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
  routeStatus: { position: "absolute", top: 92, left: 16, right: 16, zIndex: 4, backgroundColor: "#FFFFFFE8", padding: 10, borderRadius: 8 },
  routeStatusText: { color: "#334155", textAlign: "center" },
  studentSelector: { position: "absolute", top: 132, left: 16, right: 16, zIndex: 4, gap: 6 },
  studentButton: { backgroundColor: "#FFFFFFE8", padding: 8, borderRadius: 6 },
  studentButtonActive: { borderWidth: 2, borderColor: "#1A56DB" },

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

  qrButtonContainer: {
    position: 'absolute',
    left: 16,
    bottom: 200,
    zIndex: 3,
    elevation: 8,
  },

  scanModeContainer: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    zIndex: 10,
    elevation: 10,
  },

  scanModeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ccc',
  },

  scanModeActive: {
    borderColor: '#00E676',
    backgroundColor: '#E8F5E9',
  },

  scanModeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
