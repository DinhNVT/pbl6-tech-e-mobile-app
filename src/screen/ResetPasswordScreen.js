import {
  ScrollView,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Image,
  Keyboard,
  Text,
} from "react-native";
import { React, useState } from "react";

import Input from "../component/Input";
import AppStyles from "../theme/AppStyles";
import ButtonOutlined from "../component/ButtonOutlined";
import ButtonFilled from "../component/ButtonFilled";
import AuthenticationService from "../config/service/AuthenticationService";
import Loading from "../component/Loading";

const ResetPasswordScreen = (props) => {
  const [email, setEmail] = useState("");
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const onResetPassword = () => {
    setMessage("")
    if (!validateEmail(email)) {
      setMessage("");
      setIsError(true);
    } else {
      setIsError(false);
      setIsLoading(true);
      AuthenticationService.postResetPassword({
        email: email,
      }).then((res) => {
        console.log(res);
        if (res.message == "Reset password is Failed!") {
          setMessage("notOK");
          setIsLoading(false);
        } else if (res.message == "Reset password Success!") {
          setMessage("OK");
          setIsLoading(false);
        } else {
          setMessage("Lỗi hệ thống!!!");
          setIsLoading(false);
        }
      });
    }
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
              props.navigation.navigate("TabStack");
            }}
            style={[AppStyles.FontStyle.button, styles.subTitle]}
          >
            Home
          </Text>
          <Text style={[AppStyles.FontStyle.headline_4, styles.title]}>
            Nhập email để lấy lại mật khẩu
          </Text>
          {isError ? (
            <Text
              style={[
                AppStyles.FontStyle.subtitle_1,
                {
                  color: AppStyles.ColorStyles.color.error_400,
                  marginHorizontal: 40,
                  textAlign: "center",
                },
              ]}
            >
              Email không hợp lệ
            </Text>
          ) : null}
          {message == "notOK" ? (
            <Text
              style={[
                AppStyles.FontStyle.subtitle_1,
                {
                  color: AppStyles.ColorStyles.color.error_400,
                  marginHorizontal: 40,
                  textAlign: "center",
                },
              ]}
            >
              Email không tồn tại!!! Hãy nhập lại
            </Text>
          ) : message == "OK" ? (
            <Text
              style={[
                AppStyles.FontStyle.subtitle_1,
                {
                  color: AppStyles.ColorStyles.color.success_400,
                  marginHorizontal: 40,
                  textAlign: "center",
                },
              ]}
            >
              Mật khẩu mới đã được gửi trong email của bạn. Vui lòng kiểm tra
              email
            </Text>
          ) : null}
          <View style={styles.inputView}>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập Email"
              style={{
                ...styles.inputText,
                ...{ color: AppStyles.ColorStyles.color.gray_700 },
              }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <ButtonOutlined onPress={onResetPassword} style={styles.button}>
              Lấy mật khẩu
            </ButtonOutlined>
            <ButtonFilled
              onPress={() => {
                props.navigation.navigate("LoginScreen");
              }}
              style={styles.button}
            >
              Đăng nhập
            </ButtonFilled>
            <ButtonFilled
              onPress={() => {
                props.navigation.navigate("TabStack");
              }}
              style={styles.button}
            >
              Thoát
            </ButtonFilled>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default ResetPasswordScreen;

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
  },
  title: {
    color: AppStyles.ColorStyles.color.primary_normal,
    paddingBottom: 16,
    textAlign: "center",
  },
  inputView: {
    marginBottom: 16,
  },
  button: {
    width: "100%",
    marginTop: 16,
  },
  buttonContainer: {
    width: "80%",
  },
  subTitle: {
    color: AppStyles.ColorStyles.color.gray_500,
    textDecorationLine: "underline",
  },
});
