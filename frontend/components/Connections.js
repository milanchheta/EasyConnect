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
export default function Connections(props) {
  const jwtToken = useSelector((state) => state.login.jwtToken);

  let connections = props.route.params.data;
  const onMessageRoomClick = (item) => {
    console.log("go to messages");
    axios
      .get("http://127.0.0.1:5000/message?connection_id=" + item.id, {
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
  console.log(connections);
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
        data={connections}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}
