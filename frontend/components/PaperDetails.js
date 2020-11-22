import React, { useState, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";

/**
 * Stylesheet for the paper details component.
 */
const styles = StyleSheet.create({
  Heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#7A1705",
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "column",
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
    backgroundColor: "#900",
    marginVertical: 10,
  },
});

/**
 * Paper Details component to render the details of the a single research paper.
 * @param {props} props Props passed from the parent component.
 */
export default function PaperDetails(props) {
  let paper = props.route.params.paper;
  const jwtToken = useSelector((state) => state.login.jwtToken);

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

  useEffect(() => {
    if (!jwtToken && jwtToken === undefined && jwtToken === "") {
      props.navigation.push("Login");
    }
  });

  // console.log(props);

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
