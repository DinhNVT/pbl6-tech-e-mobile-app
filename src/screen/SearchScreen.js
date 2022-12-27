import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import CardProductItem from "../component/CardProductItem";
import AppStyles from "../theme/AppStyles";
import Logo from "../../assets/icons/Logo.png";
import Icon from "react-native-vector-icons/FontAwesome5";
import InputSearch from "../component/InputSearch";
import Badge from "../component/Badge";
import ProductService from "../config/service/ProductService";
import { useIsFocused } from "@react-navigation/native";

const SearchScreen = (props) => {
  const { keyword } = props.route.params;
  const [keywordNew, setKeywordNew] = useState("");
  const [products, setProducts] = useState();
  const isFocused = useIsFocused();

  const onSearch = () => {
    ProductService.getListProducts(
      `search=${!!keywordNew ? keywordNew : ""}`
    ).then((res) => {
      if (!!res) {
        setProducts(res);
        // console.log(res);
      }
    });
  };

  useEffect(() => {
    if (!!keyword) {
      setKeywordNew(keyword);
    }
    onSearch();
  }, [isFocused, props.navigation]);

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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoView}>
          <Image resizeMode="cover" style={styles.logo} source={Logo}></Image>
        </View>
        <InputSearch
          onSearch={onSearch}
          value={keywordNew}
          onChangeText={setKeywordNew}
        />
        <TouchableOpacity
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
              marginLeft: 8,
            }}
          />
          {/* <Badge></Badge> */}
        </TouchableOpacity>
      </View>
      <Text
        style={[
          AppStyles.FontStyle.headline_6,
          { color: AppStyles.ColorStyles.color.gray_700, marginLeft: 8 },
        ]}
      >
        Kết quả tìm kiếm "{!!keywordNew ? keywordNew : ""}"
      </Text>
      {!!products && products.results.length > 0 ? (
        <View style={styles.content}>
          <FlatList
            data={products.results}
            renderItem={ItemProduct}
            keyExtractor={(item) => item.id}
            key={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
          ></FlatList>
        </View>
      ) : (
        <Text
          style={[
            AppStyles.FontStyle.headline_6,
            { width: "100%", textAlign: "center", marginTop: 32 },
          ]}
        >
          Không tìm thấy sản phẩm
        </Text>
      )}
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    // flexWrap: "wrap",
    // justifyContent: "space-between",
    backgroundColor: "white",
    flex: 1,
    width: "100%",
  },
  content: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "white",
    flexDirection: "row",
  },
  header: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "nowrap",
  },
  logo: {
    width: "100%",
    height: "90%",
  },
  logoView: {
    width: 35,
    height: 24,
    marginRight: 8,
  },
});
