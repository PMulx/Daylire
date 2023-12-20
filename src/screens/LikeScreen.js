import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Text,
} from "react-native";
import styles from "./../styles/LikeScreenStyles";
import { SearchBar } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

const LikeScreen = () => {
  const navigation = useNavigation();
  const [cadavres, setCadavres] = useState([]);
  const [likedCadavresArray, setLikedCadavresArray] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState("alphabetical");
  const [filteredCadavres, setFilteredCadavres] = useState(null);
  const [sortedCadavres, setSortedCadavres] = useState(null);
  const [search, setSearch] = useState("");

  const getValueFromAsyncStorage = async () => {
    try {
      const value = await AsyncStorage.getItem("likedCadavres");

      if (value !== null) {
        const parsedValue = JSON.parse(value);
        setLikedCadavresArray(parsedValue);
        processLikedCadavres(parsedValue);
      } else {
        console.log("Aucune valeur trouvée pour cette clé.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la valeur:", error);
    }
  };

  const processLikedCadavres = async (likedCadavresArray) => {
    try {
      const response = await fetch(
        `https://loufok.alwaysdata.net/api/cadavres`
      );
      const data = await response.json();

      // Assurez-vous que la propriété "cadavres" existe dans la réponse
      if (data && data.cadavres) {
        const matchedCadavres = data.cadavres.filter((cadavre) =>
          likedCadavresArray.includes(cadavre.id_cadavre)
        );

        setCadavres(matchedCadavres);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données des cadavres:",
        error
      );
    }
  };

  const updateSearch = (text) => {
    setSearch(text);

    if (text.trim() === "") {
      setFilteredCadavres(cadavres);
    } else {
      const filtered = cadavres.filter((cadavre) =>
        cadavre.titre_cadavre.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCadavres(filtered);
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", options);
  };

  const handleSortChange = (itemValue) => {
    setSelectedSort(itemValue);

    let sortedData;

    if (itemValue === "alphabetical") {
      // Tri alphabétique en fonction du titre du cadavre
      sortedData = cadavres.sort((a, b) =>
        a.titre_cadavre.localeCompare(b.titre_cadavre)
      );
    } else if (itemValue === "date") {
      // Tri par la date de fin du cadavre
      sortedData = cadavres.sort(
        (a, b) => new Date(a.date_fin_cadavre) - new Date(b.date_fin_cadavre)
      );
    }

    setSortedCadavres(sortedData);
  };

  const removeLikedCadavre = async (id_cadavre) => {
    try {
      // Récupérez les IDs actuels du local storage
      const currentLikedCadavres = await AsyncStorage.getItem("likedCadavres");
      if (currentLikedCadavres !== null) {
        const parsedCurrentLikedCadavres = JSON.parse(currentLikedCadavres);
        // Retirez l'ID du tableau
        const updatedLikedCadavres = parsedCurrentLikedCadavres.filter(
          (id) => id !== id_cadavre
        );
        // Mettez à jour le local storage avec le nouveau tableau d'IDs
        await AsyncStorage.setItem(
          "likedCadavres",
          JSON.stringify(updatedLikedCadavres)
        );
        // Mettez à jour l'état local
        setLikedCadavresArray(updatedLikedCadavres);
        // Mettez à jour les cadavres affichés
        processLikedCadavres(updatedLikedCadavres);
        await fetch(`https://loufok.alwaysdata.net/api/cadavre/remove_like`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id_cadavre }),
        });
      }
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'ID du local storage:",
        error
      );
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getValueFromAsyncStorage();
    });

    // Clean up the subscription when the component unmounts
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView style={styles.home}>
      <View style={styles.header}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
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
            source={require("./../../assets/filter.png")}
            style={styles.buttonImage}
          />
        </TouchableOpacity>
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
            >
              <Picker.Item label="Tri alphabétique" value="alphabetical" />
              <Picker.Item label="Tri par date" value="date" />
            </Picker>

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={closeModal}
            >
              <Text style={styles.closeModalButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {cadavres.map((cadavre) => (
        <View key={cadavre.id_cadavre} style={styles.cadavreContainer}>
          <View style={styles.cadavreContainerLeft}>
            <Text style={styles.titleText}>{cadavre.titre_cadavre}</Text>
            <Text style={styles.participantsText}>
              {formatDate(cadavre.date_debut_cadavre)} -{" "}
              {formatDate(cadavre.date_fin_cadavre)}
            </Text>
          </View>
          <View style={styles.cadavreContainerRight}>
            <TouchableOpacity
              style={styles.cadavreButton}
              onPress={() => removeLikedCadavre(cadavre.id_cadavre)}
            >
              <Image
                source={require("../../assets/love.png")}
                style={styles.likeLogo}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnApi}
              onPress={() => {
                navigation.navigate("Cadavre", {
                  id_cadavre: cadavre.id_cadavre,
                });
              }}
            >
              <Image
                source={require("../../assets/play.png")}
                style={styles.playLogo}
              />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default LikeScreen;
