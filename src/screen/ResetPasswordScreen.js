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
import ButtonOutlined from "../component/ButtonOutlined";
import ButtonFilled from "../component/ButtonFilled";

const ResetPasswordScreen = () => {
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
          <View style={styles.imageView}>
            <Image
              style={styles.image}
              source={require("../../assets/icons/Logo.png")}
              resizeMode="contain"
            />
          </View>
          <Text style={[AppStyles.FontStyle.headline_4, styles.title]}>
            Nhập email để lấy lại mật khẩu
          </Text>
          <View style={styles.inputView}>
            <Input placeholder="Nhập Email" style={styles.inputText} />
          </View>
          <View style={styles.buttonContainer}>
            <ButtonOutlined style={styles.button}>Lấy mật khẩu</ButtonOutlined>
            <ButtonFilled style={styles.button}>Thoát</ButtonFilled>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
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
    textAlign: 'center'
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
  }
});
