import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Divider, List, Title, Paragraph } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';

// Simple enum for leave types
enum LeaveType {
  ANNUAL = 'Yıllık İzin',
  EMERGENCY = 'Acil Durum',
  BIRTHDAY = 'Doğum Günü'
}

// Simple date formatter
const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Simple business days calculator
const calculateBusinessDays = (startDate: Date, endDate: Date): number => {
  let count = 0;
  const curDate = new Date(startDate.getTime());
  
  while (curDate <= endDate) {
    const dayOfWeek = curDate.getDay();
    // Skip weekends (0 is Sunday, 6 is Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    curDate.setDate(curDate.getDate() + 1);
  }
  
  return count;
};

const NewLeaveRequestScreen = ({ navigation }: any) => {
  // Basic state management
  const [leaveType, setLeaveType] = useState<LeaveType>(LeaveType.ANNUAL);
  const [showLeaveTypeMenu, setShowLeaveTypeMenu] = useState(false);
  
  // Date handling without external date picker
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock user data
  const user = {
    id: 1,
    name: 'John Doe',
    remainingDays: 15
  };

  // Calculate business days
  const calculatedDays = calculateBusinessDays(startDate, endDate);

  // Simple date incrementer functions
  const incrementStartDate = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + 1);
    setStartDate(newDate);
    
    // If start date is after end date, update end date too
    if (newDate > endDate) {
      setEndDate(newDate);
    }
  };

  const decrementStartDate = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() - 1);
    
    // Don't go before today
    if (newDate >= today) {
      setStartDate(newDate);
    }
  };

  const incrementEndDate = () => {
    const newDate = new Date(endDate);
    newDate.setDate(newDate.getDate() + 1);
    setEndDate(newDate);
  };

  const decrementEndDate = () => {
    const newDate = new Date(endDate);
    newDate.setDate(newDate.getDate() - 1);
    
    // Don't go before start date
    if (newDate >= startDate) {
      setEndDate(newDate);
    }
  };

  // Submit handler
  const handleSubmit = async () => {
    if (calculatedDays === 0) {
      Alert.alert('Hata', 'Geçerli bir tarih aralığı seçmelisiniz.');
      return;
    }

    if (!description) {
      Alert.alert('Hata', 'Lütfen izin talebiniz için bir açıklama girin.');
      return;
    }

    setIsLoading(true);
    try {
      // Simplified - just log the data instead of dispatching to store
      const leaveRequest = {
        userId: user.id,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        days: calculatedDays,
        description,
        leaveType
      };
      
      console.log('Submitting leave request:', leaveRequest);
      
      // Simulate API call
      setTimeout(() => {
        Alert.alert('Başarılı', 'İzin talebiniz başarıyla oluşturuldu.');
        navigation.goBack();
      }, 1000);
    } catch (error) {
      Alert.alert('Hata', 'İzin talebi oluşturulurken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Title style={styles.title}>Yeni İzin Talebi</Title>
        
        <List.Section>
          <List.Accordion
            title={`İzin Tipi: ${leaveType}`}
            expanded={showLeaveTypeMenu}
            onPress={() => setShowLeaveTypeMenu(!showLeaveTypeMenu)}
          >
            <List.Item 
              title={LeaveType.ANNUAL}
              onPress={() => {
                setLeaveType(LeaveType.ANNUAL);
                setShowLeaveTypeMenu(false);
              }}
            />
            <List.Item 
              title={LeaveType.EMERGENCY}
              onPress={() => {
                setLeaveType(LeaveType.EMERGENCY);
                setShowLeaveTypeMenu(false);
              }}
            />
            <List.Item 
              title={LeaveType.BIRTHDAY}
              onPress={() => {
                setLeaveType(LeaveType.BIRTHDAY);
                setShowLeaveTypeMenu(false);
              }}
            />
          </List.Accordion>
        </List.Section>

        <Divider style={styles.divider} />
        
        {/* Simple date picker UI */}
        <View style={styles.dateSection}>
          <Text style={styles.dateLabel}>Başlangıç Tarihi:</Text>
          <View style={styles.datePickerRow}>
            <TouchableOpacity onPress={decrementStartDate} style={styles.dateButton}>
              <Text style={styles.dateButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.dateText}>{formatDate(startDate)}</Text>
            <TouchableOpacity onPress={incrementStartDate} style={styles.dateButton}>
              <Text style={styles.dateButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.dateLabel}>Bitiş Tarihi:</Text>
          <View style={styles.datePickerRow}>
            <TouchableOpacity onPress={decrementEndDate} style={styles.dateButton}>
              <Text style={styles.dateButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.dateText}>{formatDate(endDate)}</Text>
            <TouchableOpacity onPress={incrementEndDate} style={styles.dateButton}>
              <Text style={styles.dateButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.dayCalcContainer}>
          <Text style={styles.dayCalcLabel}>Toplam İş Günü:</Text>
          <Text style={styles.dayCalcValue}>{calculatedDays} gün</Text>
        </View>

        <Divider style={styles.divider} />
        
        <TextInput
          label="Açıklama"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.textInput}
        />

        <View style={styles.infoBox}>
          <Paragraph style={styles.infoText}>
            Kalan İzin Hakkınız: {user.remainingDays} gün
          </Paragraph>
          <Paragraph style={styles.infoText}>
            Talep edilen izin: {calculatedDays} gün
          </Paragraph>
          {calculatedDays > user.remainingDays && (
            <Paragraph style={styles.warningText}>
              Dikkat: Talep ettiğiniz izin gün sayısı, kalan izin hakkınızdan fazladır!
            </Paragraph>
          )}
        </View>
        
        <Button 
          mode="contained" 
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading || calculatedDays === 0 || !description}
          style={styles.submitButton}
        >
          İzin Talebi Oluştur
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  dateSection: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  dateButton: {
    backgroundColor: '#e0e0e0',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 18,
    paddingHorizontal: 16,
  },
  dayCalcContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  dayCalcLabel: {
    fontSize: 16,
  },
  dayCalcValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textInput: {
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 16,
  },
  infoText: {
    marginBottom: 4,
  },
  warningText: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 8,
  },
  submitButton: {
    paddingVertical: 8,
    backgroundColor: '#0056b3',
  },
});

export default NewLeaveRequestScreen;