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
// import DocumentPicker from "react-native-document-picker";
import * as DocumentPicker from "expo-document-picker";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#F0FFF0",
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
    // marginTop: 10,
    padding: 10,
  },
  flexrow: {
    // marginTop: 10,
    // padding: 10,
    marginHorizontal: 10,
  },
  urlText: {
    color: "blue",
    alignSelf: "center",
    fontSize: 15,
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
  const [File, setFile] = useState(null);

  const user = jwt_decode(jwtToken)["user"];

  dispatch(profileName(user["full_name"]));
  dispatch(profileInterests(user["interests"].join(",")));
  dispatch(profileScholarLink(user["scholars_link"]));

  const uploadPaper = async () => {
    console.log("Upload paper");
    try {
      const res = await DocumentPicker.getDocumentAsync();
      // console.log(res);
      if (res.type == "cancel") {
        alert("User Cancelled");
      } else {
        setFile(res);
        if (File != null) {
          // console.log("File");
          // console.log(File);
          // console.log(File.uri, File.size);

          const payload = new FormData();
          payload.append("name", File.name);
          payload.append("file", {
            uri: File.uri,
            name: File.name,
            type: "application/pdf",
          });
          // console.log("Payload");
          // console.log(payload);
          await axios
            .post("http://10.0.2.2:5000/upload", payload, {
              headers: {
                "Content-type": "multipart/form-data",
                Authorization: "Bearer " + jwtToken,
              },
            })
            .then((response) => {
              console.log(response);
              if (response.status == 404) {
                console.log("Error in data receieve");
              } else if (response.status == 200) {
                console.log("success");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    } catch (err) {
      console.log("Error", JSON.stringify(err));
      throw err;
    }
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
        <View style={styles.flexrow}>
          <Text style={styles.label}>Google Scholar Link: </Text>
          <Text style={styles.urlText}>{user["scholars_link"]}</Text>
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
