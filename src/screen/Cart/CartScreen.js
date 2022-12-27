import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { React, useState, useEffect } from "react";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AppStyles from "../../theme/AppStyles";
import product from "../../../assets/image/product.png";
import ButtonOutlined from "../../component/ButtonOutlined";
import AuthenticationService from "../../config/service/AuthenticationService";
import CartService from "../../config/service/CartService";
import { useIsFocused } from "@react-navigation/native";

const CartScreen = (props) => {
  const [isLogin, setIsLogin] = useState();
  const [dataCartItem, setDataCartItem] = useState([]);
  const [cartItemId, setCartItemId] = useState([]);
  const isFocused = useIsFocused();

  const checkLogin = async () => {
    setIsLogin(await AuthenticationService.isLogin());
    if (!(await AuthenticationService.isLogin())) {
      props.navigation.navigate("LoginStack", {
        name: "Login",
      });
    }
  };

  const getCartItem = () => {
    CartService.getCartItem().then((res) => {
      setDataCartItem(res.data);
      setCartItemId([]);
    });
  };

  useEffect(() => {
    getCartItem();
  }, [isFocused, props.navigation]);

  useEffect(() => {
    checkLogin();
  }, [isLogin, isFocused]);

  const handleDeleteCartItem = (id) => {
    CartService.deleteCartItem(id).then(async (res) => {
      if (res.message == "Delete product out Cart Item is Success!") {
        getCartItem();
      }
    });
  };

  const toggleCartItemId = (id) => {
    let arrNew = [...cartItemId];
    if (arrNew.findIndex((item) => item == id) != -1) {
      arrNew.splice(
        arrNew.findIndex((item) => item == id),
        1
      );
    } else {
      arrNew.push(id);
    }
    setCartItemId(arrNew);
  };

  const handleUpdateCartItem = async (id, status, quantity, product_child) => {
    const idUser = await AuthenticationService.getDataUser();
    if (quantity > 1 && status == "DOWN") {
      CartService.putUpdateCartItem(id, {
        user: idUser.id,
        product_child: product_child,
        quantity: quantity - 1,
      }).then((res) => {
        if (res.message == "Update product into cart is success!") {
          getCartItem();
        }
      });
    } else if (status == "UP") {
      CartService.putUpdateCartItem(id, {
        user: idUser.id,
        product_child: product_child,
        quantity: quantity + 1,
      }).then((res) => {
        if (res.message == "Update product into cart is success!") {
          getCartItem();
        }
      });
    }
    // console.log(id, status, quantity, product_child);
  };

  const handleAddOrder = async () => {
    // console.log(cartItemId);
    const idUser = await AuthenticationService.getDataUser();
    // console.log(idUser.id);
    if (cartItemId.length > 0) {
      props.navigation.navigate("OrderScreen", {
        dataCartItem: {
          userId: idUser.id,
          cartItemId: cartItemId,
        },
      });
    } else {
      Alert.alert(`Không có sản phẩm nào được chọn`);
    }
  };

  const handleDeleteAllCartItem = () => {
    if (dataCartItem.length > 0) {
      let cartIdAll = [];
      dataCartItem.map((item) => {
        cartIdAll.push(item.id);
      });
      CartService.deleteAllCartItem({
        carts: cartIdAll,
      }).then((res) => {
        if (res.message == "Delete product out Cart Item is Success!") {
          getCartItem();
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      {isLogin ? (
        <ScrollView>
          <View style={styles.headerSelect}>
            <View style={styles.selectAll}>
              <TouchableOpacity
                onPress={() => {
                  if (dataCartItem.length != cartItemId.length) {
                    let arrNew = [...cartItemId];
                    dataCartItem.map((itemO) => {
                      if (!arrNew.find((item) => item == itemO.id)) {
                        arrNew.push(itemO.id);
                      }
                    });
                    setCartItemId(arrNew);
                  } else {
                    setCartItemId([]);
                  }
                }}
              >
                <Icon
                  name={
                    dataCartItem.length == cartItemId.length
                      ? "checkbox-marked"
                      : "checkbox-blank-outline"
                  }
                  size={32}
                  color={AppStyles.ColorStyles.color.primary_normal}
                />
              </TouchableOpacity>
              <Text style={AppStyles.FontStyle.subtitle_1}>Chọn tất cả</Text>
            </View>
            <TouchableOpacity onPress={handleDeleteAllCartItem}>
              <Text style={AppStyles.FontStyle.subtitle_1}>Xóa tất cả</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.itemsContainer}>
            {dataCartItem.length > 0 ? (
              dataCartItem.map((item) => (
                <View style={styles.cartItem}>
                  <View
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        toggleCartItemId(item.id);
                      }}
                    >
                      <Icon
                        name={
                          cartItemId.find((itemN) => itemN == item.id)
                            ? "checkbox-marked"
                            : "checkbox-blank-outline"
                        }
                        size={32}
                        color={AppStyles.ColorStyles.color.primary_normal}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        handleDeleteCartItem(item.id);
                      }}
                    >
                      <Icon
                        name="delete-outline"
                        size={32}
                        color={AppStyles.ColorStyles.color.error_400}
                      />
                    </TouchableOpacity>
                  </View>

                  <Image
                    resizeMode="cover"
                    style={styles.imageProduct}
                    source={{ uri: item.product_child.thumbnail_url }}
                  ></Image>
                  <View style={styles.cartContent}>
                    <Text
                      numberOfLines={3}
                      style={[
                        AppStyles.FontStyle.subtitle_2,
                        { marginBottom: 8 },
                      ]}
                    >
                      {item.product_child.name}
                    </Text>
                    {/* <Text style={AppStyles.FontStyle.body_2}>
                      Dung lượng: 256GB
                    </Text>
                    <Text style={AppStyles.FontStyle.body_2}>Màu: Vàng</Text> */}
                    <Text style={AppStyles.FontStyle.body_2}>Số lượng:</Text>
                    <View style={styles.quality}>
                      <TouchableOpacity
                        activeOpacity={item.quantity > 1 ? 0.4 : 1}
                        onPress={() => {
                          if (item.quantity > 1) {
                            handleUpdateCartItem(
                              item.id,
                              "DOWN",
                              item.quantity,
                              item.product_child.product
                            );
                          }
                        }}
                      >
                        <Icon
                          name="minus-circle"
                          size={32}
                          color={
                            item.quantity > 1
                              ? AppStyles.ColorStyles.color.primary_normal
                              : AppStyles.ColorStyles.color.gray_400
                          }
                        />
                      </TouchableOpacity>
                      <Text
                        style={[
                          AppStyles.FontStyle.subtitle_1,
                          { marginHorizontal: 8 },
                        ]}
                      >
                        {item.quantity}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          handleUpdateCartItem(
                            item.id,
                            "UP",
                            item.quantity,
                            item.product_child.product
                          );
                        }}
                      >
                        <Icon
                          name="plus-circle"
                          size={32}
                          color={AppStyles.ColorStyles.color.primary_normal}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={[
                        AppStyles.FontStyle.headline_6,
                        { color: AppStyles.ColorStyles.color.primary_normal },
                      ]}
                    >
                      Giá:{" "}
                      {!!item.total_price
                        ? item.total_price
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        : "0"}
                      đ
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text>Không có sản phẩm</Text>
            )}
          </View>
          <ButtonOutlined onPress={handleAddOrder}>Thanh toán</ButtonOutlined>
        </ScrollView>
      ) : null}
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 8,
  },
  headerSelect: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: AppStyles.ColorStyles.color.gray_300,
    borderBottomWidth: 1,
  },
  selectAll: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quality: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  itemsContainer: {
    marginVertical: 8,
  },
  cartItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomColor: AppStyles.ColorStyles.color.gray_300,
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginVertical: 8,
  },
  cartContent: {
    width: 270,
  },
  imageProduct: {
    width: 70,
    height: 70,
    borderRadius: 4,
    backgroundColor: "white",
    borderColor: AppStyles.ColorStyles.primary_normal,
    borderWidth: 1,
    overflow: "hidden",
    marginRight: 8,
  },
});
