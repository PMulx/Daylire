import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import styles from "../styles/HomeScreenStyles";

const HomeScreen = () => {
  const [apiData, setApiData] = useState(null);

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

  // Appel de la fonction au chargement du composant
  useEffect(() => {
    fetchDataFromApi();
  }, []);

  return (
    <ScrollView style={styles.home}>
      {/* Header avec logo et icône de question */}
      <View style={styles.header}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
        <TouchableOpacity onPress={() => alert("Icône de question cliquée")}>
          <Image
            source={require("../../assets/question.png")}
            style={styles.questionIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Contenu de la page */}
      <View style={styles.container}>
        {/* Première div avec un paragraphe et un bouton */}
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

        {/* Deuxième div avec un paragraphe */}
        <View style={styles.paragraph}>
          <Text style={styles.text}>
            Le cadavre exquis, c'est une création littéraire collaborative où
            chacun ajoute une portion de texte sans connaître le reste. Sur
            Daylire, découvrez des écrits imprévisibles et décalés.
            L'imagination sans limites à portée de main.
          </Text>
        </View>

        {/* Troisième div avec les valeurs de l'API */}
        {apiData && (
          <View style={styles.apiValues}>
            <Text>Valeur 1: {apiData.t}</Text>
            <Text>Valeur 2: {apiData.value2}</Text>
            {/* Ajoutez d'autres champs en conséquence */}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
