// src/screens/AdminLoginScreen.js
import React, { useState, useEffect } from 'react';
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
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Normal kullanıcı login sayfası
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const fadeAnim = useState(new Animated.Value(0))[0];
  const navigation = useNavigation();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = () => {
    // Form doğrulama
    if (!email || !password) {
      setError('Lütfen e-posta ve şifre alanlarını doldurun.');
      return;
    }

    // Loading state başlat
    setLoading(true);

    // Login işlemi simülasyonu
    setTimeout(() => {
      setLoading(false);
      // Başarılı giriş sonrası dashboard'a yönlendirme
      navigation.navigate('HRDashboard' as never);
    }, 1500);
  };

  const handleAdminLogin = () => {
    // Yönetici giriş sayfasına yönlendirme
    navigation.navigate('HRDashboard' as never);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#4776E6', '#8E54E9']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Animated.View 
            style={[
              styles.loginContainer, 
              { 
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              }
            ]}
          >
            {/* Image Side - Shown on Large Screens */}
            {width > 500 && (
              <View style={styles.imageSide}>
                <LinearGradient
                  colors={['#4776E6', '#8E54E9']}
                  style={styles.backgroundGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
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
                <Text style={[styles.inputLabel, isFocused.email && styles.focusedLabel]}>E-posta</Text>
                <View style={[styles.inputContainer, isFocused.email && styles.focusedInput]}>
                  <Ionicons name="mail-outline" size={20} color={isFocused.email ? '#8E54E9' : '#888'} style={styles.inputIcon} />
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
                    onFocus={() => handleFocus('email')}
                    onBlur={() => handleBlur('email')}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, isFocused.password && styles.focusedLabel]}>Şifre</Text>
                <View style={[styles.inputContainer, isFocused.password && styles.focusedInput]}>
                  <Ionicons name="lock-closed-outline" size={20} color={isFocused.password ? '#8E54E9' : '#888'} style={styles.inputIcon} />
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
                    onFocus={() => handleFocus('password')}
                    onBlur={() => handleBlur('password')}
                  />
                  <TouchableOpacity
                    onPress={togglePasswordVisibility}
                    style={styles.eyeIcon}
                    disabled={loading}
                  >
                    <Ionicons
                      name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={isFocused.password ? '#8E54E9' : '#888'}
                    />
                  </TouchableOpacity>
                </View>
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

              {/* Yönetici Girişi Butonu */}
              <TouchableOpacity
                style={styles.adminLoginButton}
                onPress={handleAdminLogin}
                activeOpacity={0.7}
                disabled={loading}
              >
                <View style={styles.adminLoginButtonContent}>
                  <Ionicons name="shield-outline" size={16} color="#8E54E9" style={styles.adminIcon} />
                  <Text style={styles.adminLoginButtonText}>Yönetici Girişi</Text>
                </View>
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
                    disabled={loading}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="logo-google" size={20} color="#DB4437" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialIcon} disabled={loading} activeOpacity={0.7}>
                    <Ionicons name="mail" size={20} color="#4285F4" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialIcon} disabled={loading} activeOpacity={0.7}>
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
          </Animated.View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

// Yönetici login sayfası
const AdminLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const fadeAnim = useState(new Animated.Value(0))[0];
  const navigation = useNavigation();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = () => {
    // Form doğrulama
    if (!email || !password) {
      setError('Lütfen e-posta ve şifre alanlarını doldurun.');
      return;
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    // Loading state başlat
    setLoading(true);

    // Login işlemi simülasyonu (gerçek uygulamada burada API çağrısı yapılır)
    setTimeout(() => {
      setLoading(false);
      // Başarılı giriş sonrası dashboard'a yönlendirme
      navigation.navigate('HRDashboard' as never);
    }, 1500);
  };
  
  // Kullanıcı girişine geri dön
  const goBackToLogin = () => {
    navigation.goBack();
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Animated.View 
            style={[
              styles.loginContainer, 
              { 
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              }
            ]}
          >
            {/* Sol Taraf - Büyük Ekranlarda Gösterilir */}
            {width > 500 && (
              <View style={styles.imageSide}>
                <LinearGradient
                  colors={['#1E3A8A', '#3B82F6']}
                  style={styles.backgroundGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.overlay}>
                    <Image
                      source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5087/5087579.png' }}
                      style={styles.logoImage}
                      resizeMode="contain"
                    />
                    <Text style={styles.overlayTitle}>Admin Yönetim Paneli</Text>
                    <Text style={styles.overlayText}>
                      Tüm sistem ayarlarını ve kullanıcıları tek bir yerden yönetin.
                    </Text>
                    <View style={styles.features}>
                      <View style={styles.featureItem}>
                        <View style={styles.featureIcon}>
                          <Text style={styles.featureIconText}>✓</Text>
                        </View>
                        <Text style={styles.featureText}>Gelişmiş Kullanıcı Yönetimi</Text>
                      </View>
                      <View style={styles.featureItem}>
                        <View style={styles.featureIcon}>
                          <Text style={styles.featureIconText}>✓</Text>
                        </View>
                        <Text style={styles.featureText}>Kapsamlı Analitik Raporlar</Text>
                      </View>
                      <View style={styles.featureItem}>
                        <View style={styles.featureIcon}>
                          <Text style={styles.featureIconText}>✓</Text>
                        </View>
                        <Text style={styles.featureText}>Güçlü Güvenlik Özellikleri</Text>
                      </View>
                      <View style={styles.featureItem}>
                        <View style={styles.featureIcon}>
                          <Text style={styles.featureIconText}>✓</Text>
                        </View>
                        <Text style={styles.featureText}>Özelleştirilebilir Ayarlar</Text>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            )}

            {/* Logo - Küçük Ekranlar İçin */}
            {width <= 500 && (
              <View style={styles.smallScreenLogo}>
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5087/5087579.png' }}
                  style={styles.smallLogoImage}
                  resizeMode="contain"
                />
                <Text style={styles.smallLogoText}>Admin Paneli</Text>
              </View>
            )}

            {/* Giriş Formu */}
            <View style={styles.loginSide}>
              {/* Geri Dönüş Butonu */}
              <TouchableOpacity 
                style={styles.backButton}
                onPress={goBackToLogin}
                disabled={loading}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={22} color="#1E3A8A" />
                <Text style={styles.backButtonText}>Kullanıcı Girişine Dön</Text>
              </TouchableOpacity>
              
              <View style={styles.loginHeader}>
                <Text style={styles.welcomeText}>Admin Girişi</Text>
                <Text style={styles.instructionText}>
                  Yönetim paneline erişmek için giriş yapın
                </Text>
              </View>

              {/* Hata Mesajı */}
              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle-outline" size={20} color="#d9534f" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, isFocused.email && styles.focusedLabel]}>E-posta</Text>
                <View style={[styles.inputContainer, isFocused.email && styles.focusedInput]}>
                  <Ionicons name="mail-outline" size={20} color={isFocused.email ? '#3B82F6' : '#888'} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="admin@sirket.com"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setError(''); // Kullanıcı yazmaya başladığında hatayı temizle
                    }}
                    editable={!loading}
                    onFocus={() => handleFocus('email')}
                    onBlur={() => handleBlur('email')}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, isFocused.password && styles.focusedLabel]}>Şifre</Text>
                <View style={[styles.inputContainer, isFocused.password && styles.focusedInput]}>
                  <Ionicons name="lock-closed-outline" size={20} color={isFocused.password ? '#3B82F6' : '#888'} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#999"
                    secureTextEntry={!passwordVisible}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setError(''); // Kullanıcı yazmaya başladığında hatayı temizle
                    }}
                    editable={!loading}
                    onFocus={() => handleFocus('password')}
                    onBlur={() => handleBlur('password')}
                  />
                  <TouchableOpacity
                    onPress={togglePasswordVisibility}
                    style={styles.eyeIcon}
                    disabled={loading}
                  >
                    <Ionicons
                      name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={isFocused.password ? '#3B82F6' : '#888'}
                    />
                  </TouchableOpacity>
                </View>
              </View>



              <TouchableOpacity
                style={[styles.loginButton, loading && styles.disabledButton]}
                onPress={handleLogin}
                activeOpacity={0.8}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#1E3A8A', '#3B82F6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={styles.loginButtonText}>Admin Girişi</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.altLogin}>
                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>bilgi</Text>
                  <View style={styles.divider} />
                </View>

                <View style={styles.securityNotice}>
                  <Ionicons name="shield-checkmark-outline" size={18} color="#3B82F6" style={styles.securityIcon} />
                  <Text style={styles.securityText}>
                    Bu sayfa yalnızca yetkili personel içindir. Tüm giriş denemeleri kaydedilir.
                  </Text>
                </View>

              </View>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  adminLoginButton: {
    backgroundColor: 'rgba(142, 84, 233, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(142, 84, 233, 0.3)',
  },
  adminLoginButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminIcon: {
    marginRight: 8,
  },
  adminLoginButtonText: {
    color: '#8E54E9',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
    padding: 4,
  },
  backButtonText: {
    marginLeft: 5,
    color: '#1E3A8A',
    fontSize: 14,
    fontWeight: '500',
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
    borderRadius: 24,
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
    backgroundColor: '#EFF6FF',
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
  },
  smallLogoImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  smallLogoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
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
    color: '#1E3A8A',
    marginBottom: 10,
  },
  instructionText: {
    color: '#64748B',
    fontSize: 15,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    marginBottom: 8,
    color: '#475569',
    fontSize: 14,
    fontWeight: '500',
    transition: '0.3s',
  },
  focusedLabel: {
    color: '#8E54E9',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    overflow: 'hidden',
    transition: '0.3s',
  },
  focusedInput: {
    borderColor: '#8E54E9',
    backgroundColor: '#FAFAFA',
    shadowColor: '#8E54E9',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 15,
    color: '#333',
  },
  eyeIcon: {
    padding: 15,
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
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  checkboxChecked: {
    backgroundColor: '#8E54E9',
    borderColor: '#8E54E9',
  },
  adminCheckboxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rememberText: {
    color: '#64748B',
    fontSize: 14,
  },
  forgotText: {
    color: '#8E54E9',
    fontSize: 14,
    fontWeight: '600',
  },
  adminForgotText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 25,
    elevation: 3,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginGradient: {
    paddingVertical: 16,
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
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    color: '#94A3B8',
    paddingHorizontal: 10,
    fontSize: 14,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#eaeaea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  securityIcon: {
    marginRight: 12,
  },
  securityText: {
    color: '#475569',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  contactSupport: {
    marginTop: 10,
  },
  contactText: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
  },
  contactHighlight: {
    color: '#3B82F6',
    fontWeight: '600',
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
    fontWeight: '600',
  },
});

export default AdminLoginScreen;
export { LoginScreen };