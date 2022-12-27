import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { React, useState, useEffect } from "react";

import AppStyles from "../../theme/AppStyles";
import ProductService from "../../config/service/ProductService";
import productIMG from "../../../assets/image/product.png";
import { useIsFocused } from "@react-navigation/native";
import ButtonFilled from "../../component/ButtonFilled";
import ButtonOutlined from "../../component/ButtonOutlined";
import EditChildProduct from "./ComponentUpdateProduct/EditChildProduct";
import EditImageProduct from "./ComponentUpdateProduct/EditImageProduct";
import EditInformationProduct from "./ComponentUpdateProduct/EditInformationProduct";
import EditVariantProduct from "./ComponentUpdateProduct/EditVariantProduct";

const MainUpdateProduct = (props) => {
  const { idUser, idProduct } = props.route.params;
  const [product, setProduct] = useState();
  const isFocused = useIsFocused();

  const [options, setOptions] = useState({
    info: false,
    image: false,
    child: false,
    variant: false,
  });

  const getProduct = () => {
    ProductService.getDetailProduct(idProduct).then((res) => {
      if (!!res.data) setProduct(res.data);
    });
  };

  useEffect(() => {
    getProduct();
    props.navigation.setOptions({
      header: ({ navigation, back }) => {
        return (
          <View style={styles.headerStyle}>
            <View style={styles.headerLeft}>
              {back ? (
                <TouchableOpacity
                  onPress={navigation.goBack}
                  activeOpacity={0.7}
                >
                  <Text
                    style={{
                      color: AppStyles.ColorStyles.color.primary_normal,
                    }}
                  >
                    Thoát
                  </Text>
                </TouchableOpacity>
              ) : null}
              <Text
                style={[AppStyles.FontStyle.headline_6, { marginLeft: 20 }]}
              >
                Chỉnh sửa sản phẩm
              </Text>
            </View>
          </View>
        );
      },
    });
  }, [props.navigation, isFocused, options]);

  const handleSetOptionDefault = () => {
    setOptions({
      info: false,
      image: false,
      child: false,
      variant: false,
    });
  };

  return (
    <View style={styles.container}>
      {!options.info && !options.child && !options.image && !options.variant ? (
        <View>
          {!!product && (
            <View style={styles.headerContent}>
              <Text style={AppStyles.FontStyle.subtitle_1}>{product.name}</Text>
              <Text style={AppStyles.FontStyle.subtitle_2}>
                {product.price}đ
              </Text>
              <Image
                key={new Date().getTime()}
                style={styles.headerIMG}
                source={
                  product.img_products.length > 0
                    ? {
                        uri: `${product.img_products[0].link}${
                          product.img_products[0].link.includes("?") ? "&" : "?"
                        }&time'${new Date().getTime()}`,
                        cache: "reload",
                      }
                    : productIMG
                }
                resizeMode="cover"
              ></Image>
            </View>
          )}
          <View style={styles.headerContent}>
            <ButtonOutlined
              onPress={() => {
                setOptions({
                  info: true,
                  image: false,
                  child: false,
                  variant: false,
                });
              }}
              style={{ width: "100%", marginVertical: 8 }}
            >
              Chỉnh sửa thông tin sản phẩm
            </ButtonOutlined>
            <ButtonOutlined
              onPress={() => {
                setOptions({
                  info: false,
                  image: true,
                  child: false,
                  variant: false,
                });
              }}
              style={{ width: "100%", marginVertical: 8 }}
            >
              Chỉnh sửa ảnh sản phẩm
            </ButtonOutlined>
            <ButtonOutlined
              onPress={() => {
                setOptions({
                  info: false,
                  image: false,
                  child: true,
                  variant: false,
                });
              }}
              style={{ width: "100%", marginVertical: 8 }}
            >
              Chỉnh sửa sản phẩm con
            </ButtonOutlined>
            <ButtonOutlined
              onPress={() => {
                setOptions({
                  info: false,
                  image: false,
                  child: false,
                  variant: true,
                });
              }}
              style={{ width: "100%", marginVertical: 8 }}
            >
              Chỉnh sửa lựa chọn sản phẩm
            </ButtonOutlined>
          </View>
        </View>
      ) : null}
      {options.info ? (
        <EditInformationProduct
          idUser={idUser}
          product={product}
          onCancel={handleSetOptionDefault}
        />
      ) : null}
      {options.image ? (
        <EditImageProduct
          idUser={idUser}
          product={product}
          onCancel={handleSetOptionDefault}
        />
      ) : null}
      {options.child ? (
        <EditChildProduct
          idUser={idUser}
          product={product}
          onCancel={handleSetOptionDefault}
        />
      ) : null}
      {options.variant ? (
        <EditVariantProduct
          idUser={idUser}
          product={product}
          onCancel={handleSetOptionDefault}
        />
      ) : null}
    </View>
  );
};

export default MainUpdateProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 8,
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
  headerLeft: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerRight: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  btnCancel: {
    padding: 4,
    paddingHorizontal: 8,
    marginRight: 16,
  },
  btnNext: {
    backgroundColor: AppStyles.ColorStyles.color.primary_normal,
    borderWidth: 1,
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    borderRadius: 4,
    padding: 4,
    paddingHorizontal: 8,
  },
  headerContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  headerIMG: {
    borderRadius: 8,
    height: 250,
    width: "100%",
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    borderWidth: 1,
    marginVertical: 8,
  },
});
