import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { Svg, Circle, Text as SvgText } from "react-native-svg";
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
  const handleSortChange = (itemValue) => {
    setSelectedSort(itemValue);
    // Ajoutez ici la logique pour trier votre contenu en fonction de la valeur sélectionnée
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
          placeholderTextColor="rgba(166, 173, 190, 1)" // Couleur du texte d'espace réservé
          clearIcon={{ color: "rgba(166, 173, 190, 1)" }} // Couleur de l'icône de suppression
          searchIcon={{ color: "rgba(166, 173, 190, 1)" }} // Couleur de l'icône de recherche
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
              style={{ color: "red" }}
              itemStyle={{ color: "red" }}
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
      <TouchableOpacity style={styles.btnApi}>
        <Text style={styles.apiText}> 1 </Text>
        <View style={styles.apiDiv}>
          <View style={styles.apiInfo}>
            <Text style={styles.apiInfoTitle}>Nom cadavre</Text>
            <Text style={styles.apiInfoPeriode}>Période cadavre</Text>
            <Text style={styles.apiInfoParticipants}>NbParticipants</Text>
          </View>
          <View style={styles.percentageCircleContainer}>
            <PercentageCircleChart percentage={75} />
          </View>
          <Image
            source={require("../../assets/play__green.png")}
            style={styles.playLogo}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnApi}>
        <Text style={styles.apiText}> 2 </Text>
        <View style={styles.apiDiv}>
          <View style={styles.apiInfo}>
            <Text style={styles.apiInfoTitle}>Nom cadavre</Text>
            <Text style={styles.apiInfoPeriode}>Période cadavre</Text>
            <Text style={styles.apiInfoParticipants}>NbParticipants</Text>
          </View>
          <View style={styles.percentageCircleContainer}>
            <PercentageCircleChart percentage={56} />
          </View>
          <Image
            source={require("../../assets/play__green.png")}
            style={styles.playLogo}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnApi}>
        <Text style={styles.apiText}> 3 </Text>
        <View style={styles.apiDiv}>
          <View style={styles.apiInfo}>
            <Text style={styles.apiInfoTitle}>Nom cadavre</Text>
            <Text style={styles.apiInfoPeriode}>Période cadavre</Text>
            <Text style={styles.apiInfoParticipants}>NbParticipants</Text>
          </View>
          <View style={styles.percentageCircleContainer}>
            <PercentageCircleChart percentage={23} />
          </View>
          <Image
            source={require("../../assets/play__green.png")}
            style={styles.playLogo}
          />
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default LikeScreen;
