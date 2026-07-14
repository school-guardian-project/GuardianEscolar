import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useTheme } from "@core/services/ThemeService";

export default function BackButton() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={handleBack} style={styles.button}>
        <Ionicons name="arrow-back" size={24} color={theme.textColor} />
      </Pressable>
      <View style={[styles.divider, { backgroundColor: theme.borderColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  divider: {
    height: 1,
    width: "100%",
    marginBottom: 20,
  },
});