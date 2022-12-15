import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { React, useEffect, useState } from "react";
import AppStyles from "../../theme/AppStyles";
import Config from "react-native-config";
import ButtonOutlined from "../../component/ButtonOutlined";
import { launchImageLibrary } from "react-native-image-picker";
import Loading from "../../component/Loading";
import AccountService from "../../config/service/AccountService";

const ChangeAvtUserScreen = (props) => {
  const { avt, id } = props.route.params;
  const API_URL = new URL(Config.API_URL);
  const [uriAvt, setAvt] = useState(null);
  const [error, setError] = useState({
    uriAvt: false,
    error: false,
    success: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const selectFile = () => {
    setError((prevErrorInput) => {
      return { ...prevErrorInput, success: false, error: false };
    });
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
        setError((prevErrorInput) => {
          return { ...prevErrorInput, uriAvt: true };
        });
      } else if (res.customButton) {
        console.log("User tapped custom button: ", res.customButton);
        alert(res.customButton);
      } else {
        let source = res;
        setError((prevErrorInput) => {
          return { ...prevErrorInput, uriAvt: false };
        });
        setAvt(source);
      }
    });
  };

  const handleChangeAvtUser = () => {
    setError((prevErrorInput) => {
      return { ...prevErrorInput, success: false, error: false };
    });
    setIsLoading(true);
    var formData = new FormData();
    formData.append(`avt`, {
      name: uriAvt.assets[0].fileName,
      type: "image/jpg",
      uri: uriAvt.assets[0].uri,
    });
    AccountService.putChangeAvtUser(id, formData).then((res) => {
      if (res.message == "Update Profile completed!") {
        setIsLoading(false);
        setError((prevErrorInput) => {
          return { ...prevErrorInput, success: true, error: false };
        });
      } else {
        setIsLoading(false);
        setError((prevErrorInput) => {
          return { ...prevErrorInput, success: false, error: true };
        });
      }
    });
  };

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View>
          {!!uriAvt && (
            <TouchableOpacity activeOpacity={0.8} onPress={handleChangeAvtUser}>
              <Text
                style={[
                  AppStyles.FontStyle.button,
                  { color: AppStyles.ColorStyles.color.gray_800 },
                ]}
              >
                Lưu
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [props.navigation, uriAvt]);

  return (
    <View style={styles.container}>
      {isLoading && <Loading />}
      {error.success ? (
        <Text style={[AppStyles.FontStyle.subtitle_1, styles.textSuccess]}>
          Đổi ảnh thành công
        </Text>
      ) : error.error ? (
        <Text style={[AppStyles.FontStyle.subtitle_1, styles.textError]}>
          Đổi ảnh không thành công
        </Text>
      ) : null}
      <Image
        resizeMode="cover"
        style={styles.avt}
        source={
          !!uriAvt && !error.uriAvt
            ? { uri: uriAvt.assets[0].uri }
            : !!avt && !uriAvt
            ? { uri: `${API_URL}${avt}` }
            : null
        }
      ></Image>
      <ButtonOutlined onPress={selectFile}>Chọn ảnh</ButtonOutlined>
    </View>
  );
};

export default ChangeAvtUserScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    display: "flex",
    alignItems: "center",
    paddingTop: 24,
  },
  avt: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    width: "90%",
    height: 300,
    backgroundColor: "white",
    marginBottom: 16,
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
