import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Keyboard
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
import Loading from "../../component/Loading";

const EditUserProfileScreen = (props) => {
  const dataUser = props.route.params.dataUser;
  const [openCal, setOpenCal] = useState(false);
  const [dataSeller, setDataSeller] = useState();
  const isFocused = useIsFocused();
  const [inputData, setInputData] = useState({
    email: !!dataUser.data ? dataUser.data.email : "",
    emailPaypal:
      !!dataUser.data && !!dataUser.data.user_profile.account_no
        ? dataUser.data.user_profile.account_no
        : "",
    first_name: !!dataUser.data ? dataUser.data.first_name : "",
    last_name: !!dataUser.data ? dataUser.data.last_name : "",
    dayOfBirth:
      !!dataUser.data && !!dataUser.data.user_profile.birthday
        ? new Date(dataUser.data.user_profile.birthday.toString())
        : new Date(),
    gender: !!dataUser.data ? dataUser.data.user_profile.gender : null,
    phoneNumber:
      !!dataUser.data && !!dataUser.data.user_profile.phone
        ? dataUser.data.user_profile.phone
        : "",
    address:
      !!dataUser.data && !!dataUser.data.user_profile.address
        ? dataUser.data.user_profile.address
        : "",
  });
  const [errorInput, setErrorInput] = useState({
    email: false,
    emailPaypal: false,
    phoneNumber: false,
    error: false,
    success: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const setDate = (event, date) => {
    setOpenCal(!openCal);
    if (event.type == "set") {
      setInputData((prevInputData) => {
        return { ...prevInputData, dayOfBirth: new Date(date) };
      });
    }
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

  var item = [
    { id: 1, title: "--", value: null },
    { id: 2, title: "Nam", value: true },
    { id: 3, title: "Nữ", value: false },
  ];

  if (
    !!dataUser.data &&
    (dataUser.data.user_profile.gender != true ||
      dataUser.data.user_profile.gender != false)
  ) {
    item.shift();
  }

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity activeOpacity={0.8} onPress={handleEditUserProfile}>
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
  }, [props.navigation, inputData]);

  const handleChangeGender = (chooseId) => {
    if (chooseId == 2) {
      setInputData((prevInputData) => {
        return { ...prevInputData, gender: true };
      });
    } else if (chooseId == 3) {
      setInputData((prevInputData) => {
        return { ...prevInputData, gender: false };
      });
    } else {
      setInputData((prevInputData) => {
        return { ...prevInputData, gender: null };
      });
    }
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleEditUserProfile = () => {
    Keyboard.dismiss()
    setErrorInput((prevErrorInput) => {
      return { ...prevErrorInput, error: false, success: false };
    });
    var check = false;

    if (!validateEmail(inputData.email)) {
      check = true;
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, email: true };
      });
    } else {
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, email: false };
      });
    }

    if (inputData.phoneNumber.length > 10) {
      check = true;
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, phoneNumber: true };
      });
    } else {
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, phoneNumber: false };
      });
    }

    if (!!inputData.emailPaypal && !validateEmail(inputData.emailPaypal)) {
      check = true;
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, emailPaypal: true };
      });
    } else {
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, emailPaypal: false };
      });
    }

    if (!check) {
      console.log(inputData);
      setIsLoading(true);
      AccountService.putEditUserProfile(dataUser.data.id, {
        first_name: inputData.first_name,
        last_name: inputData.last_name,
        email: inputData.email,
        user_profile: {
          gender: inputData.gender,
          birthday: inputData.dayOfBirth.toISOString().substring(0, 10),
          phone: inputData.phoneNumber,
          address: inputData.address,
          account_no: inputData.emailPaypal,
        },
      }).then((res) => {
        if (res.message == "Update Profile completed!") {
          setErrorInput((prevErrorInput) => {
            return { ...prevErrorInput, error: false, success: true };
          });
          setIsLoading(false);
        } else {
          setErrorInput((prevErrorInput) => {
            return { ...prevErrorInput, error: true, success: false };
          });
          setIsLoading(false);
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
        {isLoading && <Loading />}
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
        {errorInput.success ? (
          <Text style={[AppStyles.FontStyle.subtitle_1, styles.textSuccess]}>
            Sửa thành công
          </Text>
        ) : errorInput.error ? (
          <Text style={[AppStyles.FontStyle.subtitle_1, styles.textError]}>
            Sửa không thành công
          </Text>
        ) : null}
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
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>Email</Text>
          <Input
            value={inputData.email}
            onChangeText={(e) => {
              setInputData({ ...inputData, email: e });
            }}
            placeholder="Nhập email"
            style={styles.inputText}
          />
          {errorInput.email ? (
            <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
              *Email sai
            </Text>
          ) : null}
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>Họ*</Text>
          <Input
            value={inputData.first_name}
            onChangeText={(e) => {
              setInputData({ ...inputData, first_name: e });
            }}
            placeholder="Nhập họ"
            style={styles.inputText}
          />
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>Tên*</Text>
          <Input
            value={inputData.last_name}
            onChangeText={(e) => {
              setInputData({ ...inputData, last_name: e });
            }}
            placeholder="Nhập tên"
            style={styles.inputText}
          />
        </View>
        <View style={[styles.inputView, { position: "relative" }]}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Ngày sinh
          </Text>
          <Input
            value={inputData.dayOfBirth.toISOString().substring(0, 10)}
            placeholder="__/__/__"
            style={styles.inputText}
            editable={false}
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
              value={inputData.dayOfBirth}
              maximumDate={new Date()}
              textColor={AppStyles.ColorStyles.color.primary_normal}
              onChange={setDate}
            />
          ) : null}
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Giới tính
          </Text>
          <Dropdown
            onChange={handleChangeGender}
            style={styles.genderDropdown}
            itemDropdown={item}
            id={
              inputData.gender == true ? 2 : inputData.gender == false ? 3 : 1
            }
          />
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Số điện thoại
          </Text>
          <Input
            value={inputData.phoneNumber}
            onChangeText={(e) => {
              setInputData({ ...inputData, phoneNumber: e });
            }}
            placeholder="Nhập số điện thoại"
            style={styles.inputText}
          />
          {errorInput.phoneNumber ? (
            <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
              *số điện thoại phải nhỏ hơn 10
            </Text>
          ) : null}
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Địa chỉ
          </Text>
          <Input
            value={inputData.address}
            onChangeText={(e) => {
              setInputData({ ...inputData, address: e });
            }}
            placeholder="Nhập địa chỉ"
            style={styles.inputText}
          />
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Email Paypal
          </Text>
          <Input
            value={inputData.emailPaypal}
            onChangeText={(e) => {
              setInputData({ ...inputData, emailPaypal: e });
            }}
            placeholder="Nhập email Paypal"
            style={styles.inputText}
          />
          {errorInput.emailPaypal ? (
            <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
              *email sai
            </Text>
          ) : null}
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
  textError: {
    color: AppStyles.ColorStyles.color.error_400,
    width: 325,
  },
});
