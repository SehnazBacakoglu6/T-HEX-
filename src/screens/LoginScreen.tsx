// src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    // Burada login işlemleri yapılacak
    // Şimdilik direkt HRDashboard'a yönlendiriyoruz
    navigation.navigate('NewLeaveRequest' as never);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#4776E6', '#8E54E9']}
        style={styles.background}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.loginContainer}>
            {/* Image Side - Shown on Large Screens */}
            {width > 500 && (
              <View style={styles.imageSide}>
                <LinearGradient
                  colors={['#4776E6', '#8E54E9']}
                  style={styles.backgroundGradient}
                >
                  <View style={styles.overlay}>
                    <Image
                      source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2910/2910756.png' }}
                      style={styles.logoImage}
                      resizeMode="contain"
                    />
                    <Text style={styles.overlayTitle}>İK Yönetim Sistemi</Text>
                    <Text style={styles.overlayText}>
                      Şirketinizin insan kaynakları süreçlerini tek bir platformda yönetin.
                    </Text>
                    <View style={styles.features}>
                      <View style={styles.featureItem}>
                        <View style={styles.featureIcon}>
                          <Text style={styles.featureIconText}>✓</Text>
                        </View>
                        <Text style={styles.featureText}>Kolay Personel Yönetimi</Text>
                      </View>
                      <View style={styles.featureItem}>
                        <View style={styles.featureIcon}>
                          <Text style={styles.featureIconText}>✓</Text>
                        </View>
                        <Text style={styles.featureText}>İzin ve Mola Takibi</Text>
                      </View>
                      <View style={styles.featureItem}>
                        <View style={styles.featureIcon}>
                          <Text style={styles.featureIconText}>✓</Text>
                        </View>
                        <Text style={styles.featureText}>Performans Değerlendirme</Text>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            )}

            {/* Logo - For Small Screens */}
            {width <= 500 && (
              <View style={styles.smallScreenLogo}>
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2910/2910756.png' }}
                  style={styles.smallLogoImage}
                  resizeMode="contain"
                />
                <Text style={styles.smallLogoText}>İK Yönetim Sistemi</Text>
              </View>
            )}

            {/* Login Side */}
            <View style={styles.loginSide}>
              <View style={styles.loginHeader}>
                <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
                <Text style={styles.instructionText}>
                  Devam etmek için lütfen giriş yapın
                </Text>
              </View>

              {/* Error Message Display */}
              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle-outline" size={20} color="#d9534f" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>E-posta</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="ornek@sirket.com"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setError(''); // Clear error when user starts typing
                    }}
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Şifre</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#999"
                    secureTextEntry={!passwordVisible}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setError(''); // Clear error when user starts typing
                    }}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={togglePasswordVisibility}
                    style={styles.eyeIcon}
                    disabled={loading}
                  >
                    <Ionicons
                      name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#888"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.options}>
                <TouchableOpacity
                  style={styles.rememberContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                  disabled={loading}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.rememberText}>Beni hatırla</Text>
                </TouchableOpacity>

                <TouchableOpacity disabled={loading}>
                  <Text style={styles.forgotText}>Şifremi unuttum</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.loginButton, loading && styles.disabledButton]}
                onPress={handleLogin}
                activeOpacity={0.8}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#4776E6', '#8E54E9']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={styles.loginButtonText}>Giriş Yap</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.altLogin}>
                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>veya şununla giriş yapın</Text>
                  <View style={styles.divider} />
                </View>

                <View style={styles.socialIcons}>
                  <TouchableOpacity
                    style={styles.socialIcon}
                    onPress={handleLogin}
                    disabled={loading}
                  >
                    <Ionicons name="logo-google" size={20} color="#DB4437" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialIcon} disabled={loading}>
                    <Ionicons name="mail" size={20} color="#4285F4" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialIcon} disabled={loading}>
                    <Ionicons name="logo-linkedin" size={20} color="#0077B5" />
                  </TouchableOpacity>
                </View>
              </View>

              {width <= 500 && (
                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    Hesabınız yok mu? <Text style={styles.footerHighlight}>Kaydolun</Text>
                  </Text>
                </View>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    width: width > 500 ? '90%' : '100%',
    maxWidth: 1000,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: width > 500 ? 'row' : 'column',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 15,
  },
  imageSide: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 25,
  },
  overlayTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  overlayText: {
    fontSize: 16,
    color: 'white',
    lineHeight: 24,
    marginBottom: 30,
  },
  features: {
    marginTop: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureIconText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  featureText: {
    color: 'white',
    fontSize: 15,
  },
  smallScreenLogo: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  smallLogoImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  smallLogoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  loginSide: {
    flex: 1,
    padding: width > 500 ? 40 : 30,
    backgroundColor: 'white',
  },
  loginHeader: {
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  instructionText: {
    color: '#777',
    fontSize: 15,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#d9534f',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    marginBottom: 8,
    color: '#555',
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#eaeaea',
    borderRadius: 8,
    overflow: 'hidden',
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 15,
    color: '#333',
  },
  eyeIcon: {
    padding: 12,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  checkboxChecked: {
    backgroundColor: '#8E54E9',
    borderColor: '#8E54E9',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rememberText: {
    color: '#555',
    fontSize: 14,
  },
  forgotText: {
    color: '#8E54E9',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 25,
    elevation: 3,
    shadowColor: '#8E54E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  altLogin: {
    alignItems: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#eaeaea',
  },
  dividerText: {
    color: '#888',
    paddingHorizontal: 10,
    fontSize: 14,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  footerHighlight: {
    color: '#8E54E9',
    fontWeight: '500',
  },
});

export default LoginScreen;