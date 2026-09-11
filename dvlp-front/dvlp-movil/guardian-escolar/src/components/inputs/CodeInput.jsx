import React, { useRef, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useTheme } from "@core/services/ThemeService";

export default function CodeInput() {
  const { theme } = useTheme();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    if (!/^\d?$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Pasar al siguiente input
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    // Si está vacío y presiona borrar, vuelve atrás
    if (
      nativeEvent.key === "Backspace" &&
      code[index] === "" &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputs.current[index] = ref)}
          value={digit}
          maxLength={1}
          keyboardType="number-pad"
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
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
    gap: 6,
    width: "100%",
  },

  input: {
    flex: 1,
    maxWidth: 45,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
  },
});