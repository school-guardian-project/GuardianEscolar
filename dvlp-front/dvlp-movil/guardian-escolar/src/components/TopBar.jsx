import SearchInput from "@components/inputs/SearchInput";
import NotificationButton from "@components/buttons/NotificationButton";
import { StyleSheet } from "react-native";

export default function TopBar({ config }) {
  return (
    <View
      style={[styles.topBar, !config.showSearchInput && styles.topBarNoSearch]}
    >
      {config.showSearchInput && (
        <View style={styles.searchWrapper}>
          <SearchInput />
        </View>
      )}
      {config.showNotifications && <NotificationButton />}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  topBarNoSearch: { justifyContent: "flex-end" },

  searchWrapper: {
    flex: 1,
    marginRight: 12,
  },
});
