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
import AppStyles from "../../theme/AppStyles";
import Loading from "../../component/Loading";
import { useIsFocused } from "@react-navigation/native";
import ProductService from "../../config/service/ProductService";
import product from "../../../assets/image/product.png";
import { launchImageLibrary } from "react-native-image-picker";

const AddImageProduct = (props) => {
  const { id, userId } = props.route.params;
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteProduct = () => {
    ProductService.deleteProduct(id).then((res) => {
      if (res.message == "Product deleted is success!") {
        props.navigation.goBack();
      }
    });
  };

  useEffect(() => {
    props.navigation.setOptions({
      header: ({ navigation, back }) => {
        return (
          <View style={styles.headerStyle}>
            <View style={styles.headerLeft}>
              <Text
                style={[AppStyles.FontStyle.headline_6, { marginLeft: 20 }]}
              >
                Thêm ảnh sản phẩm
              </Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.btnCancel}
                activeOpacity={0.7}
                onPress={handleDeleteProduct}
              >
                <Text
                  style={[
                    { color: AppStyles.ColorStyles.color.primary_normal },
                  ]}
                >
                  Hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnNext}
                onPress={handleAddProductIMG}
                activeOpacity={0.7}
              >
                <Text style={[{ color: "white" }]}>Tiếp</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      },
    });
  }, [props.navigation, images]);

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

  const handleAddProductIMG = () => {
    setIsLoading(true);
    if (images.length > 0) {
      var formData = new FormData();
      formData.append("product_id", id);
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
          props.navigation.replace("AddProductChildScreen", {
            id: id,
            userId: userId,
          });
        } else {
          console.log("error add product img");
        }
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      {isLoading && <Text>Loading...</Text>}
      <View style={styles.content}>
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

export default AddImageProduct;

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
  btnCancel: {
    padding: 4,
    paddingHorizontal: 8,
    marginRight: 16,
  },
  btnNext: {
    backgroundColor: AppStyles.ColorStyles.color.primary_normal,
    borderWidth: 1,
    borderColor: AppStyles.ColorStyles.color.primary_normal,
    borderRadius: 4,
    padding: 4,
    paddingHorizontal: 8,
  },
});
