import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AppStyles from "../theme/AppStyles";

const Badge = () => {
  return (
    <View style={styles.badge}>
      <Text
        style={[
          AppStyles.FontStyle.caption,
          { color: "white", margin: 0, padding: 0 },
        ]}
      >
        0
      </Text>
    </View>
  );
};

export default Badge;

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    zIndex: 10,
    backgroundColor: AppStyles.ColorStyles.color.primary_normal,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "white",
    width: 23,
    height: 23,
    textAlign: "center",
    top: -5,
    right: -5,
    alignItems: "center",
    justifyContent: "center",
  },
});
