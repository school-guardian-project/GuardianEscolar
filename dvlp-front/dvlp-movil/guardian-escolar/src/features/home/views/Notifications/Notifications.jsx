import React, { useState } from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";
import BackButton from "@components/buttons/BackButton";
import styles from "./Notifications.style";

const initialNotifications = [
  {
    id: "route-started",
    icon: "bus-outline",
    type: "boarding",
    saved: false,
    titleKey: "notifications.routeStartedTitle",
    messageKey: "notifications.routeStartedMessage",
  },
  {
    id: "student-boarded",
    icon: "checkmark-circle-outline",
    type: "boarding",
    saved: false,
    titleKey: "notifications.studentBoardedTitle",
    messageKey: "notifications.studentBoardedMessage",
  },
  {
    id: "route-arriving",
    icon: "location-outline",
    type: "delay",
    saved: false,
    titleKey: "notifications.routeArrivingTitle",
    messageKey: "notifications.routeArrivingMessage",
  },
  {
    id: "student-left",
    icon: "exit-outline",
    type: "alighting",
    saved: false,
    titleKey: "notifications.studentLeftTitle",
    messageKey: "notifications.studentLeftMessage",
  },
  {
    id: "route-detour",
    icon: "git-branch-outline",
    type: "detour",
    saved: false,
    titleKey: "notifications.routeDetourTitle",
    messageKey: "notifications.routeDetourMessage",
  },
];

const filterOptions = [
  { key: "all", labelKey: "notifications.filters.all" },
  { key: "boarding", labelKey: "notifications.filters.boarding" },
  { key: "alighting", labelKey: "notifications.filters.alighting" },
  { key: "delay", labelKey: "notifications.filters.delays" },
  { key: "detour", labelKey: "notifications.filters.detours" },
  { key: "saved", labelKey: "notifications.filters.saved" },
];

export default function Notifications() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [filtersVisible, setFiltersVisible] = useState(false);

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

  const renderNotification = ({ item }) => (
    <View
      style={[
        styles.notification,
        { backgroundColor: theme.cardBg, borderColor: theme.borderColor },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.cardSecondaryBg }]}>
        <Ionicons name={item.icon} size={24} color={theme.iconColor} />
      </View>

      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={[styles.notificationTitle, { color: theme.textColor }]}>
            {t(item.titleKey)}
          </Text>
          <Text style={[styles.time, { color: theme.textSecondary }]}>
            {t("notifications.justNow")}
          </Text>
        </View>
        <Text style={[styles.message, { color: theme.textSecondary }]}>
          {t(item.messageKey)}
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