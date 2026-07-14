import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  title: {
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 30,
  },

  description: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 35,
  },

  form: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
  },

  backButtonWrap: {
    marginBottom: 15,
  },

  info: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 35,
    marginBottom: 25,
  },

  buttonWrap: {
    marginTop: 16,
    width: "100%",
  },
});
