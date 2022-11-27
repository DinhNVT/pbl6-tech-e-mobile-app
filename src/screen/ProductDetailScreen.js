import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { React, useEffect } from "react";

import Product from "../../assets/image/product.png";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import AppStyles from "../theme/AppStyles";

const ProductDetailScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        activeOpacity={0.4}
        style={styles.btnLeft}
      >
        <Icon name="arrow-alt-circle-left" size={25} color={"white"} />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.4} style={styles.btnRight}>
        <Icon name="shopping-cart" size={20} color={"white"} />
      </TouchableOpacity>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image
            resizeMode="cover"
            style={styles.image}
            source={Product}
          ></Image>
        </View>
        <View
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.selectOptionImage}
          >
            <Image
              style={[styles.imageSub, { marginLeft: 8 }]}
              resizeMode="cover"
              source={Product}
            ></Image>
            <Image
              style={styles.imageSub}
              resizeMode="cover"
              source={Product}
            ></Image>
            <Image
              style={styles.imageSub}
              resizeMode="cover"
              source={Product}
            ></Image>
            <Image
              style={styles.imageSub}
              resizeMode="cover"
              source={Product}
            ></Image>
            <Image
              style={styles.imageSub}
              resizeMode="cover"
              source={Product}
            ></Image>
            <Image
              style={styles.imageSub}
              resizeMode="cover"
              source={Product}
            ></Image>
            <Image
              style={styles.imageSub}
              resizeMode="cover"
              source={Product}
            ></Image>
            <Image
              style={styles.imageSub}
              resizeMode="cover"
              source={Product}
            ></Image>
            <Image
              style={styles.imageSub}
              resizeMode="cover"
              source={Product}
            ></Image>
          </ScrollView>
        </View>
        <Text
          style={[
            AppStyles.FontStyle.subtitle_2,
            { color: AppStyles.ColorStyles.color.gray_700, margin: 8 },
          ]}
        >
          MacBook Pro M1 2020 Ram 8GB/ SSD 256GB (Gray) - New 99%
        </Text>
      </ScrollView>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: 'white'
  },
  imageContainer: {
    width: "100%",
  },
  image: {
    width: "100%",
    height: 250,
  },
  btnLeft: {
    position: "absolute",
    zIndex: 100,
    top: 15,
    left: 10,
    backgroundColor: AppStyles.ColorStyles.color.gray_700,
    opacity: 0.8,
    padding: 8,
    borderRadius: 50,
  },
  btnRight: {
    position: "absolute",
    zIndex: 101,
    right: 10,
    top: 15,
    backgroundColor: AppStyles.ColorStyles.color.gray_700,
    opacity: 0.8,
    padding: 8,
    borderRadius: 50,
  },
  selectOptionImage: {
    height: 50,
    marginVertical: 8,
  },
  imageSub: {
    width: 50,
    height: 50,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: AppStyles.ColorStyles.color.primary_normal,
  },
});
