import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { RoleSwitcherProvider } from "@core/dev/RoleSwitcherContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { ThemeProvider } from "@core/services/ThemeService";
import { loadLanguage } from "@core/i18n/i18n";

// Iniciar Sesión
import Login from "@features/auth/views/Login/Login";

// Recuperar contraseña
import ForgotPassword from "@features/account/views/Password/ForgotPassword/ForgotPassword/ForgotPassword";
import VerifyCode from "@features/account/views/Password/ForgotPassword/VerifyCode/VerifyCode";
import NewPassword from "@features/account/views/Password/ForgotPassword/NewPassword/NewPassword";

// Cambiar contraseña
import UpdatePassword from "@features/account/views/Password/UpdatePassword/UpdatePassword/UpdatePassword";
import VerifyCodePassword from "@features/account/views/Password/UpdatePassword/VerifyPassword/VerifyCodePassword";
import ChangePasswordForm from "@features/account/views/Password/UpdatePassword/ChangePasswordForm/ChangePasswordForm";

// Página principal
import MainPage from "@features/home/views/MainPage/MainPage";
import Notifications from "@features/home/views/Notifications/Notifications";

// Mi perfil
import Profile from "@features/profile/views/Profile/Profile";

// Mis datos
import Datas from "@features/profile/views/Datas/Datas";

// Cambiar correo electrónico
import UpdateEmail from "@features/account/views/Email/UpdateEmail/UpdateEmail";
import VerifyUpdateEmail from "@features/account/views/Email/VerifyUpdateEmail/VerifyUpdateEmail";
import NewEmail from "@features/account/views/Email/NewEmail/NewEmail";
import VerifyNewEmail from "@features/account/views/Email/VerifyNewEmail/VerifyNewEmail";

// Cambiar teléfono
import UpdatePhone from "@features/account/views/Phone/UpdatePhone/UpdatePhone";
import VerifyUpdatePhone from "@features/account/views/Phone/VerifyUpdatePhone/VerifyUpdatePhone";
import NewPhone from "@features/account/views/Phone/NewPhone/NewPhone";
import VerifyNewPhone from "@features/account/views/Phone/VerifyNewPhone/VerifyNewPhone";

// Mi familia
import Family from "@features/profile/views/Family/Family";

// Seguridad y políticas
import Security from "@features/profile/views/Security/Security";
import PrivacyPolicies from "@features/profile/views/Privacy/PrivacyPolicies";

// Sobre nosotros
import AboutUs from "@features/profile/views/AboutUs/AboutUs";

// Soporte y calificaciones
import Support from "@features/profile/views/AboutUs/Support/Support";
import Rating from "@features/profile/views/AboutUs/Rating/Rating";

// Apariencia e idioma
import Appearance from "@features/profile/views/Appearance/Appearance";
import Language from "@features/profile/views/language/language";

// Cerrar sesión
import Logout from "@features/profile/views/Logout/Logout";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="MainPage"
        component={MainPage}
        options={{
          tabBarLabel: "Rutas",
          tabBarIcon: () => "🚌",
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: () => "🧍",
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [languageLoaded, setLanguageLoaded] = useState(false);

  useEffect(() => {
    const initializeLanguage = async () => {
      await loadLanguage();
      setLanguageLoaded(true);
    };

    initializeLanguage();
  }, []);

  // Esperar a que se cargue el idioma guardado
  if (!languageLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <RoleSwitcherProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Login" component={Login} />

            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />

            <Stack.Screen name="VerifyCode" component={VerifyCode} />

            <Stack.Screen name="NewPassword" component={NewPassword} />

            <Stack.Screen name="MainPage" component={MainPage} />

            <Stack.Screen name="Notifications" component={Notifications} />

            <Stack.Screen name="Profile" component={Profile} />

            <Stack.Screen name="Datas" component={Datas} />

            <Stack.Screen name="UpdateEmail" component={UpdateEmail} />

            <Stack.Screen
              name="VerifyUpdateEmail"
              component={VerifyUpdateEmail}
            />

            <Stack.Screen name="NewEmail" component={NewEmail} />

            <Stack.Screen name="VerifyNewEmail" component={VerifyNewEmail} />

            <Stack.Screen name="UpdatePhone" component={UpdatePhone} />

            <Stack.Screen
              name="VerifyUpdatePhone"
              component={VerifyUpdatePhone}
            />

            <Stack.Screen name="NewPhone" component={NewPhone} />

            <Stack.Screen name="VerifyNewPhone" component={VerifyNewPhone} />

            <Stack.Screen name="UpdatePassword" component={UpdatePassword} />

            <Stack.Screen
              name="VerifyCodePassword"
              component={VerifyCodePassword}
            />

            <Stack.Screen
              name="ChangePasswordForm"
              component={ChangePasswordForm}
            />

            <Stack.Screen name="Family" component={Family} />

            <Stack.Screen name="Security" component={Security} />

            <Stack.Screen name="PrivacyPolicies" component={PrivacyPolicies} />

            <Stack.Screen name="AboutUs" component={AboutUs} />

            <Stack.Screen name="Logout" component={Logout} />

            <Stack.Screen name="Support" component={Support} />

            <Stack.Screen name="Rating" component={Rating} />

            <Stack.Screen name="Appearance" component={Appearance} />

            <Stack.Screen name="Language" component={Language} />

            <Stack.Screen name="HomeTabs" component={HomeTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </RoleSwitcherProvider>
  );
}
