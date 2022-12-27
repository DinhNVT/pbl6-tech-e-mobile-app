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
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";

const MainShopScreen = (props) => {
  const { dataUser } = props.route.params;
  const [products, setProducts] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const [paramsPage, setParamsPage] = useState(1);

  const getProduct = () => {
    setIsLoading(true);
    ProductService.getProductByIdSeller(dataUser.data.id, paramsPage).then(
      (res) => {
        setProducts(res);
        setIsLoading(false);
      }
    );
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

            <TouchableOpacity
              style={{
                backgroundColor: AppStyles.ColorStyles.color.primary_normal,
                borderRadius: 4,
                padding: 6,
              }}
              onPress={() => {
                props.navigation.navigate("PayOutScreen");
              }}
              activeOpacity={0.7}
            >
              <Text style={{ color: "white" }}>Tài khoản</Text>
            </TouchableOpacity>
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
  }, [isFocused, props.navigation, paramsPage]);

  const handlePaging = (status) => {
    const indexPageNext = products?.next?.indexOf("page");
    const indexPagePre = products?.previous?.indexOf("page");
    if (status == "next" && !!products.next && indexPageNext > 0) {
      setParamsPage(
        products.next.substring(indexPageNext + 5, indexPageNext + 7)
      );
    } else if (status == "pre" && !!products.previous && indexPagePre > 0) {
      setParamsPage(
        products.previous.substring(indexPagePre + 5, indexPagePre + 7)
      );
    } else {
      setParamsPage(1);
    }
  };

  const handleDeleteProduct = (id) => {
    ProductService.deleteProduct(id).then((res) => {
      if (res.message == "Product deleted is success!") {
        getProduct();
      }
    });
  };

  const handleEditProduct = (id) => {
    props.navigation.navigate("MainUpdateProduct", {
      idUser: dataUser.data.id,
      idProduct: id,
    });
  };

  const ItemProduct = ({ item }) => {
    return (
      <CardProductItem
        key={item.id}
        onPress={() => {
          props.navigation.navigate("ViewProductScreen", {
            id: item.id,
          });
        }}
        title={item.name}
        a={item.rating_average}
        originalPrice={item.original_price}
        price={item.price}
        url={item.img_products.length > 0 ? `${item.img_products[0].link}` : ""}
        discount={item.discount_rate}
        addToCart={false}
        quantitySold={item.quantity_sold}
        handleDelete={() => {
          handleDeleteProduct(item.id);
        }}
        handleEdit={() => {
          handleEditProduct(item.id);
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loading />
      ) : !!products && !!products.results && products.results.length > 0 ? (
        <View
          style={[
            styles.content,
            { paddingBottom: !products.previous && !products.next ? 0 : 48 },
          ]}
        >
          <FlatList
            data={products.results}
            renderItem={ItemProduct}
            keyExtractor={(item) => item.id}
            key={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
          ></FlatList>
          {!products.previous && !products.next ? null : (
            <View
              style={{
                marginHorizontal: 8,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  handlePaging("pre");
                }}
                activeOpacity={!products.previous ? 1 : 0.5}
              >
                <MIcon
                  name="chevron-left"
                  size={42}
                  color={
                    !products.previous
                      ? AppStyles.ColorStyles.color.gray_400
                      : AppStyles.ColorStyles.color.primary_normal
                  }
                  style={{ padding: 0, margin: 0 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handlePaging("next");
                }}
                activeOpacity={!products.next ? 1 : 0.5}
              >
                <MIcon
                  name="chevron-right"
                  size={42}
                  color={
                    !products.next
                      ? AppStyles.ColorStyles.color.gray_400
                      : AppStyles.ColorStyles.color.primary_normal
                  }
                  style={{ padding: 0, margin: 0 }}
                />
              </TouchableOpacity>
            </View>
          )}
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
    position: "relative",
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
  content: {
    flex: 1,
  },
});
