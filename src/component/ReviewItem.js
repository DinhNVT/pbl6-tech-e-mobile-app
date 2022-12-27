import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import Star from "./Star";
import AppStyles from "../theme/AppStyles";

const ReviewItem = (props) => {
  return (
    <View style={{ ...styles.container, ...props.style }}>
      <Text style={[AppStyles.FontStyle.headline_6]}>{props.name}</Text>
      <Text style={[AppStyles.FontStyle.caption]}>{props.date}</Text>
      <Star style={{ marginBottom: 8 }} a={props.a}></Star>
      <Text>{props.content}</Text>
      <Image
        resizeMode="cover"
        style={styles.image}
        source={{ uri: props.uri }}
      ></Image>
    </View>
  );
};

export default ReviewItem;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "flex-start",
    borderRadius: 8,
    // borderWidth: 1,
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 4,
    backgroundColor: "white",
    marginVertical: 8,
  },
  image: {
    width: "100%",
    height: 300,
    marginVertical: 8,
    backgroundColor: "white",
    borderRadius: 8,
  },
});
