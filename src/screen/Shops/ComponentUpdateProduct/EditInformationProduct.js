import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from "react-native";
import { React, useEffect, useState } from "react";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AppStyles from "../../../theme/AppStyles";
import Loading from "../../../component/Loading";
import { useIsFocused } from "@react-navigation/native";
import ProductService from "../../../config/service/ProductService";
import Dropdown from "../../../component/Dropdown";
import Input from "../../../component/Input";

const EditInformationProduct = (props) => {
  const { idUser, product } = props;
  const [itemDropdown, setItemDropdown] = useState();
  const [inputData, setInputData] = useState({
    category: product.category,
    name: product.name,
    original_price: product.original_price.toString(),
    discount_rate: product.discount_rate.toString(),
    quantity_sold: product.quantity_sold.toString(),
    shortDescription: product.short_description,
    description: product.description,
    brand: product.speficication.brand,
    cpuSpeed: product.speficication.cpu_speed,
    GPU: product.speficication.gpu,
    RAM: product.speficication.ram,
    ROM: product.speficication.rom,
    screenSize: product.speficication.screen_size,
    pin: product.speficication.battery_capacity,
    weight: product.speficication.weight,
    chip: product.speficication.chip_set,
    material: product.speficication.material,
  });
  const [errorInput, setErrorInput] = useState({
    name: false,
    error: false,
    success: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleGetCategory = async () => {
    let itemDropdown = [];
    const res = await ProductService.getListCategory().then((res) => {
      return res;
    });
    if (!!res.data) {
      res.data.map((item) => {
        itemDropdown.push({
          id: item.id,
          title: item.name,
        });
      });
      setItemDropdown(itemDropdown);
    }
  };

  useEffect(() => {
    handleGetCategory();
  }, [inputData]);

  const onChangeItem = (chooseId) => {
    setInputData({ ...inputData, category: chooseId });
  };

  const handlerUpdateProduct = () => {
    Keyboard.dismiss();
    setErrorInput((prevErrorInput) => {
      return { ...prevErrorInput, error: false, success: false };
    });
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
    if (!check) {
      setIsLoading(true);
      ProductService.putUpdateProduct(product.id, {
        seller: idUser,
        category: inputData.category,
        name: inputData.name,
        short_description: inputData.shortDescription,
        description: inputData.description,
        original_price: inputData.original_price,
        discount_rate: inputData.discount_rate,
        quantity_sold: inputData.quantity_sold,
        speficication: {
          brand: inputData.brand,
          cpu_speed: inputData.cpuSpeed,
          gpu: inputData.GPU,
          ram: inputData.RAM,
          rom: inputData.ROM,
          screen_size: inputData.screenSize,
          battery_capacity: inputData.pin,
          weight: inputData.weight,
          chip_set: inputData.chip,
          material: inputData.material,
        },
      }).then((res) => {
        if (res.message == "Product updated is sucess!") {
          setIsLoading(false);
          setErrorInput((prevErrorInput) => {
            return { ...prevErrorInput, error: false, success: true };
          });
        } else {
          console.log("Error");
          console.log(res)
          setIsLoading(false);
          setErrorInput((prevErrorInput) => {
            return { ...prevErrorInput, error: true, success: false };
          });
        }
      });
    } else {
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, error: false, success: false };
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ alignItems: "center", width: "100%", marginVertical: 24 }}>
        <View style={styles.editCard}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.addToCart, styles.btnDelete]}
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
            onPress={handlerUpdateProduct}
            activeOpacity={0.7}
            style={[styles.addToCart, styles.btnEdit]}
          >
            <Text style={{ color: "white" }}>Lưu</Text>
          </TouchableOpacity>
        </View>
        {isLoading && <Loading />}
        {errorInput.success ? (
          <Text style={[AppStyles.FontStyle.subtitle_1, styles.textSuccess]}>
            Sửa thành công
          </Text>
        ) : errorInput.error ? (
          <Text style={[AppStyles.FontStyle.subtitle_1, styles.textError]}>
            Sửa không thành công
          </Text>
        ) : null}
        <Text style={[AppStyles.FontStyle.headline_6, { marginBottom: 16 }]}>
          Thông tin cơ bản
        </Text>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Chọn loại sản phẩm
          </Text>
          {!!itemDropdown && (
            <Dropdown
              onChange={onChangeItem}
              itemDropdown={itemDropdown}
              id={product.category}
              style={styles.dropdown}
            ></Dropdown>
          )}
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
            Giá gốc*
          </Text>
          <Input
            value={inputData.original_price}
            onChangeText={(e) => {
              setInputData({ ...inputData, original_price: e });
            }}
            placeholder="Nhập giá gốc"
            style={styles.inputText}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Giảm giá*
          </Text>
          <Input
            value={inputData.discount_rate}
            onChangeText={(e) => {
              setInputData({ ...inputData, discount_rate: e });
            }}
            placeholder="Nhập số giảm giá"
            style={styles.inputText}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Số lượng*
          </Text>
          <Input
            value={inputData.quantity_sold}
            onChangeText={(e) => {
              setInputData({ ...inputData, quantity_sold: e });
            }}
            placeholder="Nhập số lượng"
            style={styles.inputText}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Mô tả ngắn
          </Text>
          <Input
            value={inputData.shortDescription}
            onChangeText={(e) => {
              setInputData({ ...inputData, shortDescription: e });
            }}
            placeholder="Nhập mô tả ngắn"
            style={styles.inputText}
          />
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Mô tả chi tiết
          </Text>
          <Input
            value={inputData.description}
            onChangeText={(e) => {
              setInputData({ ...inputData, description: e });
            }}
            placeholder="Nhập mô tả chi tiết"
            style={styles.inputTextArea}
            multiline={true}
            numberOfLines={100}
          />
        </View>
        <Text style={[AppStyles.FontStyle.headline_6, { marginBottom: 16 }]}>
          Thông số kỹ thuật
        </Text>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>Hãng</Text>
          <Input
            value={inputData.brand}
            onChangeText={(e) => {
              setInputData({ ...inputData, brand: e });
            }}
            placeholder="Vd: Apple, Samsung,..."
            style={styles.inputText}
          />
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Tốc độ CPU
          </Text>
          <Input
            value={inputData.cpuSpeed}
            onChangeText={(e) => {
              setInputData({ ...inputData, cpuSpeed: e });
            }}
            placeholder="Vd: 2.5 GHz, 2.0 GHz,..."
            style={styles.inputText}
          />
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Card màn hình
          </Text>
          <Input
            value={inputData.GPU}
            onChangeText={(e) => {
              setInputData({ ...inputData, GPU: e });
            }}
            placeholder="Vd: RTX™ 3050 4G,..."
            style={styles.inputText}
          />
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Dung lượng RAM
          </Text>
          <Input
            value={inputData.RAM}
            onChangeText={(e) => {
              setInputData({ ...inputData, RAM: e });
            }}
            placeholder="Vd: 8GB, 6GB,..."
            style={styles.inputText}
          />
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Dung lượng bộ nhớ
          </Text>
          <Input
            value={inputData.ROM}
            onChangeText={(e) => {
              setInputData({ ...inputData, ROM: e });
            }}
            placeholder="Vd: 128GB, 64GB,..."
            style={styles.inputText}
          />
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Kích thước màn hình
          </Text>
          <Input
            value={inputData.screenSize}
            onChangeText={(e) => {
              setInputData({ ...inputData, screenSize: e });
            }}
            placeholder="Vd: 6.1 inches,..."
            style={styles.inputText}
          />
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Dung lượng pin
          </Text>
          <Input
            value={inputData.pin}
            onChangeText={(e) => {
              setInputData({ ...inputData, pin: e });
            }}
            placeholder="Vd: 3110 mAh"
            style={styles.inputText}
          />
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Cân nặng
          </Text>
          <Input
            value={inputData.weight}
            onChangeText={(e) => {
              setInputData({ ...inputData, weight: e });
            }}
            placeholder="Vd: 1000g, 800g,..."
            style={styles.inputText}
          />
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Loại chip
          </Text>
          <Input
            value={inputData.chip}
            onChangeText={(e) => {
              setInputData({ ...inputData, chip: e });
            }}
            placeholder="Vd: A13 Bionic, Snapdragon 8+,..."
            style={styles.inputText}
          />
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Chât liệu
          </Text>
          <Input
            value={inputData.material}
            onChangeText={(e) => {
              setInputData({ ...inputData, material: e });
            }}
            placeholder="Vd: Nhôm, nhựa, ..."
            style={styles.inputText}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default EditInformationProduct;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    display: "flex",
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
  inputTextArea: {
    width: "90%",
    marginHorizontal: 16,
    height: 150,
    textAlignVertical: "top",
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
  editCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingHorizontal: 24,
  },
  btnDelete: {
    width: "45%",
    backgroundColor: "white",
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    borderWidth: 1,
  },
  addToCart: {
    backgroundColor: AppStyles.ColorStyles.color.primary_normal,
    // marginTop: 8,
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    padding: 8,
    width: "100%",
    marginHorizontal: 8,
    marginBottom: 8,
  },
  btnEdit: {
    width: "45%",
  },
  textSuccess: {
    color: AppStyles.ColorStyles.color.success_400,
    marginTop: 8,
    width: "100%",
    textAlign: "center",
    marginLeft: 8,
    marginBottom: 16,
  },
  textError: {
    color: AppStyles.ColorStyles.color.error_400,
    marginTop: 8,
    width: "100%",
    textAlign: "center",
    marginLeft: 8,
    marginBottom: 16,
  },
});
