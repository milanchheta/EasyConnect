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
import { Icon } from "react-native-elements";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import jwt_decode from "jwt-decode";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "scroll",
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginLeft: "auto",
    marginRight: "auto",
    fontWeight: "700",
    padding: 5,
    borderBottomColor: "#aaa",
    borderBottomWidth: 2,
    width: "100%",
    color: "#fff",
  },
  subtitle: {
    fontSize: 15,
    color: "#aaa",
  },
  titlecontainer: {
    backgroundColor: "#3CB371",
  },
  input: {
    flex: 1,
    borderStartWidth: 2,
    borderEndWidth: 2,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    padding: 5,
    margin: 5,
    fontSize: 15,
    textAlign: "center",
    backgroundColor: "#fff",
    borderColor: "#aaa",
    borderRadius: 10,
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
    // maxWidth: moderateScale(250, 2),
    // paddingHorizontal: moderateScale(7, 2),
    // paddingTop: moderateScale(2, 2),
    // paddingBottom: moderateScale(3, 2),
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 12,
  },
  message: {
    fontSize: 18,
    fontWeight: "900",
  },
  timestamp: {
    fontSize: 12,
  },
});
export default function MessageRoom(props) {
  const scrollRef = useRef();
  const jwtToken = useSelector((state) => state.login.jwtToken);
  const userId = jwt_decode(jwtToken)["user"]["id"];

  const [message, setMessage] = useState("");
  const [chat_messages, setchat_messages] = useState([]);
  const connection_id = props.route.params.connection_id;
  const message_room_id = props.route.params.message_room_id;
  const full_name = props.route.params.full_name;
  let payload = {
    message: message,
    message_room_id: message_room_id,
  };
  const sendMessage = () => {
    if (message.trim() != "") {
      axios
        .post("http://10.0.2.2:5000/message", payload, {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        })
        .then((response) => {
          setchat_messages([...chat_messages, response.data]);
          setMessage("");
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
        setchat_messages(response.data.messages);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titlecontainer}>
        <Text style={styles.title}>{full_name}</Text>
      </View>
      <ScrollView
        ref={scrollRef}
        onContentSizeChange={() => {
          scrollRef.current.scrollToEnd({ animated: true });
        }}
        contentContainerStyle={{}}
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
                      ? { backgroundColor: "#ccc" }
                      : { backgroundColor: "#3393FF" },
                  ]}
                >
                  {/* <Text>{item["sender_id"]}</Text> */}
                  <Text
                    style={[
                      styles.balloon,
                      userId !== item["sender_id"]
                        ? { color: "black" }
                        : { color: "#fff" },
                      styles.message,
                    ]}
                  >
                    {item["message"]}
                  </Text>
                  <Text
                    style={[
                      styles.balloon,
                      userId !== item["sender_id"]
                        ? { color: "#000000" }
                        : { color: "#ddd" },
                      styles.timestamp,
                    ]}
                  >
                    {item["timestamp"]}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.footer}>
        <TextInput
          style={styles.input}
          multiline={true}
          value={message}
          onChangeText={(text) => setMessage(text)}
          placeholder="Enter messge"
        />
        <Icon
          iconStyle={{ color: "#3393FF" }}
          name="send"
          type="material"
          size={40}
          onPress={() => sendMessage()}
        />
        {/* <Button onPress={() => sendMessage()} title="Send"></Button> */}
      </View>
    </SafeAreaView>
  );
}
