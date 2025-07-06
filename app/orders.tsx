import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { scale } from '../styles/responsive';
import { CustomerLayout } from '../layouts';

interface Order {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  orderItems: {
    id: number;
    quantity: number;
    product: {
      id: number;
      name: string;
      price: number;
      image?: string;
    };
  }[];
}

export default function OrdersScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { colors } = useTheme();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    } else {
      loadOrders();
    }
  }, [isAuthenticated, router]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement API call to get user orders
      // const response = await api.orders.getUserOrders();
      // setOrders(response.data);
      
      // Mock data for now
      const mockOrders: Order[] = [
        {
          id: 1,
          total: 150000,
          status: 'delivered',
          createdAt: '2024-01-15T10:00:00Z',
          orderItems: [
            {
              id: 1,
              quantity: 2,
              product: {
                id: 1,
                name: 'Sữa tươi nguyên chất',
                price: 75000,
              }
            }
          ]
        },
        {
          id: 2,
          total: 200000,
          status: 'shipping',
          createdAt: '2024-01-20T14:30:00Z',
          orderItems: [
            {
              id: 2,
              quantity: 1,
              product: {
                id: 2,
                name: 'Sữa chua Vinamilk',
                price: 200000,
              }
            }
          ]
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'shipping': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'confirmed': return '#2196F3';
      case 'shipping': return '#FF9800';
      case 'delivered': return '#4CAF50';
      case 'cancelled': return '#F44336';
      default: return colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={[styles.orderCard, { backgroundColor: colors.cardBackground }]}
      onPress={() => router.push(`/orders/${item.id}`)}
    >
      <View style={styles.orderHeader}>
        <Text style={[styles.orderId, { color: colors.text }]}>
          Đơn hàng #{item.id}
        </Text>
        <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
          {getStatusText(item.status)}
        </Text>
      </View>

      <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
        {formatDate(item.createdAt)}
      </Text>

      <View style={styles.orderItems}>
        {item.orderItems.map((orderItem) => (
          <View key={orderItem.id} style={styles.orderItemRow}>
            <Text style={[styles.productName, { color: colors.text }]}>
              {orderItem.product.name}
            </Text>
            <Text style={[styles.productQuantity, { color: colors.textSecondary }]}>
              x{orderItem.quantity}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={[styles.orderTotal, { color: colors.text }]}>
          Tổng cộng: {formatPrice(item.total)}
        </Text>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  const navigationProps = {
    showLogo: false,
    showBackButton: true,
    showCart: false,
    title: 'Đơn hàng của tôi',
    onBackPress: () => router.back(),
    activeTab: 'account' as const,
    onHomePress: () => router.push('/'),
    onProductsPress: () => router.push('/explore'),
    onAccountPress: () => router.push('/account'),
  };

  if (!isAuthenticated || !user) {
    return (
      <CustomerLayout {...navigationProps}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout {...navigationProps}>
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text }]}>Đang tải đơn hàng...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={80} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.text }]}>
              Bạn chưa có đơn hàng nào
            </Text>
            <TouchableOpacity
              style={[styles.shopButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/explore')}
            >
              <Text style={styles.shopButtonText}>Mua sắm ngay</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </CustomerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: scale(12),
    fontSize: scale(16),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(32),
  },
  emptyText: {
    fontSize: scale(18),
    textAlign: 'center',
    marginTop: scale(16),
    marginBottom: scale(24),
  },
  shopButton: {
    paddingHorizontal: scale(24),
    paddingVertical: scale(12),
    borderRadius: scale(8),
  },
  shopButtonText: {
    color: 'white',
    fontSize: scale(16),
    fontWeight: '600',
  },
  listContainer: {
    padding: scale(16),
  },
  orderCard: {
    padding: scale(16),
    borderRadius: scale(12),
    marginBottom: scale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  orderId: {
    fontSize: scale(16),
    fontWeight: '600',
  },
  orderStatus: {
    fontSize: scale(14),
    fontWeight: '500',
  },
  orderDate: {
    fontSize: scale(12),
    marginBottom: scale(12),
  },
  orderItems: {
    marginBottom: scale(12),
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  productName: {
    flex: 1,
    fontSize: scale(14),
  },
  productQuantity: {
    fontSize: scale(14),
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: scale(12),
  },
  orderTotal: {
    fontSize: scale(16),
    fontWeight: '600',
  },
}); 