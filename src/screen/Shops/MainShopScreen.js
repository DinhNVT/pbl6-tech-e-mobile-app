import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { React, useEffect, useState } from "react";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AppStyles from "../../theme/AppStyles";
import InputSearch from "../../component/InputSearch";
import CardProductItem from "../../component/CardProductItem";
import Loading from "../../component/Loading";
import { useIsFocused } from "@react-navigation/native";
import ProductService from "../../config/service/ProductService";

const MainShopScreen = (props) => {
  const { dataUser } = props.route.params;
  const [products, setProducts] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();

  const getProduct = () => {
    setIsLoading(true);
    ProductService.getProductByIdSeller(dataUser.data.id).then((res) => {
      setProducts(res);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getProduct();
    props.navigation.setOptions({
      header: ({ navigation, back }) => {
        return (
          <View style={styles.headerStyle}>
            {back ? (
              <TouchableOpacity onPress={navigation.goBack} activeOpacity={0.7}>
                <Icon
                  name="arrow-left-thin-circle-outline"
                  size={32}
                  color={"gray"}
                />
              </TouchableOpacity>
            ) : undefined}
            <InputSearch
              onSearch={() => {
                console.log("search");
              }}
            ></InputSearch>
            <TouchableOpacity
              style={styles.addStyle}
              onPress={() => {
                props.navigation.navigate("AddProductScreen", {
                  dataUser: dataUser,
                });
              }}
              activeOpacity={0.7}
            >
              <Icon name="plus" size={32} color={"white"} />
            </TouchableOpacity>
          </View>
        );
      },
    });
  }, [isFocused, props.navigation]);

  const handleDeleteProduct = (id) => {
    ProductService.deleteProduct(id).then((res) => {
      if (res.message == "Product deleted is success!") {
        getProduct()
      }
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
        url={item.img_products.length > 0 ? item.img_products[0].link : ""}
        discount={item.discount_rate}
        addToCart={false}
        quantitySold={item.quantity_sold}
        handleDelete={() => {
          handleDeleteProduct(item.id);
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loading />
      ) : !!products && !!products.results && products.results.length > 0 ? (
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
        <View style={styles.notProduct}>
          <Text
            style={[AppStyles.FontStyle.headline_6, { textAlign: "center" }]}
          >
            Không có sản phẩm
          </Text>
        </View>
      )}
    </View>
  );
};

export default MainShopScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerStyle: {
    height: 50,
    backgroundColor: "white",
    padding: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
  },
  addStyle: {
    backgroundColor: AppStyles.ColorStyles.color.secondary_400,
    borderRadius: 4,
  },
  notProduct: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
  },
});
