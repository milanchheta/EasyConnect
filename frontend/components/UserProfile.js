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
    backgroundColor: "#F0FFF0",
  },
  label: {
    fontSize: 20,
    fontWeight: "700",
    color: "#90EE90",
  },
  value: {
    alignSelf: "center",
    fontSize: 15,
  },
  flexCol: {
    flexDirection: "row",
    marginTop: 10,
    padding: 10,
  },
  connectbuttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    alignSelf: "center",
  },
  connectbutton: {
    alignSelf: "center",
    padding: 10,
    borderRadius: 20,
    width: 200,
    backgroundColor: "#90EE90",
    marginVertical: 10,
  },
});

export default function UserProfile(props) {
  const dispatch = useDispatch();
  const jwtToken = useSelector((state) => state.login.jwtToken);

  const user = jwt_decode(jwtToken)["user"];

  dispatch(profileName(user["full_name"]));
  dispatch(profileInterests(user["interests"].join(",")));
  dispatch(profileScholarLink(user["scholars_link"]));

  const uploadPaper = () => {
    console.log("Upload paper");
  };

  // console.log();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.flexCol}>
        <Text style={styles.label}>Full Name: </Text>
        <Text style={styles.value}>{user["full_name"]}</Text>
      </View>
      <View style={styles.flexCol}>
        <Text style={styles.label}>Email: </Text>
        <Text style={styles.value}>{user["email"]}</Text>
      </View>

      {user["interests"] &&
        user["interests"].length > 0 &&
        user["interests"][0] != "" && (
          <View style={styles.flexCol}>
            <Text style={styles.label}>Interests: </Text>
            <Text style={styles.value}>{user["interests"].join(", ")}</Text>
          </View>
        )}
      {user["scholars_link"] != "" && (
        <View style={styles.flexCol}>
          <Text style={styles.label}>Google Scholar Link: </Text>
          <Text style={styles.value}>{user["scholars_link"]}</Text>
        </View>
      )}
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("EditProfile");
        }}
        style={styles.connectbutton}
      >
        <Text style={styles.connectbuttonText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          uploadPaper();
        }}
        style={styles.connectbutton}
      >
        <Text style={styles.connectbuttonText}>Upload Paper</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
