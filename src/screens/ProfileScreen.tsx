import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Avatar, TextInput, Button, Card, Title, Paragraph, Switch, Text, Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { createStackNavigator } from '@react-navigation/stack';

const ProfileScreen = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  
  // Profil bilgileri için state
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    ad: user?.ad || '',
    soyad: user?.soyad || '',
    telefon: user?.telefon || '',
    email: user?.email || '',
    departman: user?.departman || '',
    pozisyon: user?.pozisyon || '',
    notifikasyonAktif: user?.notifikasyonAktif || true,
  });

  // Form değişikliklerini işle
  const handleChange = (name: string, value: string | boolean) => {
    setProfileData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Profil güncelleme işlemi
  const handleUpdateProfile = () => {
    // Burada API'ye istek gönderilecek
    // Başarılı olursa Redux store'u güncellenecek
    
    // Örnek güncelleme işlemi:
    // dispatch(updateUserProfile(profileData));
    
    Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi');
    setIsEditing(false);
  };

  // Parola değiştirme işlemi için
  const handleChangePassword = () => {
    // Şifre değiştirme ekranına yönlendirme ya da modal açılabilir
    Alert.alert('Şifre Değiştir', 'Şifre değiştirme özelliği henüz uygulanmadı.');
  };

  // Çıkış yapma işlemi
  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Oturumu kapatmak istediğinize emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Çıkış Yap',
          onPress: () => {
            // dispatch(logout());
            // Çıkış işlemi gerçekleştirilecek
          },
        },
      ]
    );
  };

  // Kullanıcı adı ve soyadının baş harflerini alıp avatarda gösterelim
  const getInitials = () => {
    const ad = user?.ad || '';
    const soyad = user?.soyad || '';
    return ad.charAt(0) + soyad.charAt(0);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Avatar.Text 
          size={100} 
          label={getInitials()}
          style={styles.avatar}
          color="#0056b3"
          labelStyle={{ fontWeight: 'bold' }}
        />
        <Title style={styles.name}>{user?.ad} {user?.soyad}</Title>
        <Paragraph style={styles.position}>{user?.pozisyon}</Paragraph>
        <Paragraph style={styles.department}>{user?.departman}</Paragraph>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Profil Bilgileri</Title>
          <Divider style={styles.divider} />
          
          {isEditing ? (
            <View>
              <TextInput
                label="Ad"
                value={profileData.ad}
                onChangeText={(text) => handleChange('ad', text)}
                style={styles.input}
                mode="outlined"
              />
              <TextInput
                label="Soyad"
                value={profileData.soyad}
                onChangeText={(text) => handleChange('soyad', text)}
                style={styles.input}
                mode="outlined"
              />
              <TextInput
                label="E-posta"
                value={profileData.email}
                onChangeText={(text) => handleChange('email', text)}
                style={styles.input}
                mode="outlined"
                keyboardType="email-address"
              />
              <TextInput
                label="Telefon"
                value={profileData.telefon}
                onChangeText={(text) => handleChange('telefon', text)}
                style={styles.input}
                mode="outlined"
                keyboardType="phone-pad"
              />
              <TextInput
                label="Departman"
                value={profileData.departman}
                disabled
                style={styles.input}
                mode="outlined"
              />
              <TextInput
                label="Pozisyon"
                value={profileData.pozisyon}
                disabled
                style={styles.input}
                mode="outlined"
              />

              <View style={styles.switchContainer}>
                <Text>Bildirimler</Text>
                <Switch
                  value={profileData.notifikasyonAktif}
                  onValueChange={(value) => handleChange('notifikasyonAktif', value)}
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button 
                  mode="contained" 
                  onPress={handleUpdateProfile} 
                  style={styles.button}
                >
                  Kaydet
                </Button>
                <Button 
                  mode="outlined" 
                  onPress={() => setIsEditing(false)} 
                  style={styles.button}
                >
                  İptal
                </Button>
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Ad:</Text>
                <Text style={styles.infoValue}>{user?.ad}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Soyad:</Text>
                <Text style={styles.infoValue}>{user?.soyad}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>E-posta:</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Telefon:</Text>
                <Text style={styles.infoValue}>{user?.telefon}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Departman:</Text>
                <Text style={styles.infoValue}>{user?.departman}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Pozisyon:</Text>
                <Text style={styles.infoValue}>{user?.pozisyon}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Bildirimler:</Text>
                <Text style={styles.infoValue}>{user?.notifikasyonAktif ? 'Açık' : 'Kapalı'}</Text>
              </View>

              <Button 
                mode="contained" 
                onPress={() => setIsEditing(true)} 
                style={[styles.button, styles.editButton]}
              >
                Düzenle
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Hesap Ayarları</Title>
          <Divider style={styles.divider} />
          
          <Button 
            mode="outlined" 
            onPress={handleChangePassword} 
            style={styles.actionButton}
            icon="lock"
          >
            Şifre Değiştir
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={handleLogout} 
            style={[styles.actionButton, styles.logoutButton]}
            icon="logout"
          >
            Çıkış Yap
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0056b3',
  },
  avatar: {
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  position: {
    color: '#fff',
    fontSize: 16,
  },
  department: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  card: {
    margin: 10,
    borderRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  input: {
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    marginVertical: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  editButton: {
    marginVertical: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginVertical: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    flex: 1,
    fontWeight: 'bold',
    color: '#555',
  },
  infoValue: {
    flex: 2,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  actionButton: {
    marginVertical: 8,
  },
  logoutButton: {
    borderColor: '#ff6b6b',
    color: '#ff6b6b',
  },
});

export default ProfileScreen;