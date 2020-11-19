import React from "react";
import { View, StyleSheet, Text, Image, Linking } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageStyle: {
    width: 200,
    height: 200,
  },
});
export default function Profile(props) {
  const _goToURL = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };
  const item = props.route.params.item;
  return (
    <View>
      <Image source={{ uri: item.url_picture }} style={styles.imageStyle} />
      <Text>{item.researcher}</Text>
      <Text>Affiliation: </Text> <Text>{item.affiliation}</Text>
      <Text>Email: </Text> <Text>{item.email}</Text>
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
    </View>
  );
}
