import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

export default function SearchInput({
  value,
  onChangeText,
}) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.borderColor,
        },
      ]}
    >
      <Text
        style={[
          styles.icon,
          { color: theme.textSecondary },
        ]}
      >
        🔎
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={t("searchRoute")}
        placeholderTextColor={theme.cardColorInput}
        style={[
          styles.input,
          { color: theme.textColor },
        ]}
      />
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
    fontSize: 20,
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
  },
});