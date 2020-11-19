import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
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

export default function PaperList(props) {
  let paper = props.route.params.item;

  const onPaperClick = (paper) => {
    props.navigation.navigate("PaperDetails", { paper });
  };

  const Item = ({ item, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    {
      console.log(item);
    }
    return <Item item={item} onPress={() => onPaperClick(item)} />;
  };

  const item = props.route.params.item;
  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={item.papers} renderItem={renderItem} />
    </SafeAreaView>
  );
}
