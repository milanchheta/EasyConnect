import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  View,
  ScrollView,
  Linking,
} from "react-native";

const styles = StyleSheet.create({
  Heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#90EE90",
  },
  titleHead: {
    fontSize: 25,
    fontWeight: "700",
    justifyContent: "center",
    paddingVertical: 10,
    color: "black",
  },
  container: {
    flex: 1,
    backgroundColor: "#F0FFF0",
    paddingHorizontal: 5,
  },
  item: {
    alignSelf: "center",
    fontSize: 15,
    paddingHorizontal: 10,
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
  urlButton: {
    alignSelf: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 20,
    width: 300,
    backgroundColor: "#90EE90",
    marginVertical: 10,
  },
});

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
    <ScrollView style={styles.container}>
      <Text style={styles.titleHead}>{paper.title}</Text>
      <Text style={styles.Heading}>Abstract:</Text>
      <Text style={styles.item}>{paper.abstract}</Text>
      <View style={styles.flexCol}>
        <Text style={styles.Heading}>Cites:</Text>
        <Text style={styles.item}>{paper.cites}</Text>
      </View>
      {paper.publisher && (
        <View style={styles.flexCol}>
          <Text style={styles.Heading}>Publisher:</Text>
          <Text style={styles.item}>{paper.publisher}</Text>
        </View>
      )}
      <View style={styles.flexCol}>
        <Text style={styles.Heading}>Year:</Text>
        <Text style={styles.item}>{paper.year}</Text>
      </View>

      <TouchableOpacity
        style={styles.urlButton}
        onPress={() => _goToURL(paper.url)}
      >
        <Text style={styles.connectbuttonText}>View Paper</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.urlButton}
        onPress={() => _goToURL(paper.eprint)}
      >
        <Text style={styles.connectbuttonText}>Get PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
