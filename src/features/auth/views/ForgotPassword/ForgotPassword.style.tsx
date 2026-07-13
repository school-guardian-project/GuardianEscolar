import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 30 ,
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
    marginBottom: 40,
  },

  info: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 25,
  },
});