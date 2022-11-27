import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import CardProductItem from "../component/CardProductItem";
import AppStyles from "../theme/AppStyles";
import Logo from "../../assets/icons/Logo.png";
import Icon from "react-native-vector-icons/FontAwesome5";
import InputSearch from "../component/InputSearch";

const SearchScreen = (props) => {
  const onSearch = () => {
    props.navigation.navigate("SearchScreen");
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoView}>
          <Image resizeMode="cover" style={styles.logo} source={Logo}></Image>
        </View>
        <InputSearch onSearch={onSearch} />
        <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
          <Icon
            name="shopping-cart"
            size={20}
            color={"white"}
            style={{
              backgroundColor: AppStyles.ColorStyles.color.secondary_400,
              padding: 8,
              borderRadius: 6,
              marginLeft: 8
            }}
          />
        </TouchableOpacity>
      </View>
      <Text
        style={[
          AppStyles.FontStyle.headline_6,
          { color: AppStyles.ColorStyles.color.gray_700, marginLeft: 8 },
        ]}
      >
        Kết quá tìm kiếm "iphone"
      </Text>
      <ScrollView>
        <View style={styles.content}>
          <CardProductItem />
          <CardProductItem />
          <CardProductItem />
          <CardProductItem />
          <CardProductItem />
        </View>
      </ScrollView>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "white",
    flex: 1,
    width: '100%'
  },
  content: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "white",
    flexDirection: "row",
  },
  header: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "nowrap",
  },
  logo: {
    width: "100%",
    height: "90%",
  },
  logoView: {
    width: 35,
    height: 24,
    marginRight: 8
  },
});
