import { dispatchCartUpdate } from './events';

// Lưu giỏ hàng vào localStorage và phát ra sự kiện
export const saveCartToLocalStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
  // Phát ra sự kiện để thông báo giỏ hàng đã thay đổi
  window.dispatchEvent(new Event('cartUpdated'));
};

// Lấy giỏ hàng từ localStorage
export const getCartFromLocalStorage = () => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = (product, quantity = 1) => {
  const cart = getCartFromLocalStorage();
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  
  setCartToLocalStorage(cart);
  return cart;
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItemQuantity = (productId, quantity) => {
  const cart = getCartFromLocalStorage();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    item.quantity = quantity;
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartToLocalStorage(cart);
    }
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = (productId) => {
  const cart = getCartFromLocalStorage();
  const updatedCart = cart.filter(item => item.id !== productId);
  setCartToLocalStorage(updatedCart);
  return updatedCart;
};

// Xóa toàn bộ giỏ hàng
export const clearCart = () => {
  localStorage.removeItem('cart');
  dispatchCartUpdate();
  return [];
};

export const setCartToLocalStorage = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// New authentication functions
export const setAuthToken = (token) => {
  try {
    localStorage.setItem('auth_token', token);
  } catch (error) {
    console.error('Error saving auth token:', error);
  }
};

export const getAuthToken = () => {
  try {
    return localStorage.getItem('auth_token');
  } catch (error) {
    console.error('Error reading auth token:', error);
    return null;
  }
};

export const removeAuthToken = () => {
  try {
    localStorage.removeItem('auth_token');
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
};

export const setUserData = (user) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const getUserData = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error reading user data:', error);
    return null;
  }
};

export const removeUserData = () => {
  try {
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error removing user data:', error);
  }
}; 