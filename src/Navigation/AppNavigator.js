import React from "react";
import { TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import LikeScreen from "../screens/LikeScreen";
import ListScreen from "../screens/ListScreen";
import CadavreScreen from "../screens/CadavreScreen";
import { View, Image } from "react-native";

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 40,
        width: "80%",
        marginHorizontal: "10%",
        borderRadius: 20,
        backgroundColor: "#EEEFF2",
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        const isCadavreScreen = route.name === "Cadavre";

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const icon = () => {
          if (route.name === "List") {
            return (
              <Image
                source={require("../../assets/list.png")}
                style={{ width: 34, height: 34, resizeMode: "contain" }}
              />
            );
          } else if (route.name === "Home") {
            return (
              <Image
                source={require("../../assets/home.png")}
                style={{ width: 34, height: 34, resizeMode: "contain" }}
              />
            );
          } else if (route.name === "Like") {
            return (
              <Image
                source={require("../../assets/like.png")}
                style={{ width: 34, height: 34, resizeMode: "contain" }}
              />
            );
          }
        };

        return (
          <View
            key={route.key}
            style={{
              flex: isCadavreScreen ? 0 : 1, // Ajuster le nombre d'éléments par ligne pour Cadavre
              alignItems: "center",
              paddingVertical: 10,
              backgroundColor: isFocused ? "#A4FA82" : "transparent",
              borderRadius: 350,
            }}
          >
            <TouchableOpacity
              onPress={onPress}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              {icon()}
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tab.Screen
          name="List"
          component={ListScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Like"
          component={LikeScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Cadavre"
          component={CadavreScreen}
          options={{
            headerShown: false,
            tabBarStyle: { display: "none" }, // Cacher le style de la barre d'onglets
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
