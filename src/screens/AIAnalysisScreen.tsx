import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card, Title, Text, Button, Divider, Chip, List, useTheme } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';

// Örnek veri, gerçek projede API'den gelecek
const MOCK_AI_ANALYSIS = {
  ozet: {
    toplamTalep: 202,
    incelenenTalep: 202,
    potansiyelIhlal: 28,
    kritikIhlal: 12,
  },
  senaryolar: [
    {
      id: 1,
      baslik: 'Proje Teslim Döneminde İzin Talepleri',
      aciklama: 'Aşağıdaki izin talepleri proje teslim dönemlerine denk gelmektedir.',
      seviye: 'Kritik',
      talepler: [
        {
          id: 101,
          calisan: 'Ahmet Yılmaz',
          departman: 'Mühendislik',
          tarih: '20-26 Haziran 2024',
          ihlalSebebi: 'Ankara Otoyol Projesi teslim dönemi (25 Haziran)',
          cozumOnerisi: 'Talebi reddet veya tarihleri 3 Temmuz sonrasına kaydır',
        },
        {
          id: 102,
          calisan: 'Mehmet Demir',
          departman: 'Mühendislik',
          tarih: '10-14 Eylül 2024',
          ihlalSebebi: 'İstanbul Marina Projesi teslim dönemi (15 Eylül)',
          cozumOnerisi: 'Talebi reddet veya tarihleri 23 Eylül sonrasına kaydır',
        },
      ],
    },
    {
      id: 2,
      baslik: 'Departman Kotası Aşımı',
      aciklama: 'Aşağıdaki talepler onaylanırsa ilgili departmanlarda izinli çalışan sayısı %20 kotasını aşacaktır.',
      seviye: 'Yüksek',
      talepler: [
        {
          id: 201,
          calisan: 'Zeynep Kaya',
          departman: 'Şantiye Yönetimi',
          tarih: '5-9 Ağustos 2024',
          ihlalSebebi: 'Şantiye Yönetiminde aynı tarihlerde 5 kişi izinli (kota: 4)',
          cozumOnerisi: 'Kıdem sırasına göre daha kıdemli olan 4 kişinin iznini onayla',
        },
      ],
    },
    {
      id: 3,
      baslik: 'Yazlık İzin Kotası Aşımı',
      aciklama: 'Aşağıdaki talepler onaylanırsa kişinin yaz dönemi izin kotası olan 6 günü aşacaktır.',
      seviye: 'Orta',
      talepler: [
        {
          id: 301,
          calisan: 'Ali Yıldız',
          departman: 'Kalite Kontrol',
          tarih: '12-20 Ağustos 2024',
          ihlalSebebi: 'Yaz dönemi kullanılan izin: 4 gün, talep edilen: 5 gün, toplam: 9 gün > 6 gün kota',
          cozumOnerisi: 'Talebi 3 güne indir veya 6 gün dışında kalan günlerin resmi tatil/hafta sonu olduğundan emin ol',
        },
      ],
    },
  ],
};

const AIAnalysisScreen = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState<typeof MOCK_AI_ANALYSIS | null>(null);
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  useEffect(() => {
    // Gerçek projede API isteği yapılacak
    setTimeout(() => {
      setAiAnalysis(MOCK_AI_ANALYSIS);
      setIsLoading(false);
    }, 2000);
  }, []);

  const toggleExpandSection = (id: number) => {
    setExpandedSections((prev) => {
      if (prev.includes(id)) {
        return prev.filter((sectionId) => sectionId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Kritik':
        return '#d32f2f';
      case 'Yüksek':
        return '#f57c00';
      case 'Orta':
        return '#fbc02d';
      default:
        return '#7cb342';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>AI Analizi Yapılıyor...</Text>
        <Text style={styles.loadingSubText}>
          Tüm izin talepleri şirket kurallarına göre analiz ediliyor...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>AI Analiz Özeti</Title>
          
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{aiAnalysis?.ozet.toplamTalep}</Text>
              <Text style={styles.statLabel}>Toplam Talep</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{aiAnalysis?.ozet.incelenenTalep}</Text>
              <Text style={styles.statLabel}>İncelenen</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#f57c00' }]}>
                {aiAnalysis?.ozet.potansiyelIhlal}
              </Text>
              <Text style={styles.statLabel}>Potansiyel İhlal</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#d32f2f' }]}>
                {aiAnalysis?.ozet.kritikIhlal}
              </Text>
              <Text style={styles.statLabel}>Kritik İhlal</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitleText}>Tespit Edilen Senaryolar</Text>
      </View>

      {aiAnalysis?.senaryolar.map((senaryo) => (
        <Card key={senaryo.id} style={styles.scenarioCard}>
          <Card.Content>
            <View style={styles.scenarioHeader}>
              <View style={styles.scenarioTitleContainer}>
                <Title style={styles.scenarioTitle}>{senaryo.baslik}</Title>
                <Chip 
                  style={[styles.severityChip, { backgroundColor: getSeverityColor(senaryo.seviye) }]}
                >
                  <Text style={styles.severityChipText}>{senaryo.seviye}</Text>
                </Chip>
              </View>
              <Text style={styles.scenarioDescription}>{senaryo.aciklama}</Text>
            </View>

            <Divider style={styles.divider} />

            <List.Accordion
              title={`${senaryo.talepler.length} İhlal Tespit Edildi`}
              expanded={expandedSections.includes(senaryo.id)}
              onPress={() => toggleExpandSection(senaryo.id)}
              titleStyle={styles.accordionTitle}
            >
              {senaryo.talepler.map((talep) => (
                <Card key={talep.id} style={styles.violationCard}>
                  <Card.Content>
                    <View style={styles.violationHeader}>
                      <View>
                        <Text style={styles.employeeName}>{talep.calisan}</Text>
                        <Text style={styles.departmentName}>{talep.departman}</Text>
                      </View>
                      <Text style={styles.leaveDate}>{talep.tarih}</Text>
                    </View>
                    
                    <Divider style={styles.miniDivider} />
                    
                    <View style={styles.violationDetails}>
                      <Text style={styles.violationLabel}>İhlal Sebebi:</Text>
                      <Text style={styles.violationText}>{talep.ihlalSebebi}</Text>
                    </View>
                    
                    <View style={styles.violationDetails}>
                      <Text style={styles.violationLabel}>Çözüm Önerisi:</Text>
                      <Text style={styles.violationText}>{talep.cozumOnerisi}</Text>
                    </View>
                    
                    <View style={styles.actionButtons}>
                      <Button 
                        mode="contained" 
                        icon="close"
                        style={[styles.actionButton, styles.rejectButton]}
                      >
                        Reddet
                      </Button>
                      <Button 
                        mode="contained" 
                        icon="pencil"
                        style={[styles.actionButton, styles.editButton]}
                      >
                        Düzenle
                      </Button>
                      <Button 
                        mode="contained" 
                        icon="check"
                        style={[styles.actionButton, styles.approveButton]}
                      >
                        Onayla
                      </Button>
                    </View>
                  </Card.Content>
                </Card>
              ))}
            </List.Accordion>
          </Card.Content>
        </Card>
      ))}
      
      <Button 
        mode="contained" 
        icon="file-export" 
        style={styles.exportButton}
      >
        Rapor Oluştur
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  loadingSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  summaryCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0056b3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  sectionTitle: {
    marginVertical: 12,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  scenarioCard: {
    marginBottom: 16,
    elevation: 2,
  },
  scenarioHeader: {
    marginBottom: 12,
  },
  scenarioTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scenarioTitle: {
    fontSize: 16,
    flex: 1,
  },
  severityChip: {
    height: 26,
  },
  severityChipText: {
    color: 'white',
    fontSize: 12,
  },
  scenarioDescription: {
    fontSize: 14,
    color: '#555',
  },
  divider: {
    marginVertical: 12,
  },
  miniDivider: {
    marginVertical: 8,
  },
  accordionTitle: {
    fontWeight: 'bold',
  },
  violationCard: {
    marginVertical: 8,
    elevation: 1,
  },
  violationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  departmentName: {
    fontSize: 14,
    color: '#666',
  },
  leaveDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0056b3',
  },
  violationDetails: {
    marginVertical: 4,
  },
  violationLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  violationText: {
    fontSize: 14,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  editButton: {
    backgroundColor: '#FF9800',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  exportButton: {
    marginVertical: 16,
    backgroundColor: '#0056b3',
  },
});

export default AIAnalysisScreen;