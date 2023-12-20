import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { Svg, Circle, Text as SvgText } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Text,
  Button,
  RefreshControl,
} from "react-native";
import { SearchBar } from "react-native-elements";
import styles from "./../styles/ListScreenStyles";

const PercentageCircleChart = ({ percentage }) => {
  const radius = 18;

  // Ajustez les coordonnées du cercle pour les centrer
  const cx = 25; // la moitié de la taille du SVG (50/2)
  const cy = 25;

  const textY = 25;
  const textX = 25;

  // Calculez la longueur de la ligne de contour en fonction du pourcentage
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${
    (percentage / 100) * circumference
  } ${circumference}`;

  return (
    <Svg height="50" width="50">
      <Circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke="#A4FA82"
        strokeWidth="5"
        fill="transparent"
        strokeDasharray={strokeDasharray}
      />
      <SvgText
        x={textX}
        y={textY}
        fontSize="12"
        fill="#101A31"
        textAnchor="middle"
        alignmentBaseline="middle" // Centrer le texte verticalement
      >
        {`${percentage}%`}
      </SvgText>
    </Svg>
  );
};

const ListScreen = () => {
  const navigation = useNavigation();
  const [apiData, setApiData] = useState(null);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState("alphabetical");
  const [filteredCadavres, setFilteredCadavres] = useState(null);
  const [sortedCadavres, setSortedCadavres] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDataFromApi = async () => {
    try {
      const response = await fetch(
        "https://loufok.alwaysdata.net/api/cadavres"
      );
      const data = await response.json();

      // Assurez-vous que la propriété "cadavres" existe dans la réponse
      if (data && data.cadavres) {
        setApiData(data.cadavres);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de l'API",
        error
      );
    }
  };

  useEffect(() => {
    // Écouter les événements de navigation
    const unsubscribe = navigation.addListener("focus", () => {
      // Vérifiez si l'écran actuel est ListScreen
      if (navigation.isFocused()) {
        fetchDataFromApi();
      }
    });

    // Nettoyage de l'effet lors du démontage du composant
    return unsubscribe;
  }, [navigation]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", options);
  };

  const updateSearch = (text) => {
    setSearch(text);
    if (text.trim() === "") {
      setFilteredCadavres(apiData);
    } else {
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
      sortedData = apiData.sort((a, b) =>
        a.titre_cadavre.localeCompare(b.titre_cadavre)
      );
    } else if (itemValue === "date") {
      sortedData = apiData.sort(
        (a, b) => new Date(a.date_fin_cadavre) - new Date(b.date_fin_cadavre)
      );
    } else if (itemValue === "likes") {
      // Utilisez l'opérateur de soustraction pour trier les nombres
      sortedData = apiData.sort((a, b) => b.nb_jaime - a.nb_jaime);
    }

    setSortedCadavres(sortedData);
    setFilteredCadavres(sortedData); // Mettez à jour filteredCadavres après le tri
  };

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
              <Picker.Item label="Ordre alphabétique" value="alphabetical" />
              <Picker.Item label="Nombre de likes" value="likes" />
              <Picker.Item label="Date" value="date" />
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
      <View style={styles.liste}>
        {(filteredCadavres || apiData || []).map((data, index) => (
          <TouchableOpacity
            style={styles.btnApi}
            key={index}
            onPress={() => {
              navigation.navigate("Cadavre", {
                id_cadavre: data.id_cadavre,
              });
            }}
          >
            <View key={index} style={styles.apiDiv}>
              <View style={styles.apiInfo}>
                <Text style={styles.titleText}>{data.titre_cadavre}</Text>
                <View style={styles.apiInfoParticipants}>
                  <Text style={styles.participantsText}>
                    {data.nb_contributions} participants
                  </Text>
                  <View style={styles.like}>
                    <Text> {data.nb_jaime} </Text>
                    <Image
                      source={require("../../assets/love.png")}
                      style={styles.playLogo}
                    />
                  </View>
                </View>
                <Text style={styles.apiInfoPeriode}>
                  {formatDate(data.date_debut_cadavre)} -{" "}
                  {formatDate(data.date_fin_cadavre)}
                </Text>
              </View>

              <View style={styles.like}>
                <PercentageCircleChart
                  percentage={Math.round(
                    (data.nb_contributions / data.nb_contributions_max) * 100
                  )}
                />
              </View>

              <View style={styles.percentageCircleContainer}></View>

              <Image
                source={require("../../assets/play.png")}
                style={styles.playLogo}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default ListScreen;
