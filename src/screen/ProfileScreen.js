import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { React, useEffect, useState } from "react";
import Logo from "../../assets/icons/Logo.png";
import AppStyles from "../theme/AppStyles";
import ButtonFilled from "../component/ButtonFilled";
import FeatherIcon from "react-native-vector-icons/Feather";
import AuthenticationService from "../config/service/AuthenticationService";
import { useIsFocused } from "@react-navigation/native";
import { ModalYesNo } from "../component/Modals";

const ProfileScreen = (props) => {
  const [isLogin, setIsLogin] = useState(false);
  const date = Math.floor(Date.now() / 1000);
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);

  const checkLogin = async () => {
    setIsLogin(await AuthenticationService.isLogin());
  };

  const handleLogout = () => {
    AuthenticationService.clearDataLogin();
    checkLogin();
  };

  const onLogout = () => {
    handleLogout();
    setModalVisible(false);
  };

  useEffect(() => {
    checkLogin();
  }, [isFocused, props]);

  return (
    <View style={styles.container}>
      {isLogin ? (
        <View>
          <ModalYesNo
            handleYes={onLogout}
            handleNo={() => {
              setModalVisible(false);
            }}
            modalVisible={modalVisible}
            title={"Bạn có muốn đăng xuất không?"}
          />
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
            activeOpacity={0.6}
            style={styles.logOut}
          >
            <FeatherIcon
              name="log-out"
              color={AppStyles.ColorStyles.color.gray_700}
              size={30}
            />
          </TouchableOpacity>
        </View>
      ) : null}
      <View style={styles.imageContainer}>
        <Image resizeMode="cover" style={styles.logo} source={Logo}></Image>
      </View>
      {isLogin ? (
        <View style={styles.containerLogin}>
          <Text style={[AppStyles.FontStyle.headline_6, styles.fullName]}>
            Nguyen Huu Dinh
          </Text>
          <Text style={styles.role}>Người bán</Text>
          <ButtonFilled onPress={() => {}} style={styles.button}>
            Sửa hồ sơ
          </ButtonFilled>
          <ButtonFilled onPress={() => {}} style={styles.button}>
            Giỏ hàng
          </ButtonFilled>
        </View>
      ) : (
        <View style={styles.containerNotLogin}>
          <ButtonFilled
            onPress={() => {
              props.navigation.navigate("LoginStack");
            }}
            style={styles.button}
          >
            Đăng nhập
          </ButtonFilled>
          <ButtonFilled onPress={() => {}} style={styles.button}>
            Đăng ký
          </ButtonFilled>
        </View>
      )}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    position: "relative",
  },
  logOut: {
    position: "absolute",
    top: 16,
    right: 30,
  },
  imageContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    marginTop: 30,
  },
  logo: {
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    borderRadius: 50,
    borderWidth: 1,
    width: 100,
    height: 100,
  },
  button: {
    marginVertical: 8,
    width: "80%",
  },
  containerLogin: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  containerNotLogin: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  role: {
    backgroundColor: AppStyles.ColorStyles.color.primary_normal,
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    color: "white",
    borderRadius: 100,
  },
  fullName: {
    color: AppStyles.ColorStyles.color.gray_700,
    fontWeight: "600",
  },
});
