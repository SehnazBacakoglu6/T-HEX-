import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card, Title, Paragraph } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc, query, where, getDocs, and } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { format, differenceInDays, isWithinInterval, addDays } from 'date-fns';

// Şirket politikaları ve sabitler
const SUMMER_PERIOD = {
    start: new Date('2024-06-01'),
    end: new Date('2024-08-31'),
    maxDays: 6
};

const PROJECT_DEADLINES = [
    {
        name: 'Ankara Otoyol Projesi',
        date: new Date('2024-06-25'),
        restrictedStart: new Date('2024-06-18'),
        restrictedEnd: new Date('2024-07-02')
    },
    {
        name: 'İstanbul Marina',
        date: new Date('2024-09-15'),
        restrictedStart: new Date('2024-09-08'),
        restrictedEnd: new Date('2024-09-22')
    },
    {
        name: 'İzmir Konut Projesi',
        date: new Date('2024-12-10'),
        restrictedStart: new Date('2024-12-03'),
        restrictedEnd: new Date('2024-12-17')
    }
];

const PERFORMANCE_PERIOD = {
    start: new Date('2024-12-01'),
    end: new Date('2025-01-15')
};

const HOLIDAYS_2024 = [
    new Date('2024-04-23'), // 23 Nisan
    new Date('2024-05-01'), // 1 Mayıs
    new Date('2024-05-19'), // 19 Mayıs
    new Date('2024-07-15'), // 15 Temmuz
    new Date('2024-08-30'), // 30 Ağustos
    new Date('2024-10-29'), // 29 Ekim
    new Date('2025-01-01')  // 1 Ocak 2025
];

// Departman kotaları
const DEPARTMENT_QUOTAS = {
    'Şantiye Yönetimi': 0.2,  // 19 kişi, max 3 kişi
    'Mühendislik': 0.2,       // 18 kişi, max 3 kişi
    'İK': 0.2,                // 7 kişi, max 1 kişi
    'Muhasebe': 0.2,          // 3 kişi, max 1 kişi
    'Kalite Kontrol': 0.2     // 3 kişi, max 1 kişi
};

// Kıdem yılına göre izin hakları
const ANNUAL_LEAVE_DAYS = {
    LESS_THAN_5: 14,    // 1-5 yıl
    LESS_THAN_15: 20,   // 5-15 yıl
    MORE_THAN_15: 26    // 15+ yıl
};

export default function LeaveRequestScreen() {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [explanation, setExplanation] = useState('');
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [myRequests, setMyRequests] = useState([]);
    const [userData, setUserData] = useState(null);
    const [remainingDays, setRemainingDays] = useState(0);

    useEffect(() => {
        fetchUserData();
        fetchMyRequests();
        calculateRemainingDays();
    }, []);

    const fetchUserData = async () => {
        if (!auth.currentUser) return;

        try {
            const userDoc = await getDocs(doc(db, 'users', auth.currentUser.uid));
            if (userDoc.exists()) {
                setUserData(userDoc.data());
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchMyRequests = async () => {
        if (!auth.currentUser) return;

        try {
            const q = query(
                collection(db, 'leave_requests'),
                where('user_id', '==', auth.currentUser.uid)
            );

            const querySnapshot = await getDocs(q);
            const requests = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMyRequests(requests);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    const calculateRemainingDays = async () => {
        if (!userData?.hire_date) return;

        // Kıdem yılını hesapla (2024 yılı baz alınarak)
        const hireDate = new Date(userData.hire_date);
        const referenceDate = new Date('2024-01-01');
        const yearsOfService = Math.floor(
            (referenceDate - hireDate) / (1000 * 60 * 60 * 24 * 365)
        );

        // İzin hakkını belirle
        let totalDays;
        if (yearsOfService < 5) {
            totalDays = ANNUAL_LEAVE_DAYS.LESS_THAN_5;
        } else if (yearsOfService < 15) {
            totalDays = ANNUAL_LEAVE_DAYS.LESS_THAN_15;
        } else {
            totalDays = ANNUAL_LEAVE_DAYS.MORE_THAN_15;
        }

        // Kullanılan izin günlerini hesapla
        const usedDays = myRequests
            .filter(request => request.status === 'approved')
            .reduce((total, request) => total + request.days_requested, 0);

        setRemainingDays(totalDays - usedDays);
    };

    const checkDepartmentQuota = async (startDate, endDate) => {
        if (!userData?.department) return { isValid: false, message: 'Departman bilgisi bulunamadı.' };

        try {
            // Seçilen tarih aralığında aynı departmandaki onaylanmış izinleri al
            const leaveRequestsQuery = query(
                collection(db, 'leave_requests'),
                and(
                    where('department', '==', userData.department),
                    where('status', '==', 'approved'),
                    where('start_date', '<=', endDate.toISOString()),
                    where('end_date', '>=', startDate.toISOString())
                )
            );

            const querySnapshot = await getDocs(leaveRequestsQuery);
            const overlappingRequests = querySnapshot.docs.length;

            // Departman çalışan sayısına göre maksimum izinli sayısını hesapla
            const departmentQuota = DEPARTMENT_QUOTAS[userData.department] || 0.2;
            const maxAllowed = Math.max(1, Math.floor(getDepartmentSize(userData.department) * departmentQuota));

            if (overlappingRequests >= maxAllowed) {
                return {
                    isValid: false,
                    message: `Departman kotası dolmuştur. Aynı anda maksimum ${maxAllowed} kişi izin kullanabilir.`
                };
            }

            return { isValid: true };
        } catch (error) {
            console.error('Departman kotası kontrolü hatası:', error);
            return { isValid: false, message: 'Departman kotası kontrolü yapılamadı.' };
        }
    };

    const getDepartmentSize = (department) => {
        const departmentSizes = {
            'Şantiye Yönetimi': 19,
            'Mühendislik': 18,
            'İK': 7,
            'Muhasebe': 3,
            'Kalite Kontrol': 3
        };
        return departmentSizes[department] || 0;
    };

    const validateLeaveRequest = async () => {
        if (!userData?.hire_date) {
            return { isValid: false, message: 'Kullanıcı bilgileri bulunamadı.' };
        }

        const hireDate = new Date(userData.hire_date);
        const sixMonthsFromHire = addDays(hireDate, 180);

        if (new Date() < sixMonthsFromHire) {
            return { isValid: false, message: 'İlk 6 ay izin kullanılamaz.' };
        }

        // Kalan izin günü kontrolü
        const requestedDays = calculateWorkDays(startDate, endDate);
        if (requestedDays > remainingDays) {
            return {
                isValid: false,
                message: `Yetersiz izin hakkı. Kalan izin gününüz: ${remainingDays} gün.`
            };
        }

        // Departman kotası kontrolü
        const quotaCheck = await checkDepartmentQuota(startDate, endDate);
        if (!quotaCheck.isValid) {
            return quotaCheck;
        }

        // Yaz dönemi kontrolü
        if (isWithinInterval(startDate, SUMMER_PERIOD) || isWithinInterval(endDate, SUMMER_PERIOD)) {
            const summerLeaveDays = calculateWorkDays(startDate, endDate);
            if (summerLeaveDays > SUMMER_PERIOD.maxDays) {
                return { isValid: false, message: 'Yaz döneminde (Haziran-Ağustos) maksimum 6 gün izin kullanılabilir.' };
            }
        }

        // Proje teslim dönemi kontrolü
        for (const project of PROJECT_DEADLINES) {
            if (isWithinInterval(startDate, { start: project.restrictedStart, end: project.restrictedEnd }) ||
                isWithinInterval(endDate, { start: project.restrictedStart, end: project.restrictedEnd })) {
                return { isValid: false, message: `${project.name} teslim döneminde izin kullanılamaz.` };
            }
        }

        // Performans değerlendirme dönemi kontrolü
        if (isWithinInterval(startDate, PERFORMANCE_PERIOD) || isWithinInterval(endDate, PERFORMANCE_PERIOD)) {
            return { isValid: false, message: 'Performans değerlendirme döneminde izin kullanılamaz.' };
        }

        return { isValid: true };
    };

    const calculateWorkDays = (start, end) => {
        let days = 0;
        let currentDate = new Date(start);

        while (currentDate <= end) {
            // Pazar günü kontrolü
            if (currentDate.getDay() !== 0) {
                // Resmi tatil kontrolü
                if (!HOLIDAYS_2024.some(holiday =>
                    holiday.getDate() === currentDate.getDate() &&
                    holiday.getMonth() === currentDate.getMonth() &&
                    holiday.getFullYear() === currentDate.getFullYear()
                )) {
                    days++;
                }
            }
            currentDate = addDays(currentDate, 1);
        }

        return days;
    };

    const handleSubmit = async () => {
        if (!explanation) {
            Alert.alert('Hata', 'Lütfen açıklama giriniz.');
            return;
        }

        const validation = await validateLeaveRequest();
        if (!validation.isValid) {
            Alert.alert('Hata', validation.message);
            return;
        }

        setLoading(true);
        try {
            const workDays = calculateWorkDays(startDate, endDate);

            await addDoc(collection(db, 'leave_requests'), {
                user_id: auth.currentUser.uid,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                days_requested: workDays,
                status: 'pending',
                explanation,
                department: userData?.department,
                position: userData?.position,
                ai_decision: null,
                ai_reason: null,
                created_at: new Date().toISOString()
            });

            Alert.alert('Başarılı', 'İzin talebiniz oluşturuldu.');
            setExplanation('');
            fetchMyRequests();
        } catch (error) {
            console.error('Error creating request:', error);
            Alert.alert('Hata', 'İzin talebi oluşturulamadı.');
        } finally {
            setLoading(false);
        }
    };

    const renderLeaveRequest = (request) => {
        return (
            <Card key={request.id} style={styles.card}>
                <Card.Content>
                    <Title>İzin Talebi</Title>
                    <Paragraph>
                        Tarih: {format(new Date(request.start_date), 'dd/MM/yyyy')} -
                        {format(new Date(request.end_date), 'dd/MM/yyyy')}
                    </Paragraph>
                    <Paragraph>Durum: {request.status}</Paragraph>
                    <Paragraph>Açıklama: {request.explanation}</Paragraph>
                    {request.ai_decision && (
                        <View style={styles.aiSection}>
                            <Text style={styles.aiTitle}>AI Değerlendirmesi</Text>
                            <Paragraph>Karar: {request.ai_decision}</Paragraph>
                            <Paragraph>Açıklama: {request.ai_reason}</Paragraph>
                        </View>
                    )}
                </Card.Content>
            </Card>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>İzin Talebi Oluştur</Text>

            <Card style={styles.infoCard}>
                <Card.Content>
                    <Title>İzin Bilgilerim</Title>
                    <Paragraph>Kalan İzin Günü: {remainingDays} gün</Paragraph>
                </Card.Content>
            </Card>

            <Button
                onPress={() => setShowStartPicker(true)}
                mode="outlined"
                style={styles.dateButton}
            >
                Başlangıç Tarihi: {format(startDate, 'dd/MM/yyyy')}
            </Button>

            <Button
                onPress={() => setShowEndPicker(true)}
                mode="outlined"
                style={styles.dateButton}
            >
                Bitiş Tarihi: {format(endDate, 'dd/MM/yyyy')}
            </Button>

            {showStartPicker && (
                <DateTimePicker
                    value={startDate}
                    mode="date"
                    onChange={(event, selectedDate) => {
                        setShowStartPicker(false);
                        if (selectedDate) {
                            setStartDate(selectedDate);
                            if (selectedDate > endDate) {
                                setEndDate(selectedDate);
                            }
                        }
                    }}
                    minimumDate={new Date()}
                />
            )}

            {showEndPicker && (
                <DateTimePicker
                    value={endDate}
                    mode="date"
                    onChange={(event, selectedDate) => {
                        setShowEndPicker(false);
                        if (selectedDate) setEndDate(selectedDate);
                    }}
                    minimumDate={startDate}
                />
            )}

            <TextInput
                label="Açıklama"
                value={explanation}
                onChangeText={setExplanation}
                mode="outlined"
                style={styles.input}
                multiline
                numberOfLines={3}
            />

            <Button
                mode="contained"
                onPress={handleSubmit}
                loading={loading}
                style={styles.button}
            >
                Talep Oluştur
            </Button>

            <Text style={styles.subtitle}>Taleplerim</Text>
            {myRequests.map(renderLeaveRequest)}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 10,
    },
    input: {
        marginBottom: 15,
    },
    dateButton: {
        marginBottom: 15,
    },
    button: {
        marginTop: 10,
    },
    card: {
        marginBottom: 10,
    },
    aiSection: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
    },
    aiTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    infoCard: {
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
    },
}); 