import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
  registerEmail,
  registerName,
  registerPassword,
  registerConfirmPassword,
  registerScholarLink,
  registerInterests,
} from "../Actions/RegisterAction";

const styles = StyleSheet.create({});

export default function Register() {
  const dispatch = useDispatch();
  const email = useSelector((state) => state.register.email);
  const password = useSelector((state) => state.register.password);
  const confirmPassword = useSelector((state) => state.register.confirm_password);
  const fullname = useSelector((state) => state.register.fullname);
  const scholar_link = useSelector((state) => state.register.scholars_link);
  const interests = useSelector((state) => state.register.interests);

  const onSubmit = () => {
    // dispatch({ type: "ON_SUBMIT" });
    console.log(
      fullname,
      email,
      password,
      confirmPassword,
      scholar_link,
      interests
    );
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
            onChangeText={(text) =>
              dispatch(registerName(text))
            }
            value={fullname}
            placeholder="Full Name"
          />
          <TextInput
            // style={styles.textInput}
            onChangeText={(text) =>
              dispatch({ type: "ONCHANGE_EMAIL_REGISTER", data: text })
            }
            value={email}
            placeholder="Email (this will be your username)"
          />
          <TextInput
            // style={styles.textInput}
            onChangeText={(text) =>
              dispatch({ type: "ONCHANGE_PASSWORD_REGISTER", data: text })
            }
            value={password}
            placeholder="Password"
          />
          <TextInput
            // style={styles.textInput}
            onChangeText={(text) =>
              dispatch({
                type: "ONCHANGE_CONFIRM_PASSWORD_REGISTER",
                data: text,
              })
            }
            value={confirmPassword}
            placeholder="Confirm Password"
          />
          <TextInput
            // style={style.textInput}
            onChangeText={(text) =>
              dispatch({ type: "ONCHANGE_SCHOLAR_LINK_REGISTER", data: text })
            }
            value={scholar_link}
            placeholder="Google Scholar link, if applicable."
          />
          <TextInput
            // style={style.multiTextInput}
            onChangeText={(text) =>
              dispatch({ type: "ONCHANGE_INTEREST_REGISTER", data: text })
            }
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
