import React from "react";
import { View, Pressable } from "react-native";
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
    <>
      <Pressable
        onPress={handleBack}
        style={{
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color={theme.textColor}
        />
      </Pressable>

      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: theme.borderColor,
          marginBottom: 20,
        }}
      />
    </>
  );
}