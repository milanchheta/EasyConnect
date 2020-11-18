import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateLoginEmail, updateLoginPassword } from "../Actions/LoginAction";

const styles = StyleSheet.create({});

export default function Login(props) {
  const dispatch = useDispatch();
  const loginEmail = useSelector((state) => state.login.loginEmail);
  const loginPassword = useSelector((state) => state.login.loginPassword);

  const onSubmit = () => {
    console.log("loggedin" + loginEmail + " " + loginPassword);
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
        </View>
      </View>
    </View>
  );
}
