import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "@core/services/ThemeService";

import SettingsItem from "@components/inputs/SettingsItem";
import BottomTabBar from "@components/layout/BottomTabBar";

import styles from "./Profile.style";

export default function Profile() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.bgColor }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: theme.titleColor }]}>Mi perfil</Text>
        <Text style={styles.subtitle}>Gestioná tu cuenta y preferencias</Text>

        <View style={styles.card}>
          <SettingsItem
            icon={<Ionicons name="person" size={22} color={theme.iconColor} />}
            title="Mis datos"
          />
        </View>

        <View style={styles.card}>
          <SettingsItem
            icon={<FontAwesome5 name="users" size={20} color={theme.iconColor} />}
            title="Mi familia"
          />
        </View>

        <View style={styles.card}>
          <SettingsItem
            icon={<MaterialIcons name="security" size={22} color={theme.iconColor} />}
            title="Seguridad"
          />
        </View>

        <View style={styles.card}>
          <SettingsItem
            icon={<Ionicons name="lock-closed" size={22} color={theme.iconColor} />}
            title="Políticas de privacidad"
          />
        </View>

        <View style={styles.card}>
          <SettingsItem
            icon={<Ionicons name="information-circle" size={22} color={theme.iconColor} />}
            title="Sobre nosotros"
          />
        </View>
      </ScrollView>

      <BottomTabBar />
    </View>
  );
}
