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
import IconM from "react-native-vector-icons/MaterialCommunityIcons";
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
import ButtonOutlined from "../../component/ButtonOutlined";
import AuthenticationService from "../../config/service/AuthenticationService";
import CartService from "../../config/service/CartService";
import { useIsFocused } from "@react-navigation/native";
import ButtonFilled from "../../component/ButtonFilled";

const ProductDetailScreen = ({ navigation, route }) => {
  const [isViewMore, setIsViewMore] = useState(false);
  const [product, setProduct] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [idImage, setIdImage] = useState();
  const [seller, setSeller] = useState();
  const API_URL = new URL(Config.API_URL);
  const { width } = useWindowDimensions();
  const [reviews, setReviews] = useState([]);
  const [isAdd, setIsAdd] = useState(false);
  const [variant, setVariant] = useState([]);
  const [variantId, setVariantId] = useState({
    idColor: "",
    idMemory: "",
  });
  const [quality, setQuality] = useState(1);
  const [childId, setChildId] = useState("");
  const [sameProduct, setSameProduct] = useState([]);
  const isFocused = useIsFocused();

  const getProductDetail = async () => {
    setIsLoading(true);
    const getProduct = await ProductService.getDetailProduct(route.params.id)
      .then((res) => {
        if (!!res.data) {
          return res;
        }
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
      });
    const getSeller = await AccountService.getSellerProfile(
      getProduct.data.seller
    ).then((res) => {
      if (!!res.data) {
        return res;
      }
      setIsLoading(false);
    });
    if (!!getProduct.data.speficication.brand) {
      const getSame = await ProductService.getListProducts(
        `brand=${getProduct.data.speficication.brand}`
      ).then((res) => {
        return res;
      });
      setSameProduct(getSame.results);
    }
    setProduct(getProduct.data);
    setIdImage(getProduct.data.img_products[0].id);
    setSeller(getSeller.data);
    setIsLoading(false);
  };

  const reviewProduct = () => {
    ProductService.getReview(route.params.id).then((res) => {
      if (!!res.data) setReviews(res.data);
    });
  };

  useEffect(() => {
    getProductDetail();
    reviewProduct();
  }, [isFocused, navigation]);

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

  const handleAddColorVariant = (value, id) => {
    setVariantId((old) => {
      return { ...old, idColor: id };
    });
    let arrNew = [...variant];
    if (arrNew.find((item) => item.name == "Màu")) {
      arrNew[arrNew.findIndex((item) => item.name == "Màu")] = {
        name: "Màu",
        value: value,
      };
    } else {
      arrNew.push({
        name: "Màu",
        value: value,
      });
    }
    setVariant(arrNew);
    setChildId(product.product_childs.find((item) => item.id == id));
  };
  const handleAddMemoryVariant = (value, id) => {
    setVariantId((old) => {
      return { ...old, idMemory: id };
    });
    let arrNew = [...variant];
    if (arrNew.find((item) => item.name == "Dung lượng")) {
      arrNew[arrNew.findIndex((item) => item.name == "Dung lượng")] = {
        name: "Dung lượng",
        value: value,
      };
    } else {
      arrNew.push({
        name: "Dung lượng",
        value: value,
      });
    }
    setVariant(arrNew);
  };

  const handleAddToCart = async () => {
    // console.log(product.id);
    // console.log(quality);
    // console.log(variant);
    if (product.product_variants.length == variant.length) {
      const idUser = await AuthenticationService.getDataUser();
      CartService.postAddToCart({
        user: idUser.id,
        product_id: product.id,
        variants: variant,
        quantity: quality,
      }).then((res) => {
        // console.log(res);
        if (res.message == "Add product into cart is success!") {
          Alert.alert(`Thêm vào giỏ hàng thành công`);
          resetAllCart();
          setIsAdd(!isAdd);
        } else {
          Alert.alert(`Thêm vào giỏ hàng thất bại`);
          console.log(res);
        }
      });
    }
  };

  const resetAllCart = () => {
    setQuality(1);
    setVariantId({
      idColor: "",
      idMemory: "",
    });
    setVariant([]);
    setChildId("");
  };

  const handleCheckAddToCart = async () => {
    if (await AuthenticationService.isLogin()) {
      setIsAdd(!isAdd);
    } else {
      Alert.alert(`Bạn chưa đăng nhập`);
    }
  };

  return (
    <View style={styles.container}>
      {isAdd ? (
        <View style={styles.addCartItem}>
          <View style={styles.cartChooseItem}>
            <View style={styles.headerAddCart}>
              {!!childId && (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "70%",
                  }}
                >
                  <Image
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 8,
                      marginRight: 8,
                      overflow: "hidden",
                    }}
                    resizeMode="cover"
                    source={{ uri: childId.thumbnail_url }}
                  ></Image>
                  <View style={{ width: 250 }}>
                    <Text
                      numberOfLines={3}
                      style={AppStyles.FontStyle.subtitle_1}
                    >
                      {childId.name}
                    </Text>
                    <Text
                      style={{
                        color: AppStyles.ColorStyles.color.primary_normal,
                      }}
                    >
                      {!!childId.price
                        ? childId.price
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        : "0"}
                      đ
                    </Text>
                  </View>
                </View>
              )}

              <TouchableOpacity
                onPress={() => {
                  setIsAdd(!isAdd);
                  resetAllCart();
                }}
              >
                <Ionicons
                  name="ios-close-circle-outline"
                  size={34}
                  color={"gray"}
                />
              </TouchableOpacity>
            </View>
            <View style={{ height: 580 }}>
              <ScrollView>
                {product.product_variants.find(
                  (itemColor) => itemColor.name == "Màu"
                ) &&
                product.product_variants.find(
                  (itemColor) => itemColor.name == "Màu"
                ).options.length > 0 ? (
                  <View style={styles.variantItem}>
                    <Text>Màu sắc</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                      }}
                    >
                      {product.product_variants
                        .find((itemColor) => itemColor.name == "Màu")
                        .options.filter(
                          (valueO, index, self) =>
                            index ===
                            self.findIndex((t) => t.value === valueO.value)
                        )
                        .map((item) => (
                          <TouchableOpacity
                            onPress={() => {
                              handleAddColorVariant(
                                item.value,
                                item.product_child
                              );
                            }}
                            style={[
                              styles.itemVariant,
                              {
                                backgroundColor:
                                  variantId.idColor == item.product_child
                                    ? AppStyles.ColorStyles.color.primary_normal
                                    : AppStyles.ColorStyles.color.gray_200,
                              },
                            ]}
                          >
                            <Image
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 4,
                                marginRight: 4,
                              }}
                              resizeMode="cover"
                              source={{
                                uri: `${
                                  product.product_childs.find(
                                    (itemIMG) =>
                                      itemIMG.id == item.product_child
                                  ).thumbnail_url
                                }`,
                              }}
                            ></Image>
                            <Text>{item.value}</Text>
                          </TouchableOpacity>
                        ))}
                    </View>
                  </View>
                ) : null}
                {product.product_variants.find(
                  (itemMemory) => itemMemory.name == "Dung lượng"
                ) &&
                product.product_variants.find(
                  (itemMemory) => itemMemory.name == "Dung lượng"
                ).options.length > 0 ? (
                  <View style={styles.variantItem}>
                    <Text>Dung lượng</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                      }}
                    >
                      {product.product_variants
                        .find((itemMemory) => itemMemory.name == "Dung lượng")
                        .options.filter(
                          (valueO, index, self) =>
                            index ===
                            self.findIndex((t) => t.value === valueO.value)
                        )
                        .map((item) => (
                          <TouchableOpacity
                            onPress={() => {
                              handleAddMemoryVariant(
                                item.value,
                                item.product_child
                              );
                            }}
                            style={[
                              styles.itemVariant,
                              {
                                backgroundColor:
                                  variantId.idMemory == item.product_child
                                    ? AppStyles.ColorStyles.color.primary_normal
                                    : AppStyles.ColorStyles.color.gray_200,
                              },
                            ]}
                          >
                            <Text>{item.value}</Text>
                          </TouchableOpacity>
                        ))}
                    </View>
                  </View>
                ) : null}
                <View style={[styles.variantItem, { paddingBottom: 80 }]}>
                  <Text>Số lượng</Text>
                  <View style={styles.quality}>
                    <TouchableOpacity
                      onPress={() => {
                        if (quality > 1) setQuality(quality - 1);
                        else setQuality(1);
                      }}
                      activeOpacity={quality == 1 ? 1 : 0.7}
                    >
                      <IconM
                        name="minus-circle"
                        size={32}
                        color={
                          quality == 1
                            ? AppStyles.ColorStyles.color.gray_400
                            : AppStyles.ColorStyles.color.primary_normal
                        }
                      />
                    </TouchableOpacity>
                    <Text
                      style={[
                        AppStyles.FontStyle.subtitle_1,
                        { marginHorizontal: 8 },
                      ]}
                    >
                      {quality}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setQuality(quality + 1);
                      }}
                      activeOpacity={0.7}
                    >
                      <IconM
                        name="plus-circle"
                        size={32}
                        color={AppStyles.ColorStyles.color.primary_normal}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
          {product.product_variants.length > 0 && (
            <View style={styles.addCartBtn}>
              <ButtonOutlined
                style={{
                  backgroundColor:
                    product.product_variants.length == variant.length
                      ? AppStyles.ColorStyles.color.primary_normal
                      : "gray",
                }}
                onPress={() => {
                  handleAddToCart();
                }}
              >
                Thêm vào giỏ hàng
              </ButtonOutlined>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.addCartBtn}>
          <ButtonOutlined
            onPress={() => {
              handleCheckAddToCart();
            }}
          >
            Thêm vào giỏ hàng
          </ButtonOutlined>
        </View>
      )}

      {isLoading && <Loading />}
      {!isLoading && !!product ? (
        <View style={{ paddingBottom: 58 }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            activeOpacity={0.4}
            style={styles.btnLeft}
          >
            <Icon name="arrow-alt-circle-left" size={25} color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("CartStack");
            }}
            activeOpacity={0.4}
            style={styles.btnRight}
          >
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
                          AppStyles.FontStyle.subtitle_1,
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
                {sameProduct.length > 0 && (
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={styles.sameProduct}
                  >
                    {sameProduct.map((item) => (
                      <CardProductItem
                        onPress={() => {
                          navigation.replace("ProductDetailScreen", {
                            id: item.id,
                          });
                        }}
                        style={styles.cardItem}
                        title={item.name}
                        a={item.rating_average}
                        originalPrice={item.original_price}
                        price={item.price}
                        url={
                          item.img_products.length > 0
                            ? item.img_products[0].link
                            : ""
                        }
                        discount={item.discount_rate}
                        addToCart={true}
                      />
                    ))}
                  </ScrollView>
                )}
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
                <ButtonFilled
                  onPress={async () => {
                    if (await AuthenticationService.isLogin()) {
                      navigation.navigate("ReviewProductScreen", {
                        idProduct: product.id,
                      });
                    } else {
                      Alert.alert(`Bạn chưa đăng nhập`);
                    }
                  }}
                >
                  Đánh giá
                </ButtonFilled>
                {reviews.map((item) => (
                  <ReviewItem
                    name={item.user.name}
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

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "white",
  },
  addCartItem: {
    position: "absolute",
    flex: 1,
    backgroundColor: "#000000C1",
    width: "100%",
    height: "100%",
    zIndex: 1000,
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    display: "flex",
    justifyContent: "flex-end",
  },
  addCartBtn: {
    position: "absolute",
    zIndex: 999,
    bottom: 8,
    left: 8,
    right: 8,
  },
  quality: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  cartChooseItem: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
    backgroundColor: "white",
    height: 700,
    padding: 8,
  },
  headerAddCart: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 120,
  },
  variantItem: {
    borderTopColor: AppStyles.ColorStyles.color.gray_200,
    borderTopWidth: 1,
    marginTop: 8,
    paddingTop: 8,
  },
  itemVariant: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppStyles.ColorStyles.color.gray_200,
    paddingHorizontal: 12,
    borderRadius: 4,
    paddingVertical: 6,
    marginRight: 8,
    marginVertical: 8,
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
