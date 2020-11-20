import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ScrollView,
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
    alignSelf: "center",
    borderRadius: 100,
  },
  container: {
    flex: 1,
    backgroundColor: "#F0FFF0",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    alignSelf: "center",
    marginVertical: 10,
    color: "#90EE90",
  },
  Heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#90EE90",
  },
  item: {
    alignSelf: "center",
    fontSize: 15,
  },
  innercontainer: {
    flex: 1,
    // backgroundColor: "#F0FFF0",
    marginHorizontal: 20,
  },
  flexCol: {
    flexDirection: "row",
    marginTop: 10,
  },

  connectbuttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    alignSelf: "center",
  },
  connectbutton: {
    alignSelf: "center",
    padding: 10,
    borderRadius: 20,
    width: 200,
    backgroundColor: "#90EE90",
    marginVertical: 20,
  },
  urlButton: {
    alignSelf: "center",
    padding: 10,
    borderRadius: 20,
    width: 300,
    backgroundColor: "#90EE90",
    marginVertical: 10,
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
  console.log(item);
  useEffect(() => {
    if ("scholars_link" in item) {
      axios
        .get(
          "http://10.0.2.2:5000/profile?scholars_link=" + item["scholars_link"],
          {
            headers: {
              "content-type": "application/json",
              Authorization: "Bearer " + jwtToken,
            },
          }
        )
        .then((response) => {
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
      .post("http://10.0.2.2:5000/requests", payload, {
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
        "http://10.0.2.2:5000/message?connection_id=" +
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
          connection_data: response.data,
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{item.researcher}</Text>

      <Image source={{ uri: item.url_picture }} style={styles.imageStyle} />

      {(requested || received || messageButton || connectButton) && (
        <TouchableOpacity
          style={styles.connectbutton}
          onPress={
            connectButton
              ? () => request()
              : messageButton
              ? sendMessage(item.scholars_link)
              : null
          }
          disabled={requested || received ? true : false}
        >
          <Text style={styles.connectbuttonText}>
            {requested && `Connection request sent`}
            {received && `Received connection request`}
            {messageButton && `Send Message`}
            {connectButton && `Connect`}
          </Text>
        </TouchableOpacity>
      )}

      {/* {received && (
        <TouchableOpacity disabled={true}>
          <Text>Received connection request</Text>
        </TouchableOpacity>
      )} */}

      <ScrollView style={styles.innercontainer}>
        <Text style={styles.Heading}>Affiliation: </Text>
        <Text style={styles.item}>{item.affiliation}</Text>
        <Text style={styles.Heading}>Interests: </Text>
        <Text style={styles.item}>{item.interests.join(", ")}</Text>
        <View style={styles.flexCol}>
          <Text style={styles.Heading}>Email: </Text>
          <Text style={styles.item}>{item.email}</Text>
        </View>
        <View style={styles.flexCol}>
          <Text style={styles.Heading}>Cited By: </Text>
          <Text style={styles.item}>{item.citedby}</Text>
        </View>
        {/* <View style={styles.urlCol}> */}
        {/* <Text
            style={{ color: "blue" }}
            onPress={() => _goToURL(item.iu_link)}
          >
            {item.iu_link}
          </Text>
          <Text
            style={{ color: "blue" }}
            onPress={() => _goToURL(item.scholars_link)}
          >
            {item.scholars_link}
          </Text> */}
        <TouchableOpacity
          style={styles.urlButton}
          onPress={() => _goToURL(item.scholars_link)}
        >
          <Text style={styles.connectbuttonText}>Scholars Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.urlButton}
          onPress={() => _goToURL(item.iu_link)}
        >
          <Text style={styles.connectbuttonText}>IU Profile</Text>
        </TouchableOpacity>
        {/* </View> */}
        <TouchableOpacity
          style={styles.urlButton}
          onPress={() => {
            props.navigation.navigate("PaperList", { item });
          }}
        >
          <Text style={styles.connectbuttonText}>List of Papers</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScrollView>
  );
}
