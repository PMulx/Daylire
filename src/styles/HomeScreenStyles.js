import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  home: {
    backgroundColor: "#101A31",
    padding: 30,
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
    gap: 10,
    borderRadius: 20,
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
    marginLeft: "15%",
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
  paragraph: {
    marginTop: 20,
  },
  apiDiv: {
    padding: 20,
    marginTop: 20,
    marginBottom: 150,
  },
  apiTitle: {
    color: "#FEFFFE",
    marginBottom: 20,
    textAlign: "center",
    fontSize: 20,
  },
  apiText: {
    color: "#101A31",
    fontSize: 20,
  },
  btnApi: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    padding: 13,
    borderRadius: 20,
    backgroundColor: "#FEFFFE",
    marginBottom: 13,
    marginTop: 13,
  },
});

export default styles;
