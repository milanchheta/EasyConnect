const styles = StyleSheet.create({});

import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";

export default function Profile(props) {
  const item = props.route.params.item;
  return (
    <View>
      <Text>{item.researcher}</Text>
    </View>
  );
}
