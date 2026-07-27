import './src/core/i18n/i18n';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { ThemeProvider } from '@core/services/ThemeService';

import Login from '@features/auth/views/Login/Login';
import ForgotPassword from '@features/auth/views/ForgotPassword/ForgotPassword';
import VerifyCode from '@features/auth/views/VerifyCode/VerifyCode';
import NewPassword from '@features/auth/views/NewPassword/NewPassword';
import MainPage from "@features/home/views/MainPage/MainPage";
import Profile from "@features/profile/views/Profile/Profile";
import Datas from "@features/profile/views/Datas/Datas";
import Family from "@features/profile/views/Family/Family";
import Security from "@features/profile/views/Security/Security";
import PrivacyPolicies from '@features/profile/views/Privacy/PrivacyPolicies';
import AboutUs from '@features/profile/views/AboutUs/AboutUs'
import Logout from '@features/profile/views/Logout/Logout';
import Support from "@features/profile/views/AboutUs/Support/Support";
import Rating from "@features/profile/views/AboutUs/Rating/Rating";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Pantallas placeholder temporales
/*
function MainPage() {
  return <View style={{ flex: 1 }}/>;
}
  */
/*
function Profile() {
  return <View style={{ flex: 1 }}/>;
}

*/
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
          <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
          <Stack.Screen name="VerifyCode" component={VerifyCode}/>
          <Stack.Screen name="NewPassword" component={NewPassword}/>
          <Stack.Screen name="MainPage" component={MainPage}/>  
          <Stack.Screen name="Profile" component={Profile}/>
          <Stack.Screen name="Datas" component={Datas}/>
          <Stack.Screen name="Family" component={Family}/>
          <Stack.Screen name="Security" component={Security}/>
          <Stack.Screen name="PrivacyPolicies" component={PrivacyPolicies}/>
          <Stack.Screen name="AboutUs" component={AboutUs}/>
          <Stack.Screen name="Logout"  component={Logout}/>
          <Stack.Screen name="Support" component={Support}/>
          <Stack.Screen name="Rating" component={Rating}/>
          <Stack.Screen name="HomeTabs" component={HomeTabs}/>
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}