import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { React, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import AppStyles from "../theme/AppStyles";

const Dropdown = (props) => {
  const [onClickDropdown, setOnClickDropdown] = useState(false);
  const [chooseId, setChooseId] = useState(props.itemDropdown[0].id);

  return (
    <View style={{ ...styles.container, ...props.style }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setOnClickDropdown(!onClickDropdown);
        }}
      >
        <View style={styles.content}>
          <Text style={AppStyles.FontStyle.subtitle_2}>
            {props.itemDropdown.find((item) => item.id == chooseId).title}
          </Text>
          <Icon
            name={onClickDropdown ? "angle-up" : "angle-down"}
            size={20}
            color={AppStyles.ColorStyles.color.gray_800}
          />
        </View>
      </TouchableOpacity>
      {onClickDropdown ? (
        <View style={styles.dropdown}>
          {props.itemDropdown.map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                setChooseId(item.id)
                setOnClickDropdown(!onClickDropdown);
                props.onChange(item.id);
              }}
              key={item.id}
              activeOpacity={0.8}
              style={styles.itemDropdown}
            >
              <Text style={AppStyles.FontStyle.subtitle_2}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  container: {
    width: 150,
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    borderWidth: 1,
    borderRadius: 4,
    margin: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    position: "relative",
    zIndex: 1,    
  },
  content: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  dropdown: {
    position: "absolute",
    left: -1,
    top: 29,
    width: 150,
    zIndex: 12,
    padding: 8,
    backgroundColor: "white",
    borderRadius: 4,
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    borderWidth: 1,
    elevation: 4,
  },
  itemDropdown: {
    marginVertical: 4,
  },
});
