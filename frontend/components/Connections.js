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
import { ScrollView } from "react-native-gesture-handler";

/**
 * Stylesheet for the connection component.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 20,
    paddingLeft: 10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
    color: "#7A1705",
  },
  subtitle: {
    fontSize: 15,
    color: "#4A3C31",
  },
  nullMessage: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  nullText: { fontSize: 25 },
});

/**
 * Component to render the connections oof each user.
 * @param {props} props Props passed on from the parent component
 */
export default function Connections(props) {
  const jwtToken = useSelector((state) => state.login.jwtToken);

  useEffect(() => {
    if (!jwtToken && jwtToken === undefined && jwtToken === "") {
      props.navigation.push("Login");
    }
  });

  let connections = props.route.params.data;

  /**
   * Function to render a new message room with a connected user.
   * @param {item} item user object to start a new conversation.
   */
  const onMessageRoomClick = (item) => {
    console.log("go to messages");
    /**
     * Http request to fetch a new message room id for each connected user.
     */
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
        props.navigation.navigate("Message Room", {
          message_room_id: message_room_id,
          connection_id: response.data.connection_id,
          full_name: item.full_name,
        });
      })
      .catch((err) => {
        console.log("Error fetching data");
      });
  };

  console.log(connections);

  /**
   * Function to render each single list item.
   * @param {item} item User object that is used for rendering data.
   * @param {style} style Style object to match the user data.
   * @param {onPress} onPress Event handler when a button is pressed.
   */
  const Item = ({ item, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
      <Text style={styles.title}>{item.full_name}</Text>
      <Text style={styles.subtitle}>{item.email}</Text>
    </TouchableOpacity>
  );

  /**
   * Function to render a single item in the list.
   * @param {item} item User object with single user data.
   */
  const renderItem = ({ item }) => {
    return <Item item={item} onPress={() => onMessageRoomClick(item)} />;
  };

  /**
   * Function to render a seperator between list items.
   */
  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: "#C8C8C8",
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {connections.length > 0 ? (
        <FlatList
          data={connections}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={renderSeparator}
        />
      ) : (
        <View style={[styles.nullMessage]}>
          <Text style={styles.nullText}>No active connections!</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
