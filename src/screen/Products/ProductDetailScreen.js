import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  useWindowDimensions,
} from "react-native";
import { React, useEffect, useState, useCallback } from "react";

import Product from "../../../assets/image/product.png";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import AppStyles from "../../theme/AppStyles";
import Star from "../../component/Star";
import CardProductItem from "../../component/CardProductItem";
import ReviewItem from "../../component/ReviewItem";
import ProductService from "../../config/service/ProductService";
import Loading from "../../component/Loading";
import AccountService from "../../config/service/AccountService";
import Config from "react-native-config";
import RenderHtml from "react-native-render-html";

const ProductDetailScreen = ({ navigation, route }) => {
  const [isViewMore, setIsViewMore] = useState(false);
  const [product, setProduct] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [idImage, setIdImage] = useState();
  const [seller, setSeller] = useState();
  const API_URL = new URL(Config.API_URL);
  const { width } = useWindowDimensions();

  const getProductDetail = async () => {
    setIsLoading(true);
    const getProduct = await ProductService.getDetailProduct(route.params.id)
      .then((res) => {
        if (!!res.data) {
          setProduct(res.data);
          setIdImage(res.data.img_products[0].id);
          setIsLoading(false);
          return res;
        }
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
      });
    AccountService.getSellerProfile(getProduct.data.seller).then((res) => {
      if (!!res.data) {
        setSeller(res.data);
      }
      setIsLoading(false);
    });
  };
  useEffect(() => {
    getProductDetail();
  }, []);

  const OpenURLButton = ({ url, children }) => {
    const handlePress = useCallback(async () => {
      // const supported = await Linking.canOpenURL(url);
      // if (supported) {
      await Linking.openURL(url);
      // } else {
      //   Alert.alert(`Don't know how to open this URL: ${url}`);
      // }
    }, [url]);
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={handlePress}>
        <Text
          style={[
            AppStyles.FontStyle.body_1,
            {
              color: AppStyles.ColorStyles.color.primary_dark,
              textDecorationLine: "underline",
            },
          ]}
        >
          {children}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading && <Loading />}
      {!isLoading && !!product ? (
        <View>
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
                source={{
                  uri: product.img_products.find((p) => p.id == idImage).link,
                }}
              ></Image>
            </View>
            <View
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.selectOptionImage}
              >
                {product.img_products.map((item, index) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => {
                        setIdImage(item.id);
                      }}
                    >
                      <Image
                        key={index}
                        style={[
                          styles.imageSub,
                          {
                            marginLeft: 8,
                            borderWidth: idImage == item.id ? 3 : 2,
                            borderColor:
                              idImage == item.id
                                ? AppStyles.ColorStyles.color.gray_800
                                : AppStyles.ColorStyles.color.primary_normal,
                          },
                        ]}
                        resizeMode="cover"
                        source={{ uri: item.link }}
                      ></Image>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
            <View style={styles.content}>
              <Text
                style={[
                  AppStyles.FontStyle.subtitle_1,
                  { color: AppStyles.ColorStyles.color.gray_800 },
                ]}
              >
                {product.name}
              </Text>
              <View style={styles.reviewContainer}>
                <Star a={product.rating_average} style={{ marginRight: 8 }} />
                <Text>{product.review_count} đánh giá</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text
                  style={[
                    AppStyles.FontStyle.headline_6,
                    {
                      color: AppStyles.ColorStyles.color.primary_normal,
                      marginRight: 16,
                    },
                  ]}
                >
                  {product.price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                  đ
                </Text>
                <Text
                  style={[
                    AppStyles.FontStyle.body_1,
                    {
                      color: AppStyles.ColorStyles.color.gray_500,
                      textDecorationLine: "line-through",
                    },
                  ]}
                >
                  {product.original_price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                  đ
                </Text>
              </View>
              {!!seller && (
                <View style={styles.shopInfo}>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity activeOpacity={0.5}>
                      <Image
                        resizeMode="cover"
                        style={styles.avtShop}
                        source={{ uri: `${API_URL}${seller.logo}` }}
                      ></Image>
                    </TouchableOpacity>

                    <View style={styles.shopInfoChild}>
                      <Text
                        style={[
                          AppStyles.FontStyle.headline_6,
                          { color: AppStyles.ColorStyles.color.gray_800 },
                        ]}
                      >
                        {seller.name_store}
                      </Text>
                      {!!seller.facebook && (
                        <OpenURLButton url={seller.facebook}>
                          Facebook
                        </OpenURLButton>
                      )}
                    </View>
                  </View>

                  <TouchableOpacity style={styles.viewShop} activeOpacity={0.5}>
                    <Text
                      style={[
                        AppStyles.FontStyle.button,
                        { color: AppStyles.ColorStyles.color.primary_normal },
                      ]}
                    >
                      Xem shop
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.infoProduct}>
                <Text
                  style={[
                    AppStyles.FontStyle.headline_6,
                    { marginVertical: 8 },
                  ]}
                >
                  Thông tin sản phẩm
                </Text>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ fontWeight: "500", color: "black" }}>
                    Brand:{" "}
                  </Text>
                  <Text>{product.speficication.brand}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ fontWeight: "500", color: "black" }}>
                    Tốc độ CPU:{" "}
                  </Text>
                  <Text>{product.speficication.cpu_speed}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ fontWeight: "500", color: "black" }}>
                    GPU:{" "}
                  </Text>
                  <Text>{product.speficication.gpu}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ fontWeight: "500", color: "black" }}>
                    RAM:{" "}
                  </Text>
                  <Text>{product.speficication.ram}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ fontWeight: "500", color: "black" }}>
                    ROM:{" "}
                  </Text>
                  <Text>{product.speficication.rom}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ fontWeight: "500", color: "black" }}>
                    Kích thước màn hình:{" "}
                  </Text>
                  <Text>{product.speficication.screen_size}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ fontWeight: "500", color: "black" }}>
                    Dung lượng pin:{" "}
                  </Text>
                  <Text>{product.speficication.battery_capacity}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ fontWeight: "500", color: "black" }}>
                    Cân nặng:{" "}
                  </Text>
                  <Text>{product.speficication.weight}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ fontWeight: "500", color: "black" }}>
                    Loại chip:{" "}
                  </Text>
                  <Text>{product.speficication.chip_set}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ fontWeight: "500", color: "black" }}>
                    Chất liệu:{" "}
                  </Text>
                  <Text>{product.speficication.material}</Text>
                </View>
              </View>
              <View>
                <Text
                  style={[
                    AppStyles.FontStyle.headline_6,
                    { marginVertical: 8 },
                  ]}
                >
                  Mô tả sản phẩm
                </Text>
                <Text
                  numberOfLines={isViewMore ? 100 : 15}
                  style={AppStyles.FontStyle.body_2}
                >
                  {product.description}
                </Text>
                {/* <RenderHtml
                  contentWidth={width}
                  source={{ html: `${product.description}` }}
                /> */}
                <TouchableOpacity
                  onPress={() => {
                    setIsViewMore(!isViewMore);
                  }}
                  style={styles.viewMore}
                  activeOpacity={0.5}
                >
                  <Text
                    style={[
                      AppStyles.FontStyle.button,
                      {
                        color: AppStyles.ColorStyles.color.primary_normal,
                        textDecorationLine: "underline",
                      },
                    ]}
                  >
                    {isViewMore ? "Ẩn bớt" : "Xem thêm..."}
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text
                  style={[
                    AppStyles.FontStyle.headline_6,
                    { marginVertical: 8 },
                  ]}
                >
                  Sản phẩm tương tự
                </Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  style={styles.sameProduct}
                >
                  <CardProductItem
                    // onPress={() => {
                    //   props.navigation.navigate("ProductDetailScreen");
                    // }}
                    style={styles.cardItem}
                    title={"title "}
                    a={3.6}
                    originalPrice={3213242}
                    price={4241412}
                    url={
                      "https://image.thanhnien.vn/w1024/Uploaded/2022/yfrph/2022_10_08/b2943e85-fc37-4d71-827b-294393d8466c-769.jpeg"
                    }
                    discount={20}
                  />
                  <CardProductItem
                    // onPress={() => {
                    //   props.navigation.navigate("ProductDetailScreen");
                    // }}
                    style={styles.cardItem}
                    title={"title "}
                    a={3.6}
                    originalPrice={3213242}
                    price={4241412}
                    url={
                      "https://image.thanhnien.vn/w1024/Uploaded/2022/yfrph/2022_10_08/b2943e85-fc37-4d71-827b-294393d8466c-769.jpeg"
                    }
                    discount={20}
                  />
                </ScrollView>
              </View>
              <View>
                <Text
                  style={[
                    AppStyles.FontStyle.headline_6,
                    { marginVertical: 8 },
                  ]}
                >
                  Đánh giá sản phẩm
                </Text>
                <View style={styles.voteContainer}>
                  <Text
                    style={[
                      AppStyles.FontStyle.headline_3,
                      {
                        color: AppStyles.ColorStyles.color.primary_normal,
                        marginRight: 16,
                      },
                    ]}
                  >
                    4.5
                  </Text>
                  <Star a={1}></Star>
                  <Text>34323 đánh giá</Text>
                </View>
                <ReviewItem
                  name={"Nguyen Huu Dinh"}
                  content={"San phẩm ok"}
                  a={4.5}
                ></ReviewItem>
                <ReviewItem
                  name={"Nguyen Huu Dinh"}
                  content={"San phẩm ok"}
                  a={4.5}
                ></ReviewItem>
                <ReviewItem
                  name={"Le Dinh San"}
                  content={"San phẩm ok qua chat luowng"}
                  a={4}
                ></ReviewItem>
              </View>
            </View>
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "white",
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
  reviewContainer: {
    display: "flex",
    flexDirection: "row",
  },
  content: {
    marginHorizontal: 8,
    marginVertical: 8,
    marginBottom: 24,
  },
  priceContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppStyles.ColorStyles.color.primary_light,
    padding: 8,
    borderRadius: 4,
    marginVertical: 8,
  },
  shopInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    marginVertical: 8,
    backgroundColor: AppStyles.ColorStyles.color.secondary_50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 2,
    borderRadius: 4,
  },
  shopInfoChild: {
    marginLeft: 8,
  },
  avtShop: {
    width: 56,
    height: 56,
    borderRadius: 50,
    backgroundColor: "white",
  },
  viewShop: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    padding: 8,
    marginRight: 16,
  },
  cardItem: {
    width: 200,
    marginRight: 8,
  },
  voteContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  infoProduct: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    padding: 8,
  },
});
