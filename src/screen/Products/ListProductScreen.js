import {
  StyleSheet,
  Text,
  View,
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
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";

const ListProductScreen = (props) => {
  // console.log(props.route.params);
  const [products, setProducts] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [paramsGetProducts, setParamsGetProducts] = useState("");
  const [paramsPage, setParamsPage] = useState(1);
  const [keyword, setKeyword] = useState();

  const getListProducts = (params) => {
    setIsLoading(true);
    ProductService.getListProducts(params).then((res) => {
      if (!!res) {
        setProducts(res);
        setIsLoading(false);
        // console.log(res)
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getListProducts(
      `category=${props.route.params.id}&${paramsGetProducts}&page=${paramsPage}`
    );
  }, [paramsGetProducts, paramsPage]);

  const item = [
    { id: 1, title: "Mặc định" },
    { id: 2, title: "Giá giảm dần" },
    { id: 3, title: "Giá tăng dần" },
  ];

  const handleSortProductByPrice = (chooseId) => {
    if (chooseId == 1) {
      setParamsGetProducts("");
    } else if (chooseId == 2) {
      setParamsGetProducts("ordering=-price");
    } else if (chooseId == 3) {
      setParamsGetProducts("ordering=price");
    }
  };

  const onSearch = () => {
    if (!!keyword)
      props.navigation.navigate("SearchScreen", {
        keyword: keyword,
      });
  };

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
      <View style={styles.headerTitle}>
        <Text
          style={[
            AppStyles.FontStyle.subtitle_1,
            { color: AppStyles.ColorStyles.color.gray_800, marginLeft: 8 },
          ]}
        >
          Danh sách {props.route.params.name}
        </Text>
        <Dropdown
          onChange={handleSortProductByPrice}
          itemDropdown={item}
          id={1}
        />
      </View>

      {isLoading ? (
        <Loading />
      ) : !!products ? (
        <View style={styles.content}>
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
      ) : null}
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
