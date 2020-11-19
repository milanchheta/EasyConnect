import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
export default function Requests(props) {
  const [requests, setrequests] = useState([]);
  const jwtToken = useSelector((state) => state.login.jwtToken);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/requests", {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      })
      .then((response) => {
        setrequests(response.data);
        console.log(response);
      })
      .catch((err) => {
        console.log("Error fetching data");
      });
  }, []);

  const acceptRequest = (item) => {
    let payload = { jwt_token: jwtToken, accpeted_user: item };
    axios
      .post("http://127.0.0.1:5000/connect", payload, {
        headers: {
          "content-type": "application/json",
        },
      })
      .then((response) => {
        let temp = requests.filter((el) => el.id != item.id);
        setrequests(temp);
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const Item = ({ item, style }) => (
    <View style={[styles.item, style]}>
      <Text style={styles.title}>{item.full_name}</Text>
      <Text style={styles.subtitle}>{item.email}</Text>
      <TouchableOpacity onPress={() => acceptRequest(item)}>
        Accept Request
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => {
    return <Item item={item} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}
