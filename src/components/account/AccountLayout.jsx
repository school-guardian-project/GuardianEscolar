import React from "react";
import { View, ScrollView } from "react-native";

import BackButton from "@components/buttons/BackButton";
import AccountHeader from "./AccountHeader";

import { useTheme } from "@core/services/ThemeService";
import styles from "@core/styles/accountScreen.style";

export default function AccountLayout({
  backLabel,
  title,
  description,
  children,
  footer,
}) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.bgColor },
      ]}
    >
      <View style={styles.header}>
        <BackButton label={backLabel} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AccountHeader
          title={title}
          description={description}
        />

        {children}

        {footer}
      </ScrollView>
    </View>
  );
}