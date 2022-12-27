import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";

import Icon from "react-native-vector-icons/FontAwesome5";
import AppStyles from "../theme/AppStyles";

const InputSearch = (props) => {
  return (
    <View style={styles.container}>
      <TextInput value={props.value} onChangeText={props.onChangeText} onSubmitEditing={props.onSearch}  style={styles.input}></TextInput>
      <TouchableOpacity activeOpacity={0.5} onPress={props.onSearch}>
        <Icon
          name="search"
          size={20}
          color={AppStyles.ColorStyles.color.gray_400}
        />
      </TouchableOpacity>
    </View>
  );
};

export default InputSearch;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderColor: AppStyles.ColorStyles.color.gray_400,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 8,
    width: '70%'
  },
  input: {
    width: "90%",
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: AppStyles.ColorStyles.color.gray_700,
  },
});
