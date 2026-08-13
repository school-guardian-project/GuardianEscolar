import React from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useTheme } from "@core/services/ThemeService";

export default function BackButton({
  label,
  backTo,
}) {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const handleBack = () => {
    if (backTo) {
      navigation.navigate(backTo);
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.button}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.textColor}
          />
        </Pressable>

        {label && (
          <Text
            style={[
              styles.title,
              { color: theme.titleColor },
            ]}
          >
            {label}
          </Text>
        )}
      </View>

      <View
        style={[
          styles.divider,
          { backgroundColor: theme.borderColor },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  button: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 10,
  },

  divider: {
    height: 1,
    width: "100%",
    marginBottom: 20,
  },
});