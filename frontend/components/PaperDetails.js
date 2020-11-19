import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";

const styles = StyleSheet.create({});

export default function PaperDetails(props) {
  let paper = props.route.params.paper;

  let _goToURL = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };
  console.log(props);
  return (
    <View style={styles.container}>
      <Text>Title:</Text>
      <Text>{paper.title}</Text>

      <Text>Abstract:</Text>
      <Text>{paper.abstract}</Text>

      <Text>Cites:</Text>
      <Text>{paper.cites}</Text>

      <Text>Publisher:</Text>
      <Text>{paper.publisher}</Text>

      <Text>Year:</Text>
      <Text>{paper.year}</Text>

      <Text>URL:</Text>
      <Text style={{ color: "blue" }} onPress={() => _goToURL(paper.url)}>
        {paper.url}
      </Text>

      <Text>Eprint URL:</Text>
      <Text style={{ color: "blue" }} onPress={() => _goToURL(paper.eprint)}>
        {paper.eprint}
      </Text>
    </View>
  );
}
