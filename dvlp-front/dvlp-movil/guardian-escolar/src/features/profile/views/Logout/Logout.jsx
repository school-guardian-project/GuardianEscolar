import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";
import { useNavigation } from "@react-navigation/native";
import BackButton from "@components/buttons/BackButton";
import PrimaryButton from "@components/buttons/PrimaryButton";

import styles from "@core/styles/profileScreen.style";


export default function Logout() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.bgColor},
      ]}
    >
      {/* Encabezado */}
      <View style={styles.header}>
        <BackButton label={t("inputs.logout")} />
      </View>

      {/* Contenido */}
      <View style={styles.logoutContainer     
      }>
        {/* Icono */}
        <View
          style={[
            styles.logoutIcon,
            { backgroundColor: "#ffd7d7d1"},
          ]}
        >
          <Ionicons
            name="log-out-outline"
            size={50}
            color="#DC2626"
          />
        </View>

        {/* Título */}
        <Text
          style={[
            styles.logoutTitle,
            { color: theme.textColor },
          ]}
        >
          {t("logout.title")}
        </Text>

        {/* Descripción */}
        <Text
          style={[
            styles.logoutDescription,
            { color: theme.textSecondary },
          ]}
        >
          {t("logout.description")}
        </Text>

        {/* Botón cerrar sesión */}
        <PrimaryButton
          text={t("inputs.logout")}
          onPress={() => navigation.navigate("Login")}
        />

        {/* Botón cancelar */}
        <View style={styles.cancelButton}>
          <Text
            style={[
              styles.cancelText,
              { color: theme.textColor },
            ]}
            onPress={() => navigation.navigate("Profile")}
          >
            {t("button.cancel")}
            
          </Text>
          
        </View>
      </View>
    </View>
  );
}