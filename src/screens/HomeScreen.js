import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  RefreshControl,
} from "react-native";
import styles from "../styles/HomeScreenStyles";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [apiData, setApiData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDataFromApi = async () => {
    try {
      const response = await fetch(
        "https://loufok.alwaysdata.net/api/cadavres"
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
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchDataFromApi();
    } finally {
      setRefreshing(false);
    }
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

      <View style={styles.container}>
        <View>
          <Text style={styles.text}>
            Daylire propose des lectures délirantes de cadavres exquis de
            Loufok. Choisissez, aimez, plongez dans l'absurde. Une expérience
            littéraire unique en quelques clics.
          </Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => Linking.openURL("https://loufok.alwaysdata.net/")}
          >
            <Image
              source={require("../../assets/loufok.png")}
              style={styles.loufokLogo}
            />
            <Text style={styles.textLoufok}>Découvrir Loufok</Text>
            <Image
              source={require("../../assets/play.png")}
              style={styles.playLogo}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.paragraph}>
          <Text style={styles.text}>
            Le cadavre exquis, c'est une création littéraire collaborative où
            chacun ajoute une portion de texte sans connaître le reste. Sur
            Daylire, découvrez des écrits imprévisibles et décalés.
            L'imagination sans limites à portée de main.
          </Text>
        </View>

        {apiData && (
          <View style={styles.apiDiv}>
            <Text style={styles.apiTitle}> 3 derniers cadavres exquis </Text>
            {apiData
              .sort(
                (a, b) =>
                  new Date(b.date_fin_cadavre) - new Date(a.date_fin_cadavre)
              )
              .slice(0, 3) // Sélectionne les trois derniers
              .map((cadavre, index) => (
                <View key={index} style={styles.btnApi}>
                  <Text style={styles.apiText}>{cadavre.titre_cadavre}</Text>
                  <TouchableOpacity
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
              ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
