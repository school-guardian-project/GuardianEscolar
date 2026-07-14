import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";
import { Ionicons } from '@expo/vector-icons';

export default function SearchInput({ value, onChangeText }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, {
      backgroundColor: theme.cardBg,
      borderColor: theme.borderColor,
    }]}>

      
      <Ionicons
        name="search"
        size={20}
        color={theme.textSecondary}
        style={styles.icon}/>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={t("searchRoute")}
        placeholderTextColor={theme.cardColorInput}
        style={[styles.input, { color: theme.textColor }]}/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});