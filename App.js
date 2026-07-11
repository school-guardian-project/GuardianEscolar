import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Importaciones de pantallas 
import Welcome from './src/features/auth/views/Welcome';
import ForgotPassword from './src/features/auth/views/ForgotPassword';
import VerifyCode from './src/features/auth/views/VerifyCode';
import NewPassword from './src/features/auth/views/NewPassword';
import MainPage from './src/features/home/views/MainPage';
import Profile from './src/features/profile/views/Profile';
import './src/core/i18n/i18n';
import { ThemeProvider } from './src/core/services/ThemeService';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navegación principal con tabs (Home + Profile)
function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="MainPage" 
        component={MainPage}
        options={{ tabBarLabel: 'Rutas', tabBarIcon: () => <Text>🚌</Text> }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{ tabBarLabel: 'Perfil', tabBarIcon: () => <Text>🧍</Text> }}
      />
    </Tab.Navigator>
  );
}

// Navegación principal
export default function App() {
  return (
    <ThemeProvider>
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
        <Stack.Screen name="VerifyCode" component={VerifyCode}/>
        <Stack.Screen name="NewPassword" component={NewPassword}/>
        <Stack.Screen name="HomeTabs" component={HomeTabs}/>
      </Stack.Navigator>
    </NavigationContainer>
    </ThemeProvider>
  );
}