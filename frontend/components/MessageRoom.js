import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 15,
    color: "#aaa",
  },
});
export default function MessageRoom(props) {
  const jwtToken = useSelector((state) => state.login.jwtToken);
  const [chat_messages, setchat_messages] = useState([]);
  let connection_id = props.route.params.connection_data.id;
  let message_room_id = props.route.params.message_room_id;
  console.log(props);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/message?connection_id=" + connection_id, {
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
      <Text>chat here</Text>
    </SafeAreaView>
  );
}
