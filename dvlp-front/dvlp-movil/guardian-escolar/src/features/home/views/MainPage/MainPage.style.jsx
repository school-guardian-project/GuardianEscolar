import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "relative",
  },
  map: {
    flex: 1,
    zIndex: 0,
  },

  topBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    elevation: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    zIndex: 1,
    elevation: 5,
  },

  spacer: {
    flex: 1,
  },
  
  bottomSection: {
    alignSelf: "stretch",
  },
});
