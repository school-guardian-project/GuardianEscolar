import { StyleSheet } from "react-native";

// Base layout shared by profile detail screens: Datas, Family, and Security.
export default StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    width: "100%",
    marginTop: 35,
  },

  content: {
    flexGrow: 1,
    marginTop: 10,
    paddingHorizontal: "4%",
    paddingBottom: 32,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 6,
    marginBottom: 12,
  },

  sectionHeader: {
    alignItems: "flex-start",
  },

  sectionHeaderFirst: {
    marginTop: -17,
  },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",

    justifyContent: "space-between",
  },

  switchControl: {
    marginTop: 20,
    marginRight: 20,
  },
});
