import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

import AppStyles from "../theme/AppStyles";

const MenuItem = (props) => {
  return (
    <TouchableOpacity onPress={props.onClick} style={{...styles.menuItem, ...props.style}}>
      <View style={{...styles.iconButton, ...props.style}}>
        {props.children}
      </View>
      <Text style={AppStyles.FontStyle.button}>{props.title}</Text>
    </TouchableOpacity>
  );
};

export default MenuItem;

const styles = StyleSheet.create({
  menuItem: {
    display: "flex",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    borderRadius: 4,
    width: 105,
    padding: 10,
    backgroundColor: "white",
    margin: 8,
    textAlign: "center"
  },
  iconButton: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    padding: 5,
    color: AppStyles.ColorStyles.color.primary_normal,
    width: 35,
    height: 35,
    display: "flex",
    alignItems: "center",
    justifyContent: 'center',
  },
});
