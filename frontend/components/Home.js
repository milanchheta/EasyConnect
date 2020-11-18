import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateRecommendations } from "../Actions/RecommendationsAction.js";

const styles = StyleSheet.create({});

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

  return (
    <View>
      <Text>
        {recommendations.map((el, idx) => {
          return recommendation({ el, idx });
        })}
        HI
      </Text>
    </View>
  );
}

function recommendation(props) {
  return (
    <View key={props.idx}>
      <Text>{props.el}</Text>
    </View>
  );
}
