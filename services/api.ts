import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../contexts/CartContext';
import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// API Configuration from environment variables
const API_CONFIG = {
  BASE_URL: process.env.VITE_BASE_URL || 'http://192.168.20.106:8000/api',
};

// Timeout cho API requests (ms)
const API_TIMEOUT = 15000;
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 phút cache cho GET requests
const MAX_RETRIES = 2;

// Debug API URL
console.log('API URL:', API_CONFIG.BASE_URL);

// Cache structure
interface CacheEntry {
  data: any;
  timestamp: number;
}

// Interface cho queue promise
interface QueueItem {
  resolve: (value: string) => void;
  reject: (reason?: any) => void;
}

// Biến để theo dõi tình trạng refresh token
let isRefreshing = false;
let failedQueue: QueueItem[] = [];
let apiCache: Record<string, CacheEntry> = {};

// Xử lý queue các request thất bại cần thực hiện lại
const processQueue = (error: Error | null | unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Check network connection
const checkNetwork = async (): Promise<boolean> => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected ?? false;
};

// Apply timeout to fetch requests
const fetchWithTimeout = (url: string, options: RequestInit, timeout: number): Promise<Response> => {
  return new Promise((resolve, reject) => {
    // Set timeout
    const timer = setTimeout(() => {
      reject(new Error('Request timed out'));
    }, timeout);

    fetch(url, options)
      .then(response => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

// Clear cache by key pattern
const clearCacheByPattern = (pattern: string) => {
  const keys = Object.keys(apiCache);
  keys.forEach(key => {
    if (key.includes(pattern)) {
      delete apiCache[key];
    }
  });
};

// Hàm refresh token
const refreshAuthToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetchWithTimeout(`${API_CONFIG.BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-type': 'mobile',
      },
      body: JSON.stringify({ refreshToken }),
    }, API_TIMEOUT);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } = data.data;

    if (accessToken) {
      await AsyncStorage.setItem('authToken', accessToken);

      if (newRefreshToken) {
        await AsyncStorage.setItem('refreshToken', newRefreshToken);
      }

      return accessToken;
    }

    throw new Error('No token received');
  } catch (error) {
    console.error('Token refresh failed:', error);

    // Xóa tokens nếu refresh thất bại
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('user');

    throw error;
  }
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  try {
    console.log(`Response status: ${response.status} ${response.statusText}`);
    console.log('Response headers:', response.headers);
    
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error(`API error: ${response.status} - ${data.message || 'Unknown error'}`);
      throw new Error(data.message || 'API request failed');
    }

    return data.data || data; // Lấy phần data từ response hoặc toàn bộ response
  } catch (error) {
    console.error('Response parsing error:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
};

// Helper for API requests with auth token
const fetchApi = async (endpoint: string, method: string = 'GET', body?: any, requiresAuth: boolean = true, useCache: boolean = true, retryCount: number = 0) => {
  try {
    console.log(`Making ${method} request to ${endpoint}`);
    console.log('Request params:', { requiresAuth, useCache, retryCount });

    // Check network connection
    const isConnected = await checkNetwork();
    console.log('Network connected:', isConnected);

    if (!isConnected) {
      // If offline and we have cached data for GET requests, return it
      const cacheKey = `${method}:${endpoint}:${JSON.stringify(body || {})}`;
      if (method === 'GET' && useCache && apiCache[cacheKey]) {
        console.log(`Using cached data for offline request: ${endpoint}`);
        return apiCache[cacheKey].data;
      }
      throw new Error('No internet connection');
    }

    // Check cache for GET requests
    if (method === 'GET' && useCache) {
      const cacheKey = `${method}:${endpoint}`;
      const cachedItem = apiCache[cacheKey];

      if (cachedItem && (Date.now() - cachedItem.timestamp) < CACHE_EXPIRY) {
        console.log(`Using cached data for: ${endpoint}`);
        return cachedItem.data;
      }
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-client-type': 'mobile', // Đánh dấu client là mobile cho backend
    };

    if (requiresAuth) {
      const token = await AsyncStorage.getItem('authToken');
      console.log('Auth token:', token ? 'Present' : 'Not present');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    console.log('Request headers:', headers);

    const options: RequestInit = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
      console.log('Request body:', body);
    }

    console.log(`Calling API: ${method} ${API_CONFIG.BASE_URL}${endpoint}`);
    
    try {
      const response = await fetchWithTimeout(`${API_CONFIG.BASE_URL}${endpoint}`, options, API_TIMEOUT);
      const result = await handleResponse(response);

      // Cache successful GET requests
      if (method === 'GET' && useCache) {
        const cacheKey = `${method}:${endpoint}`;
        apiCache[cacheKey] = {
          data: result,
          timestamp: Date.now()
        };
        console.log(`Cached data for: ${endpoint}`);
      }

      return result;
    } catch (error) {
      console.error(`API call failed:`, error);
      
      if (error instanceof Error && error.message === 'Token expired' && retryCount < MAX_RETRIES) {
        console.log(`Server error, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            await refreshAuthToken();
          } finally {
            isRefreshing = false;
          }
        }
        return fetchApi(endpoint, method, body, requiresAuth, useCache, retryCount + 1);
      }
      
      throw error;
    }
  } catch (error) {
    console.error(`Error in fetchApi for ${endpoint}:`, error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
};

// Multipart form data upload function
const uploadWithFormData = async (
  endpoint: string, 
  formData: FormData, 
  requiresAuth: boolean = true, 
  method: string = 'POST',
  retryCount: number = 0
) => {
  try {
    // Check network connection
    const isConnected = await checkNetwork();
    if (!isConnected) {
      throw new Error('No internet connection');
    }

    const headers: HeadersInit = {
      'x-client-type': 'mobile', // Đánh dấu client là mobile cho backend
    };

    if (requiresAuth) {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    console.log(`Uploading to: ${API_CONFIG.BASE_URL}${endpoint}`);
    const response = await fetchWithTimeout(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method,
      headers,
      body: formData,
      // Bỏ credentials
    }, API_TIMEOUT * 2); // Longer timeout for uploads

    // Kiểm tra nếu token hết hạn
    if (response.status === 401 && requiresAuth) {
      try {
        // Làm mới token
        const newToken = await refreshAuthToken();

        // Cập nhật header với token mới
        headers['Authorization'] = `Bearer ${newToken}`;

        // Thực hiện lại request với token mới
        const newResponse = await fetchWithTimeout(`${API_CONFIG.BASE_URL}${endpoint}`, {
          method,
          headers,
          body: formData,
        }, API_TIMEOUT * 2);

        return await handleResponse(newResponse);
      } catch (error) {
        throw error;
      }
    }

    // Handle server errors with retry logic
    if (response.status >= 500 && retryCount < MAX_RETRIES) {
      console.log(`Server error during upload, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
      const delay = 1000 * Math.pow(2, retryCount);
      await new Promise(resolve => setTimeout(resolve, delay));
      return uploadWithFormData(endpoint, formData, requiresAuth, method, retryCount + 1);
    }

    return await handleResponse(response);
  } catch (error) {
    console.error('Upload Error:', error);
    throw error;
  }
};

interface AdminProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category_id: number;
  category?: string | { id: number; name: string };
  status: boolean;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface OrderAPI {
  id: number;
  phone: string;
  name?: string;
  address?: string;
  orderItems: OrderItemAPI[];
  total: string | number;
  status: string;
  createdAt: string;
}

interface OrderItemAPI {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: string | number;
    description?: string;
    image?: string;
  };
}

interface OrdersResponse {
  orders: OrderAPI[];
  pagination: PaginationData;
}

interface ProductsResponse {
  products: AdminProduct[];
  pagination: PaginationData;
}

// Auth API methods
const auth = {
  register: async (data: { name: string; email: string; password: string; phone: string }) => {
    try {
      const response = await fetchApi('/auth/register', 'POST', data, false);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    try {
      const pushToken = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      
      const response = await fetchApi('/auth/login', 'POST', {
        email,
        password,
        pushToken: pushToken.data,
      }, false);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await fetchApi('/auth/logout', 'POST', null, true);
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  refresh: async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetchApi('/auth/refresh', 'POST', { refreshToken }, false);
      
      if (response && response.accessToken) {
        await AsyncStorage.setItem('authToken', response.accessToken);
        if (response.refreshToken) {
          await AsyncStorage.setItem('refreshToken', response.refreshToken);
        }
      }
      
      return response;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await fetchApi('/auth/profile', 'GET', null, true, false);
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },
};

// API functions
export const api = {
  // Cache management
  cache: {
    clear: () => {
      apiCache = {};
      console.log('API cache cleared');
    },
    clearByPattern: (pattern: string) => {
      clearCacheByPattern(pattern);
      console.log(`Cache cleared for pattern: ${pattern}`);
    }
  },

  // Authentication
  auth,

  // Products
  products: {
    getAll: async (
      forceRefresh: boolean = false,
      page: number = 1,
      limit: number = 10,
      search: string = '',
      category_id?: number
    ): Promise<ProductsResponse> => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(category_id && { category_id: category_id.toString() })
      });
      
      const data = await fetchApi(`/products/admin/list?${queryParams}`, 'GET', undefined, true, !forceRefresh);
      return {
        products: data.products || [],
        pagination: {
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalItems: data.totalItems,
          itemsPerPage: data.itemsPerPage
        }
      };
    },

    getHotProducts: async (forceRefresh: boolean = false): Promise<Product[]> => {
      console.log('Fetching hot products');
      return await fetchApi('/products/selling', 'GET', undefined, false, !forceRefresh);
    },

    getByCategory: async (categoryId: string, forceRefresh: boolean = false): Promise<Product[]> => {
      return await fetchApi(`/products?category_id=${categoryId}`, 'GET', undefined, false, !forceRefresh);
    },

    getById: async (productId: string, forceRefresh: boolean = false): Promise<Product> => {
      return await fetchApi(`/products/${productId}`, 'GET', undefined, false, !forceRefresh);
    },

    create: async (
      productData: Omit<AdminProduct, 'id' | 'image'>,
      imageUri?: string
    ): Promise<AdminProduct> => {
      const formData = new FormData();
      
      // Add product data
      Object.entries(productData).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      
      // Add image if provided
      if (imageUri) {
        const filename = imageUri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        const imageFile = {
          uri: imageUri,
          type: type,
          name: filename,
        };
        formData.append('image', imageFile as any);
      }
      
      return await uploadWithFormData('/products', formData, true, 'POST');
    },

    update: async (
      id: string,
      productData: Partial<Omit<AdminProduct, 'id' | 'image'>>,
      imageUri?: string
    ): Promise<AdminProduct> => {
      const formData = new FormData();
      
      // Add product data
      Object.entries(productData).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      
      // Add image if provided and it's a new image (not a URL)
      if (imageUri && !imageUri.startsWith('http')) {
        const filename = imageUri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        const imageFile = {
          uri: imageUri,
          type: type,
          name: filename,
        };
        formData.append('image', imageFile as any);
      }
      
      return await uploadWithFormData(`/products/${id}`, formData, true, 'PUT');
    },

    delete: async (id: string): Promise<void> => {
      await fetchApi(`/products/${id}`, 'DELETE', undefined, true, false);
    }
  },

  // Categories
  categories: {
    getAll: async (forceRefresh: boolean = false) => {
      return await fetchApi('/categories', 'GET', undefined, false, !forceRefresh);
    },

    create: async (name: string, imageUri: string) => {
      const formData = new FormData();
      formData.append('name', name);

      // Add image if provided
      if (imageUri) {
        const filename = imageUri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        // Sửa lại cách tạo FormData cho file
        const imageFile = {
          uri: imageUri,
          type: type,
          name: filename,
        };
        formData.append('image', imageFile as any);
      }

      const result = await uploadWithFormData('/categories', formData, true, 'POST');
      clearCacheByPattern('/categories');
      return result;
    },

    update: async (categoryId: string, name: string, imageUri: string) => {
      const formData = new FormData();
      formData.append('name', name);

      // Add image if provided and it's a new image (not a URL)
      if (imageUri && !imageUri.startsWith('http')) {
        const filename = imageUri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        // Sửa lại cách tạo FormData cho file
        const imageFile = {
          uri: imageUri,
          type: type,
          name: filename,
        };
        formData.append('image', imageFile as any);
      }

      const result = await uploadWithFormData(`/categories/${categoryId}`, formData, true, 'PUT');
      clearCacheByPattern('/categories');
      return result;
    },

    delete: async (categoryId: string) => {
      const result = await fetchApi(`/categories/${categoryId}`, 'DELETE', undefined, true, false);
      clearCacheByPattern('/categories');
      return result;
    }
  },

  // Orders
  orders: {
    getAll: async (page: number = 1, forceRefresh: boolean = false) => {
      try {
        const response = await fetchApi(
          `/orders/admin/list?page=${page}&limit=10`,
          'GET',
          undefined,
          true,
          !forceRefresh
        );        
        // Trả về đúng format từ response
        return {
          orders: response.orders || [],
          pagination: {
            currentPage: response.currentPage,
            totalPages: response.totalPages,
            totalItems: response.totalItems,
            itemsPerPage: response.itemsPerPage
          }
        };
      } catch (error) {
        console.error('Error in getAll:', error);
        throw error;
      }
    },

    create: async (orderData: {
      phone: string;
      name: string;
      orderItems: Array<{ product_id: number; quantity: number }>;
    }) => {
      const result = await fetchApi('/orders', 'POST', orderData, false, false);
      clearCacheByPattern('/orders');
      return result;
    },

    update: async (orderId: string, status: string) => {
      const result = await fetchApi(`/orders/${orderId}`, 'PUT', { status }, true, false);
      clearCacheByPattern('/orders');
      return result;
    }
  },

  // Users
  users: {
    update: async (userId: string, userData: { name?: string; email?: string; password?: string }) => {
      return await fetchApi(`/users/${userId}`, 'PUT', userData, true, false);
    }
  },

  // Sliders
  getSliders: async () => {
    try {
      const response = await fetchApi('/sliders', 'GET', undefined, false, true);      
      return response || [];
    } catch (error) {
      console.error('Error fetching sliders:', error);
      return [];
    }
  },

  // Notifications
  notifications: {
    registerToken: async (pushToken: string) => {
      return await fetchApi('/notifications/register-token', 'POST', { pushToken }, true, false);
    },
    unregisterToken: async () => {
      return await fetchApi('/notifications/unregister-token', 'POST', undefined, true, false);
    }
  },

  analytics: {
    getDashboardOverview: async (params?: { fromDate?: string; toDate?: string; year?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.fromDate) queryParams.append('fromDate', params.fromDate);
      if (params?.toDate) queryParams.append('toDate', params.toDate);
      if (params?.year) queryParams.append('year', params.year.toString());
      
      return await fetchApi(`/analytics/overview?${queryParams}`, 'GET', undefined, true, true);
    },
  },
}; 