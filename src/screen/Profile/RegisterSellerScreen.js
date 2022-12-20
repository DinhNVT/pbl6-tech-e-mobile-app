import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Keyboard,
} from "react-native";
import { React, useState, useEffect } from "react";

import AppStyles from "../../theme/AppStyles";
import Input from "../../component/Input";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { launchImageLibrary } from "react-native-image-picker";
import AccountService from "../../config/service/AccountService";
import Loading from "../../component/Loading";
import Config from "react-native-config";

const RegisterSellerScreen = (props) => {
  const { ROLE, dataSeller, dataUser } = props.route.params;
  const [uriImageShop, setUriImageShop] = useState(null);
  const [inputData, setInputData] = useState({
    imgUrl: !!dataSeller ? dataSeller.logo : null,
    nameShop: !!dataSeller ? dataSeller.name_store : "",
    emailPaypal: !!dataSeller ? dataSeller.account_no : "",
    linkFB: !!dataSeller && !!dataSeller.facebook ? dataSeller.facebook : "",
  });

  const [errorInput, setErrorInput] = useState({
    imgUrl: false,
    nameShop: false,
    emailPaypal: false,
    linkFB: false,
    success: false,
    error: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = new URL(Config.API_URL);

  const selectFile = () => {
    var options = {
      title: "Select Image",
      customButtons: [
        {
          name: "customOptionKey",
          title: "Choose file from Custom Option",
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    launchImageLibrary(options, (res) => {
      // console.log("Response = ", res);
      if (res.didCancel) {
        console.log("User cancelled image picker");
      } else if (res.error) {
        console.log("ImagePicker Error: ", res.error);
        setErrorInput((prevErrorInput) => {
          return { ...prevErrorInput, imgUrl: true };
        });
      } else if (res.customButton) {
        console.log("User tapped custom button: ", res.customButton);
        alert(res.customButton);
      } else {
        let source = res;
        setErrorInput((prevErrorInput) => {
          return { ...prevErrorInput, imgUrl: false };
        });
        setUriImageShop(source);
      }
    });
  };

  const validateLinkFB = (linkFB) => {
    return String(linkFB)
      .toLowerCase()
      .match(
        /(?:https?:\/\/)?(?:www\.)?(mbasic.facebook|m\.facebook|facebook|fb)\.(com|me)\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/gi
      );
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleRegisterSeller = async () => {
    Keyboard.dismiss();
    setErrorInput((prevErrorInput) => {
      return { ...prevErrorInput, error: false, success: false };
    });
    var check = false;
    var checkImg = false;
    if (!inputData.nameShop || inputData.nameShop.length > 30) {
      check = true;
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, nameShop: true };
      });
    } else {
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, nameShop: false };
      });
    }
    if (!validateEmail(inputData.emailPaypal)) {
      check = true;
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, emailPaypal: true };
      });
    } else {
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, emailPaypal: false };
      });
    }
    if (!!inputData.linkFB && !validateLinkFB(inputData.linkFB)) {
      check = true;
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, linkFB: true };
      });
    } else {
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, linkFB: false };
      });
    }

    if (!uriImageShop) {
      checkImg = true;
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, imgUrl: true };
      });
    } else if (!errorInput.imgUrl) {
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, imgUrl: false };
      });
    }

    if (!check && !checkImg && ROLE == "USER") {
      setIsLoading(true);
      var formData = new FormData();
      formData.append("user", dataUser.data.id);
      formData.append("name_store", inputData.nameShop);
      formData.append(`logo`, {
        name: uriImageShop.assets[0].fileName,
        type: "image/jpg",
        uri: uriImageShop.assets[0].uri,
      });
      formData.append("account_no", inputData.emailPaypal);
      formData.append("facebook", inputData.linkFB);
      AccountService.postRegisterSeller(formData).then((res) => {
        if (res.message == "Create Seller is success!") {
          setErrorInput((prevErrorInput) => {
            return { ...prevErrorInput, success: true, error: false };
          });
          setIsLoading(false);
        } else {
          console.log(res.error);
          setIsLoading(false);
          setErrorInput((prevErrorInput) => {
            return { ...prevErrorInput, error: true, success: false };
          });
        }
      });
    } else if (!check && ROLE == "SELLER") {
      setIsLoading(true);
      var formData = new FormData();
      formData.append("name_store", inputData.nameShop);
      if (!!uriImageShop) {
        formData.append(`logo`, {
          name: uriImageShop.assets[0].fileName,
          type: "image/jpg",
          uri: uriImageShop.assets[0].uri,
        });
      }
      formData.append("account_no", inputData.emailPaypal);
      formData.append("facebook", inputData.linkFB);
      AccountService.putSellerProfile(dataUser.data.id, formData).then((res) => {
        if (res.message == "Seller updated is sucess!") {
          setErrorInput((prevErrorInput) => {
            return { ...prevErrorInput, success: true, error: false };
          });
          setIsLoading(false);
        } else {
          console.log(res.error);
          setIsLoading(false);
          setErrorInput((prevErrorInput) => {
            return { ...prevErrorInput, error: true, success: false };
          });
        }
      });
    } else {
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, error: false, success: false };
      });
    }
  };

  useEffect(() => {
    props.navigation.setOptions({
      title: ROLE == "SELLER" ? "Chỉnh sửa cửa hàng" : "Đăng ký bán hàng",
      headerRight: () => (
        <TouchableOpacity activeOpacity={0.8} onPress={handleRegisterSeller}>
          <Text
            style={[
              AppStyles.FontStyle.button,
              { color: AppStyles.ColorStyles.color.gray_800 },
            ]}
          >
            {ROLE == "SELLER" ? "Lưu" : "Đăng ký"}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [inputData, props.navigation, uriImageShop]);
  return (
    <ScrollView style={styles.container}>
      <View style={{ alignItems: "center", width: "100%", marginVertical: 24 }}>
        {isLoading && <Loading />}
        {errorInput.success ? (
          <Text style={[AppStyles.FontStyle.subtitle_1, styles.textSuccess]}>
            {ROLE == "SELLER"
              ? "Sửa thành công"
              : "Đăng ký bán hàng thành công"}
          </Text>
        ) : errorInput.error ? (
          <Text style={[AppStyles.FontStyle.subtitle_1, styles.textError]}>
            {ROLE == "SELLER"
              ? "Sửa không thành công"
              : "Đăng ký không thành công"}
          </Text>
        ) : null}
        <View style={styles.imageContainer}>
          {(!uriImageShop && !!inputData.imgUrl) ||
          (!!uriImageShop) ? (
            <View>
              <Image
                resizeMode="cover"
                style={styles.logo}
                source={{
                  uri:
                    !!inputData.imgUrl && !uriImageShop
                      ? `${API_URL}${inputData.imgUrl}`
                      : uriImageShop.assets[0].uri,
                }}
              ></Image>
              <TouchableOpacity
                style={styles.iconEdit}
                onPress={selectFile}
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
          ) : (
            <View style={styles.imgNotChoose}>
              <TouchableOpacity onPress={selectFile} activeOpacity={0.9}>
                <Icon
                  name="camera-plus-outline"
                  size={70}
                  color={"gray"}
                  style={styles.iconImg}
                />
              </TouchableOpacity>
              <Text style={AppStyles.FontStyle.subtitle_1}>Chọn ảnh shop</Text>
              {errorInput.imgUrl ? (
                <Text
                  style={[
                    AppStyles.FontStyle.body_2,
                    styles.textError,
                    { textAlign: "center" },
                  ]}
                >
                  *Ảnh không hợp lệ
                </Text>
              ) : null}
            </View>
          )}
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Tên shop*
          </Text>
          <Input
            value={inputData.nameShop}
            onChangeText={(e) => {
              setInputData({ ...inputData, nameShop: e });
            }}
            placeholder="Nhập tên shop"
            style={styles.inputText}
            placeholderTextColor={AppStyles.ColorStyles.color.gray_400}
          />
          {errorInput.nameShop ? (
            <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
              *Tên shop nhỏ hơn 30 ký tự
            </Text>
          ) : null}
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Email Paypal*
          </Text>
          <Input
            value={inputData.emailPaypal}
            onChangeText={(e) => {
              setInputData({ ...inputData, emailPaypal: e });
            }}
            placeholder="Nhập email Paypal"
            style={styles.inputText}
            placeholderTextColor={AppStyles.ColorStyles.color.gray_400}
          />
          {errorInput.emailPaypal ? (
            <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
              *Email Paypal không hợp lệ
            </Text>
          ) : null}
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Link facebook
          </Text>
          <Input
            value={inputData.linkFB}
            onChangeText={(e) => {
              setInputData({ ...inputData, linkFB: e });
            }}
            placeholder="Dán link facebook vào dây"
            style={styles.inputText}
            placeholderTextColor={AppStyles.ColorStyles.color.gray_400}
          />
          {errorInput.linkFB ? (
            <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
              *Link facebook không hợp lệ
            </Text>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
};

export default RegisterSellerScreen;

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
  imageContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    borderColor: AppStyles.ColorStyles.color.primary_dark,
    borderRadius: 50,
    borderWidth: 3,
    width: 100,
    height: 100,
    position: "relative",
  },
  iconImg: {},
  iconEdit: {
    position: "absolute",
    bottom: -10,
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
  textError: {
    color: AppStyles.ColorStyles.color.error_400,
    width: 325,
  },
  imgNotChoose: {
    display: "flex",
    alignItems: "center",
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
});
