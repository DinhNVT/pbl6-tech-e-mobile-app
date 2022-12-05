import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";

import CardProductItem from "../component/CardProductItem";
import AppStyles from "../theme/AppStyles";

const ListProductScreen = (props) => {
  console.log(props.route.params)
  return (
    <View style={styles.container}>
      <Text style = {[AppStyles.FontStyle.headline_5, {color: AppStyles.ColorStyles.color.gray_700, marginLeft: 8}]}>Danh sách điện thoại</Text>
      <ScrollView >
        <View style={styles.content}>
          <CardProductItem onPress={()=>{props.navigation.navigate("ProductDetailScreen")}}/>
          <CardProductItem />
          <CardProductItem />
          <CardProductItem />
          <CardProductItem />
        </View>
      </ScrollView>
    </View>
  );
};

export default ListProductScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "white",
    flex: 1,
  },
  content: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "white",
    flexDirection: "row",
  },
});
