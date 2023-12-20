import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Text,
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
  console.log(id_cadavre);

  const handleLike = async () => {
    try {
      const likeEndpoint = isLiked
        ? "https://loufok.alwaysdata.net/api/cadavre/remove_like"
        : "https://loufok.alwaysdata.net/api/cadavre/add_like";

      const method = "POST";

      const response = await fetch(likeEndpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id_cadavre }), // Utilisation de la propriété "id" au lieu de "id_cadavre"
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const updatedData = {
          ...apiData, // Utilisation de apiData au lieu de data
          nb_jaime: isLiked ? apiData.nb_jaime - 1 : apiData.nb_jaime + 1,
        };
        console.log(data.nb_jaime);
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
        console.log(updatedData);
        setIsLiked(!isLiked);
        setApiData(updatedData);
      } else {
        console.error(
          "Error in API response:",
          response.status,
          response.statusText
        );

        // If the response contains JSON, try to parse and log it
        try {
          const errorData = await response.json();
          console.error("Error data:", errorData);
        } catch (jsonError) {
          console.error("Unable to parse error data as JSON:", jsonError);
        }
      }
    } catch (error) {
      console.error("Error while fetching or updating API data:", error);
    }
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
            {apiData.contributions && (
              <Text style={styles.contributionText}>
                {apiData.contributions.map((contribution, index) => (
                  <React.Fragment key={index}>
                    {contribution.texte_contribution}
                    {"\n\n"} {/* Ajoutez une marge entre chaque contribution */}
                  </React.Fragment>
                ))}
              </Text>
            )}
            <Text style={styles.plumeText}>
              Ecrivains : {apiData?.contributeurs && apiData.contributeurs[0]}
              <Text>.</Text>
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default CadavreScreen;
