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
import Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const CardProductItem = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} activeOpacity={0.8} style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          resizeMode="cover"
          style={styles.image}
          source={require("../../assets/image/phone.png")}
        ></Image>
        <Text style={[styles.discount, AppStyles.FontStyle.caption]}>
          Giảm 50%
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={AppStyles.FontStyle.body_2}>Iphone 14 pro max 128Gb</Text>
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
            10.000.000đ
          </Text>
          <Text
            style={[
              AppStyles.FontStyle.body_1,
              { color: AppStyles.ColorStyles.color.gray_700 },
            ]}
          >
            9.000.000đ
          </Text>
        </View>
        <View style={styles.rateContainer}>
          <FontAwesome
            name="star"
            size={15}
            color={"yellow"}
            style={{ marginRight: 4 }}
          />
          <FontAwesome
            name="star-half-full"
            size={15}
            color={"yellow"}
            style={{ marginRight: 4 }}
          />
          <FontAwesome
            name="star-o"
            size={15}
            color={"yellow"}
            style={{ marginRight: 4 }}
          />
          <FontAwesome
            name="star-o"
            size={15}
            color={"yellow"}
            style={{ marginRight: 4 }}
          />
          <FontAwesome
            name="star-o"
            size={15}
            color={"yellow"}
            style={{ marginRight: 4 }}
          />
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
    marginVertical: 12
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
    zIndex: 100,
    backgroundColor: AppStyles.ColorStyles.color.secondary_400,
    margin: 4,
    borderRadius: 4,
    padding: 2,
    color: "white",
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
    padding: 8
  },
});
