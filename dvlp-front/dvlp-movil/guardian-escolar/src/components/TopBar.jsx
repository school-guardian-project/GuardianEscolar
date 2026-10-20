import NotificationButton from "@components/buttons/NotificationButton";
import { StyleSheet, View } from "react-native";

export default function TopBar({ config, onNotificationPress }) {
  return (
    <View style={styles.topBar}>
      {config.showNotifications && (
        <NotificationButton onPress={onNotificationPress} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
