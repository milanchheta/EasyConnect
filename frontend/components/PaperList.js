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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    justifyContent: "center",
    // backgroundColor: "#F0FFF0",
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

export default function PaperList(props) {
  let paper = props.route.params.item;
  const jwtToken = useSelector((state) => state.login.jwtToken);

  const onPaperClick = (paper) => {
    props.navigation.navigate("Paper Details", { paper });
  };

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
  useEffect(() => {
    if (!jwtToken && jwtToken === undefined && jwtToken === "") {
      props.navigation.push("Login");
    }
  });
  const renderItem = ({ item }) => {
    {
      console.log(item);
    }
    return <Item item={item} onPress={() => onPaperClick(item)} />;
  };
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
