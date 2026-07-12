import './src/core/i18n/i18n';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { ThemeProvider } from '@core/services/ThemeService';

import Login from '@features/auth/views/Login';
// import ForgotPassword from '@features/auth/views/ForgotPassword';
// import VerifyCode from '@features/auth/views/VerifyCode';
// import NewPassword from '@features/auth/views/NewPassword';

// Pantallas comentadas temporalmente hasta crearlas
import { View } from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Pantallas placeholder temporales
function MainPage() {
  return <View style={{ flex: 1 }}/>;
}

function Profile() {
  return <View style={{ flex: 1 }}/>;
}

function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="MainPage" 
        component={MainPage}
        options={{ tabBarLabel: 'Rutas', tabBarIcon: () => <Text>🚌</Text> }}/>
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{ tabBarLabel: 'Perfil', tabBarIcon: () => <Text>🧍</Text> }}/>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login}/>
          <Stack.Screen name="HomeTabs" component={HomeTabs}/>
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}