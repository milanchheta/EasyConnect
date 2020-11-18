import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  updateLoginEmail,
  updateLoginPassword,
  storeJwtToken,
} from "../Actions/LoginAction";
import axios from "axios";
import jwt_decode from "jwt-decode";

const styles = StyleSheet.create({});

export default function Login(props) {
  const dispatch = useDispatch();
  const loginEmail = useSelector((state) => state.login.loginEmail);
  const loginPassword = useSelector((state) => state.login.loginPassword);
  const jwtToken = useSelector((state) => state.login.jwtToken);

  useEffect(() => {
    if (jwtToken != "") {
      var decoded = jwt_decode(jwtToken);
      props.navigation.push("Home");
    }
  });

  const onSubmit = () => {
    axios
      .post(
        "http://127.0.0.1:5000/login",
        { email: loginEmail, password: loginPassword },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      )
      .then((response) => {
        let jwt_token = response["data"]["token"];
        dispatch(storeJwtToken(jwt_token));
        props.navigation.navigate("Home");
      })
      .catch((err) => {
        console.log("Invalid Credentials");
      });
  };
  return (
    <View>
      <View>
        <View>
          <Text>Login form</Text>
          <TextInput
            onChangeText={(text) => dispatch(updateLoginEmail(text))}
            value={loginEmail}
            placeholder="Email..."
          />
          <TextInput
            onChangeText={(text) => dispatch(updateLoginPassword(text))}
            value={loginPassword}
            placeholder="Password..."
          />
          <TouchableOpacity
            onPress={() => {
              onSubmit();
            }}
          >
            <Text>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props.navigation.push("Home");
            }}
          >
            <Text>Create an account?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
