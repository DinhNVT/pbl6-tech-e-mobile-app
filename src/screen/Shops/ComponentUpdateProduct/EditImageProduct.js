import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { React, useEffect, useState } from "react";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AppStyles from "../../../theme/AppStyles";
import Loading from "../../../component/Loading";
import { useIsFocused } from "@react-navigation/native";
import ProductService from "../../../config/service/ProductService";
import product from "../../../../assets/image/product.png";
import { launchImageLibrary } from "react-native-image-picker";

const EditImageProduct = (props) => {
  const { idUser, product } = props;
  const [imagesOrigin, setImagesOrigin] = useState(product.img_products);
  const [images, setImages] = useState([]);
  const [imagesEdit, setImagesEdit] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorInput, setErrorInput] = useState({
    name: false,
    error: false,
    success: false,
  });

  useEffect(() => {}, [images]);

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
        setImages((oldImages) => [...oldImages, source]);
      }
    });
  };

  const handleDeleteIMG = (uri) => {
    setImages((prevImages) =>
      prevImages.filter((item) => item.assets[0].uri != uri)
    );
  };

  const handleDeleteIMGWithAPI = (id, index) => {
    if (id == -1) {
      let newArr = [...imagesOrigin];
      newArr.splice(index, 1);
      setImagesOrigin(newArr);
    } else {
      ProductService.deleteProductIMG(id).then((res) => {
        if (res.message == "Delete imgProduct is Success!") {
          setImagesOrigin((old) => {
            return old.filter((item) => item.id != id);
          });
        } else {
          let newArr = [...imagesOrigin];
          newArr.splice(index, 1);
          setImagesOrigin(newArr);
          console.log(res);
        }
      });
    }
  };

  const handleEditIMG = (id, index) => {
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

        let newArrImageEdit = [...imagesEdit];
        let indexNew = newArrImageEdit.findIndex((item) => item.id == id);
        if (indexNew != -1) {
          newArrImageEdit[indexNew] = { id: id, source: source };
          setImagesEdit(newArrImageEdit);
        } else {
          setImagesEdit((oldImages) => [
            ...oldImages,
            { id: id, source: source },
          ]);
        }

        let newArr = [...imagesOrigin];
        newArr[index] = { id: id, source: source };
        setImagesOrigin(newArr);
      }
    });
  };

  const handleAddProductIMG = () => {
    setErrorInput((prevErrorInput) => {
      return { ...prevErrorInput, error: false, success: false };
    });
    setIsLoading(true);
    if (imagesEdit.length > 0) {
      imagesEdit.map((item) => {
        var formData = new FormData();
        formData.append("product_id", product.id);
        formData.append(`image`, {
          name: item.source.assets[0].fileName,
          type: "image/jpg",
          uri: item.source.assets[0].uri,
        });
        ProductService.putUpdateProductIMG(item.id, formData).then((res) => {
          if (res.message == "Updated product image is success!!") {
            setIsLoading(false);
            setErrorInput((prevErrorInput) => {
              return { ...prevErrorInput, error: false, success: true };
            });
          } else {
            setErrorInput((prevErrorInput) => {
              return { ...prevErrorInput, error: true, success: false };
            });
            console.log(res);
            console.log("error add product img");
          }
        });
      });
    }
    if (images.length > 0) {
      var formData = new FormData();
      formData.append("product_id", product.id);
      images.map((item) => {
        formData.append(`images`, {
          name: item.assets[0].fileName,
          type: "image/jpg",
          uri: item.assets[0].uri,
        });
      });
      ProductService.postAddProductIMG(formData).then((res) => {
        if (res.message == "Uploading product image is successful") {
          setIsLoading(false);
          setErrorInput((prevErrorInput) => {
            return { ...prevErrorInput, error: false, success: true };
          });
        } else {
          setErrorInput((prevErrorInput) => {
            return { ...prevErrorInput, error: true, success: false };
          });
          console.log("error add product img");
        }
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      {isLoading && <Text>Loading...</Text>}
      <View style={styles.editCard}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.addToCart, styles.btnDelete]}
          onPress={props.onCancel}
        >
          <Text
            style={{
              color: AppStyles.ColorStyles.color.primary_normal,
            }}
          >
            Quay lại
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleAddProductIMG();
          }}
          activeOpacity={0.7}
          style={[styles.addToCart, styles.btnEdit]}
        >
          <Text style={{ color: "white" }}>Lưu</Text>
        </TouchableOpacity>
      </View>
      {errorInput.success ? (
        <Text style={[AppStyles.FontStyle.subtitle_1, styles.textSuccess]}>
          Sửa thành công
        </Text>
      ) : errorInput.error ? (
        <Text style={[AppStyles.FontStyle.subtitle_1, styles.textError]}>
          Sửa không thành công
        </Text>
      ) : null}
      <View style={styles.content}>
        {imagesOrigin.length > 0
          ? imagesOrigin.map((item, index) => (
              <View style={styles.itemIMG} key={item.id}>
                <Image
                  resizeMode="cover"
                  style={styles.image}
                  source={{
                    uri: !!!item.link
                      ? item.source.assets[0].uri
                      : `${item.link}`,
                  }}
                ></Image>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.deleteIMG]}
                  onPress={() => {
                    let idNew = -1;
                    if (!!item.link) idNew = item.id;
                    handleDeleteIMGWithAPI(idNew, item.index);
                  }}
                >
                  <Icon
                    name="close-box-outline"
                    size={32}
                    color={AppStyles.ColorStyles.color.error_400}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.iconImage]}
                  onPress={() => {
                    handleEditIMG(item.id, index);
                  }}
                >
                  <Icon
                    name="image-edit-outline"
                    size={32}
                    color={AppStyles.ColorStyles.color.gray_400}
                  />
                </TouchableOpacity>
              </View>
            ))
          : undefined}
        {images.length > 0
          ? images.map((item) => (
              <View style={styles.itemIMG} key={item.assets[0].uri}>
                <Image
                  resizeMode="cover"
                  style={styles.image}
                  source={{
                    uri: item.assets[0].uri,
                  }}
                ></Image>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.deleteIMG]}
                  onPress={() => {
                    handleDeleteIMG(item.assets[0].uri);
                  }}
                >
                  <Icon
                    name="close-box-outline"
                    size={32}
                    color={AppStyles.ColorStyles.color.error_400}
                  />
                </TouchableOpacity>
              </View>
            ))
          : undefined}

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={selectFile}
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
          <Icon
            name="plus"
            size={100}
            color={AppStyles.ColorStyles.color.primary_normal}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditImageProduct;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  content: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    flexDirection: "row",
    marginTop: 16,
    marginHorizontal: 8,
  },
  itemIMG: {
    width: 170,
    height: 170,
    overflow: "hidden",
    margin: 8,
    borderRadius: 8,
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    borderWidth: 2,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  deleteIMG: {
    position: "absolute",
    zIndex: 8,
    right: 8,
    top: 8,
    backgroundColor: "white",
    padding: 0,
    margin: 0,
    borderRadius: 4,
  },
  headerStyle: {
    height: 50,
    backgroundColor: "white",
    padding: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
  },
  headerLeft: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerRight: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  editCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingHorizontal: 24,
  },
  btnDelete: {
    width: "45%",
    backgroundColor: "white",
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    borderWidth: 1,
  },
  addToCart: {
    backgroundColor: AppStyles.ColorStyles.color.primary_normal,
    // marginTop: 8,
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    padding: 8,
    width: "100%",
    marginHorizontal: 8,
    marginBottom: 8,
  },
  btnEdit: {
    width: "45%",
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
  iconImage: {
    position: "absolute",
    zIndex: 100,
    left: 8,
    top: 8,
    backgroundColor: "white",
    padding: 0,
    margin: 0,
    borderRadius: 4,
  },
});
