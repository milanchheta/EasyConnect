import React from "react";
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
    </View>
  );
}
