import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@core/services/ThemeService";

export default function ExpandedSection({
  title,
  children,
}) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.borderColor,
        },
      ]}
    >
      <Pressable
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        <Text
          style={[
            styles.title,
            { color: theme.titleColor },
          ]}
        >
          {title}
        </Text>

        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={24}
          color={theme.iconColor}
        />
      </Pressable>

      {expanded && (
        <View
          style={[
            styles.body,
            {
              borderTopColor: theme.borderColor,
            },
          ]}
        >
          <Text
            style={[
              styles.content,
              { color: theme.textSecondary },
            ]}
          >
            {children}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 18,
  },

  content: {
    paddingHorizontal: 18,
    paddingBottom: 18,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
  },

  text: {
    fontSize: 14,
    lineHeight: 22,
  }
});