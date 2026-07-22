import { StyleSheet } from "react-native";

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

  buttonsContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 10,
  marginBottom: 20,
},

button: {
  flex: 1,
},

button: {
  flex: 1,
  marginHorizontal: 8,
},

logoutContainer: {
  flex: 1,
  justifyContent: "rigth",
  alignItems: "center",
  paddingHorizontal: 25,
  marginTop: 40,
},

logoutIcon: {
  width: 110,
  height: 110,
  borderRadius: 55,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 25,
},

logoutTitle: {
  fontSize: 28,
  fontWeight: "700",
  marginBottom: 12,
},

logoutDescription: {
  textAlign: "center",
  fontSize: 16,
  lineHeight: 24,
  marginBottom: 50,

},

cancelButton: {
  width: "100%",
  height: 55,
  borderRadius: 28,
  borderWidth: 1,
  borderColor: "#CFCFCF",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 15,
},

cancelText: {
  fontSize: 17,
  fontWeight: "600",
},

});
