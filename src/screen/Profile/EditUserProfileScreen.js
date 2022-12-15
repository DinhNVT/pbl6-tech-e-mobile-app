import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { React, useState, useEffect } from "react";

import ButtonOutlined from "../../component/ButtonOutlined";
import ButtonFilled from "../../component/ButtonFilled";
import Input from "../../component/Input";
import AppStyles from "../../theme/AppStyles";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/FontAwesome5";
import Dropdown from "../../component/Dropdown";
import AccountService from "../../config/service/AccountService";
import { useIsFocused } from "@react-navigation/native";

const EditUserProfileScreen = (props) => {
  const dataUser = props.route.params.dataUser;
  const [openCal, setOpenCal] = useState(false);
  const [dataSeller, setDataSeller] = useState();
  const isFocused = useIsFocused();

  const setDate = (event, date) => {
    setOpenCal(!openCal);
    if (event.type == "set") {
      console.log("set");
    }
    console.log(event.nativeEvent, date);
  };

  const getDataSeller = () => {
    AccountService.getSellerProfile(dataUser.data.id).then((res) => {
      if (!!res.data) {
        setDataSeller(res.data);
      } else {
        console.error(res);
      }
    });
  };

  useEffect(() => {
    if (dataUser.data.ROLE[1] == "SELLER") {
      getDataSeller();
    }
  }, [isFocused]);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
          <Text
            style={[
              AppStyles.FontStyle.button,
              { color: AppStyles.ColorStyles.color.gray_800 },
            ]}
          >
            Lưu
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [props.navigation]);

  const item = [
    { id: 1, title: "--" },
    { id: 2, title: "Nam" },
    { id: 3, title: "Nữ" },
  ];
  const handleChangeGender = (chooseId) => {
    console.log(chooseId);
  };
  return (
    <ScrollView style={styles.container}>
      <View style={{ alignItems: "center", width: "100%", marginVertical: 24 }}>
        <ButtonOutlined
          onPress={() => {
            props.navigation.navigate("RegisterSellerScreen", {
              ROLE: dataUser.data.ROLE[1] == "SELLER" ? "SELLER" : "USER",
              dataSeller: dataUser.data.ROLE[1] == "SELLER" ? dataSeller : null,
              dataUser: dataUser,
            });
          }}
          style={styles.button}
        >
          {dataUser.data.ROLE[1] == "SELLER"
            ? "Chỉnh sửa cửa hàng"
            : "Đăng ký bán hàng"}
        </ButtonOutlined>
        <ButtonFilled
          onPress={() => {
            props.navigation.navigate("ChangePasswordScreen");
          }}
          style={styles.button}
        >
          Đổi mật khẩu
        </ButtonFilled>
        <View style={[styles.inputView, { marginTop: 24 }]}>
          <Text style={[AppStyles.FontStyle.body_2, styles.labelReadOnly]}>
            Username
          </Text>
          <Input
            value={dataUser.data.username}
            placeholder="Nhập Username"
            style={styles.inputTextReadOnly}
            editable={false}
            placeholderTextColor={AppStyles.ColorStyles.color.gray_400}
          />
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.labelReadOnly]}>
            Email
          </Text>
          <Input
            value={dataUser.data.email}
            placeholder="Nhập email"
            style={styles.inputTextReadOnly}
            editable={false}
            placeholderTextColor={AppStyles.ColorStyles.color.gray_400}
          />
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>Họ*</Text>
          <Input
            // value={inputData.first_name}
            // onChangeText={(e) => {
            //   setInputData({ ...inputData, first_name: e });
            // }}
            placeholder="Nhập họ"
            style={styles.inputText}
          />
          {/* {errorInput.first_name ? (
          <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
            *họ không được trống và nhỏ hơn 30 ký tự
          </Text>
        ) : null} */}
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>Tên*</Text>
          <Input
            // value={inputData.first_name}
            // onChangeText={(e) => {
            //   setInputData({ ...inputData, first_name: e });
            // }}
            placeholder="Nhập tên"
            style={styles.inputText}
          />
          {/* {errorInput.first_name ? (
          <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
            *họ không được trống và nhỏ hơn 30 ký tự
          </Text>
        ) : null} */}
        </View>
        <View style={[styles.inputView, { position: "relative" }]}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Ngày sinh
          </Text>
          <Input
            // value={inputData.first_name}
            // onChangeText={(e) => {
            //   setInputData({ ...inputData, first_name: e });
            // }}
            placeholder="__/__/__"
            style={styles.inputText}
          />
          <TouchableOpacity
            onPress={() => {
              setOpenCal(!openCal);
            }}
            style={styles.dateOfBirth}
            activeOpacity={0.9}
          >
            <Icon name={"calendar-alt"} size={24} color={"gray"} />
          </TouchableOpacity>
          {openCal ? (
            <DateTimePicker
              mode="date"
              display="spinner"
              value={new Date()}
              maximumDate={new Date()}
              textColor={AppStyles.ColorStyles.color.primary_normal}
              onChange={setDate}
            />
          ) : null}
          {/* {errorInput.first_name ? (
          <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
            *họ không được trống và nhỏ hơn 30 ký tự
          </Text>
        ) : null} */}
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Giới tính
          </Text>
          <Dropdown
            onChange={handleChangeGender}
            style={styles.genderDropdown}
            itemDropdown={item}
          />
          {/* {errorInput.first_name ? (
          <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
            *họ không được trống và nhỏ hơn 30 ký tự
          </Text>
        ) : null} */}
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Số điện thoại
          </Text>
          <Input
            // value={inputData.first_name}
            // onChangeText={(e) => {
            //   setInputData({ ...inputData, first_name: e });
            // }}
            placeholder="Nhập số điện thoại"
            style={styles.inputText}
          />
          {/* {errorInput.first_name ? (
          <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
            *họ không được trống và nhỏ hơn 30 ký tự
          </Text>
        ) : null} */}
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Địa chỉ
          </Text>
          <Input
            // value={inputData.first_name}
            // onChangeText={(e) => {
            //   setInputData({ ...inputData, first_name: e });
            // }}
            placeholder="Nhập địa chỉ"
            style={styles.inputText}
          />
          {/* {errorInput.first_name ? (
          <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
            *họ không được trống và nhỏ hơn 30 ký tự
          </Text>
        ) : null} */}
        </View>
      </View>
    </ScrollView>
  );
};

export default EditUserProfileScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    display: "flex",
  },
  button: {
    marginTop: 12,
    width: "90%",
  },
  inputText: {
    width: "90%",
    marginHorizontal: 16,
  },
  inputTextReadOnly: {
    width: "90%",
    marginHorizontal: 16,
    borderColor: AppStyles.ColorStyles.color.gray_400,
    color: AppStyles.ColorStyles.color.gray_400,
  },
  inputView: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    color: AppStyles.ColorStyles.color.primary_normal,
    textAlign: "left",
    width: "90%",
    marginLeft: 8,
  },
  labelReadOnly: {
    color: AppStyles.ColorStyles.color.gray_400,
    textAlign: "left",
    width: "90%",
    marginLeft: 8,
  },
  dateOfBirth: {
    position: "absolute",
    right: 30,
    top: 35,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  genderDropdown: {
    width: "90%",
  },
});
