import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { React, useEffect, useState } from "react";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AppStyles from "../../theme/AppStyles";
import Loading from "../../component/Loading";
import { useIsFocused } from "@react-navigation/native";
import ProductService from "../../config/service/ProductService";
import { launchImageLibrary } from "react-native-image-picker";
import Input from "../../component/Input";
import addImage from "../../../assets/image/add_image.png";
import ButtonOutlined from "../../component/ButtonOutlined";

const AddProductChildScreen = (props) => {
  const { id, userId } = props.route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [showAddScreen, setShowAddScreen] = useState(false);
  const [inputData, setInputData] = useState({
    name: "",
    price: 0,
    thumbnailURL: null,
  });
  const [errorInput, setErrorInput] = useState({
    name: false,
    price: false,
    thumbnailURL: false,
  });
  const [childProducts, setChildProducts] = useState([]);

  useEffect(() => {
    props.navigation.setOptions({
      header: ({ navigation, back }) => {
        return (
          <View style={styles.headerStyle}>
            <View style={styles.headerLeft}>
              <Text
                style={[AppStyles.FontStyle.headline_6, { marginLeft: 20 }]}
              >
                Thêm sản phẩm chi tiết
              </Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.btnCancel}
                activeOpacity={0.7}
                onPress={handleDeleteProduct}
              >
                <Text
                  style={[
                    { color: AppStyles.ColorStyles.color.primary_normal },
                  ]}
                >
                  Hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnNext}
                onPress={() => {
                  if (!!childProducts) {
                    props.navigation.replace("AddProductVariantScreen", {
                      childProducts: childProducts,
                      id: id,
                      userId: userId,
                    });
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={[{ color: "white" }]}>Tiếp</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      },
    });
  }, [props.navigation, inputData, childProducts]);

  const handleDeleteProduct = () => {
    ProductService.deleteProduct(id).then((res) => {
      if (res.message == "Product deleted is success!") {
        props.navigation.goBack();
      }
    });
  };

  const selectFile = () => {
    var options = {
      // selectionLimit: 20,
      title: "Select Image",
      customButtons: [
        {
          name: "customOptionKey",
          title: "Choose file from Custom Option",
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    launchImageLibrary(options, (res) => {
      if (res.didCancel) {
        console.log("User cancelled image picker");
      } else if (res.error) {
        console.log("ImagePicker Error: ", res.error);
      } else if (res.customButton) {
        console.log("User tapped custom button: ", res.customButton);
        alert(res.customButton);
      } else {
        let source = res;
        setInputData({ ...inputData, thumbnailURL: source });
      }
    });
  };

  const handleAddProductIMG = () => {
    var check = false;

    if (!inputData.name || inputData.name.length > 100) {
      check = true;
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, name: true };
      });
    } else {
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, name: false };
      });
    }

    if (!inputData.thumbnailURL) {
      check = true;
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, thumbnailURL: true };
      });
    } else {
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, thumbnailURL: false };
      });
    }

    if (inputData.price == 0 || inputData.price > 10000000000) {
      check = true;
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, price: true };
      });
    } else {
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, price: false };
      });
    }

    if (!check) {
      setIsLoading(true);
      var formData = new FormData();
      formData.append("product_id", id);
      formData.append("name", inputData.name);
      formData.append("price", inputData.price);
      formData.append("iventory_status", true);
      formData.append(`thumbnail_url`, {
        name: inputData.thumbnailURL.assets[0].fileName,
        type: "image/jpg",
        uri: inputData.thumbnailURL.assets[0].uri,
      });
      ProductService.postAddProductChild(formData).then((res) => {
        if (!!res.data) {
          setChildProducts((oldProducts) => [...oldProducts, res.data]);
          setIsLoading(false);
          setShowAddScreen(!showAddScreen);
          setInputData({
            sku: "",
            name: "",
            price: 0,
            thumbnailURL: null,
          });
        } else {
          console.log("error");
          setIsLoading(false);
        }
      });
    }
  };

  const handleDeleteItem = (id) => {
    ProductService.deleteProductChild(id).then((res) => {
      if (res.message == "Delete product child is Success!") {
        setChildProducts((old) => {
          return old.filter((item) => item.id != id);
        });
      }
    });
  };

  return (
    <View style={styles.container}>
      {showAddScreen ? (
        <View style={styles.overlayScreen}>
          <ScrollView>
            {isLoading && <Text>Loading...</Text>}
            <View style={styles.inputView}>
              <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
                Chọn ảnh*
              </Text>
              <TouchableOpacity
                onPress={selectFile}
                style={styles.chooseIMG}
                activeOpacity={0.7}
              >
                <Image
                  resizeMode="cover"
                  style={
                    !!inputData.thumbnailURL ? styles.imageHave : styles.image
                  }
                  source={
                    !!inputData.thumbnailURL
                      ? { uri: inputData.thumbnailURL.assets[0].uri }
                      : addImage
                  }
                ></Image>
              </TouchableOpacity>
              {errorInput.thumbnailURL ? (
                <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
                  *chưa có ảnh
                </Text>
              ) : null}
            </View>
            <View style={styles.inputView}>
              <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
                Tên sản phẩm*
              </Text>
              <Input
                value={inputData.name}
                onChangeText={(e) => {
                  setInputData({ ...inputData, name: e });
                }}
                placeholder="Nhập tên sản phẩm"
                style={styles.inputText}
              />
              {errorInput.name ? (
                <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
                  *phải nhập tên hoặt tên quá dài
                </Text>
              ) : null}
            </View>
            <View style={styles.inputView}>
              <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
                Giá
              </Text>
              <Input
                value={inputData.price}
                onChangeText={(e) => {
                  setInputData({ ...inputData, price: e });
                }}
                placeholder="Nhập giá"
                style={styles.inputText}
                keyboardType="numeric"
              />
              {errorInput.price ? (
                <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
                  *giá không có hoặc quá lớn
                </Text>
              ) : null}
            </View>
            <View style={styles.editCard}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.addToCart, styles.btnDelete]}
                onPress={() => {
                  setShowAddScreen(!showAddScreen);
                }}
              >
                <Text
                  style={{
                    color: AppStyles.ColorStyles.color.primary_normal,
                  }}
                >
                  Hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddProductIMG}
                activeOpacity={0.7}
                style={[styles.addToCart, styles.btnEdit]}
              >
                <Text style={{ color: "white" }}>Thêm</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      ) : (
        <View
          style={{
            width: "100%",
            padding: 8,
          }}
        >
          <ScrollView style={styles.content}>
            {childProducts.map((item, index) => (
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "gray",
                  marginBottom: 16,
                  paddingBottom: 8,
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginVertical: 8,
                }}
              >
                <View>
                  <Text>Sản phẩm: {index + 1}</Text>
                  <Text>Tên sản phẩm: {item.name}</Text>
                  <Text>Giá: {item.price}đ</Text>
                  <TouchableOpacity
                    onPress={() => {
                      handleDeleteItem(item.id);
                    }}
                    activeOpacity={0.7}
                    style={[styles.addToCart]}
                  >
                    <Text style={{ color: "white" }}>Xóa</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    resizeMode="cover"
                    style={styles.imageView}
                    source={{ uri: item.thumbnail_url }}
                  ></Image>
                </View>
              </View>
            ))}
            <ButtonOutlined
              onPress={() => {
                setShowAddScreen(!showAddScreen);
              }}
              style={{ width: "100%" }}
            >
              Thêm
            </ButtonOutlined>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default AddProductChildScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    width: "100%",
  },
  // content: {
  //   flexWrap: "wrap",
  //   flexDirection: "row",
  //   marginTop: 16,
  //   marginHorizontal: 8,
  //   width: "100%",
  // },
  imageView: {
    width: 100,
    height: 100,
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
  label: {
    color: AppStyles.ColorStyles.color.primary_normal,
    textAlign: "left",
    width: "90%",
    marginLeft: 8,
  },
  inputView: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    marginBottom: 16,
  },
  inputText: {
    width: "90%",
    marginHorizontal: 16,
  },
  textError: {
    color: AppStyles.ColorStyles.color.error_400,
    marginTop: 8,
    width: "100%",
    textAlign: "center",
    marginLeft: 8,
    marginBottom: 16,
  },
  overlayScreen: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    marginVertical: 24,
  },
  chooseIMG: {
    width: 150,
    height: 150,
    overflow: "hidden",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "50%",
    height: "50%",
  },
  imageHave: {
    width: "100%",
    height: "100%",
  },
  editCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  btnEdit: {
    width: "45%",
  },
  btnDelete: {
    width: "45%",
    backgroundColor: "white",
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    borderWidth: 1,
  },
  addToCart: {
    backgroundColor: AppStyles.ColorStyles.color.primary_normal,
    marginTop: 8,
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    padding: 8,
  },
});
