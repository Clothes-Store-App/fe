import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { scale } from '../styles/responsive';
import { CustomerLayout } from '../layouts';
import { api } from '../services/api';

export default function AccountScreen() {
  const router = useRouter();
  const { user, logout, isAuthenticated, updateUserData } = useAuth();
  const { colors } = useTheme();

  // Debug log user data
  console.log('AccountScreen - isAuthenticated:', isAuthenticated);
  console.log('AccountScreen - user data:', user);
  
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  // Fetch user profile to ensure we have the latest data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated || !user) return;
      
      try {
        setIsLoadingProfile(true);
        console.log('Fetching user profile...');
        
        const profileData = await api.auth.getProfile();
        console.log('Profile data received:', profileData);
        
        if (profileData && profileData.user) {
          // Update user data in AuthContext
          updateUserData(profileData.user);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // If profile fetch fails, still continue with cached user data
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, user?.id]); // Only refetch when user changes

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đăng xuất', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/');
            } catch (error) {
              Alert.alert('Lỗi', 'Có lỗi xảy ra khi đăng xuất');
            }
          }
        }
      ]
    );
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới không khớp');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement change password API call
      Alert.alert('Thành công', 'Đổi mật khẩu thành công');
      setShowChangePassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setIsLoading(false);
    }
  };

  const navigationProps = {
    showLogo: true,
    showBackButton: false,
    showCart: true,
    title: 'Tài khoản',
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
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* User Info Section */}
        <View style={[styles.userInfoSection, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={50} color={colors.text} />
          </View>
          <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
            <Text style={[styles.userEmail, { color: colors.secondary }]}>{user.email}</Text>
            {user.phone && (
              <Text style={[styles.userPhone, { color: colors.secondary }]}>{user.phone}</Text>
            )}
          </View>
        </View>

        {/* Menu Options */}
        <View style={styles.menuSection}>
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: colors.separator }]}
            onPress={() => router.push('/orders')}
          >
            <Ionicons name="receipt-outline" size={24} color={colors.primary} />
            <Text style={[styles.menuText, { color: colors.text }]}>Đơn hàng của tôi</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: colors.separator }]}
            onPress={() => setShowChangePassword(true)}
          >
            <Ionicons name="lock-closed-outline" size={24} color={colors.primary} />
            <Text style={[styles.menuText, { color: colors.text }]}>Đổi mật khẩu</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: colors.separator }]}
            onPress={() => router.push('/profile/edit')}
          >
            <Ionicons name="person-outline" size={24} color={colors.primary} />
            <Text style={[styles.menuText, { color: colors.text }]}>Chỉnh sửa thông tin</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: colors.separator }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#ff4444" />
            <Text style={[styles.menuText, { color: '#ff4444' }]}>Đăng xuất</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
          </TouchableOpacity>
        </View>

        {/* Change Password Modal */}
        <Modal
          visible={showChangePassword}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowChangePassword(false)}
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowChangePassword(false)}>
                <Text style={[styles.modalCancel, { color: colors.primary }]}>Hủy</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Đổi mật khẩu</Text>
              <TouchableOpacity onPress={handleChangePassword} disabled={isLoading}>
                <Text style={[styles.modalSave, { color: colors.primary }]}>
                  {isLoading ? 'Đang lưu...' : 'Lưu'}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Mật khẩu hiện tại</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.text }]}
                  placeholder="Nhập mật khẩu hiện tại"
                  placeholderTextColor={colors.placeholder}
                  secureTextEntry
                  value={passwordData.currentPassword}
                  onChangeText={(text) => setPasswordData(prev => ({ ...prev, currentPassword: text }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Mật khẩu mới</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.text }]}
                  placeholder="Nhập mật khẩu mới"
                  placeholderTextColor={colors.placeholder}
                  secureTextEntry
                  value={passwordData.newPassword}
                  onChangeText={(text) => setPasswordData(prev => ({ ...prev, newPassword: text }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Xác nhận mật khẩu mới</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.text }]}
                  placeholder="Nhập lại mật khẩu mới"
                  placeholderTextColor={colors.placeholder}
                  secureTextEntry
                  value={passwordData.confirmPassword}
                  onChangeText={(text) => setPasswordData(prev => ({ ...prev, confirmPassword: text }))}
                />
              </View>
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>
    </CustomerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: scale(16),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoSection: {
    flexDirection: 'row',
    padding: scale(20),
    borderRadius: scale(12),
    marginBottom: scale(20),
    alignItems: 'center',
  },
  userAvatar: {
    width: scale(70),
    height: scale(70),
    borderRadius: scale(35),
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: scale(20),
    fontWeight: '600',
    marginBottom: scale(4),
  },
  userEmail: {
    fontSize: scale(14),
    marginBottom: scale(2),
  },
  userPhone: {
    fontSize: scale(14),
  },
  menuSection: {
    backgroundColor: 'white',
    borderRadius: scale(12),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    borderBottomWidth: 1,
  },
  menuText: {
    flex: 1,
    fontSize: scale(16),
    marginLeft: scale(12),
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalCancel: {
    fontSize: scale(16),
  },
  modalTitle: {
    fontSize: scale(18),
    fontWeight: '600',
  },
  modalSave: {
    fontSize: scale(16),
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: scale(16),
  },
  inputGroup: {
    marginBottom: scale(20),
  },
  inputLabel: {
    fontSize: scale(14),
    fontWeight: '500',
    marginBottom: scale(8),
  },
  input: {
    height: scale(48),
    borderRadius: scale(8),
    paddingHorizontal: scale(16),
    fontSize: scale(16),
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
}); 