import React, { useState } from "react";
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F0FFF0",
    alignItems: "center",
  },
  input: {
    borderStartWidth: 2,
    borderEndWidth: 2,
    borderTopWidth: 2,
    boderLeftWidth: 2,
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
  signupbuttonText: {
    color: "white",
    fontWeight: 700,
    fontSize: 16,
  },
  signupbutton: {
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    width: 150,
    backgroundColor: "#00BFFF",
    marginVertical: 20,
  },
  greeting: {
    fontSize: 25,
    fontWeight: 600,
    color: "#008000",
    letterSpacing: 5,
    marginTop: 20,
  },
  brand: {
    fontSize: 40,
    fontWeight: 700,
    color: "#3CB371",
    letterSpacing: 3,
    marginTop: 10,
    marginBottom: 20,
  },
  error: {
    marginBottom: 10,
    marginTop: 2,
    color: "red",
    fontSize: 13,
  },
});

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

  const [emailError, setemailError] = useState(false);
  const [passwordError, setpasswordError] = useState(false);
  const [confirmPasswordError, setconfirmPasswordError] = useState(false);
  const [fullnameError, setfullnameError] = useState(false);
  const [scholar_linkError, setscholar_linkError] = useState(false);
  const [register_error, setregister_error] = useState(false);

  const validate = () => {
    var re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    let emailcheck = re.test(email);
    let email_error = !emailcheck;

    setemailError(email_error);

    re = /^([a-zA-Z0-9]{8,})$/;
    let passwordcheck = re.test(password);
    let password_error = !passwordcheck;
    setpasswordError(password_error);

    let confirmpassword_error = !(password == confirmPassword);
    setconfirmPasswordError(confirmpassword_error);

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

    if (
      email_error ||
      password_error ||
      confirmpassword_error ||
      fullname_error ||
      scholar_link_error
    ) {
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    // TODO: Add validations.

    if (validate()) {
      let payload = {
        full_name: fullname,
        email: email,
        password: password,
        scholars_link: scholar_link,
        interests: interests.split(","),
      };

      console.log(payload);

      axios
        .post("http://127.0.0.1:5000/register", payload, {
          headers: {
            "content-type": "application/json",
          },
        })
        .then((response) => {
          console.log("Registered Succesfully.", response);
          if (response.status == 202) {
            setregister_error(true);
          } else {
            setregister_error(false);
            props.navigation.push("Login");
          }
        })
        .catch((error) => {
          setregister_error(true);
          console.log("Invalid Register Attempt ", error);
        });
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>welcome to</Text>
      <Text style={styles.brand}>EasyConnect</Text>
      <Text style={styles.error}>
        {register_error && `User already exists. Please login`}
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => dispatch(registerName(text.trim()))}
        value={fullname}
        placeholder="Full Name*"
      />
      <Text style={styles.error}>
        {fullnameError && `Enter your full name here`}
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => dispatch(registerEmail(text.trim()))}
        value={email}
        placeholder="Email*"
      />
      <Text style={styles.error}>
        {emailError && `Enter a valid email address`}
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => dispatch(registerPassword(text))}
        value={password}
        placeholder="Password*"
      />
      <Text style={styles.error}>
        {passwordError && `Enter a password at least 8 characters long`}
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => dispatch(registerConfirmPassword(text))}
        value={confirmPassword}
        placeholder="Confirm Password*"
      />
      <Text style={styles.error}>
        {confirmPasswordError && `Passwords do not match`}
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => dispatch(registerScholarLink(text.trim()))}
        value={scholar_link}
        placeholder="Google Scholar link, if applicable"
      />
      <Text style={styles.error}>
        {scholar_linkError && `Enter a valid scholar's url`}
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => dispatch(registerInterests(text.trim()))}
        value={interests}
        placeholder="Add your research interests"
      />
      <TouchableOpacity
        style={styles.signupbutton}
        onPress={() => {
          onSubmit();
        }}
      >
        <Text style={styles.signupbuttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}
