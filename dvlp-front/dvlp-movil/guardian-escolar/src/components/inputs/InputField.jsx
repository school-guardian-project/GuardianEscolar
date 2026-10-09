import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@core/services/ThemeService";

export default function InputField({
  label,
  placeholder,
  value = "",
  onChangeText = () => {},
  keyboardType = "default",
  secureTextEntry = false,
  error = "",
  editable = true,
  autoCapitalize,
}) {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

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
      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.cardColorInput}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry && !showPassword}
          editable={editable}
          autoCapitalize={autoCapitalize}
          style={[
            styles.input,
            secureTextEntry && styles.inputWithIcon,
            {
              backgroundColor: theme.cardSecondaryBg,
              borderColor: theme.borderColor,
              color: theme.textColor,
            },
          ]}
        />
        {secureTextEntry ? (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword((prev) => !prev)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={22}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

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

  inputWrapper: {
    width: "100%",
    justifyContent: "center",
  },

  inputWithIcon: {
    paddingRight: 44,
  },

  eyeButton: {
    position: "absolute",
    right: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    height: 50,
    width: "100%",
    minWidth: 0,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
  },

  error: {
    color: "#D32F2F",
    marginTop: 4,
  },
});
