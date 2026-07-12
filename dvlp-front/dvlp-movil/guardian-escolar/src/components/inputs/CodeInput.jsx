import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useTheme } from "@core/services/ThemeService";

export default function CodeInput() {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {[...Array(6)].map((_, index) => (
        <TextInput
          key={index}
          maxLength={1}
          keyboardType="numeric"
          style={[
            styles.input,
            {
              backgroundColor: theme.cardSecondaryBg,
              borderColor: theme.borderColor,
              color: theme.textColor,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },

  input: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
  },
});