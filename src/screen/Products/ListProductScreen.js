import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { React, useEffect, useState } from "react";

import CardProductItem from "../../component/CardProductItem";
import AppStyles from "../../theme/AppStyles";
import ProductService from "../../config/service/ProductService";
import Loading from "../../component/Loading";
import Dropdown from "../../component/Dropdown";
import InputSearch from "../../component/InputSearch";
import Badge from "../../component/Badge";
import Icon from "react-native-vector-icons/FontAwesome5";

const ListProductScreen = (props) => {
  // console.log(props.route.params);
  const [products, setProducts] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [paramsGetProducts, setParamsGetProducts] = useState("");

  const getListProducts = (params) => {
    setIsLoading(true);
    ProductService.getListProducts(params).then((res) => {
      if (!!res) {
        setProducts(res);
        setIsLoading(false);
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getListProducts(`category=${props.route.params.id}&${paramsGetProducts}`);
  }, [paramsGetProducts]);

  const item = [
    { id: 1, title: "Mặc định" },
    { id: 2, title: "Giá giảm dần" },
    { id: 3, title: "Giá tăng dần" },
  ];

  const handleSortProductByPrice = (chooseId) => {
    if (chooseId == 1) {
      setParamsGetProducts("");
    } else if (chooseId == 2) {
      setParamsGetProducts("ordering=price");
    } else if (chooseId == 3) {
      setParamsGetProducts("ordering=-price");
    }
  };

  const onSearch = () => {
    props.navigation.navigate("SearchScreen");
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
        url={item.img_products[1].link}
        discount={item.discount_rate}
      />
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <Icon
              name="angle-left"
              size={24}
              color={AppStyles.ColorStyles.color.gray_600}
              style={{ padding: 0, margin: 0 }}
            />
          </TouchableOpacity>
        </View>
        <InputSearch onSearch={onSearch} />
        <TouchableOpacity
          style={{ position: "relative" }}
          onPress={() => {}}
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
          <Badge></Badge>
        </TouchableOpacity>
      </View>
      <View style={styles.headerTitle}>
        <Text
          style={[
            AppStyles.FontStyle.subtitle_1,
            { color: AppStyles.ColorStyles.color.gray_800, marginLeft: 8 },
          ]}
        >
          Danh sách {props.route.params.name}
        </Text>
        <Dropdown onChange={handleSortProductByPrice} itemDropdown={item} id ={1}/>
      </View>

      {isLoading ? (
        <Loading />
      ) : (
        <View style={styles.content}>
          <FlatList
            data={products}
            renderItem={ItemProduct}
            keyExtractor={(item) => item.id}
            key={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
          ></FlatList>
        </View>
      )}
    </View>
  );
};

export default ListProductScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    position: "relative",
  },
  content: {
    flex: 1,
  },
  headerTitle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "nowrap",
  },
  backButton: {
    backgroundColor: "white",
    padding: 8,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
});
