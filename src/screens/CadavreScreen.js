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
import styles from "./../styles/CadavreScreenStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CadavreScreen = ({ route }) => {
  const { id_cadavre } = route.params;
  const [apiData, setApiData] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  const fetchDataFromApi = async () => {
    try {
      const response = await fetch(
        "https://loufok.alwaysdata.net/api/cadavre/" + id_cadavre
      );
      const data = await response.json();
      setApiData(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de l'API",
        error
      );
    }
  };

  useEffect(() => {
    fetchDataFromApi();
  }, [id_cadavre]);

  const handleLike = async () => {
    try {
      const response = await fetch(
        "https://loufok.alwaysdata.net/api/cadavre/" + id_cadavre
      );
      const data = await response.json();

      const updatedData = {
        ...data,
        nb_jaime: isLiked ? data.nb_jaime - 1 : data.nb_jaime + 1,
      };

      AsyncStorage.setItem(
        "likedCadavre" + updatedData.id_cadavre,
        isLiked ? "false" : "true"
      );

      setApiData(updatedData);

      setIsLiked(!isLiked);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération ou de la mise à jour des données de l'API",
        error
      );
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", options);
  };

  return (
    <ScrollView
      style={styles.home}
      stickyHeaderIndices={[1]} // L'indice de la vue qui doit rester collée (topBar)
    >
      {apiData && (
        <>
          <View style={styles.header}>
            <Image
              source={require("../../assets/logo.png")}
              style={styles.logo}
            />
            <TouchableOpacity
              onPress={() => alert("Icône de question cliquée")}
            >
              <Image
                source={require("../../assets/question.png")}
                style={styles.questionIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.topBar}>
            <Text style={styles.title}>{apiData[0].titre_cadavre}</Text>
            <TouchableOpacity onPress={handleLike}>
              <Image
                source={
                  isLiked
                    ? require("../../assets/love.png")
                    : require("../../assets/no_love.png")
                }
                style={styles.likeLogo}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.scrollView}>
            {apiData[0].contributions.map((contribution, index) => (
              <Text style={styles.contributionText} key={index}>
                {contribution.texte_contribution}
              </Text>
            ))}
            <Text style={styles.plumeText}>
              Ecrivains :{" "}
              {apiData[0].contributions
                .filter(
                  (contribution) => contribution.nom_plume !== "Administrateur"
                )
                .map((contribution, index) => (
                  <Text key={index}>{contribution.nom_plume} </Text>
                ))}
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default CadavreScreen;