import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
});
export default function UserProfile(props) {
  const jwtToken = useSelector((state) => state.login.jwtToken);

  return (
    <SafeAreaView style={styles.container}>
      <Text>profile here</Text>
    </SafeAreaView>
  );
}
