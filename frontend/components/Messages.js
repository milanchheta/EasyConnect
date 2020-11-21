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
import { Icon } from "react-native-elements";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: StatusBar.currentHeight || 0,
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
  addMessage: {
    margin: 15,
    marginLeft: "auto",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    width: 40,
    height: 40,
  },
  add: {
    fontSize: 25,
  },
  nullMessage: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  nullText: { fontSize: 25 },
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
    axios
      .get("http://10.0.2.2:5000/message?connection_id=" + item.id, {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      })
      .then((response) => {
        let message_room_id = response.data.message_room_id;
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

  const Item = ({ item, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
      <Text style={styles.title}>{item.full_name}</Text>
      <Text style={styles.subtitle}>{item.email}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    return <Item item={item} onPress={() => onMessageRoomClick(item)} />;
  };

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
      {messages.length > 0 ? (
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={renderSeparator}
        />
      ) : (
        <View style={[styles.nullMessage]}>
          <Text style={styles.nullText}>No ongoing conversations</Text>
        </View>
      )}
      <View style={styles.addMessage}>
        <Icon
          name="person-add"
          type="material"
          size={40}
          onPress={() => getConnectionList()}
        />
      </View>
    </SafeAreaView>
  );
}
