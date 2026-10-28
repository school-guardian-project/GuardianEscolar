import React, { useState, useCallback } from "react";
import { ActivityIndicator, FlatList, Modal, Pressable, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";
import BackButton from "@components/buttons/BackButton";
import { getSession } from "@core/services/authService";
import { getGuardianNotifications } from "@core/services/notificationApi";
import { incidentTypeLabelKey } from "@core/config/incidents";
import styles from "./Notifications.style";

const filterOptions = [
  { key: "all", labelKey: "notifications.filters.all" },
  { key: "boarding", labelKey: "notifications.filters.boarding" },
  { key: "alighting", labelKey: "notifications.filters.alighting" },
  { key: "incident", labelKey: "notifications.filters.incident" },
  { key: "delay", labelKey: "notifications.filters.delays" },
  { key: "detour", labelKey: "notifications.filters.detours" },
  { key: "saved", labelKey: "notifications.filters.saved" },
];

export default function Notifications() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  // Cambiarlo dispara la recarga: así el botón de reintentar tiene efecto.
  const [reloadKey, setReloadKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadNotifications() {
        setLoading(true);
        try {
          const session = await getSession();
          if (!session?.profileId) {
            setNotifications([]);
            return;
          }

          const data = await getGuardianNotifications();
          if (!active) return;
          setLoadError(false);

          setNotifications(data.map((item) => {
            const incidentLabelKey = incidentTypeLabelKey(item.alert?.alertTypeId);

            // Una alerta de incidente (FR-8.2) no trae boardingType: el
            // catalogo AlertType (21..24) es lo unico que la distingue en el
            // listado del acudiente, asi que ahi va su tipo como titulo.
            if (incidentLabelKey) {
              return {
                id: item.id,
                type: "incident",
                icon: "alert-circle",
                titleKey: incidentLabelKey,
                messageKey: item.alert?.description ?? null,
                dateTime: item.alert?.dateTime || item.dateTimeRead,
              };
            }

            return {
              id: item.id,
              type: item.boardingType === "OFF_BOARD" ? "alighting" : "boarding",
              icon: item.boardingType === "OFF_BOARD" ? "home" : "bus",
              titleKey: item.alert?.description || "Notificación",
              messageKey: item.alert?.description || "",
              dateTime: item.alert?.dateTime || item.dateTimeRead,
            };
          }));
        } catch (error) {
          console.error("Error loading notifications:", error);
          // Un fallo de red o un 4xx/5xx NO es "sin notificaciones": se marca
          // como error para que la UI ofrezca reintentar en vez de mentir.
          if (active) setLoadError(true);
        } finally {
          if (active) setLoading(false);
        }
      }

      loadNotifications();

      return () => {
        active = false;
      };
    }, [reloadKey]),
  );

  const toggleSaved = (notificationId) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, saved: !notification.saved }
          : notification,
      ),
    );
  };

  const filteredNotifications = notifications.filter((notification) =>
    selectedFilter === "all"
      ? true
      : selectedFilter === "saved"
        ? notification.saved
        : notification.type === selectedFilter,
  );

  const renderNotification = ({ item }) => {
    const isIncident = item.type === "incident";

    return (
      <View
        style={[
          styles.notification,
          { backgroundColor: theme.cardBg, borderColor: theme.borderColor },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: isIncident ? theme.alertBg : theme.cardSecondaryBg },
          ]}
        >
          <Ionicons
            name={item.icon}
            size={24}
            color={isIncident ? theme.alertIcon : theme.iconColor}
          />
        </View>

        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text
              style={[
                styles.notificationTitle,
                { color: isIncident ? theme.alertIcon : theme.textColor },
              ]}
            >
              {isIncident ? t(item.titleKey) : item.titleKey}
            </Text>
            <Text style={[styles.time, { color: theme.textSecondary }]}>
              {new Date(item.dateTime).toLocaleTimeString()}
            </Text>
          </View>
          <Text style={[styles.message, { color: theme.textSecondary }]}>
            {item.messageKey ?? t("notifications.incidentNoDescription")}
          </Text>
        </View>

        <Pressable
          onPress={() => toggleSaved(item.id)}
          style={styles.saveButton}
          hitSlop={8}
          accessibilityLabel={t(
            item.saved
              ? "notifications.removeSaved"
              : "notifications.saveNotification",
          )}
        >
          <Ionicons
            name={item.saved ? "star" : "star-outline"}
            size={22}
            color={item.saved ? "#F2B705" : theme.textSecondary}
          />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bgColor }]}>
      <View style={styles.header}>
        <BackButton label={t("notifications.title")} backTo="MainPage" />
      </View>

      <View style={styles.filterRow}>
        <Pressable
          onPress={() => setFiltersVisible(true)}
          style={[
            styles.filterButton,
            { borderColor: theme.borderColor, backgroundColor: theme.cardBg },
          ]}
        >
          <Ionicons name="filter-outline" size={18} color={theme.iconColor} />
          <Text style={[styles.filterButtonText, { color: theme.textColor }]}>
            {t("notifications.filters.button")}
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color={theme.accentColor} />
            </View>
          ) : loadError ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="cloud-offline-outline"
                size={48}
                color={theme.textSecondary}
              />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                {t("serviceErrors.requestFailed")}
              </Text>
              <Pressable
                onPress={() => setReloadKey((key) => key + 1)}
                style={[
                  styles.filterButton,
                  { borderColor: theme.borderColor, backgroundColor: theme.cardBg },
                ]}
                accessibilityLabel={t("button.retry")}
              >
                <Ionicons name="refresh-outline" size={18} color={theme.iconColor} />
                <Text style={[styles.filterButtonText, { color: theme.textColor }]}>
                  {t("button.retry")}
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="notifications-off-outline"
                size={48}
                color={theme.textSecondary}
              />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                {selectedFilter === "saved"
                  ? t("notifications.emptySaved")
                  : t("notifications.empty")}
              </Text>
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={filtersVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFiltersVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[styles.filterModal, { backgroundColor: theme.cardBg }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textColor }]}>
                {t("notifications.filters.title")}
              </Text>
              <Pressable
                onPress={() => setFiltersVisible(false)}
                hitSlop={8}
              >
                <Ionicons name="close" size={24} color={theme.textColor} />
              </Pressable>
            </View>

            {filterOptions.map((filter) => {
              const isSelected = selectedFilter === filter.key;

              return (
                <Pressable
                  key={filter.key}
                  onPress={() => {
                    setSelectedFilter(filter.key);
                    setFiltersVisible(false);
                  }}
                  style={[
                    styles.filterOption,
                    {
                      borderColor: isSelected
                        ? theme.accentColor
                        : theme.borderColor,
                    },
                  ]}
                >
                  <Text
                    style={[styles.filterOptionText, { color: theme.textColor }]}
                  >
                    {t(filter.labelKey)}
                  </Text>
                  <Ionicons
                    name={isSelected ? "radio-button-on" : "radio-button-off"}
                    size={22}
                    color={isSelected ? theme.accentColor : theme.textSecondary}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}