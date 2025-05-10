// Doğru store import'u (store dosyası ana dizinde olduğu için)
import { RootState } from '../../store';

// Ekranlar src/screens/ içinde olduğu için:
import LoginScreen from '../screens/LoginScreen';
import NewLeaveRequestScreen from '../screens/NewLeaveRequestScreen';
import LeaveHistoryScreen from '../screens/LeaveStatsDashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HRDashboardScreen from '../screens/HRDashboardScreen';
import LeaveStatsDashboardScreen from '../screens/LeaveStatsDashboardScreen';
import AIAnalysisScreen from '../screens/AIAnalysisScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Çalışan Tab Navigator
const EmployeeTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'EmployeeDashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'NewLeaveRequest':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'LeaveHistory':
              iconName = focused ? 'time' : 'time-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'alert-circle';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0056b3',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="EmployeeDashboard" 
        component={EmployeeDashboardScreen} 
        options={{ title: 'Ana Sayfa' }}
      />
      <Tab.Screen 
        name="NewLeaveRequest" 
        component={NewLeaveRequestScreen} 
        options={{ title: 'İzin Talebi' }}
      />
      <Tab.Screen 
        name="LeaveHistory" 
        component={LeaveHistoryScreen} 
        options={{ title: 'İzin Geçmişi' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

// İK Tab Navigator
const HRTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'HRDashboard':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'LeaveStatsDashboard':
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              break;
            case 'AIAnalysis':
              iconName = focused ? 'analytics' : 'analytics-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'alert-circle';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0056b3',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="HRDashboard" 
        component={HRDashboardScreen} 
        options={{ title: 'İzin Talepleri' }}
      />
      <Tab.Screen 
        name="LeaveStatsDashboard" 
        component={LeaveStatsDashboardScreen} 
        options={{ title: 'İstatistikler' }}
      />
      <Tab.Screen 
        name="AIAnalysis" 
        component={AIAnalysisScreen} 
        options={{ title: 'AI Analiz' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

// Ana Navigator
const AppNavigator = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const isHR = user?.departman === 'İK';

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : isHR ? (
          <Stack.Screen name="HRTabs" component={HRTabNavigator} />
        ) : (
          <Stack.Screen name="EmployeeTabs" component={EmployeeTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;