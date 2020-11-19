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
  imageStyle: {
    width: 200,
    height: 200,
  },
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
});
export default function Profile(props) {
  let item = props.route.params.item;
  const [connectButton, setconnectButton] = useState(false);
  const [connectid, setconnectid] = useState("");
  const [messageButton, setmessageButton] = useState(false);
  const [requested, setRequested] = useState(false);
  const [received, setReceived] = useState(false);

  const jwtToken = useSelector((state) => state.login.jwtToken);

  useEffect(() => {
    if ("scholars_link" in item) {
      axios
        .get(
          "http://127.0.0.1:5000/profile?scholars_link=" +
            item["scholars_link"],
          {
            headers: {
              "content-type": "application/json",
              Authorization: "Bearer " + jwtToken,
            },
          }
        )
        .then((response) => {
          console.log(response);
          if (response.data == "CONNECTED") {
            setmessageButton(true);
          } else if (response.data == "REQUESTED") {
            setRequested(true);
          } else if (response.data == "RECEIVED") {
            setReceived(true);
          } else {
            setconnectButton(true);
            setconnectid(response.data.id);
          }
        })
        .catch((err) => {
          console.log("Error fetching data");
        });
    } else {
      props.navigation.push("Login");
    }
  }, []);

  const request = () => {
    let payload = { requesting_user_jwt: jwtToken, id: connectid };
    axios
      .post("http://127.0.0.1:5000/requests", payload, {
        headers: {
          "content-type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const sendMessage = (scholars_link) => {
    axios
      .get(
        "http://127.0.0.1:5000/message?connection_id=" +
          connectid +
          "&scholars_link=" +
          scholars_link,
        {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        }
      )
      .then((response) => {
        let message_room_id = response.data.message_room_id;
        console.log(message_room_id);
        props.navigation.navigate("MessageRoom", {
          message_room_id: message_room_id,
          connection_id: response.data.connection_id,
        });
      })
      .catch((err) => {
        console.log("Error fetching data");
      });
  };
  let _goToURL = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  return (
    <View>
      <Image source={{ uri: item.url_picture }} style={styles.imageStyle} />
      <Text>{item.researcher}</Text>
      <Text>Affiliation: </Text> <Text>{item.affiliation}</Text>
      <Text>Email: </Text> <Text>{item.email}</Text>
      <Text>Cited By:</Text>
      <Text>{item.citedby}</Text>
      <Text>Indiana University URL: </Text>
      <Text style={{ color: "blue" }} onPress={() => _goToURL(item.iu_link)}>
        {item.iu_link}
      </Text>
      <Text>Google Scolars URL: </Text>
      <Text
        style={{ color: "blue" }}
        onPress={() => _goToURL(item.scholars_link)}
      >
        {item.scholars_link}
      </Text>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("PaperList", { item });
        }}
      >
        <Text>List of Papers</Text>
      </TouchableOpacity>
      {connectButton && (
        <TouchableOpacity onPress={() => request()}>
          <Text>Connect</Text>
        </TouchableOpacity>
      )}
      {messageButton && (
        <TouchableOpacity onPress={() => sendMessage(item.scholars_link)}>
          <Text>Send Message</Text>
        </TouchableOpacity>
      )}
      {requested && (
        <TouchableOpacity disabled={true}>
          <Text>Connection request sent</Text>
        </TouchableOpacity>
      )}
      {received && (
        <TouchableOpacity disabled={true}>
          <Text>Received connection request</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
