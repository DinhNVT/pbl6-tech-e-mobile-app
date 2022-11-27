import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { React, useEffect } from "react";

import InputSearch from "../component/InputSearch";
import background_event from "../../assets/image/backgroud_event.png";
import Logo from "../../assets/icons/Logo.png";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import AppStyles from "../theme/AppStyles";
import MenuItem from "../component/MenuItem";
import ProductService from "../config/service/ProductService";

const HomeScreen = (props) => {
  const getListProducts = () => {
    ProductService.getListProducts().then(res => res)
  }
  useEffect(()=>{
    getListProducts()
  })
  const onSearch = () => {
    props.navigation.navigate('SearchScreen')
  }
  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={background_event}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.header}>
          <View style={styles.logoView}>
            <Image resizeMode="cover" style={styles.logo} source={Logo}></Image>
          </View>
          <InputSearch onSearch={onSearch} />
          <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
            <Icon
              name="shopping-cart"
              size={20}
              color={"white"}
              style={{
                backgroundColor: AppStyles.ColorStyles.color.secondary_400,
                padding: 8,
                borderRadius: 6,
              }}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <View style={styles.menuView}>
        <View style={styles.menuTop}>
          <MenuItem
            onClick={() => {
              props.navigation.navigate("ListProductScreen");
            }}
            title={"Điện thoại"}
          >
            <Icon
              name="mobile-alt"
              size={20}
              color={AppStyles.ColorStyles.color.primary_normal}
            />
          </MenuItem>
          <MenuItem title={"Laptop"}>
            <Icon
              name="laptop"
              size={20}
              color={AppStyles.ColorStyles.color.primary_normal}
            />
          </MenuItem>
          <MenuItem title={"Tablet"}>
            <Icon
              name="tablet-alt"
              size={20}
              color={AppStyles.ColorStyles.color.primary_normal}
            />
          </MenuItem>
          <MenuItem title={"Đồng hồ"}>
            <Ionicons
              name="ios-watch-outline"
              size={20}
              color={AppStyles.ColorStyles.color.primary_normal}
            />
          </MenuItem>
          <MenuItem title={"Tivi"}>
            <Icon
              name="tv"
              size={20}
              color={AppStyles.ColorStyles.color.primary_normal}
            />
          </MenuItem>
          <MenuItem title={"Âm thanh"}>
            <Icon
              name="bullhorn"
              size={20}
              color={AppStyles.ColorStyles.color.primary_normal}
            />
          </MenuItem>
        </View>
        <View style={styles.menuBottom}>
          <TouchableOpacity style={[styles.menuItem, { width: "auto" }]}>
            <Text style={AppStyles.FontStyle.button}>Khác</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
  },
  header: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "nowrap",
  },
  image: {
    width: "100%",
    height: 200,
  },
  logo: {
    width: "100%",
    height: "90%",
  },
  logoView: {
    width: 35,
    height: 24,
    // marginRight: 4
  },
  menuView: {
    display: "flex",
    width: "100%",
    padding: 10,
    backgroundColor: "white",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  menuTop: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
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
    textAlign: "center",
  },
});
