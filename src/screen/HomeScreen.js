import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  FlatList,
} from "react-native";
import { React, useEffect, useState } from "react";

import InputSearch from "../component/InputSearch";
import background_event from "../../assets/image/backgroud_event.png";
import Logo from "../../assets/icons/Logo.png";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import AppStyles from "../theme/AppStyles";
import MenuItem from "../component/MenuItem";
import Badge from "../component/Badge";
import CardProductItem from "../component/CardProductItem";
import ProductService from "../config/service/ProductService";
import { useIsFocused } from "@react-navigation/native";

const HomeScreen = (props) => {
  const [products, setProducts] = useState();
  const [keyword, setKeyword] = useState("");
  const isFocused = useIsFocused();

  const getListProducts = (params) => {
    ProductService.getListHOTProducts().then((res) => {
      if (!!res) {
        setProducts(res);
      }
    });
  };

  useEffect(() => {
    getListProducts();
  }, []);

  useEffect(() => {
    setKeyword("");
  }, [isFocused, props.navigation]);

  const onSearch = () => {
    if (!!keyword)
      props.navigation.navigate("SearchScreen", {
        keyword: keyword,
      });
  };

  const ItemProduct = ({ item }) => {
    return (
      <CardProductItem
        key={item.id}
        onPress={() => {
          props.navigation.navigate("ProductDetailScreen", {
            id: item.id,
          });
        }}
        title={item.name}
        a={item.rating_average}
        originalPrice={item.original_price}
        price={item.price}
        url={item.img_products.length > 0 ? `${item.img_products[0].link}` : ""}
        discount={item.discount_rate}
        addToCart={true}
        quantitySold={item.quantity_sold}
      />
    );
  };

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
          <InputSearch
            value={keyword}
            onChangeText={setKeyword}
            onSearch={onSearch}
          />
          <TouchableOpacity
            style={{ position: "relative" }}
            onPress={() => {
              props.navigation.navigate("CartStack");
            }}
            activeOpacity={0.7}
          >
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
            {/* <Badge></Badge> */}
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <View style={styles.menuView}>
        <View style={styles.menuTop}>
          <MenuItem
            onClick={() => {
              props.navigation.navigate("ListProductScreen", {
                id: 1,
                name: "Điện thoại",
              });
            }}
            title={"Điện thoại"}
          >
            <MIcon
              name="cellphone"
              size={20}
              color={AppStyles.ColorStyles.color.primary_normal}
            />
          </MenuItem>
          <MenuItem
            onClick={() => {
              props.navigation.navigate("ListProductScreen", {
                id: 3,
                name: "Laptop",
              });
            }}
            title={"Laptop"}
          >
            <MIcon
              name="laptop"
              size={20}
              color={AppStyles.ColorStyles.color.primary_normal}
            />
          </MenuItem>
          <MenuItem
            onClick={() => {
              props.navigation.navigate("ListProductScreen", {
                id: 2,
                name: "Ipad",
              });
            }}
            title={"Tablet"}
          >
            <MIcon
              name="tablet-android"
              size={20}
              color={AppStyles.ColorStyles.color.primary_normal}
            />
          </MenuItem>
          <MenuItem title={"Đồng hồ"}>
            <MIcon
              name="watch-variant"
              size={20}
              color={AppStyles.ColorStyles.color.primary_normal}
            />
          </MenuItem>
          <MenuItem title={"Tivi"}>
            <MIcon
              name="television"
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
      {!!products ? (
        <View style={styles.content}>
          <Text style={[AppStyles.FontStyle.headline_6, { marginLeft: 8 }]}>
            Sản phẩm nổi bật
          </Text>
          <FlatList
            data={products.data}
            renderItem={ItemProduct}
            keyExtractor={(item) => item.id}
            key={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
          ></FlatList>
        </View>
      ) : null}
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
    // shadowColor: "#000000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.23,
    // shadowRadius: 2.62,

    // elevation: 4,
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
  content: {
    flex: 1,
    marginVertical: 16,
  },
});
