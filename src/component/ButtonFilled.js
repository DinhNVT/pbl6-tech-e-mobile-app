import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";

import AppStyles from "../theme/AppStyles";

const ButtonFilled = (props) => {
  return (
    <TouchableHighlight
      activeOpacity={0.9}
      underlayColor= {AppStyles.ColorStyles.color.primary_light_active} 
      onPress={props.onPress}
      style={{ ...styles.container, ...props.style}}
    >
      <View style={{...styles.button, ...props.styles}}>
        <Text style={[AppStyles.FontStyle.BUTTON, styles.buttonText]}>
          {props.children}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: AppStyles.ColorStyles.color.primary_normal,
    fontSize: 18,
    textAlign: "center"
  },
  container: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    borderWidth: 1.5,
    height: 50,
    borderColor: AppStyles.ColorStyles.color.primary_normal,
  },
});

export default ButtonFilled;
