import React, { useEffect, useState } from "react";

import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  updateLoginEmail,
  updateLoginPassword,
  storeJwtToken,
} from "../Actions/LoginAction";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";

/**
 * Stylesheet for the login page.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loginbutton: {
    alignItems: "center",
    padding: 12,
    borderRadius: 20,
    width: 300,
    backgroundColor: "#900",
    marginBottom: 15,
  },
  signupbutton: {
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    width: 150,
    backgroundColor: "#4A3C31",
    marginTop: 5,
  },

  loginbuttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  signupbuttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
  },
  greeting: {
    fontSize: 25,
    fontWeight: "600",
    color: "#008000",
    letterSpacing: 5,
  },
  brand: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#7A1705",
    letterSpacing: 3,
    marginBottom: 50,
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
    fontSize: 20,
    textAlign: "center",
    backgroundColor: "#fff",
    borderColor: "#aaa",
    width: 300,
  },
  signupText: {
    color: "#aaa",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 5,
    marginTop: 10,
  },
  error: {
    marginBottom: 10,
    marginTop: 2,
    color: "red",
    fontSize: 13,
  },
});

/**
 * Login component to assist user login to the system.
 * @param {props} props Props passed from the App component.
 */
export default function Login(props) {
  const dispatch = useDispatch();
  const loginEmail = useSelector((state) => state.login.loginEmail);
  const loginPassword = useSelector((state) => state.login.loginPassword);
  const jwtToken = useSelector((state) => state.login.jwtToken);
  const [emailError, setemailError] = useState(false);
  const [passwordError, setpasswordError] = useState(false);
  const [login_error, setlogin_error] = useState(false);

  useEffect(() => {
    if (jwtToken && jwtToken != undefined && jwtToken != "") {
      props.navigation.push("Home");
    }
  });

  /**
   * Function to validate the user input during login.
   */
  const validate = () => {
    var re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    let emailcheck = re.test(loginEmail);
    let email_error = !emailcheck;

    setemailError(email_error);

    re = /^([a-zA-Z0-9]{8,})$/;
    let passwordcheck = re.test(loginPassword);
    let password_error = !passwordcheck;

    setpasswordError(password_error);
    if (email_error || password_error) {
      return false;
    }
    return true;
  };

  /**
   * Function invoked during user login attempt.
   */
  const onSubmit = () => {
    if (validate()) {
      let payload = { email: loginEmail, password: loginPassword };
      /**
       * Http request to validate user login in the system and store the jwt token in app storage.
       */
      axios
        .post("http://10.0.2.2:5000/login", payload, {
          headers: {
            "content-type": "application/json",
          },
        })
        .then((response) => {
          let jwt_token = response["data"]["token"];
          dispatch(storeJwtToken(jwt_token));
          setlogin_error(false);
          props.navigation.push("Home");
        })
        .catch((err) => {
          setlogin_error(true);
          console.log(err);
        });
    }
  };
  
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={styles.brand}>EasyConnect</Text>
      <Text style={styles.error}>{login_error && `Invalid credentials`}</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => dispatch(updateLoginEmail(text.trim()))}
        value={loginEmail}
        placeholder="Email"
      />
      <Text style={styles.error}>
        {emailError && `Enter a valid email address`}
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => dispatch(updateLoginPassword(text.trim()))}
        value={loginPassword}
        secureTextEntry={true}
        placeholder="Password"
      />
      <Text style={styles.error}>
        {passwordError && `Enter a password at least 8 characters long`}
      </Text>
      <TouchableOpacity
        style={styles.loginbutton}
        onPress={() => {
          onSubmit();
        }}
      >
        <Text style={styles.loginbuttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.signupText}>Don't have an account yet?</Text>

      <TouchableOpacity
        style={styles.signupbutton}
        onPress={() => {
          props.navigation.push("Register");
        }}
      >
        <Text style={styles.signupbuttonText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
