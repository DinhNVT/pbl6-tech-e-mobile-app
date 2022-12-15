import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AppStyles from "../theme/AppStyles";

const Star = (props) => {
  var a = props.a;
  var RatingStart = [];
  if (a == 0)
    return <FontAwesome name={null} size={15} style={{ marginRight: 4 }} />;
  for (let i = 1; i <= 5; i++) {
    if (a % 1 != 0 && a % 1 != 0.5) {
      if ((a % 1) - 0.5 > 0) {
        a = Math.trunc(a) + 0.5;
      } else {
        a = Math.trunc(a);
      }
    }
    RatingStart.push(
      <FontAwesome
        key={i}
        name={
          i == Math.trunc(a + 1) && a % 1 == 0.5
            ? "star-half-full"
            : i <= a
            ? "star"
            : "star-o"
        }
        size={15}
        color={AppStyles.ColorStyles.color.warning_300}
        style={{ marginRight: 4 }}
      />
    );
  }
  return (
    <View style={{ ...styles.container, ...props.style }}>{RatingStart}</View>
  );
};

export default Star;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
