import React, { useRef, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useTheme } from "@core/services/ThemeService";

export default function CodeInput({ value = "", onChangeText = () => {}, length = 6 }) {
  const { theme } = useTheme();
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);

  const handleChange = (text) => {
    onChangeText(text.replace(/\D/g, "").slice(0, length));
  };

  const activeIndex = Math.min(value.length, length - 1);

  return (
    <Pressable style={styles.container} onPress={() => inputRef.current?.focus()}>
      <View style={styles.row} pointerEvents="none">
      {Array.from({ length }, (_, index) => (
        <View
          key={index}
          style={[
            styles.box,
            {
              backgroundColor: theme.cardSecondaryBg,
              borderColor: focused && index === activeIndex ? theme.buttonApply : theme.borderColor,
            },
          ]}
        >
          <Text style={[styles.digit, { color: theme.textColor }]}>{value[index] ?? ""}</Text>
        </View>
      ))}
      </View>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        maxLength={length}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        caretHidden
        contextMenuHidden={false}
        style={styles.hiddenInput}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  box: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    maxWidth: 45,
    height: 50,
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  digit: {
    fontSize: 20,
    textAlign: "center",
    includeFontPadding: false,
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.02,
    color: "transparent",
    textAlign: "center",
  },
});