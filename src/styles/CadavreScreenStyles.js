import { StyleSheet } from "react-native";

const primaryColor = "#101A31";
const secondaryColor = "#A4FA82";
const textColor = "#FEFFFE";

const styles = StyleSheet.create({
  // Global styles
  home: {
    backgroundColor: primaryColor,
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: textColor,
    textAlign: "justify",
  },

  // Header styles
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
    resizeMode: "contain",
  },

  // Title styles
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 25,
    color: textColor,
    alignSelf: "center",
  },

  // Top Bar styles
  topBar: {
    margin: 15,
    marginBottom: 45,
    position: "relative",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 30,
  },

  // Contribution styles
  contributionText: {
    textAlign: "justify",
    color: textColor,
    fontSize: 15,
  },

  // Plume text styles
  plumeText: {
    letterSpacing: 2,
    marginTop: 30,
    fontStyle: "italic",
    textAlign: "justify",
    color: textColor,
    marginBottom: 140,
  },

  // Like section styles
  likeSection: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  likeLogo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
});

export default styles;
