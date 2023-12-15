import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Text,
  Button,
} from "react-native";
import { SearchBar } from "react-native-elements";
import styles from "./../styles/LikeScreenStyles";

const LikeScreen = () => {
  const [apiData, setApiData] = useState(null);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState("alphabetical");

  const fetchDataFromApi = async () => {
    try {
      const response = await fetch(
        "https://loufok.alwaysdata.net/api/cadavres"
      );
      const data = await response.json();
      setApiData(data);
      console.log(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de l'API",
        error
      );
    }
  };

  useEffect(() => {
    fetchDataFromApi();
  }, []);

  const updateSearch = (text) => {
    setSearch(text);
    // Vous pouvez également effectuer d'autres opérations ici, si nécessaire
  };
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  // const likeCadavre = (cadavreId) => {
  //   // Logique pour liker le cadavre avec l'ID cadavreId
  //   console.log(`Liked Cadavre with ID: ${cadavreId}`);
  // };
  // const readCadavre = (cadavreId) => {
  //   // Logique pour lire le cadavre avec l'ID cadavreId
  //   console.log(`Read Cadavre with ID: ${cadavreId}`);
  // };
  const handleSortChange = (itemValue) => {
    setSelectedSort(itemValue);
    // Ajoutez ici la logique pour trier votre contenu en fonction de la valeur sélectionnée
  };

  // const renderCadavres = () => {
  //   if (!apiData || apiData.length === 0) {
  //     return <Text>Aucun cadavre trouvé.</Text>;
  //   }

  //   return apiData.map((cadavre) => (
  //     <View key={cadavre.id} style={styles.cadavreContainer}>
  //       <Text style={styles.cadavreName}>{cadavre.name}</Text>
  //       <Text style={styles.cadavreDate}>
  //         Début: {cadavre.startDate} - Fin: {cadavre.endDate}
  //       </Text>
  //       <TouchableOpacity
  //         style={styles.cadavreButton}
  //         onPress={() => likeCadavre(cadavre.id)}
  //       >
  //         <Text style={styles.cadavreButtonText}>Like</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity
  //         style={styles.cadavreButton}
  //         onPress={() => readCadavre(cadavre.id)}
  //       >
  //         <Text style={styles.cadavreButtonText}>Read</Text>
  //       </TouchableOpacity>
  //     </View>
  //   ));
  // };

  return (
    <ScrollView style={styles.home}>
      <View style={styles.header}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
        <TouchableOpacity onPress={() => alert("Icône de question cliquée")}>
          <Image
            source={require("../../assets/question.png")}
            style={styles.questionIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.filter}>
        <SearchBar
          placeholder="Rechercher le nom"
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
          inputStyle={styles.searchInput}
          placeholderTextColor="rgba(166, 173, 190, 1)" // Couleur du texte d'espace réservé
          clearIcon={{ color: "rgba(166, 173, 190, 1)" }} // Couleur de l'icône de suppression
          searchIcon={{ color: "rgba(166, 173, 190, 1)" }} // Couleur de l'icône de recherche
          onChangeText={updateSearch}
          value={search}
        />
        <TouchableOpacity style={styles.buttonStyle} onPress={openModal}>
          <Image
            width={30} // Ajustez la largeur de l'image selon vos besoins
            height={30} // Ajustez la hauteur de l'image selon vos besoins
            source={require("./../../assets/filter.png")}
            style={styles.buttonImage}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.cadavreContainer}>
        <View style={styles.cadavreContainerLeft}>
          <Text style={styles.cadavreName}>TEST </Text>
          <Text style={styles.cadavreDate}>7/12/2023 - 14/12/2023</Text>
        </View>

        <View style={styles.cadavreContainerRight}>
          <TouchableOpacity
            style={styles.cadavreButton}
            // onPress={() => likeCadavre(cadavre.id)}
          >
            <Text style={styles.cadavreButtonText}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cadavreButton}
            // onPress={() => readCadavre(cadavre.id)}
          >
            <Text style={styles.cadavreButtonText}>Lire</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Trier par :</Text>

            <Picker
              selectedValue={selectedSort}
              onValueChange={(itemValue) => handleSortChange(itemValue)}
              style={{ color: "black" }}
            >
              <Picker.Item label="Alphabétique A-Z" value="alphabetical" />
              <Picker.Item label="Alphabétique Z-A" value="Zalphabetical" />
              <Picker.Item label="Date" value="date" />
            </Picker>

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={closeModal}
            >
              <Text style={styles.closeModalButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
          <View></View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default LikeScreen;
