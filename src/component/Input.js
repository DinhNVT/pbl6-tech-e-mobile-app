import React from "react";
import { TextInput, View, StyleSheet } from "react-native";

import AppStyles from "../theme/AppStyles";

const Input = (props) => {
  return (
    <TextInput
      {...props}
      style={{
        ...styles.input,
        ...AppStyles.FontStyle.subtitle_1,
        ...props.style,
      }}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    borderWidth: 1,
    marginVertical: 8,
    borderRadius: 4,
    color: AppStyles.ColorStyles.color.gray_400,
    paddingHorizontal: 8,
    color: AppStyles.ColorStyles.color.gray_800
  },
});

export default Input;
