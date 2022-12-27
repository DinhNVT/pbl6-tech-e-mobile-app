import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { React, useState, useEffect } from "react";
import { WebView } from "react-native-webview";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AppStyles from "../../theme/AppStyles";
import product from "../../../assets/image/product.png";
import ButtonOutlined from "../../component/ButtonOutlined";
import AuthenticationService from "../../config/service/AuthenticationService";
import CartService from "../../config/service/CartService";

const OrderScreen = (props) => {
  const { dataCartItem } = props.route.params;
  const [orders, setOrders] = useState(null);
  // console.log(dataCartItem);
  const [modalVisible, setModalVisible] = useState(false);
  const [paypalUri, setPaypalUri] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusCheckout, setStatusCheckout] = useState("NONE");

  const createOrders = () => {
    if (dataCartItem.cartItemId.length > 0) {
      CartService.postCreateOrder({
        cart_item_id: dataCartItem.cartItemId,
        user: dataCartItem.userId,
      }).then((res) => {
        if (res.message == "Order is Success!") {
          setOrders(res.data);
        } else {
          console.log(res);
        }
      });
    }
  };

  useEffect(() => {
    createOrders();
  }, []);

  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={handleDeleteOrder}>
          <Text>Hủy</Text>
        </TouchableOpacity>
      ),
    });
  }, [props.navigation, orders]);

  const handleDeleteOrder = async () => {
    if (!!orders) {
      CartService.deleteOrder(orders.id).then((res) => {
        if (res.message == "Delete order is success") {
          props.navigation.goBack();
        }
      });
    }
  };

  const handleDeleteOrderSuccess = async (status) => {
    if (!!orders) {
      await CartService.deleteOrder(orders.id).then((res) => {
        if (res.message == "Delete order is success" && status == "success") {
          setPaypalUri("");
          setStatusCheckout("SUCCESS");
          handleDeleteAllCartItem();
        } else if (
          res.message == "Delete order is success" &&
          status == "failed"
        ) {
          setPaypalUri("");
          setStatusCheckout("FAILED");
        }
      });
    }
  };

  const handleDeleteAllCartItem = async () => {
    if (dataCartItem.cartItemId.length > 0) {
      await CartService.deleteAllCartItem({
        carts: dataCartItem.cartItemId,
      }).then((res) => {
        if (res.message == "Delete product out Cart Item is Success!") {
          // getCartItem();
          console.log("delete all cart ok");
        }
      });
    }
  };

  const handleCheckout = () => {
    setIsLoading(true);
    CartService.postCheckOut({
      order: orders.id,
      number_money: orders.total_price,
      type_payment: "online",
    }).then((res) => {
      if (!!res?.link_payment) {
        setPaypalUri(res.link_payment);
        setModalVisible(!modalVisible);
        setIsLoading(false);
      } else {
        console.log(res);
      }
    });
  };

  const onChangeState = (webState) => {
    if (
      webState.url.includes("http://192.168.1.11:8000/") &&
      webState.url.includes("succeeded")
    ) {
      handleDeleteOrderSuccess("success");
    } else if (
      webState.url.includes("http://192.168.1.11:8000/") &&
      webState.url.includes("failed")
    ) {
      handleDeleteOrderSuccess("failed");
    }
  };

  return (
    <View style={styles.container}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        {!!paypalUri && statusCheckout == "NONE" ? (
          <View style={styles.centeredView}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text>close</Text>
            </TouchableOpacity>
            <WebView
              source={{
                uri: paypalUri,
              }}
              onNavigationStateChange={onChangeState}
              style={{
                flex: 1,
              }}
            />
          </View>
        ) : statusCheckout == "SUCCESS" ? (
          <View
            style={[
              styles.centeredViewStatus,
              { backgroundColor: AppStyles.ColorStyles.color.success_100 },
            ]}
          >
            <Icon
              name={"check-decagram"}
              size={150}
              color={AppStyles.ColorStyles.color.success_400}
            />
            <Text
              style={[
                AppStyles.FontStyle.headline_6,
                { color: AppStyles.ColorStyles.color.success_400 },
              ]}
            >
              Thanh toán thành công!
            </Text>
            <View
              style={{
                width: "90%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                marginVertical: 16,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: AppStyles.ColorStyles.color.primary_normal,
                padding: 8,
              }}
            >
              <Text
                style={[
                  AppStyles.FontStyle.headline_6,
                  { color: AppStyles.ColorStyles.color.primary_normal },
                ]}
              >
                Tổng số tiền:
              </Text>
              <Text
                style={[
                  AppStyles.FontStyle.headline_6,
                  { color: AppStyles.ColorStyles.color.primary_normal },
                ]}
              >
                {!!orders && orders.total_price
                  ? orders.total_price
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  : "0"}
                đ
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                props.navigation.goBack();
              }}
              style={[
                {
                  backgroundColor: AppStyles.ColorStyles.color.primary_normal,
                  borderRadius: 50,
                  paddingHorizontal: 24,
                  paddingVertical: 14,
                },
              ]}
            >
              <Text style={[AppStyles.FontStyle.button, { color: "white" }]}>
                Quay lại giỏ hàng
              </Text>
            </TouchableOpacity>
          </View>
        ) : statusCheckout == "FAILED" ? (
          <View
            style={[
              styles.centeredViewStatus,
              { backgroundColor: AppStyles.ColorStyles.color.error_100 },
            ]}
          >
            <Icon
              name={"alert-decagram"}
              size={150}
              color={AppStyles.ColorStyles.color.error_400}
            />
            <Text
              style={[
                AppStyles.FontStyle.headline_6,
                { color: AppStyles.ColorStyles.color.error_400 },
              ]}
            >
              Thanh toán không thành công!
            </Text>
            <TouchableOpacity
              onPress={() => {
                props.navigation.goBack();
              }}
              style={[
                {
                  backgroundColor: AppStyles.ColorStyles.color.primary_normal,
                  borderRadius: 50,
                  paddingHorizontal: 24,
                  paddingVertical: 14,
                  marginTop: 8,
                },
              ]}
            >
              <Text style={[AppStyles.FontStyle.button, { color: "white" }]}>
                Quay lại giỏ hàng
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </Modal>

      {dataCartItem.cartItemId.length > 0 && !!orders ? (
        <ScrollView>
          <View style={styles.headerSelect}>
            <View style={styles.selectAll}>
              <Text
                style={[AppStyles.FontStyle.subtitle_1, { marginRight: 16 }]}
              >
                Số sản phẩm: {orders.order_count}
              </Text>
              <Text style={AppStyles.FontStyle.subtitle_1}>
                Tổng giá:{" "}
                {!!orders.total_price
                  ? orders.total_price
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  : "0"}
                đ
              </Text>
            </View>
          </View>
          <View style={styles.itemsContainer}>
            {orders.order_details.length > 0 ? (
              orders.order_details.map((item) => (
                <View style={styles.cartItem}>
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
                    <Text style={AppStyles.FontStyle.body_2}>
                      Số lượng: {item.quantity}
                    </Text>
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
          <ButtonOutlined
            onPress={() => {
              handleCheckout();
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              "Thanh toán"
            )}
          </ButtonOutlined>
        </ScrollView>
      ) : null}
    </View>
  );
};

export default OrderScreen;

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
    width: 100,
    height: 100,
    borderRadius: 4,
    backgroundColor: "white",
    borderColor: AppStyles.ColorStyles.primary_normal,
    borderWidth: 1,
    overflow: "hidden",
    marginRight: 8,
  },
  centeredView: {
    backgroundColor: "white",
    flex: 1,
  },
  centeredViewStatus: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
