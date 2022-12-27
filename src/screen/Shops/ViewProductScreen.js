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

const ViewProductScreen = ({ navigation, route }) => {
  const [isViewMore, setIsViewMore] = useState(false);
  const [product, setProduct] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [idImage, setIdImage] = useState();
  const [reviews, setReviews] = useState([]);
  const [seller, setSeller] = useState();
  const API_URL = new URL(Config.API_URL);
  const { width } = useWindowDimensions();

  const getProductDetail = async () => {
    setIsLoading(true);
    const getProduct = await ProductService.getDetailProduct(route.params.id)
      .then((res) => {
        if (!!res.data) {
          setProduct(res.data);
          if (res.data.img_products.length > 0)
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

  const reviewProduct = () => {
    ProductService.getReview(route.params.id).then((res) => {
      if (!!res.data) setReviews(res.data);
    });
  };

  useEffect(() => {
    getProductDetail();
    reviewProduct();
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
                source={
                  product.img_products.length > 0
                    ? {
                        uri: `${
                          product.img_products.find((p) => p.id == idImage).link
                        }${
                          product.img_products
                            .find((p) => p.id == idImage)
                            .link.toString()
                            .includes("?")
                            ? "&"
                            : "?"
                        }time'${new Date().getTime()}`,
                      }
                    : { uri: "" }
                }
              ></Image>
            </View>
            {product.img_products.length > 0 && (
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
                          source={{
                            uri: `${item.link}${
                              item.link.toString().includes("?") ? "&" : "?"
                            }time'${new Date().getTime()}`,
                          }}
                        ></Image>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

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
                  Các sẩn phẩm nhỏ
                </Text>
                {product.product_childs.map((item) => (
                  <View style={styles.childItem}>
                    <View style={styles.childItemContent}>
                      <Text style={AppStyles.FontStyle.subtitle_1}>
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          AppStyles.FontStyle.headline_6,
                          { color: AppStyles.ColorStyles.color.primary_normal },
                        ]}
                      >
                        {item.price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ".") || ""}
                        đ
                      </Text>
                    </View>
                    <Image
                      resizeMode="cover"
                      style={styles.childItemIMG}
                      source={{
                        uri: `${item.thumbnail_url}${
                          item.thumbnail_url.toString().includes("?")
                            ? "&"
                            : "?"
                        }time'${new Date().getTime()}`,
                      }}
                    ></Image>
                  </View>
                ))}
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
                    {product.rating_average.toFixed(1)}
                  </Text>
                  <Star a={product.rating_average.toFixed(1)}></Star>
                  <Text>{product.review_count} đánh giá</Text>
                </View>
                {reviews.map((item) => (
                  <ReviewItem
                    name={item.user}
                    content={item.comment}
                    a={item.rating}
                    date={`${new Date(
                      item.time_interactive
                    ).toLocaleTimeString()} ${new Date(
                      item.time_interactive
                    ).toLocaleDateString()}`}
                    uri={`${item.link}${
                      item.link.toString().includes("?") ? "&" : "?"
                    }time'${new Date().getTime()}`}
                  ></ReviewItem>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
};

export default ViewProductScreen;

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
  childItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    paddingVertical: 8,
    marginVertical: 8,
  },
  childItemContent: {
    width: "55%",
  },
  childItemIMG: {
    width: 150,
    height: 100,
    borderRadius: 4,
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    borderWidth: 1,
  },
});
