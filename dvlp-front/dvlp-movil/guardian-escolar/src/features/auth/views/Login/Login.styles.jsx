import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  form: {
    width: '100%',
    
  },
  icon: {
    fontSize: 70,
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  forgotPassword: {
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'left',
  },
  buttonWrap: {
    width: '100%',
    marginTop: 15,
  },

    error: {
    color: "#D32F2F",
    marginBottom: 10,
  },
  legalRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
  },
  legalLink: {
    fontSize: 13,
    textDecorationLine: "underline",
  },
  legalSeparator: {
    fontSize: 13,
    color: "#888",
  },
  acceptRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  acceptText: {
    flex: 1,
    fontSize: 13,
    color: "#444",
  },
});