import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  profileName,
  profileScholarLink,
  profileInterests,
} from "../Actions/ProfileAction";
import { storeJwtToken } from "../Actions/LoginAction";
import BASE_URL from "./BASE_URL";

/**
 * Stylesheet for the Edit profile component.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 90,
  },
  input: {
    borderStartWidth: 2,
    borderEndWidth: 2,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderRadius: 20,
    padding: 10,
    fontSize: 18,
    backgroundColor: "#fff",
    borderColor: "#aaa",
    width: 350,
    marginTop: 5,
  },
  editbuttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  editbutton: {
    marginTop: 100,
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    width: 300,
    backgroundColor: "#4A3C31",
    marginVertical: 20,
  },
  label: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "700",
    color: "#900",
    alignSelf: "flex-start",
    marginLeft: 30,
    marginBottom: 5,
  },
});

/**
 * Edit profile component to perform personal profile edit for the user.
 * @param {props} props
 */
export default function EditProfile(props) {
  const dispatch = useDispatch();

  const jwtToken = useSelector((state) => state.login.jwtToken);

  const fullname = useSelector((state) => state.profile.fullname);
  const scholar_link = useSelector((state) => state.profile.scholars_link);
  const interests = useSelector((state) => state.profile.interests);
  const [activity, setactivity] = useState(false);

  const [fullnameError, setfullnameError] = useState(false);
  const [scholar_linkError, setscholar_linkError] = useState(false);
  const [register_error, setregister_error] = useState(false);

  useEffect(() => {
    if (!jwtToken && jwtToken === undefined && jwtToken === "") {
      props.navigation.push("Login");
    }
  });

  /**
   * Function to validate the edited fields by the user.
   */
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
      scholar_linkArr[0] !== "https://scholar.google.com/citations?user" ||
      scholar_linkArr[1].length !== 12
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

  /**
   * Function to submit the updated user details to the system.
   */
  const onSubmit = () => {
    if (validate) {
      let payload = {
        full_name: fullname,
        scholars_link: scholar_link,
        interests: interests.split(","),
      };
      console.log(payload);

      /**
       * Http request to update the profile based on new details.
       */
      setactivity(true);
      axios
        .put(BASE_URL + "/profile", payload, {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        })
        .then((response) => {
          setactivity(false);

          if (response.status == 403) {
            console.log("Error from backend", reponse);
            setregister_error(true);
          } else {
            console.log("Updated Succesfully.", response);
            let jwt_token = response["data"]["token"];
            setregister_error(false);
            dispatch(storeJwtToken(jwt_token));
            props.navigation.navigate("My Profile");
          }
        })
        .catch((error) => {
          setactivity(false);

          setregister_error(true);
          console.log("Invalid Register Attempt ", error);
        });
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 25,
        backgroundColor: "#fff",
      }}
      // style={styles.container}
      onPress={() => {
        Keyboard.dismiss();
      }}
      onScroll={() => {
        Keyboard.dismiss();
      }}
    >
      {activity ? (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#900" />
        </View>
      ) : (
        <>
          <Text style={styles.label}>Full Name: </Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullname}
            onChangeText={(text) => dispatch(profileName(text))}
          />
          <Text style={styles.label}>Google Scholar Link: </Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => dispatch(profileScholarLink(text.trim()))}
            value={scholar_link}
            placeholder="Google Scholar link, if applicable"
          />
          <Text style={styles.label}>Interests: </Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => dispatch(profileInterests(text))}
            value={interests}
            placeholder="Add your research interests"
          />
          <TouchableOpacity
            style={styles.editbutton}
            onPress={() => {
              onSubmit();
            }}
          >
            <Text style={styles.editbuttonText}>Update Profile</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}
