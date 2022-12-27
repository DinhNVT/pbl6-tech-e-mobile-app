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
import AppStyles from "../../../theme/AppStyles";
import Loading from "../../../component/Loading";
import { useIsFocused } from "@react-navigation/native";
import ProductService from "../../../config/service/ProductService";
import { launchImageLibrary } from "react-native-image-picker";
import Input from "../../../component/Input";
import addImage from "../../../../assets/image/product.png";
import ButtonOutlined from "../../../component/ButtonOutlined";
import Dropdown from "../../../component/Dropdown";

const EditVariantProduct = (props) => {
  const { idUser, product } = props;
  // console.log(idUser, product );

  const [childProduct, setChildProduct] = useState(product.product_childs);
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
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (
      product.product_variants.length > 0 &&
      !!product.product_variants.find((item) => item.name == "Màu") &&
      count == 0
    ) {
      setVariantColorItem(
        product.product_variants.find((item) => item.name == "Màu").options
      );
      setCount(count + 1);
    }
    if (
      product.product_variants.length > 0 &&
      !!product.product_variants.find((item) => item.name == "Dung lượng") &&
      count == 0
    ) {
      setVariantMemoryItem(
        product.product_variants.find((item) => item.name == "Dung lượng")
          .options
      );
      setCount(count + 1);
    }
    var itemDropdownC = [];
    var itemDropdownV = [];
    if (childProduct.length > 0) {
      childProduct.map((item) => {
        if (
          product.product_variants.length > 0 &&
          !!product.product_variants.find((item) => item.name == "Màu") &&
          !!!product.product_variants
            .find((item) => item.name == "Màu")
            .options.find((variant) => variant.product_child == item.id)
        ) {
          itemDropdownC.push({
            id: item.id,
            title: item.name,
          });
        }
        if (
          product.product_variants.length > 0 &&
          !!product.product_variants.find(
            (item) => item.name == "Dung lượng"
          ) &&
          !!!product.product_variants
            .find((item) => item.name == "Dung lượng")
            .options.find((variant) => variant.product_child == item.id)
        ) {
          itemDropdownV.push({
            id: item.id,
            title: item.name,
          });
        }
        if (
          !!!product.product_variants.find((item) => item.name == "Dung lượng")
        ) {
          itemDropdownV.push({
            id: item.id,
            title: item.name,
          });
        }
        if (!!!product.product_variants.find((item) => item.name == "Màu")) {
          itemDropdownC.push({
            id: item.id,
            title: item.name,
          });
        }
      });
      if (itemDropdownColor.length > 0 && childIdColor == null)
        setChildIdColor(itemDropdownC[0].id);
      if (itemDropdownVariant.length > 0 && childIdVariant == null)
        setChildIdVariant(itemDropdownV[0].id);
      if (count == 0) {
        setItemDropdownColor(itemDropdownC);
        setItemDropdownVariant(itemDropdownV);
        setCount(count + 1);
      }
    }
  }, [
    input,
    variantColorItem,
    variantMemoryItem,
    childIdColor,
    childIdVariant,
    status,
  ]);

  const handleDoneAddProduct = async () => {
    const checkColor =
      product.product_variants.length > 0 &&
      !!product.product_variants.find((item) => item.name == "Màu");
    const checkMemory =
      product.product_variants.length > 0 &&
      !!product.product_variants.find((item) => item.name == "Dung lượng");

    if (checkColor) {
      const idVariantColor = product.product_variants.find(
        (item) => item.name == "Màu"
      ).id;
      const arrUpdate = variantColorItem.filter((itemVariant) => {
        return product.product_variants
          .find((item) => item.name == "Màu")
          .options.find(
            (itemO) => itemO.product_child == itemVariant.product_child
          );
      });
      if (arrUpdate.length > 0) {
        await ProductService.putUpdateProductVariant(
          product.product_variants.find((item) => item.name == "Màu").id,
          {
            options: variantColorItem,
            name: "Màu",
            product: product.id,
          }
        ).then((res) => {
          if (res.message == "Update ProductVariants is Success!") {
          }
          // console.log(res, "u");
        });
      }
      const arrAdd = variantColorItem.filter((itemVariant) => {
        return !product.product_variants
          .find((item) => item.name == "Màu")
          .options.find(
            (itemO) => itemO.product_child == itemVariant.product_child
          );
      });
      if (arrAdd.length > 0) {
        await arrAdd.map((item) => {
          ProductService.postAddProductVariantOption({
            value: item.value,
            product_variant: idVariantColor,
            product_child: item.product_child,
          }).then((res) => {
            console.log(res);
          });
        });
      }

      const arrIdDelete = product.product_variants
        .find((item) => item.name == "Màu")
        .options.filter((itemOption) => {
          return !variantColorItem.find(
            (itemCheckVariant) =>
              itemCheckVariant.product_child == itemOption.product_child
          );
        });

      if (arrIdDelete.length > 0) {
        await arrIdDelete.map((item) => {
          ProductService.deleteProductVariantOption(item.id).then((res) => {
            console.log(res);
          });
        });
      }
    }
    if (checkMemory) {
      const idVariantMemory = product.product_variants.find(
        (item) => item.name == "Dung lượng"
      ).id;
      const arrUpdate = variantMemoryItem.filter((itemVariant) => {
        return product.product_variants
          .find((item) => item.name == "Dung lượng")
          .options.find(
            (itemO) => itemO.product_child == itemVariant.product_child
          );
      });
      if (arrUpdate.length > 0) {
        await ProductService.putUpdateProductVariant(
          product.product_variants.find((item) => item.name == "Dung lượng").id,
          {
            options: variantColorItem,
            name: "Dung lượng",
            product: product.id,
          }
        ).then((res) => {
          if (res.message == "Update ProductVariants is Success!") {
          }
        });
      }

      const arrAdd = variantMemoryItem.filter((itemVariant) => {
        return !product.product_variants
          .find((item) => item.name == "Dung lượng")
          .options.find(
            (itemO) => itemO.product_child == itemVariant.product_child
          );
      });
      if (arrAdd.length > 0) {
        await arrAdd.map((item) => {
          ProductService.postAddProductVariantOption({
            value: item.value,
            product_variant: idVariantMemory,
            product_child: item.product_child,
          }).then((res) => {
            console.log(res);
          });
        });
      }

      const arrIdDelete = product.product_variants
        .find((item) => item.name == "Dung lượng")
        .options.filter((itemOption) => {
          return !variantMemoryItem.find(
            (itemCheckVariant) =>
              itemCheckVariant.product_child == itemOption.product_child
          );
        });

      if (arrIdDelete.length > 0) {
        await arrIdDelete.map((item) => {
          ProductService.deleteProductVariantOption(item.id).then((res) => {
            console.log(res);
          });
        });
      }
    }

    if (variantColorItem.length > 0 && !checkColor) {
      await ProductService.postAddProductVariant({
        options: variantColorItem,
        name: "Màu",
        product: product.id,
      }).then((res) => {
        if (res.message == "Create Product Variant is Success!") {
        }
        console.log(res);
      });
    }
    if (variantMemoryItem.length > 0 && !checkMemory) {
      await ProductService.postAddProductVariant({
        options: variantMemoryItem,
        name: "Dung lượng",
        product: product.id,
      }).then((res) => {
        if (res.message == "Create Product Variant is Success!") {
          console.log("ok");
        }
        console.log(res);
      });
    }
    props.onCancel()
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
      var arrId = [...itemDropdownColor];
      arrId = arrId.filter((item) => item.id != childIdColor);
      if (arrId.length > 0) setChildIdColor(arrId[0].id);
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
      var arrId = [...itemDropdownVariant];
      arrId = arrId.filter((item) => item.id != childIdVariant);
      if (arrId.length > 0) setChildIdVariant(arrId[0].id);
    }
  };

  const handleDeleteItem = (id, value, title, status) => {
    if (status == "COLOR") {
      setVariantColorItem((old) => {
        return old.filter(
          (item) => !(item.value == value && item.product_child == id)
        );
      });

      var arrId = [...itemDropdownColor];
      arrId.push({
        id: id,
        title: title,
      });
      setItemDropdownColor(arrId);
      if (arrId.length > 0) setChildIdColor(arrId[0].id);
    } else if (status == "MEMORY") {
      setVariantMemoryItem((old) => {
        return old.filter(
          (item) => !(item.value == value && item.product_child == id)
        );
      });
      var arrId = [...itemDropdownVariant];
      arrId.push({
        id: id,
        title: title,
      });
      setItemDropdownVariant(arrId);
      if (arrId.length > 0) setChildIdVariant(arrId[0].id);
    }
  };

  return (
    <View style={styles.container}>
      {status == "NO" ? (
        <ScrollView>
          <View
            style={[
              styles.editCardNew,
              {
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginBottom: 16,
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.addToCartNew, styles.btnDeleteNew]}
              onPress={props.onCancel}
            >
              <Text
                style={{
                  color: AppStyles.ColorStyles.color.primary_normal,
                }}
              >
                Quay lại
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleDoneAddProduct();
              }}
              activeOpacity={0.7}
              style={[styles.addToCartNew, styles.btnEditNew]}
            >
              <Text style={{ color: "white" }}>Lưu</Text>
            </TouchableOpacity>
          </View>
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
                                childItem.name,
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
                                childItem.name,
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

export default EditVariantProduct;

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
  addToCartNew: {
    backgroundColor: AppStyles.ColorStyles.color.primary_normal,
    marginTop: 8,
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    padding: 8,
  },
  editCardNew: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingHorizontal: 24,
  },
  btnDeleteNew: {
    width: "45%",
    backgroundColor: "white",
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    borderWidth: 1,
  },
  addToCartNew: {
    backgroundColor: AppStyles.ColorStyles.color.primary_normal,
    // marginTop: 8,
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    padding: 8,
    width: "100%",
    marginHorizontal: 0,
    marginBottom: 8,
  },
  btnEditNew: {
    width: "45%",
  },
});
