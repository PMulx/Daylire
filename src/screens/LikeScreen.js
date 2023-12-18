import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Image, TouchableOpacity, ScrollView, Text } from "react-native";
import styles from "./../styles/LikeScreenStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LikeScreen = () => {
  const navigation = useNavigation();
  const [cadavres, setCadavres] = useState([]);
  const [likedCadavresArray, setLikedCadavresArray] = useState([]);

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

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getValueFromAsyncStorage();
    });

    // Clean up the subscription when the component unmounts
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView>
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
