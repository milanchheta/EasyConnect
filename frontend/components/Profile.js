import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ScrollView,
  FlatList,
  Modal,
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
    marginTop: 15,
  },
  container: {
    flex: 1,
    marginTop: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    alignSelf: "center",
    marginVertical: 10,
    color: "#7A1705",
  },
  Heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#900",
    marginTop: 10,
  },
  item: {
    fontSize: 18,
    marginBottom: 5,
    padding: 5,
  },
  innercontainer: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 60,
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
    width: 250,
    backgroundColor: "#4A3C31",
    marginVertical: 20,
  },
  urlButton: {
    alignSelf: "center",
    padding: 10,
    borderRadius: 20,
    width: 300,
    backgroundColor: "#900",
    marginVertical: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

/**
 * Component to render the Profile of each researcher based on recommendations.
 * @param {props} props Props passed from the parent component.
 */
export default function Profile(props) {
  let item = props.route.params.item;
  const [connectButton, setconnectButton] = useState(false);
  const [connectid, setconnectid] = useState("");
  const [messageButton, setmessageButton] = useState(false);
  const [requested, setRequested] = useState(false);
  const [received, setReceived] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const jwtToken = useSelector((state) => state.login.jwtToken);

  /**
   * Function invoked before the component is mounted.
   */
  useEffect(() => {
    if (jwtToken && jwtToken != undefined && jwtToken != "") {
      if ("scholars_link" in item) {
        /**
         * Http request to fetch the profile of each reseracher based on google scholar data.
         */
        axios
          .get(
            "http://10.0.2.2:5000/profile?scholars_link=" +
              item["scholars_link"],
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
      }
    } else {
      props.navigation.push("Login");
    }
  }, []);

  /**
   * Function to handle the sending of request to the researcher profile.
   */
  const request = () => {
    let payload = { requesting_user_jwt: jwtToken, id: connectid };
    /**
     * Http request to send the request to a connect to a researcher.
     */
    axios
      .post("http://10.0.2.2:5000/requests", payload, {
        headers: {
          "content-type": "application/json",
        },
      })
      .then((response) => {
        setRequested(true);
        setconnectButton(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * Function to start a message thread with the reseacher.
   * @param {scholar_link} scholars_link Google scholar link of the profile to send a message.
   */
  const sendMessage = (scholars_link) => {
    /**
     * Http request to start a message room between the user and researcher.
     */
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
        console.log("id here", item.researcher);
        props.navigation.navigate("Message Room", {
          message_room_id: message_room_id,
          connection_id: response.data.connection_id,
          full_name: item.researcher,
        });
      })
      .catch((err) => {
        console.log("Error fetching data");
      });
  };

  /**
   * Function to navigate to the research paper url specified in Google scholar.
   * @param {url} url url for the research papaer
   */
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
      <Image source={{ uri: item.url_picture }} style={styles.imageStyle} />
      <Text style={styles.title}>{item.researcher}</Text>

      {(requested || received || messageButton || connectButton) && (
        <TouchableOpacity
          style={styles.connectbutton}
          onPress={() => {
            connectButton
              ? request()
              : messageButton
              ? sendMessage(item.scholars_link)
              : null;
          }}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.Heading}>Affiliation: </Text>
            <Text style={styles.item}>{item.affiliation}</Text>
            <Text style={styles.Heading}>Interests: </Text>
            <Text style={styles.item}>{item.interests.join(", ")}</Text>
            <Text style={styles.Heading}>Email: </Text>
            <Text style={styles.item}>{item.email}</Text>
            <Text style={styles.Heading}>Cited By: </Text>
            <Text style={styles.item}>{item.citedby}</Text>

            <TouchableOpacity
              style={styles.urlButton}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.connectbuttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.innercontainer}>
        <TouchableOpacity
          style={styles.urlButton}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Text style={styles.connectbuttonText}>Basic Information</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.urlButton}
          onPress={() => _goToURL(item.scholars_link)}
        >
          <Text style={styles.connectbuttonText}>Google Scholar Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.urlButton}
          onPress={() => _goToURL(item.iu_link)}
        >
          <Text style={styles.connectbuttonText}>IU Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.urlButton}
          onPress={() => {
            props.navigation.navigate("Paper List", { item });
          }}
        >
          <Text style={styles.connectbuttonText}>List of Papers</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
