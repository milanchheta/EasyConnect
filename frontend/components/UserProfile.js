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
import jwt_decode from "jwt-decode";
import {
  profileInterests,
  profileName,
  profileScholarLink,
} from "../Actions/ProfileAction";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
});

export default function UserProfile(props) {
  const dispatch = useDispatch();
  const jwtToken = useSelector((state) => state.login.jwtToken);

  const user = jwt_decode(jwtToken)["user"];

  dispatch(profileName(user["full_name"]));
  dispatch(profileInterests(user["interests"].join(",")));
  dispatch(profileScholarLink(user["scholars_link"]));

  // console.log();
  return (
    <SafeAreaView style={styles.container}>
      <Text>Profile</Text>
      <Text>{`Full Name: ${user["full_name"]}`}</Text>
      <Text>{`Email: ${user["email"]}`}</Text>
      {user["interests"] &&
        user["interests"].length > 0 &&
        user["interests"][0] != "" && (
          <Text>{`Interests: ${user["interests"].join(",")}`}</Text>
        )}
      <Text>{`Google Scholar URL: ${user["scholars_link"]}`}</Text>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("EditProfile");
        }}
      >
        <Text>Edit Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
