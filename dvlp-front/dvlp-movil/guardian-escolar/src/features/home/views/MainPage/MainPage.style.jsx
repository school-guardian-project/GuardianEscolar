import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  map: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    gap: 8,
  },
  searchWrapper: {
    flex: 1,
    minWidth: 0,
  },
  bottomSection: {
    alignSelf: "stretch",
  },
});
