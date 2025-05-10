import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, StatusBar, Animated, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Button, Text, Divider, Searchbar, Chip, Modal, Portal, TextInput, Avatar, IconButton } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

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
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  // Animation effect on load
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true
      })
    ]).start();
  }, []);

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
  
  // Get avatar initials for an employee
  const getInitials = (userId: number) => {
    const employee = MOCK_EMPLOYEES[userId as keyof typeof MOCK_EMPLOYEES];
    if (!employee) return "??";
    return `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4776E6" />
      
      {/* Gradient Background like login screen */}
      <LinearGradient
        colors={['#4776E6', '#8E54E9']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* HR Dashboard Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>İK Yönetim Paneli</Text>
          <Text style={styles.headerSubtitle}>İzin Talepleri</Text>
        </View>
        <Avatar.Text 
          size={40} 
          label="IK" 
          style={styles.avatar}
          labelStyle={styles.avatarText}
        />
      </View>
      
      {/* Main Content Card */}
      <Animated.View 
        style={[
          styles.mainContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Action Buttons */}
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.headerButton, styles.statsButton]}
            onPress={goToDashboard}
          >
            <Ionicons name="bar-chart-outline" size={18} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>İstatistikler</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.headerButton, styles.aiButton]}
            onPress={runAIAnalysis}
          >
            <Ionicons name="analytics-outline" size={18} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>AI Analiz</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#777" style={styles.searchIcon} />
          <TextInput
            placeholder="Çalışan ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            mode="flat"
            underlineColor="transparent"
            activeUnderlineColor="transparent"
          />
        </View>

        <ScrollView 
  horizontal 
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.filterContainer}
>
  <TouchableOpacity 
    style={[
      styles.filterChip, 
      selectedStatus === null && styles.activeFilterChip
    ]}
    onPress={() => setSelectedStatus(null)}
    activeOpacity={0.7}
  >
    <Ionicons 
      name="funnel-outline" 
      size={14} 
      color={selectedStatus === null ? "#fff" : "#666"} 
      style={styles.filterIcon} 
    />
    <Text style={[
      styles.filterChipText, 
      selectedStatus === null && styles.activeFilterChipText
    ]}>Tümü</Text>
  </TouchableOpacity>
  
  <TouchableOpacity 
    style={[
      styles.filterChip, 
      selectedStatus === LeaveStatus.PENDING && styles.pendingFilterChip
    ]}
    onPress={() => setSelectedStatus(LeaveStatus.PENDING)}
    activeOpacity={0.7}
  >
    <Ionicons 
      name="time-outline" 
      size={14} 
      color={selectedStatus === LeaveStatus.PENDING ? "#fff" : "#FF9800"} 
      style={styles.filterIcon} 
    />
    <Text style={[
      styles.filterChipText, 
      selectedStatus === LeaveStatus.PENDING && styles.pendingFilterChipText
    ]}>Bekleyen</Text>
  </TouchableOpacity>
  
  <TouchableOpacity 
    style={[
      styles.filterChip, 
      selectedStatus === LeaveStatus.APPROVED && styles.approvedFilterChip
    ]}
    onPress={() => setSelectedStatus(LeaveStatus.APPROVED)}
    activeOpacity={0.7}
  >
    <Ionicons 
      name="checkmark-outline" 
      size={14} 
      color={selectedStatus === LeaveStatus.APPROVED ? "#fff" : "#4CAF50"} 
      style={styles.filterIcon} 
    />
    <Text style={[
      styles.filterChipText, 
      selectedStatus === LeaveStatus.APPROVED && styles.approvedFilterChipText
    ]}>Onaylı</Text>
  </TouchableOpacity>
  
  <TouchableOpacity 
    style={[
      styles.filterChip, 
      selectedStatus === LeaveStatus.REJECTED && styles.rejectedFilterChip
    ]}
    onPress={() => setSelectedStatus(LeaveStatus.REJECTED)}
    activeOpacity={0.7}
  >
    <Ionicons 
      name="close-outline" 
      size={14} 
      color={selectedStatus === LeaveStatus.REJECTED ? "#fff" : "#F44336"} 
      style={styles.filterIcon} 
    />
    <Text style={[
      styles.filterChipText, 
      selectedStatus === LeaveStatus.REJECTED && styles.rejectedFilterChipText
    ]}>Reddedilen</Text>
  </TouchableOpacity>
</ScrollView>        {/* Leave Request Cards */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={isLoading} 
              onRefresh={onRefresh} 
              colors={['#4776E6']}
              tintColor="#4776E6"
            />
          }
          style={styles.cardScrollView}
        >
          {filteredLeaveRequests.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Filtrelerinize uygun izin talebi bulunamadı.</Text>
            </View>
          ) : (
            filteredLeaveRequests.map((leave) => {
              const employee = MOCK_EMPLOYEES[leave.userId as keyof typeof MOCK_EMPLOYEES];
              
              return (
                <Card key={leave.id} style={styles.leaveCard}>
                  <Card.Content>
                    <View style={styles.cardHeader}>
                      <View style={styles.employeeSection}>
                        <Avatar.Text 
                          size={40} 
                          label={getInitials(leave.userId)}
                          style={[styles.employeeAvatar, { backgroundColor: getStatusColor(leave.status) + '30' }]}
                          labelStyle={{ color: getStatusColor(leave.status) }}
                        />
                        <View style={styles.employeeInfo}>
                          <Text style={styles.employeeName}>{`${employee?.firstName} ${employee?.lastName}`}</Text>
                          <Text style={styles.employeePosition}>{`${employee?.department} / ${employee?.position}`}</Text>
                        </View>
                      </View>
                      <View style={[styles.statusBadge, { 
                        backgroundColor: getStatusColor(leave.status) + '20',
                        borderColor: getStatusColor(leave.status) + '40'
                      }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(leave.status) }]}>
                          {leave.status}
                        </Text>
                      </View>
                    </View>

                    <Divider style={styles.divider} />
                    
                    <View style={styles.leaveDetails}>
                      <View style={styles.detailItem}>
                        <View style={styles.detailIcon}>
                          <Ionicons name="calendar-outline" size={16} color="#4776E6" />
                        </View>
                        <View style={styles.detailContent}>
                          <Text style={styles.detailLabel}>İzin Türü</Text>
                          <Text style={styles.detailValue}>{leave.leaveType}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.detailItem}>
                        <View style={styles.detailIcon}>
                          <Ionicons name="time-outline" size={16} color="#4776E6" />
                        </View>
                        <View style={styles.detailContent}>
                          <Text style={styles.detailLabel}>Tarih Aralığı</Text>
                          <Text style={styles.detailValue}>
                            {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.detailItem}>
                        <View style={styles.detailIcon}>
                          <Ionicons name="hourglass-outline" size={16} color="#4776E6" />
                        </View>
                        <View style={styles.detailContent}>
                          <Text style={styles.detailLabel}>Süre</Text>
                          <Text style={styles.detailValue}>{`${leave.days} iş günü`}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.detailItem}>
                        <View style={styles.detailIcon}>
                          <Ionicons name="today-outline" size={16} color="#4776E6" />
                        </View>
                        <View style={styles.detailContent}>
                          <Text style={styles.detailLabel}>Talep Tarihi</Text>
                          <Text style={styles.detailValue}>{formatDate(leave.requestDate)}</Text>
                        </View>
                      </View>
                    </View>

                    {leave.description && (
                      <View style={styles.descriptionContainer}>
                        <View style={styles.descriptionHeader}>
                          <Ionicons name="document-text-outline" size={16} color="#4776E6" />
                          <Text style={styles.descriptionTitle}>Açıklama</Text>
                        </View>
                        <Text style={styles.descriptionText}>{leave.description}</Text>
                      </View>
                    )}

                    {leave.rejectReason && (
                      <View style={styles.rejectContainer}>
                        <View style={styles.rejectHeader}>
                          <Ionicons name="alert-circle-outline" size={16} color="#F44336" />
                          <Text style={styles.rejectTitle}>Red Sebebi</Text>
                        </View>
                        <Text style={styles.rejectText}>{leave.rejectReason}</Text>
                      </View>
                    )}

                    {leave.status === LeaveStatus.PENDING && (
                      <View style={styles.actionButtons}>
                        <TouchableOpacity 
                          style={styles.approveButton}
                          onPress={() => handleApprove(leave)}
                        >
                          <Ionicons name="checkmark" size={18} color="#FFF" />
                          <Text style={styles.actionButtonText}>Onayla</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.rejectButton}
                          onPress={() => handleReject(leave)}
                        >
                          <Ionicons name="close" size={18} color="#FFF" />
                          <Text style={styles.actionButtonText}>Reddet</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </Card.Content>
                </Card>
              );
            })
          )}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </Animated.View>

      {/* Rejection Modal */}
      <Portal>
        <Modal 
          visible={modalVisible} 
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalIconContainer}>
            <Ionicons name="close-circle" size={50} color="#F44336" />
          </View>
          
          <Text style={styles.modalTitle}>İzin Talebini Reddet</Text>
          <Text style={styles.modalSubtitle}>
            Lütfen red sebebini belirtin:
          </Text>
          
          <TextInput
            label="Red Sebebi"
            value={rejectReason}
            onChangeText={setRejectReason}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.modalInput}
            outlineColor="#ddd"
            activeOutlineColor="#F44336"
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => {
                setModalVisible(false);
                setRejectReason('');
              }}
            >
              <Text style={styles.modalCancelButtonText}>İptal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.modalConfirmButton,
                !rejectReason && styles.modalDisabledButton
              ]}
              onPress={confirmReject}
              disabled={!rejectReason}
            >
              <Text style={styles.modalConfirmButtonText}>Reddet</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
    </View>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  avatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarText: {
    fontWeight: 'bold',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 0.48,
    elevation: 2,
  },
  statsButton: {
    backgroundColor: '#4776E6',
  },
  aiButton: {
    backgroundColor: '#8E54E9',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    height: 45,
    fontSize: 14,
  },
  filterContainer: {
    paddingBottom: 16,
    paddingHorizontal: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    marginRight: 8,
    elevation: 1,
  },
  filterIcon: {
    marginRight: 4,
  },
  activeFilterChip: {
    backgroundColor: '#4776E6',
  },
  pendingFilterChip: {
    backgroundColor: '#FF9800',
  },
  approvedFilterChip: {
    backgroundColor: '#4CAF50',
  },
  rejectedFilterChip: {
    backgroundColor: '#F44336',
  },
  filterChipText: {
    fontSize: 12,
    color: '#666',
  },
  activeFilterChipText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pendingFilterChipText: {
    color: 'white',
    fontWeight: 'bold',
  },
  approvedFilterChipText: {
    color: 'white',
    fontWeight: 'bold',
  },
  rejectedFilterChipText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cardScrollView: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 12,
    color: '#888',
    textAlign: 'center',
  },
  leaveCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  employeeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  employeeAvatar: {
    marginRight: 12,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  employeePosition: {
    fontSize: 12,
    color: '#777',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  divider: {
    marginBottom: 12,
    backgroundColor: '#eee',
    height: 1,
  },
  leaveDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(71, 118, 230, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#777',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  descriptionContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  descriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4776E6',
    marginLeft: 6,
  },
  descriptionText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  rejectContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  rejectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rejectTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F44336',
    marginLeft: 6,
  },
  rejectText: {
    fontSize: 13,
    color: '#d32f2f',
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 0.48,
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 0.48,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
  bottomPadding: {
    height: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    margin: 20,
    alignItems: 'center',
  },
  modalIconContainer: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 0.48,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  modalConfirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#F44336',
    flex: 0.48,
    alignItems: 'center',
  },
  modalConfirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalDisabledButton: {
    opacity: 0.7,
  },
});

export default HRDashboardScreen;