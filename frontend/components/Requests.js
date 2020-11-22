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

/**
 * Stylesheet for the request page.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flex: 1,
    flexDirection: "row",
  },
  title: {
    fontSize: 20,
    color: "#7A1705",
  },
  subtitle: {
    fontSize: 15,
    color: "#4A3C31",
  },
  connectbuttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    alignSelf: "center",
  },
  connectbutton: {
    alignSelf: "center",
    marginLeft: "auto",
    padding: 5,
    borderRadius: 20,
    width: 100,
    backgroundColor: "#900",
  },
  nullMessage: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  nullText: { fontSize: 25, color: "#4A3C31" },
});

/**
 * Request component to handle all the requests the user receives.
 * @param {*} props props passed on from the app component.
 */
export default function Requests(props) {
  const [requests, setrequests] = useState([]);
  const jwtToken = useSelector((state) => state.login.jwtToken);

  /**
   * Function invoked before the component is mounted.
   */
  useEffect(() => {
    if (jwtToken && jwtToken != undefined && jwtToken != "") {
      /**
       * Http get request to fetch all the requests for the user.
       */
      axios
        .get("http://10.0.2.2:5000/requests", {
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
    } else {
      props.navigation.push("Login");
    }
  }, []);

  /**
   * Function to accept a single request.
   * @param {*} item The user object of the accepted request.
   */
  const acceptRequest = (item) => {
    let payload = { jwt_token: jwtToken, accpeted_user: item };
    /**
     * Http request to connect the two users.
     */
    axios
      .post("http://10.0.2.2:5000/connect", payload, {
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

  /**
   * Function to render each single list item.
   * @param {item} item User object that is used for rendering data.
   * @param {style} style Style object to match the user data.
   */
  const Item = ({ item, style }) => (
    <View style={[styles.item, style]}>
      <View>
        <Text style={styles.title}>{item.full_name}</Text>
        <Text style={styles.subtitle}>{item.email}</Text>
      </View>
      <TouchableOpacity
        style={styles.connectbutton}
        onPress={() => acceptRequest(item)}
      >
        <Text style={styles.connectbuttonText}>Accept</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Function to render a single item in the list.
   * @param {item} item User object with single user data.
   */
  const renderItem = ({ item }) => {
    return <Item item={item} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      {requests.length > 0 ? (
        <FlatList
          data={requests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={renderSeparator}
        />
      ) : (
        <View style={[styles.nullMessage]}>
          <Text style={styles.nullText}>No new requests</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
