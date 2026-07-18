import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@core/services/ThemeService";

export default function InfoRow({
  icon,
  title,
  value,
  subtitle,
  editable = false,
  arrow = false,
  hidden = false,
  onPress,
  last = false,
}) {
  const { theme } = useTheme();

  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          styles.row,
          !last && {
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
          },
        ]}
      >
        {/* Icono izquierda */}
        <Ionicons
          name={icon}
          size={22}
          color={theme.iconColor}
        />

        {/* Información */}
        <View style={styles.info}>
          <Text
            style={[
              styles.title,
              { color: theme.textSecondary },
            ]}
          >
            {title}
          </Text>

          <Text
            style={[
              styles.value,
              { color: theme.textColor },
            ]}
          >
            {value}
          </Text>

          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                { color: theme.textSecondary },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {/* Icono derecha */}
        {editable && (
          <Ionicons
            name="create-outline"
            size={20}
            color={theme.iconColor}
          />
        )}

        

        
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
  },

  info: {
    flex: 1,
    marginLeft: 15,
  },

  title: {
    fontSize: 13,
  },

  value: {
    fontSize: 17,
    fontWeight: "600",
    marginTop: 2,
  },

  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
