import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Text,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SearchBar } from "react-native-elements";
import styles from "./../styles/LikeScreenStyles";
import { useNavigation } from "@react-navigation/native";

const LikeScreen = () => {
  const navigation = useNavigation();
  const [apiData, setApiData] = useState(null);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState("alphabetical");
  const [isLiked, setIsLiked] = useState(false);
  const [filteredCadavres, setFilteredCadavres] = useState(null);
  const [sortedCadavres, setSortedCadavres] = useState(null);

  const fetchDataFromApi = async () => {
    try {
      const response = await fetch(
        "https://loufok.alwaysdata.net/api/cadavres"
      );
      const data = await response.json();

      // Tri alphabétique initial en fonction du titre du cadavre
      const sortedData = data.sort((a, b) =>
        a.titre_cadavre.localeCompare(b.titre_cadavre)
      );

      setApiData(sortedData);
      setSortedCadavres(sortedData); // Enregistrez l'état initial trié
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
    if (text.trim() === "") {
      // Si le champ de recherche est vide, affichez tous les cadavres
      setFilteredCadavres(apiData);
    } else {
      // Filtrer les cadavres en fonction du titre
      const filtered = apiData.filter((cadavre) =>
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
      sortedData = apiData.sort((a, b) =>
        a.titre_cadavre.localeCompare(b.titre_cadavre)
      );
    } else if (itemValue === "date") {
      // Tri par la date de fin du cadavre
      sortedData = apiData.sort(
        (a, b) => new Date(a.date_fin_cadavre) - new Date(b.date_fin_cadavre)
      );
    }

    setSortedCadavres(sortedData);
  };

  const likeCadavre = (cadavreId) => {
    // Logique pour liker le cadavre avec l'ID cadavreId
    console.log(`Liked Cadavre with ID: ${cadavreId}`);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", options);
  };

  const renderCadavres = () => {
    const cadavresToRender = filteredCadavres || sortedCadavres || apiData;

    if (!cadavresToRender || cadavresToRender.length === 0) {
      return <Text style={{ color: "white" }}>Aucun cadavre trouvé.</Text>;
    }

    return apiData.map((cadavre) => (
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
            onPress={() => likeCadavre(cadavre.id_cadavre)}
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
    ));
  };

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
          placeholderTextColor="rgba(166, 173, 190, 1)"
          clearIcon={{ color: "rgba(166, 173, 190, 1)" }}
          searchIcon={{ color: "rgba(166, 173, 190, 1)" }}
          onChangeText={updateSearch}
          value={search}
        />
        <TouchableOpacity style={styles.buttonStyle} onPress={openModal}>
          <Image
            width={30}
            height={30}
            source={require("./../../assets/filter.png")}
            style={styles.buttonImage}
          />
        </TouchableOpacity>
      </View>
      {renderCadavres()}
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
          <View></View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default LikeScreen;
