import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    flexGrow: 1,
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },

  description: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
  },

  form: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
  },

  backButtonWrap: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },

  label: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 8,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 24,
  },

  buttonWrap: {
    marginTop: 16,
    width: "100%",
  },

  info: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 25,
  },
});
