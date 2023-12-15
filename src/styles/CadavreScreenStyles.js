import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  home: {
    backgroundColor: "#101A31",
    padding: 20,
  },
  btn: {
    alignSelf: "center",
    marginTop: 30,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#A4FA82",
    color: "#101A31",
    padding: 10,
    borderRadius: 20,
    width: "70%",
  },
  textLoufok: {
    fontSize: 20,
    fontWeight: "bold",
  },
  loufokLogo: {
    width: 35,
    height: 35,
  },
  playLogo: {
    width: 25,
    height: 25,
  },
  text: {
    fontSize: 18,
    color: "#FEFFFE",
    textAlign: "justify",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: "20%",
    padding: 10,
  },
  logo: {
    resizeMode: "contain",
    width: 200,
    height: 100,
  },
  questionIcon: {
    width: 50,
    height: 50,
  },
  title: {
    marginTop: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 25,
    color: "#FEFFFE",
    marginBottom: 45,
  },
  likeLogo: {
    position: "absolute",
    top: -75,
    right: 20,
  },
  plumeText: {
    letterSpacing: 2,
    marginTop: 30,
    fontStyle: "italic",
    textAlign: "justify",
    color: "#FEFFFE",
    marginBottom: 140,
  },
  contributionText: {
    textAlign: "justify",
    color: "#FEFFFE",
    fontSize: 15,
  },
});
export default styles;
