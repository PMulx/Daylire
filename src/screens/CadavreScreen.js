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
  RefreshControl,
} from "react-native";
import styles from "./../styles/CadavreScreenStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CadavreScreen = ({ route }) => {
  const { id_cadavre } = route.params;
  const [apiData, setApiData] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDataFromApi = async () => {
    try {
      const response = await fetch(
        "https://loufok.alwaysdata.net/api/cadavre/" + id_cadavre
      );
      const data = await response.json();
      console.log(data);
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
      const likedStatus = await AsyncStorage.getItem("likedCadavres");
      if (likedStatus !== null) {
        const likedCadavres = JSON.parse(likedStatus);
        setIsLiked(likedCadavres.includes(id_cadavre));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'état de like", error);
    }
  };

  const handleLike = async () => {
    try {
      const likeEndpoint = isLiked
        ? "https://loufok.alwaysdata.net/api/cadavre/remove_like"
        : "https://loufok.alwaysdata.net/api/cadavre/add_like";

      const method = isLiked ? "DELETE" : "POST";

      const response = await fetch(likeEndpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_cadavre }),
      });

      if (response.ok) {
        const data = await response.json();

        const updatedData = {
          ...data,
          nb_jaime: isLiked ? data.nb_jaime - 1 : data.nb_jaime + 1,
        };

        // Update liked status in AsyncStorage
        const likedCadavres = await AsyncStorage.getItem("likedCadavres");
        let likedCadavresArray = likedCadavres ? JSON.parse(likedCadavres) : [];

        if (isLiked) {
          likedCadavresArray = likedCadavresArray.filter(
            (cadavreId) => cadavreId !== id_cadavre
          );
        } else {
          likedCadavresArray.push(id_cadavre);
        }

        await AsyncStorage.setItem(
          "likedCadavres",
          JSON.stringify(likedCadavresArray)
        );

        // Utilisez une fonction de mise à jour pour garantir la mise à jour basée sur la dernière valeur
        setIsLiked(!isLiked);
        setApiData(updatedData);
      } else {
        console.error("Error in API response:", response);
      }
    } catch (error) {
      console.error("Error while fetching or updating API data:", error);
    }
  };

  const renderContributions = () => {
    return apiData.contributions.map((contribution, index) => (
      <Text style={styles.contributionText} key={index}>
        {contribution.texte_contribution}
      </Text>
    ));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchDataFromApi();

      // Mise à jour des données dans AsyncStorage
      const likedStatus = await AsyncStorage.getItem("likedCadavres");
      if (likedStatus !== null) {
        const likedCadavres = JSON.parse(likedStatus);
        // Mettez à jour les données en fonction des nouvelles données obtenues de l'API
        const updatedLikedCadavres = likedCadavres.filter(
          (cadavreId) => cadavreId !== id_cadavre
        );
        await AsyncStorage.setItem(
          "likedCadavres",
          JSON.stringify(updatedLikedCadavres)
        );
      }
    } finally {
      setRefreshing(false);
    }
  };

  const renderPlumeText = () => {
    return (
      <Text style={styles.plumeText}>
        Ecrivains :{" "}
        {apiData.contributions
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
    <ScrollView
      style={styles.home}
      stickyHeaderIndices={[1]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {apiData && (
        <>
          <View style={styles.header}>
            <Image
              source={require("../../assets/logo.png")}
              style={styles.logo}
            />
          </View>
          <View style={styles.topBar}>
            <Text style={styles.title}>{apiData.titre_cadavre}</Text>
            <View style={styles.likeSection}>
              <Text style={{ color: "white" }}>{apiData.nb_jaime}</Text>
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
            {apiData.contributions.map((contribution, index) => (
              <Text style={styles.contributionText} key={index}>
                {contribution.texte_contribution}
              </Text>
            ))}
            <Text style={styles.plumeText}>
              Ecrivains :{" "}
              {apiData.contributions
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
