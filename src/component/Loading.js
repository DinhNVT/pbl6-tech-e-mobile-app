import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React from "react";
import AppStyles from "../theme/AppStyles";

const Loading = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={AppStyles.ColorStyles.color.primary_normal}
      />
      <Text style= {styles.text}>Đang tải...</Text>
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    backgroundColor: "white",
    width: 150,
    height: 150,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 999,
    top: 200,
  },
  text: {
    marginTop: 8,
    fontSize: 16,
    color: AppStyles.ColorStyles.color.gray_700
  }
});
