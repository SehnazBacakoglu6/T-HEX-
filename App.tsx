import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import LoginScreen from './src/screens/LoginScreen';
import HRDashboardScreen from './src/screens/HRDashboardScreen';
import AIAnalysisScreen from './src/screens/AIAnalysisScreen';
import LeaveStatsDashboardScreen from './src/screens/LeaveStatsDashboardScreen';
import NewLeaveRequestScreen from './src/screens/NewLeaveRequestScreen';

import { store } from './src/store/store';

const Stack = createNativeStackNavigator<RootStackParamList>();

// RootStackParamList tipini tanımlıyoruz
export type RootStackParamList = {
  Login: undefined;
  HRDashboard: undefined;
  AIAnalysis: undefined;
  LeaveStatsDashboard: undefined;
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: 'Giriş',
            headerShown: false
          }}
        />
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
        <Stack.Screen 
          name="NewLeaveRequest" 
          component={NewLeaveRequestScreen} 
          options={{ title: 'Yeni İzin Talebi' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </ReduxProvider>
  );
};

export default App;