import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CustomerLayout } from '../layouts';
import { useTheme } from '../contexts/ThemeContext';
import { api } from '../services/api';
import { scale } from '../styles/responsive';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import LogoFdaily from '../assets/images/Logo-Fdaily.png';

export default function RegisterScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Họ và tên không được để trống';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống';
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await api.auth.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });
      
      if (response.success) {
        Alert.alert('Thành công', 'Đăng ký tài khoản thành công! Vui lòng đăng nhập.', [
          { text: 'OK', onPress: () => router.push('/login') }
        ]);
      }
    } catch (error: any) {
      Alert.alert(
        'Lỗi',
        error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const navigationProps = {
    showLogo: false,
    showBackButton: true,
    showCart: false,
    title: 'Đăng ký tài khoản',
    onBackPress: () => router.back(),
    activeTab: 'account' as const,
    onHomePress: () => router.push('/'),
    onProductsPress: () => router.push('/explore'),
    onAccountPress: () => router.push('/account'),
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
        <View style={styles.centeredContainer}>
          <TouchableOpacity onPress={() => router.push('/')}> 
            <Image source={LogoFdaily} style={styles.logo} resizeMode="contain" />
          </TouchableOpacity>
          <View style={styles.titleBlock}>
            <Text style={[styles.title, { color: colors.text }]}>Đăng Ký</Text>
            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Bạn đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={[styles.switchLink, { color: colors.primary }]}>Đăng Nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.formContainer}>
            {/* Name Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.inputBorder, { backgroundColor: colors.cardBackground, color: colors.text }]}
                placeholder="Nhập họ và tên"
                placeholderTextColor={colors.placeholder}
                value={formData.name}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, name: text }));
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
              />
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.inputBorder, { backgroundColor: colors.cardBackground, color: colors.text }]}
                placeholder="Nhập số điện thoại"
                placeholderTextColor={colors.placeholder}
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, phone: text }));
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                }}
              />
              {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.inputBorder, { backgroundColor: colors.cardBackground, color: colors.text }]}
                placeholder="Nhập email"
                placeholderTextColor={colors.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, email: text }));
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, styles.inputBorder, { backgroundColor: colors.cardBackground, color: colors.text }]}
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor={colors.placeholder}
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, password: text }));
                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={24} 
                    color={colors.text} 
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, styles.inputBorder, { backgroundColor: colors.cardBackground, color: colors.text }]}
                  placeholder="Nhập lại mật khẩu"
                  placeholderTextColor={colors.placeholder}
                  secureTextEntry={!showConfirmPassword}
                  value={formData.confirmPassword}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, confirmPassword: text }));
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons 
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={24} 
                    color={colors.text} 
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, styles.inputBorder, { backgroundColor: colors.primary }]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.registerButtonText}>Tạo Tài Khoản</Text>
              )}
            </TouchableOpacity>

            {/* Google Sign Up */}
            <TouchableOpacity
              style={[styles.googleButton, styles.inputBorder, { backgroundColor: colors.cardBackground }]}
              onPress={() => {/* Handle Google sign up */}}
            >
              <View style={styles.googleIconContainer}>
                <Text style={styles.googleIconText}>G</Text>
              </View>
              <Text style={[styles.googleButtonText, { color: colors.text }]}>Đăng ký với Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBack: { position: 'absolute', top: scale(8), left: scale(8), zIndex: 10 },
  backButton: { padding: scale(4) },
  scrollViewContent: { flexGrow: 1, paddingHorizontal: scale(16) },
  centeredContainer: { flex: 1, alignItems: 'center', paddingVertical: scale(24) },
  logo: { width: scale(120), height: scale(40), marginBottom: scale(8) },
  titleBlock: { width: '100%', maxWidth: scale(400), alignSelf: 'flex-start', marginBottom: scale(16) },
  title: { fontSize: scale(24), fontWeight: '600', marginBottom: scale(8), textAlign: 'left' },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: scale(8) },
  switchText: { fontSize: scale(14), color: '#222', textAlign: 'left' },
  switchLink: { fontSize: scale(14), fontWeight: '600', textAlign: 'left' },
  formContainer: { width: '100%', maxWidth: scale(400), alignSelf: 'center', gap: scale(16) },
  inputContainer: {
    gap: scale(4),
  },
  input: { height: scale(48), borderRadius: scale(8), paddingHorizontal: scale(16), fontSize: scale(16), marginBottom: scale(8) },
  inputBorder: { borderWidth: 1, borderColor: '#d1d5db' },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    height: scale(48),
    borderRadius: scale(8),
    paddingHorizontal: scale(16),
    fontSize: scale(16),
  },
  eyeIcon: {
    position: 'absolute',
    right: scale(16),
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: scale(12),
  },
  registerButton: {
    height: scale(48),
    borderRadius: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(8),
  },
  registerButtonText: {
    color: 'white',
    fontSize: scale(16),
    fontWeight: '600',
  },
  googleButton: {
    height: scale(48),
    borderRadius: scale(8),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(8),
  },
  googleIconContainer: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(8),
  },
  googleIconText: {
    color: 'white',
    fontSize: scale(16),
    fontWeight: 'bold',
  },
  googleButtonText: {
    fontSize: scale(16),
    fontWeight: '500',
  },
}); 
 