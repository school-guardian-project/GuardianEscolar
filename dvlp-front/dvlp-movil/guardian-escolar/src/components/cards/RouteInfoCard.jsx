import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

export default function RouteInfoCard() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.borderColor,
        },
      ]}
    >
      {/* Encabezado */}
      <View style={styles.header}>

        <View>
          <Text
            style={[
              styles.title,
              { color: theme.textColor },
            ]}
          >
            Ruta Centro
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: theme.textSecondary },
            ]}
          >
            Carlos Pérez
          </Text>
        </View>

        <View>
          <Text
            style={[
              styles.titleRight,
              { color: theme.textColor },
            ]}
          >
            ABC-123
          </Text>

          <Text
            style={[
              styles.subtitleRight,
              { color: theme.textSecondary },
            ]}
          >
            06:00 AM - 07:30 AM
          </Text>
        </View>

      </View>

      {/* Línea */}
      <View
        style={[
          styles.divider,
          { backgroundColor: theme.borderColor },
        ]}
      />

      {/* Información inferior */}
      <View style={styles.footer}>

        <View style={styles.column}>
          <Text
            style={[
              styles.label,
              { color: theme.titleColor },
            ]}
          >
            {t("stops")}
          </Text>

          <Text
            style={[
              styles.value,
              { color: theme.textSecondary },
            ]}
          >
            12
          </Text>
        </View>

        <View style={styles.column}>
          <Text
            style={[
              styles.label,
              { color: theme.titleColor },
            ]}
          >
            {t("finalDestination")}
          </Text>

          <Text
            style={[
              styles.value,
              { color: theme.textSecondary },
            ]}
          >
            {t("school")}
          </Text>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 12,
  },

  titleRight: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },

  subtitleRight: {
    fontSize: 12,
    textAlign: "right",
  },

  divider: {
    height: 1,
    marginVertical: 10,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  column: {
    flex: 1,
    alignItems: "center",
  },

  label: {
    fontWeight: "bold",
  },

  value: {
    fontSize: 12,
    marginTop: 4,
  },
});