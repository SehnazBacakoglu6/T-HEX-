import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, StatusBar,TouchableOpacity } from 'react-native';
import { Card, Title, Text, Divider, Button } from 'react-native-paper';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Örnek veri, gerçek projede API'den gelecek
const MOCK_DEPARTMAN_IZINLERI = [
  { departman: 'Şantiye', izinGun: 45 },
  { departman: 'Mühendislik', izinGun: 62 },
  { departman: 'Kalite', izinGun: 28 },
  { departman: 'Muhasebe', izinGun: 15 },
  { departman: 'İK', izinGun: 12 },
];

const MOCK_AYLIK_IZINLER = [
  { ay: 'O', izinGun: 18 },
  { ay: 'Ş', izinGun: 15 },
  { ay: 'M', izinGun: 20 },
  { ay: 'N', izinGun: 25 },
  { ay: 'M', izinGun: 32 },
  { ay: 'H', izinGun: 42 },
  { ay: 'T', izinGun: 55 },
  { ay: 'A', izinGun: 60 },
  { ay: 'E', izinGun: 30 },
  { ay: 'E', izinGun: 22 },
  { ay: 'K', izinGun: 18 },
  { ay: 'A', izinGun: 15 },
];

const MOCK_CEYREKLIK_IZINLER = [
  { ay: 'Q1', izinGun: 53 },
  { ay: 'Q2', izinGun: 99 },
  { ay: 'Q3', izinGun: 145 },
  { ay: 'Q4', izinGun: 55 },
];

const MOCK_GUNLUK_IZINLER = Array.from({ length: 15 }, (_, i) => ({
  ay: `${i + 1}`,
  izinGun: Math.floor(Math.random() * 5) + 1,
}));

const MOCK_IZIN_DURUMLARI = [
  { durum: 'Onaylandı', sayi: 125 },
  { durum: 'Bekliyor', sayi: 42 },
  { durum: 'Reddedildi', sayi: 35 },
];

const MOCK_IZIN_TIPLERI = [
  { tip: 'Yıllık İzin', sayi: 160 },
  { tip: 'Acil Durum', sayi: 25 },
  { tip: 'Doğum Günü', sayi: 17 },
];

const screenWidth = Dimensions.get('window').width - 32;

const LeaveStatsDashboardScreen = ({ navigation }) => {
  const [filterValue, setFilterValue] = useState('year');
  const [chartData, setChartData] = useState(MOCK_AYLIK_IZINLER);
  const [fadeAnim] = useState(1);

  useEffect(() => {
    // Zaman filtresine göre veri güncelleme
    if (filterValue === 'month') {
      setChartData(MOCK_GUNLUK_IZINLER);
    } else if (filterValue === 'quarter') {
      setChartData(MOCK_CEYREKLIK_IZINLER);
    } else {
      setChartData(MOCK_AYLIK_IZINLER);
    }
  }, [filterValue]);

  // Geri dönüş fonksiyonu
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#4776E6" />
      
      {/* Gradient Background */}
      <LinearGradient
        colors={['#4776E6', '#8E54E9']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Button 
              icon="arrow-left" 
              mode="text" 
              textColor="white" 
              onPress={handleGoBack}
              style={styles.backButton}
            />
            <Title style={styles.headerTitle}>İzin İstatistikleri</Title>
          </View>
          <View style={styles.dateInfo}>
            <Text style={styles.dateText}>2024</Text>
          </View>
        </View>
      </View>
      
      {/* Main Content */}
      <View style={styles.container}>
        {/* Zaman Filtresi */}
        <View style={styles.filterContainer}>
          <TouchableFilterButton 
            isActive={filterValue === 'month'} 
            onPress={() => setFilterValue('month')}
            iconName="calendar-day"
            title="Ay"
          />
          <TouchableFilterButton 
            isActive={filterValue === 'quarter'} 
            onPress={() => setFilterValue('quarter')}
            iconName="calendar-week"
            title="Çeyrek"
          />
          <TouchableFilterButton 
            isActive={filterValue === 'year'} 
            onPress={() => setFilterValue('year')}
            iconName="calendar"
            title="Yıl"
          />
        </View>
        
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* İzin Kullanım Trendi Grafiği */}
          <Card style={styles.card} elevation={2}>
            <Card.Content>
              <View style={styles.cardTitleContainer}>
                <Ionicons name="analytics-outline" size={20} color="#4776E6" />
                <Text style={styles.cardTitle}>
                  İzin Kullanım Trendi
                </Text>
              </View>
              <Text style={styles.cardSubtitle}>
                {filterValue === 'month' ? 'Günlük' : filterValue === 'quarter' ? 'Çeyreklik' : 'Aylık'} izin dağılımı
              </Text>
              
              <LineChart
                data={{
                  labels: chartData.map(item => item.ay),
                  datasets: [
                    {
                      data: chartData.map(item => item.izinGun),
                    },
                  ],
                }}
                width={screenWidth}
                height={200}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(71, 118, 230, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
                  propsForDots: {
                    r: "4",
                    strokeWidth: "2",
                    stroke: "#4776E6"
                  },
                  propsForLabels: {
                    fontSize: 10,
                  }
                }}
                bezier
                style={styles.chart}
                withInnerLines={false}
                withOuterLines={false}
              />
            </Card.Content>
          </Card>
          
          {/* Departman Bazlı İzin Kullanımı */}
          <Card style={styles.card} elevation={2}>
            <Card.Content>
              <View style={styles.cardTitleContainer}>
                <Ionicons name="business-outline" size={20} color="#4CAF50" />
                <Text style={styles.cardTitle}>Departman Bazlı İzin Kullanımı</Text>
              </View>
              
              <BarChart
                data={{
                  labels: MOCK_DEPARTMAN_IZINLERI.map(item => item.departman),
                  datasets: [
                    {
                      data: MOCK_DEPARTMAN_IZINLERI.map(item => item.izinGun),
                    },
                  ],
                }}
                width={screenWidth}
                height={180}
                yAxisLabel=""
                yAxisSuffix=" g"
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
                  barPercentage: 0.5,
                  propsForLabels: {
                    fontSize: 10,
                  }
                }}
                style={styles.chart}
                showBarTops={false}
                fromZero={true}
                withInnerLines={false}
                withHorizontalLines={true}
              />
            </Card.Content>
          </Card>
          
          {/* Pasta Grafikler */}
          <View style={styles.pieContainer}>
            {/* İzin Durumları */}
            <Card style={styles.pieCard} elevation={2}>
              <Card.Content>
                <View style={styles.cardTitleContainer}>
                  <Ionicons name="stats-chart-outline" size={18} color="#8E54E9" />
                  <Text style={styles.pieCardTitle}>İzin Durumları</Text>
                </View>
                
                <PieChart
                  data={MOCK_IZIN_DURUMLARI.map((item, index) => ({
                    name: item.durum,
                    population: item.sayi,
                    color: index === 0 ? '#4CAF50' : index === 1 ? '#FF9800' : '#F44336',
                    legendFontColor: '#666',
                    legendFontSize: 10,
                  }))}
                  width={screenWidth * 0.45}
                  height={150}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor={"population"}
                  backgroundColor={"transparent"}
                  paddingLeft={"15"}
                  center={[5, 0]}
                  absolute
                  hasLegend={true}
                  avoidFalseZero
                />
              </Card.Content>
            </Card>
            
            {/* İzin Tipleri */}
            <Card style={styles.pieCard} elevation={2}>
              <Card.Content>
                <View style={styles.cardTitleContainer}>
                  <Ionicons name="layers-outline" size={18} color="#8E54E9" />
                  <Text style={styles.pieCardTitle}>İzin Tipleri</Text>
                </View>
                
                <PieChart
                  data={MOCK_IZIN_TIPLERI.map((item, index) => ({
                    name: item.tip,
                    population: item.sayi,
                    color: index === 0 ? '#3F51B5' : index === 1 ? '#E91E63' : '#FFC107',
                    legendFontColor: '#666',
                    legendFontSize: 10,
                  }))}
                  width={screenWidth * 0.45}
                  height={150}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor={"population"}
                  backgroundColor={"transparent"}
                  paddingLeft={"15"}
                  center={[5, 0]}
                  absolute
                  hasLegend={true}
                  avoidFalseZero
                />
              </Card.Content>
            </Card>
          </View>
          
          {/* Özet Bilgiler */}
          <Card style={styles.summaryCard} elevation={2}>
            <Card.Content>
              <View style={styles.cardTitleContainer}>
                <Ionicons name="information-circle-outline" size={20} color="#8E54E9" />
                <Text style={styles.cardTitle}>Özet Bilgiler</Text>
              </View>
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <View style={[styles.statIconContainer, {backgroundColor: 'rgba(76, 175, 80, 0.1)'}]}>
                    <Ionicons name="calendar" size={20} color="#4CAF50" />
                  </View>
                  <Text style={styles.statValue}>10-15 Tem</Text>
                  <Text style={styles.statLabel}>En Yoğun Hafta</Text>
                </View>
                
                <View style={styles.statItem}>
                  <View style={[styles.statIconContainer, {backgroundColor: 'rgba(63, 81, 181, 0.1)'}]}>
                    <Ionicons name="today" size={20} color="#3F51B5" />
                  </View>
                  <Text style={styles.statValue}>Ağustos</Text>
                  <Text style={styles.statLabel}>En Yoğun Ay</Text>
                </View>
                
                <View style={styles.statItem}>
                  <View style={[styles.statIconContainer, {backgroundColor: 'rgba(233, 30, 99, 0.1)'}]}>
                    <Ionicons name="people" size={20} color="#E91E63" />
                  </View>
                  <Text style={styles.statValue}>Mühendislik</Text>
                  <Text style={styles.statLabel}>En Çok İzin Alan</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
          
          {/* Uyarılar */}
          <Card style={styles.alertCard} elevation={2}>
            <LinearGradient
              colors={['rgba(255, 152, 0, 0.1)', 'rgba(255, 193, 7, 0.1)']}
              style={styles.alertGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Card.Content>
                <View style={styles.alertTitleContainer}>
                  <Ionicons name="warning-outline" size={20} color="#FF9800" />
                  <Text style={styles.alertTitle}>Dikkat Edilmesi Gerekenler</Text>
                </View>
                
                <View style={styles.alertItem}>
                  <Ionicons name="alert-circle" size={16} color="#FF9800" style={styles.alertItemIcon} />
                  <Text style={styles.alertItemText}>Ağustos ayında izin yoğunluğu çok yüksek</Text>
                </View>
                
                <View style={styles.alertItem}>
                  <Ionicons name="alert-circle" size={16} color="#FF9800" style={styles.alertItemIcon} />
                  <Text style={styles.alertItemText}>Proje teslim dönemlerinde izin yoğunluğu azaltılmalı</Text>
                </View>
                
                <View style={styles.alertItem}>
                  <Ionicons name="alert-circle" size={16} color="#FF9800" style={styles.alertItemIcon} />
                  <Text style={styles.alertItemText}>Mühendislik departmanı izin kullanımı dengelenmeli</Text>
                </View>
              </Card.Content>
            </LinearGradient>
          </Card>
          
          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </View>
  );
};

// Filtre butonları bileşeni
const TouchableFilterButton = ({ isActive, onPress, iconName, title }) => {
  const iconMap = {
    'calendar-day': 'calendar-outline',
    'calendar-week': 'calendar-clear-outline',
    'calendar': 'calendar-sharp',
  };

  return (
    <TouchableOpacity
      style={[styles.filterButton, isActive && styles.activeFilterButton]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons
        name={iconMap[iconName]}
        size={18}
        color={isActive ? '#FFF' : '#666'}
        style={styles.filterIcon}
      />
      <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    margin: 0,
    padding: 0,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dateText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    paddingTop: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 1,
  },
  activeFilterButton: {
    backgroundColor: '#4776E6',
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    marginLeft: 28,
  },
  chart: {
    borderRadius: 8,
    paddingRight: 0,
  },
  pieContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pieCard: {
    width: '48%',
    borderRadius: 12,
  },
  pieCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
    color: '#333',
  },
  summaryCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  alertCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  alertGradient: {
    borderRadius: 12,
  },
  alertTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#FF9800',
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertItemIcon: {
    marginRight: 8,
  },
  alertItemText: {
    fontSize: 13,
    color: '#555',
    flex: 1,
  },
  bottomPadding: {
    height: 20,
  }
});

export default LeaveStatsDashboardScreen;