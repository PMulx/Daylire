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
  searchContainer: {
    backgroundColor: "rgba(166, 173, 190, 0)", // Couleur de fond
    borderBottomColor: "transparent", // Couleur de la bordure inférieure
    borderTopColor: "transparent", // Couleur de la bordure supérieure
    width: 280,
  },
  searchInputContainer: {
    backgroundColor: "#EEEFF2", // Couleur de fond de la zone de saisie
    borderRadius: 10,
  },
  searchInput: {
    color: "#333", // Couleur du texte saisi
  },
  buttonStyle: {
    backgroundColor: "#EEEFF2", // Couleur de fond du bouton
    padding: 10, // Espacement interne du bouton
    borderRadius: 5, // Bordure arrondie
    width: 50,
    height: 50,
  },
  filter: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fond semi-transparent
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 300, // Ajustez la largeur selon vos besoins
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  closeModalButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "flex-end",
  },
  closeModalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  itemFilter: {
    color: "black",
  },
});

export default styles;
