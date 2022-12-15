import {
  ScrollView,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Image,
  Keyboard,
  Text,
  TouchableOpacity,
} from "react-native";
import { React, useState } from "react";

import Input from "../component/Input";
import AppStyles from "../theme/AppStyles";
import ButtonOutlined from "../component/ButtonOutlined";
import ButtonFilled from "../component/ButtonFilled";
import AuthenticationService from "../config/service/AuthenticationService";
import Icon from "react-native-vector-icons/FontAwesome5";
import Loading from "../component/Loading";

const SignUpScreen = (props) => {
  const [errorInput, setErrorInput] = useState({
    first_name: false,
    last_name: false,
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    errorServer: false,
    success: false,
  });
  const [inputData, setInputData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleRegister = () => {
    setErrorInput((prevErrorInput) => {
      return { ...prevErrorInput, errorServer: false, success: false };
    });
    var check = false;
    if (inputData.first_name.length == 0 || inputData.first_name.length > 30) {
      check = true;
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, first_name: true };
      });
    } else {
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, first_name: false };
      });
    }

    if (inputData.last_name.length == 0 || inputData.last_name.length > 15) {
      check = true;
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, last_name: true };
      });
    } else {
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, last_name: false };
      });
    }

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

    if (inputData.username.length == 0 || inputData.username.length > 50) {
      check = true;
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, username: true };
      });
    } else {
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, username: false };
      });
    }

    if (inputData.password.length < 6) {
      check = true;
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, password: true };
      });
    } else {
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, password: false };
      });
    }

    if (inputData.confirmPassword != inputData.password) {
      check = true;
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, confirmPassword: true };
      });
    } else {
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, confirmPassword: false };
      });
    }

    if (!check) {
      setIsLoading(true);
      AuthenticationService.postRegister({
        username: inputData.username,
        password: inputData.password,
        first_name: inputData.first_name,
        last_name: inputData.last_name,
        email: inputData.email,
        user_profile: {
          gender: null,
          dateOfBirth: null,
          phone: "",
          address: "",
          accountNo: "",
        },
      }).then((res) => {
        console.log(res);
        if (res.message == "Registration Success!") {
          setErrorInput((prevErrorInput) => {
            return { ...prevErrorInput, errorServer: false, success: true };
          });
          setIsLoading(false);
        } else {
          setErrorInput((prevErrorInput) => {
            return { ...prevErrorInput, errorServer: true, success: false };
          });
          setIsLoading(false);
        }
      });
    } else {
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, errorServer: false, success: false };
      });
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
      accessible={false}
    >
      <ScrollView style={styles.container}>
        <View
          style={{ alignItems: "center", width: "100%", marginVertical: 24 }}
        >
          {isLoading ? <Loading /> : null}
          <View style={styles.imageView}>
            <Image
              style={styles.image}
              source={require("../../assets/icons/Logo.png")}
              resizeMode="contain"
            />
          </View>
          <Text
            onPress={() => {
              props.navigation.navigate("TabStack");
            }}
            style={[AppStyles.FontStyle.button, styles.subTitle]}
          >
            Home
          </Text>
          <Text style={[AppStyles.FontStyle.headline_4, styles.title]}>
            Đăng ký
          </Text>
          <View style={styles.inputView}>
            <Text style={[AppStyles.FontStyle.body_2, styles.label]}>Họ*</Text>
            <Input
              value={inputData.first_name}
              onChangeText={(e) => {
                setInputData({ ...inputData, first_name: e });
              }}
              placeholder="Nhập Họ"
              style={styles.inputText}
            />
            {errorInput.first_name ? (
              <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
                *họ không được trống và nhỏ hơn 30 ký tự
              </Text>
            ) : null}
          </View>
          <View style={styles.inputView}>
            <Text style={[AppStyles.FontStyle.body_2, styles.label]}>Tên*</Text>
            <Input
              value={inputData.last_name}
              onChangeText={(e) => {
                setInputData({ ...inputData, last_name: e });
              }}
              placeholder="Nhập Tên"
              style={styles.inputText}
            />
            {errorInput.last_name ? (
              <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
                *tên không được trống và nhỏ hơn 15 ký tự
              </Text>
            ) : null}
          </View>
          <View style={styles.inputView}>
            <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
              Email*
            </Text>
            <Input
              value={inputData.email}
              onChangeText={(e) => {
                setInputData({ ...inputData, email: e });
              }}
              placeholder="Nhập Email"
              style={styles.inputText}
            />
            {errorInput.email ? (
              <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
                *email không hợp lệ
              </Text>
            ) : null}
          </View>
          <View style={styles.inputView}>
            <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
              Username*
            </Text>
            <Input
              value={inputData.username}
              onChangeText={(e) => {
                setInputData({ ...inputData, username: e });
              }}
              placeholder="Nhập Username"
              style={styles.inputText}
            />
            {errorInput.username ? (
              <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
                *username không được trống hoặc quá dài
              </Text>
            ) : null}
          </View>
          <View style={styles.inputView}>
            <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
              Mật Khẩu*
            </Text>
            <Input
              value={inputData.password}
              onChangeText={(e) => {
                setInputData({ ...inputData, password: e });
              }}
              secureTextEntry={isShowPassword ? false : true}
              placeholder="Nhập Mật Khẩu"
              style={styles.inputText}
            />
            <TouchableOpacity
              onPress={handleShowPassword}
              style={styles.eyePassword}
              activeOpacity={0.9}
            >
              <Icon
                name={isShowPassword ? "eye-slash" : "eye"}
                size={20}
                color={"gray"}
              />
            </TouchableOpacity>
            {errorInput.password ? (
              <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
                *mật khẩu phải lớn hơn 6 ký tự
              </Text>
            ) : null}
          </View>
          <View style={styles.inputView}>
            <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
              Xác Nhận Mật khẩu*
            </Text>
            <Input
              value={inputData.confirmPassword}
              onChangeText={(e) => {
                setInputData({ ...inputData, confirmPassword: e });
              }}
              secureTextEntry={isShowPassword ? false : true}
              placeholder="Nhập Lại Mật Khẩu"
              style={styles.inputText}
            />
            <TouchableOpacity
              onPress={handleShowPassword}
              style={styles.eyePassword}
              activeOpacity={0.9}
            >
              <Icon
                name={isShowPassword ? "eye-slash" : "eye"}
                size={20}
                color={"gray"}
              />
            </TouchableOpacity>
            {errorInput.confirmPassword ? (
              <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
                *Mật khẩu không khớp
              </Text>
            ) : null}
          </View>
          <ButtonOutlined onPress={handleRegister} style={styles.button}>
            Đăng Ký
          </ButtonOutlined>
          {errorInput.errorServer ? (
            <Text
              style={[
                AppStyles.FontStyle.body_1,
                { color: AppStyles.ColorStyles.color.error_400, marginTop: 8 },
              ]}
            >
              Email hoặc username đã được sử dụng
            </Text>
          ) : errorInput.success ? (
            <Text
              style={[
                AppStyles.FontStyle.body_1,
                {
                  color: AppStyles.ColorStyles.color.success_400,
                  marginTop: 8,
                },
              ]}
            >
              Đăng ký thành công
            </Text>
          ) : null}
          <Text
            onPress={() => {
              props.navigation.navigate("ResetPasswordScreen");
            }}
            style={[styles.textReset, AppStyles.FontStyle.body_2]}
          >
            Quên mật khẩu?
          </Text>
          <ButtonFilled
            onPress={() => {
              props.navigation.navigate("LoginScreen");
            }}
            style={{ width: "80%", marginBottom: 24 }}
          >
            Đăng nhập
          </ButtonFilled>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
  },
  imageView: {
    width: 76,
    height: 76,
    backgroundColor: "white",
    borderRadius: 50,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    overflow: "hidden",
    padding: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  inputText: {
    width: "80%",
    minWidth: "80%",
    maxWidth: "80%",
    color: AppStyles.ColorStyles.color.gray_700,
  },
  title: {
    color: AppStyles.ColorStyles.color.primary_normal,
  },
  label: {
    color: AppStyles.ColorStyles.color.primary_normal,
    marginLeft: 8,
  },
  inputView: {
    marginBottom: 16,
  },
  button: {
    width: "80%",
    marginTop: 16,
  },
  textReset: {
    marginVertical: 24,
    textDecorationLine: "underline",
  },
  subTitle: {
    color: AppStyles.ColorStyles.color.gray_500,
    textDecorationLine: "underline",
  },
  textError: {
    color: AppStyles.ColorStyles.color.error_400,
    width: 325,
  },
  textSuccess: {
    color: AppStyles.ColorStyles.color.success_400,
    width: 325,
  },
  eyePassword: {
    position: "absolute",
    right: 2,
    top: 38,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
