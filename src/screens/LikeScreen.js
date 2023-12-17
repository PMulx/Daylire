import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Text,
  RefreshControl,
} from "react-native";
import styles from "./../styles/LikeScreenStyles";
import { SearchBar } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LikeScreen = () => {
  const navigation = useNavigation();
  const [cadavres, setCadavres] = useState([]);
  const [likedCadavresArray, setLikedCadavresArray] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
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

  const updateLikedCadavresInAsyncStorage = async () => {
    try {
      const likedStatus = await AsyncStorage.getItem("likedCadavres");
      if (likedStatus !== null) {
        const likedCadavres = JSON.parse(likedStatus);
        // Mettez à jour les données en fonction des nouvelles données obtenues de l'API
        const updatedLikedCadavres = likedCadavres.filter(
          (cadavreId) => !cadavres.map((c) => c.id_cadavre).includes(cadavreId)
        );
        await AsyncStorage.setItem(
          "likedCadavres",
          JSON.stringify(updatedLikedCadavres)
        );
        setLikedCadavresArray(updatedLikedCadavres);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'AsyncStorage :", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await updateLikedCadavresInAsyncStorage();
    } finally {
      setRefreshing(false);
    }
  };

  const processLikedCadavres = async (likedCadavresArray) => {
    try {
      const response = await fetch(
        `https://loufok.alwaysdata.net/api/cadavres`
      );
      const cadavreDataArray = await response.json();

      const matchedCadavres = cadavreDataArray.filter((cadavre) =>
        likedCadavresArray.includes(cadavre.id_cadavre)
      );

      setCadavres(matchedCadavres);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données des cadavres:",
        error
      );
    }
  };

  useEffect(() => {
    getValueFromAsyncStorage();
  }, []);
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", options);
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
        await fetch(
          `https://loufok.alwaysdata.net/api/cadavre/${id_cadavre}/remove_like`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'ID du local storage:",
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
  const sortCadavres = (cadavres, sortOption) => {
    if (sortOption === "alphabetical") {
      return cadavres
        .slice()
        .sort((a, b) => a.titre_cadavre.localeCompare(b.titre_cadavre));
    } else if (sortOption === "date") {
      return cadavres
        .slice()
        .sort(
          (a, b) =>
            new Date(b.date_debut_cadavre) - new Date(a.date_debut_cadavre)
        );
    }
    return cadavres;
  };
  return (
    <ScrollView
      style={styles.home}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
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
      {(filteredCadavres || []).map((cadavre, index) => (
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
