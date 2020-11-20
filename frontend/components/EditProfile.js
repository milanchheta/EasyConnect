import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import {
  profileName,
  profileScholarLink,
  profileInterests,
} from "../Actions/ProfileAction";
import { storeJwtToken } from "../Actions/LoginAction";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
});

export default function EditProfile(props) {
  const dispatch = useDispatch();

  const jwtToken = useSelector((state) => state.login.jwtToken);
  //   const user = jwt_decode(jwtToken)["user"];

  const fullname = useSelector((state) => state.profile.fullname);
  const scholar_link = useSelector((state) => state.profile.scholars_link);
  const interests = useSelector((state) => state.profile.interests);

  const [fullnameError, setfullnameError] = useState(false);
  const [scholar_linkError, setscholar_linkError] = useState(false);
  const [register_error, setregister_error] = useState(false);

  const validate = () => {
    let fullname_error = null;
    if (fullname == "") {
      fullname_error = true;
    } else {
      fullname_error = false;
    }
    setfullnameError(fullname_error);

    let scholar_link_error = null;
    let scholar_linkArr = scholar_link.split("=");

    if (
      scholar_link.length != 0 &&
      (scholar_linkArr[0] !== "https://scholar.google.com/citations?user" ||
        scholar_linkArr[1].length !== 12)
    ) {
      scholar_link_error = true;
    } else {
      scholar_link_error = false;
    }
    setscholar_linkError(scholar_link_error);

    if (fullname_error || scholar_link_error) {
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    if (validate) {
      let payload = {
        full_name: fullname,
        scholars_link: scholar_link,
        interests: interests.split(","),
      };

      console.log(payload);

      axios
        .put("http://10.0.2.2:5000/profile", payload, {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        })
        .then((response) => {
          if (response.status == 403) {
            console.log("Error from backend", reponse);
            setregister_error(true);
          } else {
            console.log("Updated Succesfully.", response);
            let jwt_token = response["data"]["token"];
            setregister_error(false);
            dispatch(storeJwtToken(jwt_token));
            props.navigation.navigate("UserProfile");
          }
        })
        .catch((error) => {
          setregister_error(true);
          console.log("Invalid Register Attempt ", error);
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Edit Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullname}
        onChange={(text) => dispatch(profileName(text))}
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => dispatch(profileScholarLink(text.trim()))}
        value={scholar_link}
        placeholder="Google Scholar link, if applicable"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => dispatch(profileInterests(text))}
        value={interests}
        placeholder="Add your research interests"
      />
      <TouchableOpacity
        style={styles.signupbutton}
        onPress={() => {
          onSubmit();
        }}
      >
        <Text style={styles.signupbuttonText}>Update Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
