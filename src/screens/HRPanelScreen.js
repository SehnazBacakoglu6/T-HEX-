import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, ActivityIndicator } from 'react-native-paper';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db, functions } from '../config/firebase';
import { format } from 'date-fns';
import { httpsCallable } from 'firebase/functions';

export default function HRPanelScreen() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'leave_requests'));
            const querySnapshot = await getDocs(q);
            const requestsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRequests(requestsData);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAIAnalysis = async () => {
        setAnalyzing(true);
        try {
            const analyzeLeaveRequests = httpsCallable(functions, 'analyzeLeaveRequests');
            await analyzeLeaveRequests();
            await fetchRequests(); // Yeniden yükle
        } catch (error) {
            console.error('AI Analysis error:', error);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleStatusUpdate = async (requestId, newStatus) => {
        try {
            await updateDoc(doc(db, 'leave_requests', requestId), {
                status: newStatus,
                updated_at: new Date().toISOString()
            });
            await fetchRequests(); // Yeniden yükle
        } catch (error) {
            console.error('Status update error:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Button
                mode="contained"
                onPress={handleAIAnalysis}
                loading={analyzing}
                style={styles.analyzeButton}
            >
                AI Analiz
            </Button>

            {requests.map(request => (
                <Card key={request.id} style={styles.card}>
                    <Card.Content>
                        <Text style={styles.dates}>
                            {format(new Date(request.start_date), 'dd/MM/yyyy')} - {format(new Date(request.end_date), 'dd/MM/yyyy')}
                        </Text>
                        <Text>Açıklama: {request.explanation}</Text>
                        <Text>Durum: {request.status}</Text>
                        {request.ai_decision && (
                            <View style={styles.aiSection}>
                                <Text style={styles.aiTitle}>AI Analizi:</Text>
                                <Text>Karar: {request.ai_decision}</Text>
                                <Text>Gerekçe: {request.ai_reason}</Text>
                            </View>
                        )}
                        <View style={styles.buttonContainer}>
                            <Button
                                mode="outlined"
                                onPress={() => handleStatusUpdate(request.id, 'approved')}
                                style={styles.actionButton}
                            >
                                Onayla
                            </Button>
                            <Button
                                mode="outlined"
                                onPress={() => handleStatusUpdate(request.id, 'rejected')}
                                style={styles.actionButton}
                            >
                                Reddet
                            </Button>
                        </View>
                    </Card.Content>
                </Card>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        marginBottom: 15,
    },
    dates: {
        fontSize: 16,
        fontWeight: 'bold',
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15,
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 5,
    },
    analyzeButton: {
        marginBottom: 20,
    },
}); 