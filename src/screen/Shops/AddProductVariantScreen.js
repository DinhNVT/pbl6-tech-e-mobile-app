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
import addImage from "../../../assets/image/product.png";
import ButtonOutlined from "../../component/ButtonOutlined";
import Dropdown from "../../component/Dropdown";

const AddProductVariantScreen = (props) => {
  const { id, userId, childProducts } = props.route.params;
  // console.log(id, userId, childProducts);

  const [childProduct, setChildProduct] = useState([]);
  const [status, setStatus] = useState("NO");
  const [input, setInput] = useState({
    value: "",
    error: false,
  });
  const [itemDropdownColor, setItemDropdownColor] = useState([]);
  const [itemDropdownVariant, setItemDropdownVariant] = useState([]);
  const [childIdColor, setChildIdColor] = useState(null);
  const [childIdVariant, setChildIdVariant] = useState(null);
  const [variantColorItem, setVariantColorItem] = useState([]);
  const [variantMemoryItem, setVariantMemoryItem] = useState([]);

  const handleDeleteProduct = () => {
    ProductService.deleteProduct(id).then((res) => {
      if (res.message == "Product deleted is success!") {
        props.navigation.goBack();
      }
    });
  };

  useEffect(() => {
    var itemDropdown = [];
    if (childProducts.length > 0) {
      childProducts.map((item) => {
        itemDropdown.push({
          id: item.id,
          title: item.name,
        });
      });
      if (itemDropdownColor.length > 0 && childIdColor == null)
        setChildIdColor(itemDropdown[0].id);
      if (itemDropdownVariant.length > 0 && childIdVariant == null)
        setChildIdVariant(itemDropdown[0].id);
      setChildProduct(childProducts);
      if (variantColorItem.length == 0) setItemDropdownColor(itemDropdown);
      if (variantMemoryItem.length == 0) setItemDropdownVariant(itemDropdown);
    }
    props.navigation.setOptions({
      header: ({ navigation, back }) => {
        return (
          <View style={styles.headerStyle}>
            <View style={styles.headerLeft}>
              <Text
                style={[AppStyles.FontStyle.headline_6, { marginLeft: 20 }]}
              >
                Thêm lựa chọn
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
                onPress={handleDoneAddProduct}
                activeOpacity={0.7}
              >
                <Text style={[{ color: "white" }]}>Xong</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      },
    });
  }, [
    props.navigation,
    input,
    variantColorItem,
    variantMemoryItem,
    childIdColor,
    childIdVariant,
    status,
  ]);

  const handleDoneAddProduct = () => {
    if (variantColorItem.length > 0) {
      ProductService.postAddProductVariant({
        options: variantColorItem,
        name: "Màu",
        product: id,
      }).then((res) => {
        if (res.message == "Create Product Variant is Success!") {
          if ((variantMemoryItem.length = 0)) props.navigation.goBack();
        }
      });
    }
    if (variantMemoryItem.length > 0) {
      ProductService.postAddProductVariant({
        options: variantMemoryItem,
        name: "Dung lượng",
        product: id,
      }).then((res) => {
        if (res.message == "Create Product Variant is Success!") {
          props.navigation.goBack();
        }
      });
    }
  };

  const onChangeDropdown = (chooseId) => {
    if (status == "COLOR") setChildIdColor(chooseId);
    if (status == "MEMORY") setChildIdVariant(chooseId);
  };

  const handleAddItemVariant = () => {
    var check = false;

    if (input.value.length == 0) {
      check = true;
      setInput((prevErrorInput) => {
        return { ...prevErrorInput, error: true };
      });
    } else {
      setInput((prevErrorInput) => {
        return { ...prevErrorInput, error: false };
      });
    }

    if (!check && status == "COLOR" && itemDropdownColor.length > 0) {
      setVariantColorItem((old) => {
        if (!!old.find((item) => item.product_child == childIdColor)) {
          return old;
        }
        return [
          ...old,
          {
            value: input.value,
            product_child: childIdColor,
          },
        ];
      });
      setStatus("NO");
      setInput({
        value: "",
        error: false,
      });
      setItemDropdownColor((old) => {
        return old.filter((item) => item.id != childIdColor);
      });
      setChildIdColor(itemDropdownColor[0].id);
    } else if (!check && status == "MEMORY" && itemDropdownVariant.length > 0) {
      setVariantMemoryItem((old) => {
        if (!!old.find((item) => item.product_child == childIdVariant)) {
          return old;
        }
        return [
          ...old,
          {
            value: input.value,
            product_child: childIdVariant,
          },
        ];
      });
      setStatus("NO");
      setInput({
        value: "",
        error: false,
      });
      setItemDropdownVariant((old) => {
        return old.filter((item) => item.id != childIdVariant);
      });
      setChildIdVariant(itemDropdownVariant[0].id);
    }
  };

  const handleDeleteItem = (id, value, status) => {
    if (status == "COLOR") {
      setVariantColorItem((old) => {
        return old.filter(
          (item) => !(item.value == value && item.product_child == id)
        );
      });
    } else if (status == "MEMORY") {
      setVariantMemoryItem((old) => {
        return old.filter(
          (item) => !(item.value == value && item.product_child == id)
        );
      });
    }
  };

  return (
    <View style={styles.container}>
      {status == "NO" ? (
        <ScrollView>
          <View style={{ width: "100%" }}>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                onPress={() => {
                  setStatus("COLOR");
                }}
                style={styles.btnAdd}
                activeOpacity={0.7}
              >
                <Text style={[AppStyles.FontStyle.button, styles.btnText]}>
                  Thêm màu
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setStatus("MEMORY");
                }}
                style={styles.btnAdd}
                activeOpacity={0.7}
              >
                <Text style={[AppStyles.FontStyle.button, styles.btnText]}>
                  Thêm dung lượng
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.content}>
              <Text style={AppStyles.FontStyle.headline_6}>Màu sắc</Text>
              {childProduct.length > 0
                ? variantColorItem.map((item) => {
                    let childItem = childProduct.find(
                      (itemId) => itemId.id == item.product_child
                    );
                    return (
                      <View style={styles.contentItem}>
                        <View>
                          <Text>{item.value}</Text>
                          <Text>{childItem.name}</Text>
                          <Text>{childItem.price}</Text>
                          <TouchableOpacity
                            onPress={() => {
                              handleDeleteItem(
                                item.product_child,
                                item.value,
                                "COLOR"
                              );
                            }}
                            activeOpacity={0.7}
                            style={[styles.addToCart]}
                          >
                            <Text style={{ color: "white" }}>Xóa</Text>
                          </TouchableOpacity>
                        </View>
                        <View>
                          <Image
                            resizeMode="cover"
                            style={styles.image}
                            source={
                              !!childItem.thumbnail_url
                                ? { uri: childItem.thumbnail_url }
                                : addImage
                            }
                          ></Image>
                        </View>
                      </View>
                    );
                  })
                : null}
            </View>
            <View style={styles.content}>
              <Text style={AppStyles.FontStyle.headline_6}>Dung lượng</Text>
              {childProduct.length > 0
                ? variantMemoryItem.map((item) => {
                    let childItem = childProduct.find(
                      (itemId) => itemId.id == item.product_child
                    );
                    return (
                      <View style={styles.contentItem}>
                        <View>
                          <Text>{item.value}</Text>
                          <Text>{childItem.name}</Text>
                          <Text>{childItem.price}</Text>
                          <TouchableOpacity
                            onPress={() => {
                              handleDeleteItem(
                                item.product_child,
                                item.value,
                                "MEMORY"
                              );
                            }}
                            activeOpacity={0.7}
                            style={[styles.addToCart]}
                          >
                            <Text style={{ color: "white" }}>Xóa</Text>
                          </TouchableOpacity>
                        </View>
                        <View>
                          <Image
                            resizeMode="cover"
                            style={styles.image}
                            source={
                              !!childItem.thumbnail_url
                                ? { uri: childItem.thumbnail_url }
                                : addImage
                            }
                          ></Image>
                        </View>
                      </View>
                    );
                  })
                : null}
            </View>
            <View></View>
          </View>
        </ScrollView>
      ) : (
        <ScrollView>
          <View
            style={{
              alignItems: "center",
              width: "100%",
              marginVertical: 16,
            }}
          >
            <Text
              style={[AppStyles.FontStyle.headline_6, { marginBottom: 16 }]}
            >
              Thêm{" "}
              {status == "COLOR"
                ? "màu sắc"
                : status == "MEMORY"
                ? "dung lượng"
                : ""}
            </Text>
            <View
              style={[styles.inputView, { position: "relative", zIndex: 100 }]}
            >
              <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
                Chọn sản phẩm*
              </Text>
              {status == "COLOR" && itemDropdownColor.length > 0 ? (
                <Dropdown
                  onChange={onChangeDropdown}
                  style={styles.dropdown}
                  itemDropdown={itemDropdownColor}
                  id={itemDropdownColor[0].id}
                />
              ) : status == "MEMORY" && itemDropdownVariant.length > 0 ? (
                <Dropdown
                  onChange={onChangeDropdown}
                  style={styles.dropdown}
                  itemDropdown={itemDropdownVariant}
                  id={itemDropdownVariant[0].id}
                />
              ) : (
                <Text>Hết lựa chọn</Text>
              )}
            </View>
            <View style={[styles.inputView, { zIndex: 1 }]}>
              <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
                Loại*
              </Text>
              <Input
                value={input.value}
                onChangeText={(e) => {
                  setInput({ ...input, value: e });
                }}
                placeholder="Nhập loại"
                style={styles.inputText}
              />
              {input.error ? (
                <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
                  *không được bỏ trống
                </Text>
              ) : null}
            </View>
            <View style={styles.editCard}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.addToCart, styles.btnDelete]}
                onPress={() => {
                  setStatus("NO");
                  setInput({
                    value: "",
                    error: false,
                  });
                  if (itemDropdownColor.length > 0)
                    setChildIdColor(itemDropdownColor[0].id);
                  if (itemDropdownVariant.length > 0)
                    setChildIdVariant(itemDropdownVariant[0].id);
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
                onPress={handleAddItemVariant}
                activeOpacity={0.7}
                style={[styles.addToCart, styles.btnEdit]}
              >
                <Text style={{ color: "white" }}>Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default AddProductVariantScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
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
  btnContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  btnAdd: {
    backgroundColor: AppStyles.ColorStyles.color.primary_normal,
    borderRadius: 4,
    paddingHorizontal: 16,
    width: "45%",
    paddingVertical: 8,
  },
  btnText: {
    textAlign: "center",
    color: "white",
  },
  content: {
    marginVertical: 16,
    width: "100%",
    backgroundColor: "white",
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
  },
  image: {
    width: 100,
    height: 100,
  },
  contentItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "row",
    borderBottomColor: AppStyles.ColorStyles.color.gray_400,
    borderBottomWidth: 2,
    paddingVertical: 8,
  },
  dropdown: {
    width: "90%",
  },
  textError: {
    color: AppStyles.ColorStyles.color.error_400,
    marginTop: 8,
    width: "100%",
    textAlign: "center",
    marginLeft: 8,
    marginBottom: 16,
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
  editCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
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
    width: "100%",
    margin: 8,
  },
  btnEdit: {
    width: "45%",
  },
});
