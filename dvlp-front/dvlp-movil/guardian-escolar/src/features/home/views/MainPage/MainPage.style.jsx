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
  busMarker: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A56DB",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  topBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    elevation: 10,
  },
  statusMessage: {
    position: "absolute",
    top: 92,
    zIndex: 3,
    backgroundColor: "#FFFFFFE8",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  statusMessageText: {
    color: "#334155",
    textAlign: "center",
    fontSize: 14,
  },
  scanFeedback: {
    position: "absolute",
    top: 92,
    zIndex: 4,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  scanFeedbackSuccess: {
    backgroundColor: "#DCFCE7E8",
    borderLeftColor: "#16A34A",
  },
  scanFeedbackError: {
    backgroundColor: "#FEE2E2E8",
    borderLeftColor: "#DC2626",
  },
  scanFeedbackText: {
    color: "#1E293B",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
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
  qrButtonContainer: {
    position: "absolute",
    left: 16,
    bottom: 280,
    zIndex: 3,
    elevation: 8,
  },
  incidentButtonContainer: {
    position: "absolute",
    right: 16,
    bottom: 280,
    zIndex: 3,
    elevation: 8,
  },
});
