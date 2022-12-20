import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { React, useState, useEffect } from "react";

import Input from "../../component/Input";
import AppStyles from "../../theme/AppStyles";
import Icon from "react-native-vector-icons/FontAwesome5";
import Loading from "../../component/Loading";
import AuthenticationService from "../../config/service/AuthenticationService";

const ChangePasswordScreen = (props) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [inputData, setInputData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errorInput, setErrorInput] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
    success: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity activeOpacity={0.8} onPress={handleRegister}>
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
  }, [inputData, props.navigation]);

  const handleRegister = async () => {
    Keyboard.dismiss()
    setErrorInput((prevErrorInput) => {
      return { ...prevErrorInput, success: false };
    });
    var check = false;
    // console.log(inputData.newPassword);
    if (inputData.newPassword.length < 6) {
      check = true;
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, newPassword: true };
      });
    } else {
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, newPassword: false };
      });
    }

    if (inputData.confirmNewPassword != inputData.newPassword) {
      check = true;
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, confirmNewPassword: true };
      });
    } else {
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, confirmNewPassword: false };
      });
    }

    if (!check) {
      setIsLoading(true);
      await AuthenticationService.patchChangePassword({
        old_password: inputData.oldPassword,
        new_password: inputData.newPassword,
        confirm_newpass: inputData.confirmNewPassword,
      }).then((res) => {
        if (res.message == "changepassword is success!") {
          setErrorInput((prevErrorInput) => {
            return { ...prevErrorInput, success: true };
          });
          setIsLoading(false);
          setErrorInput((prevErrorInput) => {
            return { ...prevErrorInput, oldPassword: false };
          });
        } else if (res.error == "old_password is incorrect!") {
          setErrorInput((prevErrorInput) => {
            return { ...prevErrorInput, oldPassword: true };
          });
          setIsLoading(false);
        } else {
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
    <View style={styles.container}>
      <View style={styles.inputView}>
        {isLoading ? <Loading /> : null}
        {errorInput.success ? (
          <Text
            style={[
              AppStyles.FontStyle.subtitle_1,
              {
                color: AppStyles.ColorStyles.color.success_400,
                marginTop: 8,
                width: "100%",
                textAlign: "center",
                marginLeft: 8,
                marginBottom: 16,
              },
            ]}
          >
            Đổi mật khẩu thành công thành công
          </Text>
        ) : null}
        <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
          Mật khẩu cũ
        </Text>
        <Input
          value={inputData.oldPassword}
          onChangeText={(e) => {
            setInputData({ ...inputData, oldPassword: e });
          }}
          placeholder="Nhập mật khẩu cũ"
          style={styles.inputText}
        />
        {errorInput.oldPassword ? (
          <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
            Mật khẩu cũ không đúng!!!
          </Text>
        ) : null}
      </View>
      <View style={styles.inputView}>
        <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
          Mật khẩu mới*
        </Text>
        <Input
          value={inputData.newPassword}
          onChangeText={(e) => {
            setInputData({ ...inputData, newPassword: e });
          }}
          secureTextEntry={isShowPassword ? false : true}
          placeholder="Nhập mật khẩu mới"
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
        {errorInput.newPassword ? (
          <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
            *Mật khẩu phải lớn hơn 6 ký tự
          </Text>
        ) : null}
      </View>
      <View style={styles.inputView}>
        <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
          Xác nhận mật khẩu*
        </Text>
        <Input
          value={inputData.confirmNewPassword}
          onChangeText={(e) => {
            setInputData({ ...inputData, confirmNewPassword: e });
          }}
          secureTextEntry={isShowPassword ? false : true}
          placeholder="Nhập lại mật khẩu mới"
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
        {errorInput.confirmNewPassword ? (
          <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
            *Mật khẩu không khớp
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    flex: 1,
    display: "flex",
    alignItems: "center",
    paddingTop: 16,
  },
  inputText: {
    width: "90%",
    minWidth: "90%",
    maxWidth: "90%",
    color: AppStyles.ColorStyles.color.gray_700,
  },
  label: {
    color: AppStyles.ColorStyles.color.primary_normal,
    marginLeft: 8,
  },
  inputView: {
    marginBottom: 16,
  },
  eyePassword: {
    position: "absolute",
    right: 2,
    top: 38,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  textError: {
    color: AppStyles.ColorStyles.color.error_400,
    width: 325,
  },
});
