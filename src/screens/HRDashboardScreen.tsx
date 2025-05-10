import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, Text, Divider, Searchbar, Chip, Modal, Portal, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define your navigation param list
type RootStackParamList = {
  HRDashboard: undefined;
  AIAnalysis: undefined;
  LeaveStatsDashboard: undefined;
  // Add other screens as needed
};

// Create the navigation prop type
type HRDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'HRDashboard'>;
};

// Simplified types
enum LeaveStatus {
  PENDING = 'Bekliyor',
  APPROVED = 'Onaylandı',
  REJECTED = 'Reddedildi'
}

type LeaveRequest = {
  id: number;
  userId: number;
  startDate: string;
  endDate: string;
  days: number;
  description: string;
  requestDate: string;
  status: LeaveStatus;
  rejectReason?: string;
  leaveType: string;
}

// Mock data, will come from API in real project
const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 1,
    userId: 1,
    startDate: '2024-06-10',
    endDate: '2024-06-14',
    days: 5,
    description: 'Yıllık izin',
    requestDate: '2024-05-20',
    status: LeaveStatus.PENDING,
    leaveType: 'Yıllık İzin'
  },
  {
    id: 2,
    userId: 2,
    startDate: '2024-07-01',
    endDate: '2024-07-05',
    days: 5,
    description: 'Aile tatili',
    requestDate: '2024-05-15',
    status: LeaveStatus.APPROVED,
    leaveType: 'Yıllık İzin'
  },
  {
    id: 3,
    userId: 3,
    startDate: '2024-06-20',
    endDate: '2024-06-20',
    days: 1,
    description: 'Sağlık kontrolü',
    requestDate: '2024-05-18',
    status: LeaveStatus.REJECTED,
    rejectReason: 'Proje teslim dönemine denk geliyor',
    leaveType: 'Acil Durum İzni'
  }
];

// Mock employee data, will come from API in real project
const MOCK_EMPLOYEES = {
  1: { id: 1, firstName: 'Ahmet', lastName: 'Yılmaz', department: 'Mühendislik', position: 'İnşaat Mühendisi' },
  2: { id: 2, firstName: 'Zeynep', lastName: 'Kaya', department: 'Şantiye Yönetimi', position: 'Şantiye Şefi' },
  3: { id: 3, firstName: 'Mehmet', lastName: 'Demir', department: 'Kalite Kontrol', position: 'Kalite Kontrol Uzmanı' }
};

const HRDashboardScreen = ({ navigation }: HRDashboardScreenProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);
  const [filteredLeaveRequests, setFilteredLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Search filtering
  useEffect(() => {
    let filtered = leaveRequests;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(leave => {
        const employee = MOCK_EMPLOYEES[leave.userId as keyof typeof MOCK_EMPLOYEES];
        if (!employee) return false;
        
        const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      });
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(leave => leave.status === selectedStatus);
    }

    setFilteredLeaveRequests(filtered);
  }, [searchQuery, selectedStatus, leaveRequests]);

  const onRefresh = () => {
    setIsLoading(true);
    // Will fetch data from API in real project
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: tr });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Onaylandı':
        return '#4CAF50';
      case 'Reddedildi':
        return '#F44336';
      default:
        return '#FF9800';
    }
  };

  const handleApprove = (leave: LeaveRequest) => {
    // Will make API request in real project
    const updatedLeave = { ...leave, status: LeaveStatus.APPROVED };
    setLeaveRequests(prev => prev.map(item => item.id === leave.id ? updatedLeave : item));
  };

  const handleReject = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setModalVisible(true);
  };

  const confirmReject = () => {
    if (!selectedLeave || !rejectReason) return;
    
    // Will make API request in real project
    const updatedLeave = { 
      ...selectedLeave, 
      status: LeaveStatus.REJECTED,
      rejectReason
    };
    
    setLeaveRequests(prev => prev.map(item => item.id === selectedLeave.id ? updatedLeave : item));
    setModalVisible(false);
    setRejectReason('');
    setSelectedLeave(null);
  };

  const runAIAnalysis = () => {
    // Will perform AI analysis in real project
    navigation.navigate('AIAnalysis');
  };

  const goToDashboard = () => {
    navigation.navigate('LeaveStatsDashboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerButtons}>
        <Button 
          mode="contained" 
          icon="chart-bar" 
          onPress={goToDashboard}
          style={[styles.headerButton, { flex: 1, marginRight: 8 }]}
        >
          İstatistikler
        </Button>
        <Button 
          mode="contained" 
          icon="robot" 
          onPress={runAIAnalysis}
          style={[styles.headerButton, { flex: 1, marginLeft: 8 }]}
        >
          AI Analiz
        </Button>
      </View>

      <Searchbar
        placeholder="Çalışan ara..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        <Chip 
          selected={selectedStatus === null}
          onPress={() => setSelectedStatus(null)}
          style={styles.filterChip}
        >
          Tümü
        </Chip>
        <Chip 
          selected={selectedStatus === LeaveStatus.PENDING}
          onPress={() => setSelectedStatus(LeaveStatus.PENDING)}
          style={styles.filterChip}
        >
          Bekliyor
        </Chip>
        <Chip 
          selected={selectedStatus === LeaveStatus.APPROVED}
          onPress={() => setSelectedStatus(LeaveStatus.APPROVED)}
          style={styles.filterChip}
        >
          Onaylandı
        </Chip>
        <Chip 
          selected={selectedStatus === LeaveStatus.REJECTED}
          onPress={() => setSelectedStatus(LeaveStatus.REJECTED)}
          style={styles.filterChip}
        >
          Reddedildi
        </Chip>
      </ScrollView>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      >
        {filteredLeaveRequests.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Paragraph>Filtrelerinize uygun izin talebi bulunamadı.</Paragraph>
            </Card.Content>
          </Card>
        ) : (
          filteredLeaveRequests.map((leave) => {
            const employee = MOCK_EMPLOYEES[leave.userId as keyof typeof MOCK_EMPLOYEES];
            
            return (
              <Card key={leave.id} style={styles.leaveCard}>
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <View>
                      <Title>{`${employee?.firstName} ${employee?.lastName}`}</Title>
                      <Paragraph>{`${employee?.department} / ${employee?.position}`}</Paragraph>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(leave.status) }]}>
                      <Text style={styles.statusText}>{leave.status}</Text>
                    </View>
                  </View>

                  <Divider style={styles.divider} />
                  
                  <View style={styles.leaveDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>İzin Türü:</Text>
                      <Text style={styles.detailValue}>{leave.leaveType}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Başlangıç:</Text>
                      <Text style={styles.detailValue}>{formatDate(leave.startDate)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Bitiş:</Text>
                      <Text style={styles.detailValue}>{formatDate(leave.endDate)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Toplam:</Text>
                      <Text style={styles.detailValue}>{`${leave.days} iş günü`}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Talep Tarihi:</Text>
                      <Text style={styles.detailValue}>{formatDate(leave.requestDate)}</Text>
                    </View>
                  </View>

                  {leave.description && (
                    <View style={styles.noteBox}>
                      <Text style={styles.noteLabel}>Açıklama:</Text>
                      <Text style={styles.noteText}>{leave.description}</Text>
                    </View>
                  )}

                  {leave.rejectReason && (
                    <View style={styles.rejectBox}>
                      <Text style={styles.rejectLabel}>Red Sebebi:</Text>
                      <Text style={styles.rejectText}>{leave.rejectReason}</Text>
                    </View>
                  )}

                  {leave.status === LeaveStatus.PENDING && (
                    <View style={styles.actionButtons}>
                      <Button 
                        mode="contained" 
                        onPress={() => handleApprove(leave)}
                        style={[styles.actionButton, styles.approveButton]}
                      >
                        Onayla
                      </Button>
                      <Button 
                        mode="contained" 
                        onPress={() => handleReject(leave)}
                        style={[styles.actionButton, styles.rejectButton]}
                      >
                        Reddet
                      </Button>
                    </View>
                  )}
                </Card.Content>
              </Card>
            );
          })
        )}
      </ScrollView>

      <Portal>
        <Modal 
          visible={modalVisible} 
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>İzin Talebini Reddet</Title>
          <Paragraph style={styles.modalText}>
            Lütfen red sebebini belirtin:
          </Paragraph>
          <TextInput
            label="Red Sebebi"
            value={rejectReason}
            onChangeText={setRejectReason}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.modalInput}
          />
          <View style={styles.modalButtons}>
            <Button 
              mode="outlined" 
              onPress={() => {
                setModalVisible(false);
                setRejectReason('');
              }}
              style={styles.modalButton}
            >
              İptal
            </Button>
            <Button 
              mode="contained" 
              onPress={confirmReject}
              disabled={!rejectReason}
              style={styles.modalButton}
            >
              Reddet
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  headerButton: {
    paddingVertical: 8,
  },
  searchbar: {
    marginBottom: 16,
  },
  filterContainer: {
    paddingBottom: 16,
  },
  filterChip: {
    marginRight: 8,
  },
  emptyCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  leaveCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 12,
  },
  leaveDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  detailValue: {
    color: '#333',
  },
  noteBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  noteLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  noteText: {
    fontStyle: 'italic',
  },
  rejectBox: {
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  rejectLabel: {
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 4,
  },
  rejectText: {
    fontStyle: 'italic',
    color: '#d32f2f',
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
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  modalText: {
    marginBottom: 12,
  },
  modalInput: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    minWidth: 100,
  },
});

export default HRDashboardScreen;