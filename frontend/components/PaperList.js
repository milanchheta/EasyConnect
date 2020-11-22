import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

/**
 * Stylesheet for the paper list component.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    padding: 10,
    flex: 1,
    flexDirection: "row",
  },
  listButton: { height: 70 },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  titleText: {
    fontSize: 20,
    alignSelf: "center",
  },
  pageTitle: {
    fontSize: 30,
    color: "#7A1705",
  },
  subtitle: {
    fontSize: 15,
    color: "#aaa",
  },
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 5,
  },
  titleview: {
    justifyContent: "center",
    flexDirection: "column",
  },
});

/**
 * Paper List component to render the list of all research papers of a particular user.
 * @param {props} props Props passed from parent component.
 */
export default function PaperList(props) {
  let paper = props.route.params.item;
  const jwtToken = useSelector((state) => state.login.jwtToken);

  /**
   * Function to navigate the user to the paper details page for each research paper.
   * @param {paper} paper Research paper object for each user selected paper.
   */
  const onPaperClick = (paper) => {
    props.navigation.navigate("Paper Details", { paper });
  };

  /**
   * Function to render each single list item.
   * @param {item} item User object that is used for rendering data.
   * @param {style} style Style object to match the user data.
   * @param {onPress} onPress Event handler when a button is pressed.
   */
  const Item = ({ item, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={styles.listButton}>
      <View style={styles.item}>
        <Text style={styles.titleText}>
          {item["title"].length > 80
            ? item["title"].substring(0, 80 - 3) + "..."
            : item["title"]}
        </Text>
      </View>
    </TouchableOpacity>
  );

  /**
   * Function invoked before the component is mounted.
   */
  useEffect(() => {
    if (!jwtToken && jwtToken === undefined && jwtToken === "") {
      props.navigation.push("Login");
    }
  });

  /**
   * Function to render a single item in the list.
   * @param {item} item User object with single user data.
   */
  const renderItem = ({ item }) => {
    {
      console.log(item);
    }
    return <Item item={item} onPress={() => onPaperClick(item)} />;
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

  const item = props.route.params.item;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>List of Papers</Text>

      <FlatList
        data={item.papers}
        keyExtractor={(item) => item.title + item.year + item.cites}
        ItemSeparatorComponent={renderSeparator}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}
