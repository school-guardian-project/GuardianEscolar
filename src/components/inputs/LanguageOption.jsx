import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import { useTheme } from "@core/services/ThemeService";

export default function LanguageOption({
  language,
  description,
  selected,
  onPress,
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: theme.cardBackground,
          borderBottomColor: theme.borderColor,
        },
      ]}
    >
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            { color: theme.textColor },
          ]}
        >
          {language}
        </Text>

        <Text
          style={[
            styles.description,
            { color: theme.textSecondary },
          ]}
        >
          {description}
        </Text>
      </View>

      <View
        style={[
          styles.radio,
          {
            borderColor: selected
              ? theme.primaryColor
              : theme.borderColor,
          },
        ]}
      >
        {selected && (
          <View
            style={[
              styles.radioSelected,
              {
                backgroundColor: theme.primaryColor,
              },
            ]}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 10,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomWidth: 1,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 14,
    fontWeight: "500",
  },

  description: {
    fontSize: 13,
    marginTop: 2,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,

    borderWidth: 2,

    alignItems: "center",
    justifyContent: "center",
  },

  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});