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
import { useDispatch } from "react-redux";
import { setDataUser, setTokenUser } from "../config/redux/features/authSlice";
import Icon from "react-native-vector-icons/FontAwesome5";
import Loading from "../component/Loading";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("spyrke0");
  const [password, setPassword] = useState("PBL6TechE");
  const [isLogin, setIsLogin] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const dispatch = useDispatch();

  const handleLogin = async () => {
    setIsLoading(false)
    setIsLoading(true)
    let data = await AuthenticationService.postLogin({
      username: email,
      password: password,
    })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.log(error);
      });
    if (data.message == "login is success!" && data.data.role != "ADMIN") {
      AuthenticationService.saveDataLogin(data);
      dispatch(setDataUser(data.data));
      dispatch(
        setTokenUser({
          refresh: data.token.refresh,
          access: data.token.access,
        })
      );
      setIsLoading(false)
      setIsLogin(true);
      navigation.navigate("TabStack");
    } else {
      setIsLoading(false)
      setIsLogin("incorrect");
    }
    // let dataUser = await AuthenticationService.getDataUser();
    // let tokenUser = await AuthenticationService.getTokenUser();
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
        accessible={false}
      >
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
              navigation.navigate("TabStack");
            }}
            style={[AppStyles.FontStyle.button, styles.subTitle]}
          >
            Home
          </Text>
          <Text style={[AppStyles.FontStyle.headline_4, styles.title]}>
            Đăng nhập
          </Text>
          {isLogin == "incorrect" ? (
            <Text
              style={[
                AppStyles.FontStyle.subtitle_1,
                { color: AppStyles.ColorStyles.color.error_400 },
              ]}
            >
              Sai tài khoản hoặc mật khẩu
            </Text>
          ) : null}
          <View style={styles.inputView}>
            <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
              Email
            </Text>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập Email"
              style={styles.inputText}
            />
          </View>
          <View style={styles.inputView}>
            <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
              Mật khẩu
            </Text>
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="Nhập Mật Khẩu"
              style={styles.inputText}
              secureTextEntry={isShowPassword ? false : true}
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
          </View>
          <ButtonOutlined onPress={handleLogin} style={styles.button}>
            Đăng nhập
          </ButtonOutlined>
          <Text
            onPress={() => {
              navigation.navigate("ResetPasswordScreen");
            }}
            style={[styles.textReset, AppStyles.FontStyle.body_2]}
          >
            Quên mật khẩu?
          </Text>
          <ButtonFilled
            onPress={() => {
              navigation.navigate("SignUpScreen");
            }}
            style={{ width: "80%", marginBottom: 24 }}
          >
            Đăng ký
          </ButtonFilled>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default LoginScreen;

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
    marginBottom: 24,
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
  subTitle: {
    color: AppStyles.ColorStyles.color.gray_500,
    textDecorationLine: "underline",
  },
  title: {
    color: AppStyles.ColorStyles.color.primary_normal,
    paddingBottom: 16,
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
  eyePassword: {
    position: "absolute",
    right: 2,
    top: 38,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
