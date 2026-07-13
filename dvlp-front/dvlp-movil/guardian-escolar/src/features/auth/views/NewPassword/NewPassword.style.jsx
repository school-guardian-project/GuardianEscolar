import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    padding: 25,
    marginTop: 20,
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
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 8,
  },

  input: {
    height: 46,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
  },

  buttonWrap: {
    marginTop: 28,
    width: '100%',
  },
});