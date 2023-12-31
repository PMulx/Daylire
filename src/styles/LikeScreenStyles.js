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
    resizeMode: "contain",
  },
  playLogo: {
    width: 25,
    height: 25,
    resizeMode: "contain",
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
    resizeMode: "contain",
  },
  questionIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
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

    borderRadius: 5, // Bordure arrondie
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonImage: {
    flex: 1,
    width: 25,
    height: 25,
    resizeMode: "contain", // Ajuste l'image au conteneur sans déformation
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
  cadavreContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 15,
  },
  cadavreContainerLeft: {
    flexDirection: "column",
    gap: 8,
  },
  cadavreContainerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginRight: 10,
  },
  apiInfoTitle: {
    color: "#101A31",
    fontSize: 22,
    fontWeight: "bold",
  },
  apiInfoPeriode: {
    color: "#101A31",
    fontSize: 16,
  },
  apiInfoParticipants: {
    color: "#101A31",
    fontSize: 15,
    fontWeight: "300",
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  participantsText: {
    fontStyle: "italic",
    fontSize: 14,
  },
  apiText: {
    color: "#101A31",
    fontSize: 30,
    fontWeight: "bold",
  },
  btnApi: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  likeLogo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
});

export default styles;
