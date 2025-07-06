import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { scale } from '../styles/responsive';
import LogoFdaily from '../assets/images/Logo-Fdaily.png';

export default function LoginScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập email và mật khẩu');
      return;
    }
    
    try {
      setIsLoading(true);
      const result = await login(email, password);
      
      if (!result.success) {
        Alert.alert('Đăng nhập thất bại', result.message || 'Email hoặc mật khẩu không đúng');
      } else {
        Alert.alert('Thành công', 'Đăng nhập thành công!', [
          { text: 'OK', onPress: () => router.push('/') }
        ]);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đăng nhập');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (authLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.headerBack}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
        <View style={styles.centeredContainer}>
        <TouchableOpacity onPress={() => router.push('/')}> 
            <Image source={LogoFdaily} style={styles.logo} resizeMode="contain" />
          </TouchableOpacity>
          <View style={styles.titleBlock}>
            <Text style={[styles.title, { color: colors.text }]}>Đăng Nhập</Text>
            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Bạn chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={[styles.switchLink, { color: colors.primary }]}>Đăng Ký</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={[styles.input, styles.inputBorder, { backgroundColor: colors.cardBackground, color: colors.text }]}
                placeholderTextColor={colors.placeholder}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            
            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Mật khẩu"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={[styles.passwordInput, styles.inputBorder, { backgroundColor: colors.cardBackground, color: colors.text }]}
                  placeholderTextColor={colors.placeholder}
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
            </View>

            {/* Remember Password Checkbox */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity style={styles.checkbox}>
                <Ionicons name="checkbox-outline" size={20} color={colors.primary} />
                <Text style={[styles.checkboxText, { color: colors.text }]}>Ghi nhớ mật khẩu?</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={[styles.forgotPassword, { color: colors.primary }]}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>
            
            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, styles.inputBorder, { backgroundColor: colors.primary }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>

            {/* Google Login */}
            <TouchableOpacity
              style={[styles.googleButton, styles.inputBorder, { backgroundColor: colors.cardBackground }]}
              onPress={() => {/* Handle Google login */}}
            >
              <View style={styles.googleIconContainer}>
                <Text style={styles.googleIconText}>G</Text>
              </View>
              <Text style={[styles.googleButtonText, { color: colors.text }]}>Đăng nhập với Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  checkboxText: {
    fontSize: scale(14),
  },
  forgotPassword: {
    fontSize: scale(14),
  },
  loginButton: {
    height: scale(48),
    borderRadius: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(8),
  },
  loginButtonText: {
    color: 'white',
    fontSize: scale(16),
    fontWeight: '600',
  },
  googleButton: { height: scale(48), borderRadius: scale(8), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: scale(8) },
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: scale(16),
  },
  headerBack: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
  },
  backButton: {
    padding: scale(8),
  },
}); 