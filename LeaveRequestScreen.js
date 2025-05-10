import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { db, auth } from './firebaseConfig';
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput } from 'react-native-paper';

const DEPARTMENT_SIZES = {
    'Şantiye Yönetimi': 19,
    'Mühendislik': 18,
    'İK': 7,
    'Muhasebe': 3,
    'Kalite Kontrol': 3
};

const PROJECT_DEADLINES = {
    'Project A': { start: '2024-05-01', end: '2024-05-15' },
    'Project B': { start: '2024-07-15', end: '2024-07-30' },
    'Project C': { start: '2024-09-10', end: '2024-09-25' }
};

export default function LeaveRequestScreen() {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [explanation, setExplanation] = useState('');
    const [department, setDepartment] = useState('');
    const [remainingDays, setRemainingDays] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const userDoc = await getDocs(query(
                collection(db, "users"),
                where("uid", "==", auth.currentUser.uid)
            ));
            if (!userDoc.empty) {
                const userData = userDoc.docs[0].data();
                setDepartment(userData.department);
                calculateRemainingDays(userData.joinDate);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch user information');
        }
    };

    const calculateRemainingDays = (joinDate) => {
        const today = new Date();
        const yearsOfService = (today - new Date(joinDate)) / (1000 * 60 * 60 * 24 * 365);

        let totalDays;
        if (yearsOfService < 5) totalDays = 14;
        else if (yearsOfService < 15) totalDays = 20;
        else totalDays = 26;

        setRemainingDays(totalDays); // This should be adjusted based on used days
    };

    const validateRequest = async () => {
        // Check summer period restriction
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            Alert.alert('Error', 'End date must be after start date');
            return false;
        }

        // Summer period check (June-August)
        if ((start.getMonth() >= 5 && start.getMonth() <= 7) ||
            (end.getMonth() >= 5 && end.getMonth() <= 7)) {
            const summerDays = calculateDays(startDate, endDate);
            if (summerDays > 6) {
                Alert.alert('Error', 'Maximum 6 days allowed during summer period');
                return false;
            }
        }

        // Project deadline check
        for (const [project, dates] of Object.entries(PROJECT_DEADLINES)) {
            const deadlineStart = new Date(dates.start);
            const deadlineEnd = new Date(dates.end);

            if ((start >= deadlineStart && start <= deadlineEnd) ||
                (end >= deadlineStart && end <= deadlineEnd)) {
                Alert.alert('Error', `Leave not allowed during ${project} deadline period`);
                return false;
            }
        }

        // Performance evaluation period check
        const evalStart = new Date('2024-12-01');
        const evalEnd = new Date('2025-01-31');
        if ((start >= evalStart && start <= evalEnd) ||
            (end >= evalStart && end <= evalEnd)) {
            Alert.alert('Error', 'Leave not allowed during performance evaluation period');
            return false;
        }

        // Department quota check
        const activeRequests = await getDocs(query(
            collection(db, "leave_requests"),
            where("department", "==", department),
            where("status", "==", "approved")
        ));

        const currentOnLeave = activeRequests.size;
        const maxAllowed = Math.floor(DEPARTMENT_SIZES[department] * 0.2);

        if (currentOnLeave >= maxAllowed) {
            Alert.alert('Error', 'Department quota exceeded');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const isValid = await validateRequest();
            if (!isValid) {
                setLoading(false);
                return;
            }

            await addDoc(collection(db, "leave_requests"), {
                user_id: auth.currentUser.uid,
                department,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                days_requested: calculateDays(startDate, endDate),
                status: "pending",
                explanation,
                ai_decision: null,
                ai_reason: null,
                created_at: new Date().toISOString()
            });

            Alert.alert('Success', 'Leave request submitted successfully');
            setExplanation('');
        } catch (error) {
            Alert.alert('Error', 'Failed to submit leave request');
        } finally {
            setLoading(false);
        }
    };

    const calculateDays = (start, end) => {
        let count = 0;
        const current = new Date(start);
        const endDate = new Date(end);

        while (current <= endDate) {
            if (current.getDay() !== 0) { // Skip Sundays
                count++;
            }
            current.setDate(current.getDate() + 1);
        }
        return count;
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Leave Request</Text>

            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Remaining Days: {remainingDays}</Text>
                <Text style={styles.infoText}>Department: {department}</Text>
            </View>

            <View style={styles.dateContainer}>
                <Button
                    title="Select Start Date"
                    onPress={() => setShowStartPicker(true)}
                />
                <Text style={styles.dateText}>
                    {startDate.toLocaleDateString()}
                </Text>

                {showStartPicker && (
                    <DateTimePicker
                        value={startDate}
                        mode="date"
                        onChange={(event, date) => {
                            setShowStartPicker(false);
                            if (date) setStartDate(date);
                        }}
                    />
                )}
            </View>

            <View style={styles.dateContainer}>
                <Button
                    title="Select End Date"
                    onPress={() => setShowEndPicker(true)}
                />
                <Text style={styles.dateText}>
                    {endDate.toLocaleDateString()}
                </Text>

                {showEndPicker && (
                    <DateTimePicker
                        value={endDate}
                        mode="date"
                        onChange={(event, date) => {
                            setShowEndPicker(false);
                            if (date) setEndDate(date);
                        }}
                    />
                )}
            </View>

            <TextInput
                style={styles.input}
                placeholder="Explanation"
                value={explanation}
                onChangeText={setExplanation}
                multiline
                numberOfLines={4}
            />

            <Button
                title={loading ? "Submitting..." : "Submit Leave Request"}
                onPress={handleSubmit}
                disabled={loading}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    infoContainer: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    infoText: {
        fontSize: 16,
        marginBottom: 5,
    },
    dateContainer: {
        marginBottom: 20,
    },
    dateText: {
        fontSize: 16,
        marginTop: 8,
    },
    input: {
        marginBottom: 20,
    },
});