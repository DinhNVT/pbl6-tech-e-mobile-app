import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { React, useEffect, useState } from "react";
import AvatarDefault from "../../../assets/image/avatar_default.png";
import AppStyles from "../../theme/AppStyles";
import ButtonFilled from "../../component/ButtonFilled";
import FeatherIcon from "react-native-vector-icons/Feather";
import AuthenticationService from "../../config/service/AuthenticationService";
import { useIsFocused } from "@react-navigation/native";
import { ModalYesNo } from "../../component/Modals";
import Loading from "../../component/Loading";
import AccountService from "../../config/service/AccountService";
import Config from "react-native-config";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ProfileScreen = (props) => {
  const [isLogin, setIsLogin] = useState(false);
  // const date = Math.floor(Date.now() / 1000);
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [dataUser, setDataUser] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = new URL(Config.API_URL);

  const checkLogin = async () => {
    setIsLoading(true);
    if (await AuthenticationService.isLogin()) {
      setIsLogin(true);
      const getDataUser = await AuthenticationService.getDataUser();
      AccountService.getUserProfile(getDataUser.id).then((res) => {
        if (!!res.data) {
          setDataUser(res);
          setIsLoading(false);
        } else {
          console.log("error");
          setIsLoading(false);
        }
      });
    } else {
      setIsLogin(false);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    AuthenticationService.postLogout();
    AuthenticationService.clearDataLogin();
    checkLogin();
    setDataUser(null);
  };

  const onLogout = () => {
    handleLogout();
    setModalVisible(false);
  };

  useEffect(() => {
    checkLogin();
  }, [isFocused, props.navigation]);

  return (
    <View style={styles.container}>
      {isLoading && <Loading />}
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
      {isLogin && !!dataUser ? (
        <View style={styles.imageContainer}>
          <View>
            <Image
              resizeMode="cover"
              style={styles.logo}
              source={
                !!dataUser.data.user_profile.avt
                  ? { uri: `${API_URL}${dataUser.data.user_profile.avt}` }
                  : AvatarDefault
              }
            ></Image>
            <TouchableOpacity
              style={styles.iconEdit}
              onPress={() => {
                props.navigation.navigate("ChangeAvtUserScreen", {
                  avt: !!dataUser.data.user_profile.avt
                    ? dataUser.data.user_profile.avt
                    : null,
                  id: dataUser.data.id,
                });
              }}
              activeOpacity={0.9}
            >
              <Icon
                name="border-color"
                size={24}
                color={"gray"}
                style={styles.iconImg}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      {isLogin && !!dataUser ? (
        <View style={styles.containerLogin}>
          <Text style={[AppStyles.FontStyle.headline_6, styles.fullName]}>
            {dataUser.data.first_name + " " + dataUser.data.last_name}
          </Text>
          <Text style={styles.role}>
            {dataUser.data.ROLE[1] == "SELLER" ? "Người bán" : "Khách hàng"}
          </Text>
          <ButtonFilled
            onPress={() => {
              props.navigation.navigate("EditUserProfileScreen", {
                dataUser: dataUser,
              });
            }}
            style={styles.button}
          >
            Sửa hồ sơ
          </ButtonFilled>
          <ButtonFilled
            onPress={() => {
              props.navigation.navigate("CartStack");
            }}
            style={styles.button}
          >
            Giỏ hàng
          </ButtonFilled>
          {dataUser.data.ROLE[1] == "SELLER" && (
            <ButtonFilled
              onPress={() => {
                props.navigation.navigate("MainShopScreen", {
                  dataUser: dataUser,
                });
              }}
              style={styles.button}
            >
              Quản lý cửa hàng
            </ButtonFilled>
          )}
        </View>
      ) : !isLogin && !dataUser ? (
        <View style={styles.containerNotLogin}>
          <View style={styles.circleBackGround}></View>
          <ButtonFilled
            onPress={() => {
              props.navigation.navigate("LoginStack", {
                name: "Login",
              });
            }}
            style={styles.button}
          >
            Đăng nhập
          </ButtonFilled>
          <ButtonFilled
            onPress={() => {
              props.navigation.navigate("LoginStack", {
                name: "SignUp",
              });
            }}
            style={styles.button}
          >
            Đăng ký
          </ButtonFilled>
        </View>
      ) : null}
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
    borderColor: AppStyles.ColorStyles.color.primary_dark,
    borderRadius: 50,
    borderWidth: 3,
    width: 100,
    height: 100,
    position: "relative",
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
    height: "100%",
    justifyContent: "center",
  },
  circleBackGround: {
    position: "absolute",
    backgroundColor: AppStyles.ColorStyles.color.secondary_400,
    width: 370,
    height: 370,
    borderRadius: 550,
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
  iconEdit: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    margin: 0,
    padding: 0,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    width: 35,
    height: 35,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 6,
  },
});
