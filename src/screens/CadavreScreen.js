import React, { useEffect, useState, useRef } from "react";
import { View, Image, TouchableOpacity, ScrollView, Text } from "react-native";
import styles from "./../styles/CadavreScreenStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CadavreScreen = ({ route, navigation }) => {
  const { id_cadavre } = route.params;
  const [apiData, setApiData] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const navigationRef = useRef(navigation);

  const fetchAndSetData = async () => {
    try {
      // Récupérer les données de l'API
      const response = await fetch(
        "https://loufok.alwaysdata.net/api/cadavre/" + id_cadavre
      );
      const data = await response.json();
      setApiData(data);

      // Récupérer et mettre à jour le statut de like
      const likedStatus = await AsyncStorage.getItem("likedCadavres");
      if (likedStatus !== null) {
        const likedCadavres = JSON.parse(likedStatus);
        setIsLiked(likedCadavres.includes(id_cadavre));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigationRef.current.addListener("focus", () => {
      fetchAndSetData();
    });

    return unsubscribe;
  }, [navigationRef, id_cadavre]);

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

      const method = "POST";

      const response = await fetch(likeEndpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id_cadavre }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

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

        // Mettez à jour isLiked après avoir traité la réponse de l'API
        setIsLiked(!isLiked);

        // Mettez à jour nb_jaime en fonction des données de l'API
        const updatedData = {
          ...apiData,
          nb_jaime: isLiked ? apiData.nb_jaime - 1 : apiData.nb_jaime + 1,
        };
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

  return (
    <ScrollView style={styles.home} stickyHeaderIndices={[1]}>
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
              Ecrivains :{" "}
              {apiData?.contributeurs && apiData.contributeurs[0].slice(2)}
              <Text>.</Text>
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default CadavreScreen;
