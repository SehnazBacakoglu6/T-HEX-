import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HRDashboardScreen from './src/screens/HRDashboardScreen'; // Doğru yol olduğundan emin olun
import AIAnalysisScreen from './src/screens/AIAnalysisScreen'; // Bu ekranı oluşturmanız gerekecek
import LeaveStatsDashboardScreen from './src/screens/LeaveStatsDashboardScreen'; // Bu ekranı oluşturmanız gerekecek

const Stack = createNativeStackNavigator<RootStackParamList>();

// RootStackParamList tipini tanımlıyoruz
export type RootStackParamList = {
  HRDashboard: undefined;
  AIAnalysis: undefined;
  LeaveStatsDashboard: undefined;
  // Diğer ekranları da ekleyin
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HRDashboard">
        <Stack.Screen 
          name="HRDashboard" 
          component={HRDashboardScreen} 
          options={{ title: 'İzin Talepleri' }} 
        />
        <Stack.Screen 
          name="AIAnalysis" 
          component={AIAnalysisScreen} 
          options={{ title: 'AI Analiz' }} 
        />
        <Stack.Screen 
          name="LeaveStatsDashboard" 
          component={LeaveStatsDashboardScreen} 
          options={{ title: 'İzin İstatistikleri' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;