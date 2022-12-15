import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import AppStyles from "../theme/AppStyles";

const ButtonOutlined = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={props.onPress}
      style={{ ...styles.container, ...props.style }}
    >
      <View {...props} style={{ ...styles.button }}>
        <Text style={[AppStyles.FontStyle.BUTTON, styles.buttonText]}>
          {props.children}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  container: {
    backgroundColor: AppStyles.ColorStyles.color.primary_normal,
    height: 48,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
});

export default ButtonOutlined;
