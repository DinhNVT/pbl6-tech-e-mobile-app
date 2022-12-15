import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import React from "react";

import AppStyles from "../theme/AppStyles";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Star from "./Star";

const CardProductItem = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={0.8}
      style={{...styles.container, ...props.style}}
    >
      <View style={styles.imageContainer}>
        <Image
          resizeMode="cover"
          style={styles.image}
          source={{ uri: props.url }}
        ></Image>
        <Text style={[AppStyles.FontStyle.caption, styles.discount]}>
          Giảm giá {!props.discount ? "0" : props.discount}%
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <Text
          numberOfLines={3}
          style={[AppStyles.FontStyle.body_2, styles.textTitle]}
        >
          {props.title}
        </Text>
        <View style={styles.price}>
          <Text
            style={[
              AppStyles.FontStyle.caption,
              {
                color: AppStyles.ColorStyles.color.gray_500,
                textDecorationLine: "line-through",
              },
            ]}
          >
            {props.originalPrice
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".") || ""}
            đ
          </Text>
          <Text
            style={[
              AppStyles.FontStyle.body_1,
              { color: AppStyles.ColorStyles.color.gray_700 },
            ]}
          >
            {props.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") || ""}
            đ
          </Text>
        </View>
        <View style={styles.rateContainer}>
          <Star a={props.a} />
        </View>
        <TouchableOpacity activeOpacity={0.7} style={styles.addToCart}>
          <FontAwesome name="cart-plus" size={20} color={"white"} style={{}} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default CardProductItem;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    width: "45%",
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "white",
    marginHorizontal: 8,
    marginVertical: 12,
  },
  imageContainer: {
    width: "100%",
    height: 100,
  },
  image: {
    width: "100%",
    height: "100%",
    margin: 0,
    padding: 0,
  },
  discount: {
    position: "absolute",
    zIndex: 11,
    margin: 4,
    borderRadius: 4,
    padding: 2,
    color: "white",
    backgroundColor: "#F294A190",
  },
  contentContainer: {
    width: "100%",
    padding: 6,
  },
  price: {
    marginVertical: 8,
  },
  rateContainer: {
    display: "flex",
    flexDirection: "row",
  },
  addToCart: {
    backgroundColor: AppStyles.ColorStyles.color.primary_normal,
    marginTop: 8,
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    padding: 8,
  },
  textTitle: {
    minHeight: 65,
  },
});
