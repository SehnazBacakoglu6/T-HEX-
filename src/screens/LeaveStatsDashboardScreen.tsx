import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Text, Divider, SegmentedButtons } from 'react-native-paper';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { createStackNavigator } from '@react-navigation/stack';

// Örnek veri, gerçek projede API'den gelecek
const MOCK_DEPARTMAN_IZINLERI = [
  { departman: 'Şantiye Yönetimi', izinGun: 45 },
  { departman: 'Mühendislik', izinGun: 62 },
  { departman: 'Kalite Kontrol', izinGun: 28 },
  { departman: 'Muhasebe', izinGun: 15 },
  { departman: 'İK', izinGun: 12 },
];

const MOCK_AYLIK_IZINLER = [
  { ay: 'Ocak', izinGun: 18 },
  { ay: 'Şubat', izinGun: 15 },
  { ay: 'Mart', izinGun: 20 },
  { ay: 'Nisan', izinGun: 25 },
  { ay: 'Mayıs', izinGun: 32 },
  { ay: 'Haziran', izinGun: 42 },
  { ay: 'Temmuz', izinGun: 55 },
  { ay: 'Ağustos', izinGun: 60 },
  { ay: 'Eylül', izinGun: 30 },
  { ay: 'Ekim', izinGun: 22 },
  { ay: 'Kasım', izinGun: 18 },
  { ay: 'Aralık', izinGun: 15 },
];

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

const screenWidth = Dimensions.get('window').width - 40;

const LeaveStatsDashboardScreen = () => {
  const [filterValue, setFilterValue] = useState('year');
  const [chartData, setChartData] = useState(MOCK_AYLIK_IZINLER);

  useEffect(() => {
    // Gerçek projede API'den veri çekilecek
    // Şimdilik sadece butonlarda değişiklik gösteriyoruz
    if (filterValue === 'month') {
      // Ayın günlerine göre veri
      const gunlukData = Array.from({ length: 30 }, (_, i) => ({
        ay: `${i + 1}`,
        izinGun: Math.floor(Math.random() * 5) + 1,
      }));
      setChartData(gunlukData);
    } else if (filterValue === 'quarter') {
      // Çeyreklik veri
      setChartData([
        { ay: 'Q1', izinGun: 53 },
        { ay: 'Q2', izinGun: 99 },
        { ay: 'Q3', izinGun: 145 },
        { ay: 'Q4', izinGun: 55 },
      ]);
    } else {
      // Yıllık (aylık bazda) veri
      setChartData(MOCK_AYLIK_IZINLER);
    }
  }, [filterValue]);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>İzin Kullanım İstatistikleri</Title>
          <Paragraph style={styles.cardSubtitle}>2024 Yılı Verileri</Paragraph>
          
          <SegmentedButtons
            value={filterValue}
            onValueChange={setFilterValue}
            buttons={[
              { value: 'month', label: 'Ay' },
              { value: 'quarter', label: 'Çeyrek' },
              { value: 'year', label: 'Yıl' },
            ]}
            style={styles.segmentedButtons}
          />
          
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>
              İzin Kullanım Trendi ({filterValue === 'month' ? 'Günlük' : filterValue === 'quarter' ? 'Çeyreklik' : 'Aylık'})
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
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 86, 179, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: "#0056b3"
                }
              }}
              bezier
              style={styles.chart}
            />
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.chartTitle}>Departman Bazlı İzin Kullanımı</Title>
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
            height={220}
            yAxisLabel=""
            yAxisSuffix=" gün"
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              barPercentage: 0.6,
            }}
            style={styles.chart}
          />
        </Card.Content>
      </Card>
      
      <View style={styles.rowContainer}>
        <Card style={[styles.card, styles.halfCard]}>
          <Card.Content>
            <Title style={styles.chartTitle}>İzin Durumları</Title>
            <PieChart
              data={MOCK_IZIN_DURUMLARI.map((item, index) => ({
                name: item.durum,
                population: item.sayi,
                color: index === 0 ? '#4CAF50' : index === 1 ? '#FF9800' : '#F44336',
                legendFontColor: '#7F7F7F',
                legendFontSize: 12,
              }))}
              width={screenWidth * 0.45}
              height={180}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              absolute
            />
          </Card.Content>
        </Card>
        
        <Card style={[styles.card, styles.halfCard]}>
          <Card.Content>
            <Title style={styles.chartTitle}>İzin Tipleri</Title>
            <PieChart
              data={MOCK_IZIN_TIPLERI.map((item, index) => ({
                name: item.tip,
                population: item.sayi,
                color: index === 0 ? '#3F51B5' : index === 1 ? '#E91E63' : '#FFC107',
                legendFontColor: '#7F7F7F',
                legendFontSize: 12,
              }))}
              width={screenWidth * 0.45}
              height={180}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              absolute
            />
          </Card.Content>
        </Card>
      </View>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>İzin Yoğunluğu</Title>
          <Paragraph style={styles.cardSubtitle}>2024 Yılı En Yoğun Dönemler</Paragraph>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>10-15 Temmuz</Text>
              <Text style={styles.statLabel}>En Yoğun Hafta</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Ağustos</Text>
              <Text style={styles.statLabel}>En Yoğun Ay</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Mühendislik</Text>
              <Text style={styles.statLabel}>En Çok İzin Kullanan</Text>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.alertContainer}>
            <Text style={styles.alertTitle}>⚠️ Dikkat Edilmesi Gerekenler</Text>
            <Text style={styles.alertItem}>• Ağustos ayında izin yoğunluğu çok yüksek</Text>
            <Text style={styles.alertItem}>• Proje teslim dönemlerinde izin yoğunluğu azaltılmalı</Text>
            <Text style={styles.alertItem}>• Mühendislik departmanı izin kullanımı dengelenmeli</Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfCard: {
    width: '48%',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0056b3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  divider: {
    marginVertical: 16,
  },
  alertContainer: {
    backgroundColor: '#fff9c4',
    padding: 12,
    borderRadius: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  alertItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
});

export default LeaveStatsDashboardScreen;