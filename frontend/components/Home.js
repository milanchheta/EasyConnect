import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateRecommendations } from "../Actions/RecommendationsAction.js";
import { logout } from "../Actions/LoginAction.js";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 15,
    color: "#aaa",
  },
});
export default function Home(props) {
  const dispatch = useDispatch();
  const jwtToken = useSelector((state) => state.login.jwtToken);
  const recommendations = useSelector(
    (state) => state.recommendations.recommendations
  );

  useEffect(() => {
    if (jwtToken != "") {
      axios
        .get("http://127.0.0.1:5000/recommendations", {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        })
        .then((response) => {
          dispatch(updateRecommendations(response["data"]["researchers"]));
        })
        .catch((err) => {
          console.log("Error fetching data");
        });
    } else {
      props.navigation.push("Login");
    }
  }, []);

  const onProfileClick = (item) => {
    console.log("go to profile");
    props.navigation.push("Profile", { item });
  };

  const logOut = () => {
    dispatch(logout());
    props.navigation.push("Login");
  };

  const Item = ({ item, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
      <Text style={styles.title}>{item.researcher}</Text>
      <Text style={styles.subtitle}>{item.affiliation}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    return <Item item={item} onPress={() => onProfileClick(item)} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={recommendations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity onPress={() => logOut()}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
