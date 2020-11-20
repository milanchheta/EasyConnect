import React, { useEffect, useState, useRef } from "react";
import { scale, moderateScale } from "react-native-size-matters";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  TextInput,
} from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import jwt_decode from "jwt-decode";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    
    overflow: "scroll",
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 30,
    justifyContent: "space-around",
    marginLeft: "auto",
    marginRight: "auto",
    fontWeight: "800",
    padding: 20,
  },
  subtitle: {
    fontSize: 15,
    color: "#aaa",
  },
  input: {
    borderStartWidth: 2,
    borderEndWidth: 2,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    padding: 10,
    fontSize: 20,
    textAlign: "center",
    backgroundColor: "#fff",
    borderColor: "#aaa",
  },
  button: {
    height: 50,
  },
  leftUser: {
    alignItems: "flex-start",
    margin: 10,
  },
  rightUser: {
    alignItems: "flex-end",
    margin: 10,
  },
  messageContainer: {
    flex: 1,
    flexDirection: "column",
  },
  balloon: {
    maxWidth: moderateScale(250, 2),
    paddingHorizontal: moderateScale(10, 2),
    paddingTop: moderateScale(5, 2),
    paddingBottom: moderateScale(7, 2),
    borderRadius: 20,
  },
  message: {
    fontSize: 20,
    fontWeight: "900",
  },
  timestamp: {
    fontSize: 12,
    color: "#ddd",
  },
});
export default function MessageRoom(props) {
  const scrollRef = useRef();
  const jwtToken = useSelector((state) => state.login.jwtToken);
  const userId = jwt_decode(jwtToken)["user"]["id"];

  const [message, setMessage] = useState("");
  const [chat_messages, setchat_messages] = useState([]);
  let connection_id = props.route.params.connection_data.id;
  let message_room_id = props.route.params.message_room_id;
  // console.log(props);
  let payload = {
    message: message,
    message_room_id: message_room_id,
  };
  const sendMessage = () => {
    console.log(message);
    axios
      .post("http://10.0.2.2:5000/message", payload, {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      })
      .then((response) => {
        console.log(response);
        setchat_messages([...chat_messages, response.data]);
        setMessage("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get("http://10.0.2.2:5000/message?connection_id=" + connection_id, {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      })
      .then((response) => {
        console.log(response.data.messages);
        setchat_messages(response.data.messages);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        {props.route.params.connection_data.full_name}
      </Text>
      <ScrollView
        ref={scrollRef}
        onContentSizeChange={() => {
          scrollRef.current.scrollToEnd({ animated: true });
        }}
      >
        {chat_messages.map((item, key) => {
          return (
            <View style={styles.messageContainer} key={key}>
              <View
                style={[
                  styles.bubble,
                  userId !== item["sender_id"]
                    ? styles.leftUser
                    : styles.rightUser,
                ]}
              >
                <View
                  style={[
                    styles.balloon,
                    userId !== item["sender_id"]
                      ? { backgroundColor: "#aaa" }
                      : { backgroundColor: "#1084ff" },
                  ]}
                >
                  {/* <Text>{item["sender_id"]}</Text> */}
                  <Text style={styles.message}>{item["message"]}</Text>
                  <Text style={styles.timestamp}>{item["timestamp"]}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <TextInput
        style={styles.input}
        multiline={true}
        value={message}
        onChangeText={(text) => setMessage(text)}
        placeholder="Enter messge"
      />
      <Button
        style={styles.button}
        onPress={() => sendMessage()}
        title="Send"
      ></Button>
    </SafeAreaView>
  );
}
