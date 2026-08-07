import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useTheme } from "@core/services/ThemeService";

export default function InputField({
  label,
  placeholder,
  value = "",
  onChangeText = () => {},
  keyboardType = "default",
  secureTextEntry = false,
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>

      {/* Label */}
      <Text
        style={[
          styles.label,
          { color: theme.textSecondary },
        ]}
      >
        {label}
      </Text>

      {/* Input */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.cardColorInput}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={[
          styles.input,
          {
            backgroundColor: theme.cardSecondaryBg,
            borderColor: theme.borderColor,
            color: theme.textColor,
          },
        ]}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },

  label: {
    fontSize: 13,
    marginBottom: 4,
  },

  input: {
    height: 50,
    width: "100%",
    minWidth: 0,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});
