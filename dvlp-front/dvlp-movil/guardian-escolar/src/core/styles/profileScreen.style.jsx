import { StyleSheet } from "react-native";

// Shared layout for profile detail screens that include BackButton + BottomTabBar.
export default StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    width: "100%",
    marginTop: 30,
  },

  content: {
    flexGrow: 1,
    marginTop: 10,
    paddingHorizontal: "4%",
    paddingBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 6,
    marginBottom: 12,
  },
});
