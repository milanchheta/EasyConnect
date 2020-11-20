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
export default function Messages(props) {
  const jwtToken = useSelector((state) => state.login.jwtToken);
  const [messages, setmessages] = useState([]);
  useEffect(() => {
    axios
      .get("http://10.0.2.2:5000/message_rooms", {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      })
      .then((response) => {
        console.log(response);
        setmessages(response.data);
      })
      .catch((err) => {
        console.log("Error fetching data");
      });
  }, []);

  const getConnectionList = () => {
    axios
      .get("http://10.0.2.2:5000/connect", {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      })
      .then((response) => {
        let data = response.data;
        props.navigation.navigate("Connections", { data });
      })
      .catch((err) => {
        console.log("Error fetching data");
      });
  };
  const onMessageRoomClick = (item) => {
    console.log("go to messages");
    axios
      .get("http://10.0.2.2:5000/message?connection_id=" + item.id, {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      })
      .then((response) => {
        let message_room_id = response.data.message_room_id;
        console.log(message_room_id);
        props.navigation.navigate("MessageRoom", {
          message_room_id: message_room_id,
          connection_data: item,
        });
      })
      .catch((err) => {
        console.log("Error fetching data");
      });
  };

  const Item = ({ item, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
      <Text style={styles.title}>{item.full_name}</Text>
      <Text style={styles.subtitle}>{item.email}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    return <Item item={item} onPress={() => onMessageRoomClick(item)} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity onPress={() => getConnectionList()}>
        <Text>Send Message to a connection</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
