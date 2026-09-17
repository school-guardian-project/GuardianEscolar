import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";
import { dashboardService } from "@core/api/services";
import { API_CONFIG } from "@core/api/api.config";
import useSession from "@core/hooks/useSession";

export default function RouteInfoCard() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { role, session } = useSession();
  const [route, setRoute] = React.useState(null);

  React.useEffect(() => {
    if (!API_CONFIG.ENABLED) return;
    if (!session?.profile?.id || !role) return;
    
    dashboardService.getRouteForProfile(session.profile, role).then(routeData => {
      if (routeData) setRoute(routeData);
    }).catch(() => {});
  }, [role, session]);

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

        <View style={styles.headerText}>
          <Text
            style={[
              styles.title,
              { color: theme.textColor },
            ]}
          >
            {route?.Name || 'Sin ruta asignada'}
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: theme.textSecondary },
            ]}
          >
            {route?.driverName || 'Sin conductor'}
          </Text>
        </View>

        <View style={styles.headerText}>
          <Text
            style={[
              styles.titleRight,
              { color: theme.textColor },
            ]}
          >
            {route?.Plate || '—'}
          </Text>

          <Text
            style={[
              styles.subtitleRight,
              { color: theme.textSecondary },
            ]}
          >
            {route?.TargetSector || '—'}
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
            {t("cards.stops")}
          </Text>

          <Text
            style={[
              styles.value,
              { color: theme.textSecondary },
            ]}
          >
            {route?.stopsCount ?? '—'}
          </Text>
        </View>

        <View style={styles.column}>
          <Text
            style={[
              styles.label,
              { color: theme.titleColor },
            ]}
          >
            {t("cards.finalDestination")}
          </Text>

          <Text
            style={[
              styles.value,
              { color: theme.textSecondary },
            ]}
          >
            {route?.TargetSector || t("cards.school")}
          </Text>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    alignSelf: "center",
    borderWidth: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderRadius: 12,
    padding: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  headerText: {
    flex: 1,
    minWidth: 0,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    flexShrink: 1,
  },

  subtitle: {
    fontSize: 12,
    flexShrink: 1,
  },

  titleRight: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
    flexShrink: 1,
  },

  subtitleRight: {
    fontSize: 12,
    textAlign: "right",
    flexShrink: 1,
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
