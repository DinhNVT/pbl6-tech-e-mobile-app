import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { React, useState, useEffect } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AppStyles from "../../theme/AppStyles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ButtonFilled from "../../component/ButtonFilled";
import { launchImageLibrary } from "react-native-image-picker";
import Loading from "../../component/Loading";
import ProductService from "../../config/service/ProductService";
import AuthenticationService from "../../config/service/AuthenticationService";

const ReviewProductScreen = (props) => {
  const { idProduct } = props.route.params;
  const [reviewData, setReviewData] = useState({
    star: 1,
    comment: "",
    image: null,
  });
  const [errorInput, setErrorInput] = useState({
    comment: false,
    image: false,
    error: false,
    success: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const startArr = [1, 2, 3, 4, 5];

  const handleReview = async () => {
    // console.log(reviewData);
    setErrorInput((prevErrorInput) => {
      return { ...prevErrorInput, error: false, success: false };
    });

    var check = false;
    if (!reviewData.comment || reviewData.comment.length > 200) {
      check = true;
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, comment: true };
      });
    } else {
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, comment: false };
      });
    }

    if (reviewData.image == null) {
      check = true;
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, image: true };
      });
    } else {
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, image: false };
      });
    }

    if (!check) {
      setIsLoading(true);
      const userId = await AuthenticationService.getDataUser();
      var formData = new FormData();
      formData.append("product", idProduct);
      formData.append("user", userId.id);
      formData.append("favorite", true);
      formData.append("comment", reviewData.comment);
      formData.append("rating", reviewData.star);
      formData.append(`images`, {
        name: reviewData.image.assets[0].fileName,
        type: "image/jpg",
        uri: reviewData.image.assets[0].uri,
      });
      ProductService.postReviewProduct(formData).then((res) => {
        if (res.message == "Evaluate product is Success!") {
          setErrorInput((prevErrorInput) => {
            return { ...prevErrorInput, error: false, success: true };
          });
          setIsLoading(false);
        } else {
          console.log(res);
          setErrorInput((prevErrorInput) => {
            return { ...prevErrorInput, error: true, success: false };
          });
          setIsLoading(false);
        }
      });
    } else {
      setErrorInput((prevErrorInput) => {
        return { ...prevErrorInput, error: false, success: false };
      });
      setIsLoading(false);
    }
  };

  const handleSetStar = (number) => {
    setReviewData((old) => {
      return { ...old, star: number };
    });
  };

  const selectFile = () => {
    var options = {
      // selectionLimit: 20,
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
      if (res.didCancel) {
        console.log("User cancelled image picker");
      } else if (res.error) {
        console.log("ImagePicker Error: ", res.error);
      } else if (res.customButton) {
        console.log("User tapped custom button: ", res.customButton);
        alert(res.customButton);
      } else {
        let source = res;
        setReviewData({ ...reviewData, image: source });
      }
    });
  };

  // console.log(idProduct);
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        {isLoading && <Loading></Loading>}
        {errorInput.success && (
          <Text style={[AppStyles.FontStyle.subtitle_1, styles.textSuccess]}>
            Đánh giá thành công
          </Text>
        )}
        {errorInput.error && (
          <Text style={[AppStyles.FontStyle.subtitle_1, styles.textError]}>
            Bạn chưa mua hoặc đã đánh giá sản phẩm
          </Text>
        )}

        <View style={{ display: "flex", flexDirection: "row", marginTop: 8 }}>
          {startArr.map((item) => (
            <TouchableOpacity
              onPress={() => {
                handleSetStar(item);
              }}
            >
              <FontAwesome
                name={reviewData.star >= item ? "star" : "star-o"}
                size={32}
                color={AppStyles.ColorStyles.color.warning_300}
                style={{ marginHorizontal: 4 }}
              />
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.textInput}
          numberOfLines={10}
          value={reviewData.comment}
          onChangeText={(e) => setReviewData({ ...reviewData, comment: e })}
          textAlignVertical="top"
          placeholder="Nhập đánh giá"
        ></TextInput>
        {errorInput.comment ? (
          <Text style={[AppStyles.FontStyle.body_2, styles.textError]}>
            *không được bỏ trống
          </Text>
        ) : null}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            selectFile();
          }}
          style={[
            styles.itemIMG,
            {
              borderColor: AppStyles.ColorStyles.color.primary_normal,
              borderWidth: 8,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          {!!reviewData.image ? (
            <Image
              resizeMode="cover"
              style={{
                width: "100%",
                height: "100%",
              }}
              source={{
                uri: reviewData.image.assets[0].uri,
              }}
            ></Image>
          ) : (
            <Icon
              name="plus"
              size={100}
              color={AppStyles.ColorStyles.color.primary_normal}
            />
          )}
        </TouchableOpacity>
        {errorInput.comment ? (
          <Text
            style={[
              AppStyles.FontStyle.body_2,
              styles.textError,
              { marginBottom: 8 },
            ]}
          >
            *chưa chọn ảnh
          </Text>
        ) : null}
        <ButtonFilled style={{ width: "100%" }} onPress={handleReview}>
          Đánh giá
        </ButtonFilled>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ReviewProductScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 8,
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  itemIMG: {
    width: "100%",
    height: 300,
    overflow: "hidden",
    margin: 8,
    borderRadius: 8,
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    borderWidth: 2,
  },
  textInput: {
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    borderWidth: 1,
    marginVertical: 8,
    borderRadius: 4,
    padding: 8,
    width: "100%",
  },
  textError: {
    color: AppStyles.ColorStyles.color.error_400,
    width: "100%",
    textAlign: "center",
  },
  textSuccess: {
    color: AppStyles.ColorStyles.color.success_400,
    width: "100%",
    textAlign: "center",
  },
});
