import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import LeaveRequestScreen from '../screens/LeaveRequestScreen';
import HRPanelScreen from '../screens/HRPanelScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="LeaveRequest"
                    component={LeaveRequestScreen}
                    options={{ title: 'İzin Talebi' }}
                />
                <Stack.Screen
                    name="HRPanel"
                    component={HRPanelScreen}
                    options={{ title: 'İK Paneli' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
} 