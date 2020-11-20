import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    justifyContent: "center",
    backgroundColor: "#F0FFF0",
    alignItems: "center",
  },
  item: {
    padding: 5,
    flex: 1,
    flexDirection: "row",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  titleText: {
    fontSize: 20,
  },
  pageTitle: {
    fontSize: 30,
    color: "#008000",
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

  const onPaperClick = (paper) => {
    props.navigation.navigate("PaperDetails", { paper });
  };

  const Item = ({ item, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={style}>
      <View style={styles.item}>
        <Text style={styles.titleText}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

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
        keyExtractor={(item) => item.title}
        ItemSeparatorComponent={renderSeparator}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}
