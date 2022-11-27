import {
  ScrollView,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Image,
  Keyboard,
  Text,
} from "react-native";
import React from "react";

import Input from "../component/Input";
import AppStyles from "../theme/AppStyles";
import ButtonOutlined from '../component/ButtonOutlined'
import ButtonFilled from "../component/ButtonFilled";

const SignUpScreen = ({navigation}) => {
  
  return (
    <ScrollView style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
        accessible={false}
      >
        <View style={{ alignItems: "center", width: "100%", marginVertical: 24}}>
          <View style={styles.imageView}>
            <Image
              style={styles.image}
              source={require("../../assets/icons/Logo.png")}
              resizeMode="contain"
            />
          </View>
          <Text style={[AppStyles.FontStyle.headline_4, styles.title]}>
            Đăng ký
          </Text>
          <View style = {styles.inputView}>
            <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
              Họ Tên
            </Text>
            <Input placeholder= "Nhập Email" style={styles.inputText}/>
          </View>
          <View style = {styles.inputView}>
            <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
              Email
            </Text>
            <Input placeholder= "Nhập Email" style={styles.inputText}/>
          </View>
          <View style = {styles.inputView}>
            <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
              Mật Khẩu
            </Text>
            <Input placeholder= "Nhập Email" style={styles.inputText}/>
          </View>
          <View style = {styles.inputView}>
            <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
              Xác Nhận Mật khẩu
            </Text>
            <Input placeholder= "Nhập Mật Khẩu" style={styles.inputText}/>
          </View>
          <ButtonOutlined style = {styles.button}>Đăng Ký</ButtonOutlined>
          <Text style={[styles.textReset, AppStyles.FontStyle.body_2]}>Quên mật khẩu?</Text>
          <ButtonFilled style = {{width: "80%", marginBottom: 24}}>Đăng nhập</ButtonFilled>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: "100%",
    height: "100%",
    paddingVertical: 24
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
    maxWidth: "80%"
  },
  title: {
    color: AppStyles.ColorStyles.color.primary_normal,
    paddingBottom: 16,
  },
  label: {
    color: AppStyles.ColorStyles.color.primary_normal,
    marginLeft: 8
  },
  inputView: {
    marginBottom: 16
  },
  button: {
    width: "80%",
    marginTop: 16
  },
  textReset: {
    marginVertical: 24,
    textDecorationLine: "underline"
  }
});
