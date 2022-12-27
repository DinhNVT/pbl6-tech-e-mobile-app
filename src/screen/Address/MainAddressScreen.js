import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { React, useState, useEffect } from "react";
import { WebView } from "react-native-webview";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AppStyles from "../../theme/AppStyles";
import product from "../../../assets/image/product.png";
import ButtonOutlined from "../../component/ButtonOutlined";
import AuthenticationService from "../../config/service/AuthenticationService";
import CartService from "../../config/service/CartService";
import Config from "react-native-config";
import Input from "../../component/Input";
import AccountService from "../../config/service/AccountService";
import Loading from "../../component/Loading";
import { resolveSoa } from "dns";

const MainAddressScreen = (props) => {
  // const [users, setUsers] = useState("");
  const [infoAddress, setInfoAddress] = useState({
    phone: "",
    address: "",
  });

  const [error, setError] = useState({
    phone: false,
    error: false,
    success: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState([]);
  const [tinh, setTinh] = useState("");
  const [quan, setQuan] = useState("");
  const [phuong, setPhuong] = useState("");
  const [detail, setDetail] = useState("");

  const handleUpdateAddress = async () => {
    setError((prevErrorInput) => {
      return { ...prevErrorInput, success: false, error: false };
    });

    var check = false;
    function isNumeric(str) {
      if (typeof str != "string") return false; // we only process strings!
      return (
        !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str))
      ); // ...and ensure strings of whitespace fail
    }
    if (!!infoAddress.phone && infoAddress.phone.length != 10) {
      check = true;
      setError((prevErrorInput) => {
        return { ...prevErrorInput, phone: true };
      });
    } else {
      setError((prevErrorInput) => {
        return { ...prevErrorInput, phone: false };
      });
    }

    if (!check) {
      setIsLoading(true);
      const userId = await AuthenticationService.getDataUser();
      AccountService.putEditUserProfile(userId.id, {
        user_profile: {
          address: infoAddress.address,
          phone: infoAddress.phone,
        },
      }).then((res) => {
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
    } else {
      setError((prevErrorInput) => {
        return { ...prevErrorInput, success: false, error: false };
      });
    }
  };

  const getUserProfile = async () => {
    const userId = await AuthenticationService.getDataUser();
    await AccountService.getUserProfile(userId.id).then((res) => {
      if (!!res?.data) {
        // setUsers(res.data);
        setInfoAddress({
          address: res.data.user_profile.address,
          phone: res.data.user_profile.phone,
        });
      } else {
        console.log(res);
      }
    });
  };

  useEffect(() => {
    getUserProfile();
    getAddress();
  }, []);

  useEffect(() => {
    // console.log("ok")
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            handleUpdateAddress();
          }}
        >
          <Text>Lưu</Text>
        </TouchableOpacity>
      ),
    });
  }, [props.navigation, infoAddress]);

  const getAddress = async () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    await fetch("https://provinces.open-api.vn/api/?depth=3", requestOptions)
      .then((response) => response.json())
      .then((result) => setAddress(result))
      .catch((error) => console.log("error", error));
  };

  const setAddressChild = (step, code, name) => {
    if (step == 1) {
      setTinh({
        step: step,
        code: code,
        name: name,
      });
    }
    if (step == 2) {
      setQuan({
        step: step,
        code: code,
        name: name,
      });
    }
    if (step == 3) {
      setPhuong({
        step: step,
        code: code,
        name: name,
      });
    }
  };

  const handleDone = (status) => {
    if (status == "cancel") {
      setModalVisible(false);
      setTinh("");
      setQuan("");
      setPhuong("");
      setDetail("");
    }
    if (status == "done") {
      if (!!detail) {
        setInfoAddress({
          ...infoAddress,
          address: `${detail}, ${phuong.name}, ${quan.name}, ${tinh.name}`,
        });
        setModalVisible(false);
        setTinh("");
        setQuan("");
        setPhuong("");
        setDetail("");
      }
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.headerButton}>
              <TouchableOpacity
                onPress={() => {
                  handleDone("cancel");
                }}
                style={{ padding: 8 }}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleDone("done");
                }}
                style={{ padding: 8 }}
              >
                <Text>Xong</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {!tinh && !quan && !phuong
                ? address.map((item) => (
                    <TouchableOpacity
                      onPress={() => {
                        setAddressChild(1, item.code, item.name);
                      }}
                      style={styles.itemChildAddress}
                    >
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  ))
                : null}
              {!!tinh && !quan && !phuong
                ? address
                    .find((itemFindOne) => itemFindOne.code == tinh.code)
                    .districts.map((item) => (
                      <TouchableOpacity
                        onPress={() => {
                          setAddressChild(2, item.code, item.name);
                        }}
                        style={styles.itemChildAddress}
                      >
                        <Text>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                : null}
              {!!tinh && !!quan && !phuong
                ? address
                    .find((itemFindOne) => itemFindOne.code == tinh.code)
                    .districts.find(
                      (itemFindTwo) => itemFindTwo.code == quan.code
                    )
                    .wards.map((item) => (
                      <TouchableOpacity
                        onPress={() => {
                          setAddressChild(3, item.code, item.name);
                        }}
                        style={styles.itemChildAddress}
                      >
                        <Text>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                : null}
              {!!tinh && !!quan && !!phuong ? (
                <View style={[styles.inputView, { padding: 8 }]}>
                  <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
                    Đường, nhà, xóm, thôn,...
                  </Text>
                  <Input
                    value={detail}
                    onChangeText={setDetail}
                    placeholder="Nhập đường, nhà, xóm, thôn,..."
                    style={styles.inputText}
                  />
                  {/* {error.phone ? (
                  <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
                    *Số điện thoại phải 10 số
                  </Text>
                ) : null} */}
                </View>
              ) : null}
            </ScrollView>
          </View>
        </Modal>
        {isLoading && <Loading></Loading>}
        {error.success ? (
          <Text style={[AppStyles.FontStyle.subtitle_1, styles.textSuccess]}>
            Đổi địa chỉ thành công
          </Text>
        ) : error.error ? (
          <Text style={[AppStyles.FontStyle.subtitle_1, styles.textError]}>
            Đổi địa chỉ không thành công
          </Text>
        ) : null}
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Số điện thoại
          </Text>
          <Input
            value={infoAddress.phone}
            onChangeText={(e) => {
              setInfoAddress({ ...infoAddress, phone: e });
            }}
            placeholder="Nhập số điện thoại"
            style={styles.inputText}
          />
          {error.phone ? (
            <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
              *Số điện thoại phải 10 số
            </Text>
          ) : null}
        </View>
        <View style={styles.inputView}>
          <Text style={[AppStyles.FontStyle.body_2, styles.label]}>
            Địa chỉ
          </Text>
          <TouchableOpacity
            style={{
              borderRadius: 4,
              borderColor: AppStyles.ColorStyles.color.primary_normal,
              borderWidth: 1,
              paddingVertical: 8,
              paddingLeft: 8,
              paddingRight: 8,
              marginTop: 8,
            }}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Text style={[AppStyles.FontStyle.subtitle_1]}>
              {!!infoAddress.address ? infoAddress.address : "Chọn"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MainAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: "white",
  },
  label: {
    color: AppStyles.ColorStyles.color.primary_normal,
    marginLeft: 8,
  },
  inputView: {
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
  centeredView: {
    flex: 1,
    backgroundColor: "white",
  },
  headerButton: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: 48,
    flexDirection: "row",
    borderBottomColor: AppStyles.ColorStyles.color.gray_400,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  itemChildAddress: {
    borderBottomColor: AppStyles.ColorStyles.color.gray_400,
    borderBottomWidth: 0.5,
    borderTopColor: AppStyles.ColorStyles.color.gray_400,
    borderTopWidth: 0.5,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
});
