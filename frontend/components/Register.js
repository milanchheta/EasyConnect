import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
  registerEmail,
  registerName,
  registerPassword,
  registerConfirmPassword,
  registerScholarLink,
  registerInterests,
} from "../Actions/RegisterAction";

const styles = StyleSheet.create({});

export default function Register(props) {
  const dispatch = useDispatch();
  const email = useSelector((state) => state.register.email);
  const password = useSelector((state) => state.register.password);
  const confirmPassword = useSelector(
    (state) => state.register.confirm_password
  );
  const fullname = useSelector((state) => state.register.fullname);
  const scholar_link = useSelector((state) => state.register.scholars_link);
  const interests = useSelector((state) => state.register.interests);

  const onSubmit = () => {
    // TODO: Add validations.

    if (password == confirmPassword) {
      let payload = {
        full_name: fullname,
        email: email,
        password: password,
        scholars_link: scholar_link,
        interests: interests.split(" "),
      };

      console.log(payload);

      axios
        .post("http://localhost:5000/register", payload, {
          headers: {
            "content-type": "application/json",
          },
        })
        .then((response) => {
          console.log("Registered Succesfully.", response);
          props.navigation.navigate("Login");
        })
        .catch((error) => {
          console.log("Invalid Register Attempt ", error);
        });
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.centeredView}>
        <View style={styles.modalStyle}>
          <Text style={styles.textHeading}>
            Create your EasyConnect account
          </Text>
          <TextInput
            // style={styles.textInput}
            onChangeText={(text) => dispatch(registerName(text))}
            value={fullname}
            placeholder="Full Name"
          />
          <TextInput
            // style={styles.textInput}
            onChangeText={(text) => dispatch(registerEmail(text))}
            value={email}
            placeholder="Email (this will be your username)"
          />
          <TextInput
            // style={styles.textInput}
            onChangeText={(text) => dispatch(registerPassword(text))}
            value={password}
            placeholder="Password"
          />
          <TextInput
            // style={styles.textInput}
            onChangeText={(text) => dispatch(registerConfirmPassword(text))}
            value={confirmPassword}
            placeholder="Confirm Password"
          />
          <TextInput
            // style={style.textInput}
            onChangeText={(text) => dispatch(registerScholarLink(text))}
            value={scholar_link}
            placeholder="Google Scholar link, if applicable."
          />
          <TextInput
            // style={style.multiTextInput}
            onChangeText={(text) => dispatch(registerInterests(text))}
            value={interests}
            placeholde="Add your research interests, seperated by space"
          />
          <TouchableOpacity
            // style={styles.button}
            onPress={() => {
              onSubmit();
            }}
          >
            <Text>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
