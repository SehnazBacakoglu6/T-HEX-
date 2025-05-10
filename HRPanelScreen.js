import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { db } from './firebaseConfig';
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { Card, Title, Paragraph, Chip, DataTable, Searchbar } from 'react-native-paper';
import { httpsCallable } from 'firebase/functions';

const DEPARTMENT_SIZES = {
    'Şantiye Yönetimi': 19,
    'Mühendislik': 18,
    'İK': 7,
    'Muhasebe': 3,
    'Kalite Kontrol': 3
};

export default function HRPanelScreen() {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [departmentStats, setDepartmentStats] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    useEffect(() => {
        filterRequests();
    }, [selectedDepartment, searchQuery, requests]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "leave_requests"));
            const requestsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRequests(requestsData);
            calculateDepartmentStats(requestsData);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch leave requests');
        } finally {
            setLoading(false);
        }
    };

    const calculateDepartmentStats = (requestsData) => {
        const stats = {};
        Object.keys(DEPARTMENT_SIZES).forEach(dept => {
            const deptRequests = requestsData.filter(r => r.department === dept);
            const approved = deptRequests.filter(r => r.status === 'approved').length;
            const pending = deptRequests.filter(r => r.status === 'pending').length;
            const quota = Math.floor(DEPARTMENT_SIZES[dept] * 0.2);

            stats[dept] = {
                total: DEPARTMENT_SIZES[dept],
                currentlyOnLeave: approved,
                pending,
                remainingQuota: quota - approved
            };
        });
        setDepartmentStats(stats);
    };

    const filterRequests = () => {
        let filtered = [...requests];

        if (selectedDepartment !== 'All') {
            filtered = filtered.filter(r => r.department === selectedDepartment);
        }

        if (searchQuery) {
            filtered = filtered.filter(r =>
                r.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.user_id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredRequests(filtered);
    };

    const handleAIAnalyze = async (requestId) => {
        setLoading(true);
        try {
            const analyzeRequest = httpsCallable(functions, 'analyzeLeaveRequest');
            const result = await analyzeRequest({ requestId });

            if (result.data.success) {
                await updateDoc(doc(db, "leave_requests", requestId), {
                    ai_decision: result.data.decision,
                    ai_reason: result.data.reason
                });

                fetchRequests(); // Refresh the list
                Alert.alert('Success', 'AI analysis completed');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to perform AI analysis');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (requestId, newStatus) => {
        setLoading(true);
        try {
            await updateDoc(doc(db, "leave_requests", requestId), {
                status: newStatus,
                updated_at: new Date().toISOString()
            });

            fetchRequests(); // Refresh the list
            Alert.alert('Success', `Request ${newStatus}`);
        } catch (error) {
            Alert.alert('Error', 'Failed to update request status');
        } finally {
            setLoading(false);
        }
    };

    const renderDepartmentStats = () => (
        <DataTable>
            <DataTable.Header>
                <DataTable.Title>Department</DataTable.Title>
                <DataTable.Title numeric>Total</DataTable.Title>
                <DataTable.Title numeric>On Leave</DataTable.Title>
                <DataTable.Title numeric>Pending</DataTable.Title>
                <DataTable.Title numeric>Quota Left</DataTable.Title>
            </DataTable.Header>

            {Object.entries(departmentStats).map(([dept, stats]) => (
                <DataTable.Row key={dept}>
                    <DataTable.Cell>{dept}</DataTable.Cell>
                    <DataTable.Cell numeric>{stats.total}</DataTable.Cell>
                    <DataTable.Cell numeric>{stats.currentlyOnLeave}</DataTable.Cell>
                    <DataTable.Cell numeric>{stats.pending}</DataTable.Cell>
                    <DataTable.Cell numeric>{stats.remainingQuota}</DataTable.Cell>
                </DataTable.Row>
            ))}
        </DataTable>
    );

    const renderRequestCard = (request) => (
        <Card style={styles.card} key={request.id}>
            <Card.Content>
                <Title>Leave Request</Title>
                <Paragraph>Department: {request.department}</Paragraph>
                <Paragraph>Dates: {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}</Paragraph>
                <Paragraph>Days: {request.days_requested}</Paragraph>
                <Paragraph>Explanation: {request.explanation}</Paragraph>

                <View style={styles.chipContainer}>
                    <Chip style={styles.statusChip}>
                        Status: {request.status}
                    </Chip>
                    {request.ai_decision && (
                        <Chip style={styles.aiChip}>
                            AI: {request.ai_decision}
                        </Chip>
                    )}
                </View>

                {request.ai_reason && (
                    <Paragraph style={styles.aiReason}>
                        AI Reasoning: {request.ai_reason}
                    </Paragraph>
                )}
            </Card.Content>

            <Card.Actions>
                {request.status === 'pending' && (
                    <>
                        <Button
                            title="Approve"
                            onPress={() => handleStatusUpdate(request.id, 'approved')}
                            disabled={loading}
                        />
                        <Button
                            title="Reject"
                            onPress={() => handleStatusUpdate(request.id, 'rejected')}
                            disabled={loading}
                        />
                        <Button
                            title="AI Analyze"
                            onPress={() => handleAIAnalyze(request.id)}
                            disabled={loading}
                        />
                    </>
                )}
            </Card.Actions>
        </Card>
    );

    return (
        <ScrollView style={styles.container}>
            <Title style={styles.title}>HR Leave Management Panel</Title>

            <View style={styles.filterContainer}>
                <Searchbar
                    placeholder="Search requests..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />

                <View style={styles.departmentFilter}>
                    <Button
                        title="All"
                        onPress={() => setSelectedDepartment('All')}
                        color={selectedDepartment === 'All' ? '#007AFF' : '#666'}
                    />
                    {Object.keys(DEPARTMENT_SIZES).map(dept => (
                        <Button
                            key={dept}
                            title={dept}
                            onPress={() => setSelectedDepartment(dept)}
                            color={selectedDepartment === dept ? '#007AFF' : '#666'}
                        />
                    ))}
                </View>
            </View>

            {renderDepartmentStats()}

            <View style={styles.requestsContainer}>
                {filteredRequests.map(renderRequestCard)}
            </View>
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
    filterContainer: {
        marginBottom: 20,
    },
    searchBar: {
        marginBottom: 10,
    },
    departmentFilter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20,
    },
    card: {
        marginBottom: 16,
    },
    chipContainer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 10,
    },
    statusChip: {
        backgroundColor: '#e0e0e0',
    },
    aiChip: {
        backgroundColor: '#b3e5fc',
    },
    aiReason: {
        marginTop: 10,
        fontStyle: 'italic',
    },
    requestsContainer: {
        marginTop: 20,
    },
});