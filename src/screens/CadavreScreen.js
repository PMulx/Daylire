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
    fetchLikeStatus(); // Appel de fetchLikeStatus à l'intérieur de useEffect
  }, [id_cadavre]);

  const fetchLikeStatus = async () => {
    try {
      const likedStatus = await AsyncStorage.getItem(
        "likedCadavre" + id_cadavre
      );

      console.log("Liked status from AsyncStorage:", likedStatus);

      if (likedStatus !== null) {
        setIsLiked(likedStatus === "true");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'état de like", error);
    }
  };

  const handleLike = async () => {
    try {
      console.log("Attempting to like or unlike cadavre:", id_cadavre);
      const likeEndpoint = isLiked
        ? `https://loufok.alwaysdata.net/api/cadavre/${id_cadavre}/remove_like`
        : `https://loufok.alwaysdata.net/api/cadavre/${id_cadavre}/add_like`;

      console.log("Like endpoint:", likeEndpoint);

      const response = await fetch(likeEndpoint);
      const data = await response.json();

      console.log("API response after liking:", data);

      const updatedData = {
        ...data,
        nb_jaime: isLiked ? data.nb_jaime - 1 : data.nb_jaime + 1,
      };

      // Update liked status in AsyncStorage
      await AsyncStorage.setItem(
        "likedCadavre" + updatedData.id_cadavre,
        String(!isLiked)
      );

      console.log("Updated data after liking:", updatedData);

      // Utilisez une fonction de mise à jour pour garantir la mise à jour basée sur la dernière valeur
      setIsLiked((prevIsLiked) => !prevIsLiked);
      setApiData(updatedData);

      // Remove likedCadavre from AsyncStorage if disliked
      if (isLiked) {
        await AsyncStorage.removeItem("likedCadavre" + updatedData.id_cadavre);
      }
    } catch (error) {
      console.error("Error while fetching or updating API data:", error);
    }
  };
  const renderContributions = () => {
    return apiData[0].contributions.map((contribution, index) => (
      <Text style={styles.contributionText} key={index}>
        {contribution.texte_contribution}
      </Text>
    ));
  };

  const renderPlumeText = () => {
    return (
      <Text style={styles.plumeText}>
        Ecrivains :{" "}
        {apiData[0].contributions
          .filter((contribution) => contribution.nom_plume !== "Administrateur")
          .map((contribution, index) => (
            <Text key={index}>{contribution.nom_plume} </Text>
          ))}
      </Text>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", options);
  };

  return (
    <ScrollView style={styles.home} stickyHeaderIndices={[1]}>
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
            <View style={styles.likeSection}>
              <Text style={{ color: "white" }}>{apiData[0].nb_jaime}</Text>
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
                .map((contribution, index, array) => (
                  <React.Fragment key={index}>
                    <Text>{contribution.nom_plume}</Text>
                    {index < array.length - 1 ? (
                      <Text>, </Text>
                    ) : (
                      <Text> </Text>
                    )}
                  </React.Fragment>
                ))}
              <Text>.</Text>
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default CadavreScreen;
