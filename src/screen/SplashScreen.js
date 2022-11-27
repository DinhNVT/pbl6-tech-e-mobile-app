import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  ImageBackground,
} from "react-native";
import React from "react";

const SplashScreen = (props) => {
  return (
    <View style={styles.manView}>
      <StatusBar animated={true} hidden={true} />
      <ImageBackground
        source={require("../../assets/icons/Star.png")}
        resizeMode="stretch"
        style={styles.image}
      >
        <Image
          style={{width: "100%", height: 80 }}
          source={require("../../assets/icons/Logo.png")}
          resizeMode = "contain"
        ></Image>
      </ImageBackground>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  manView: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    justifyContent: "center",
    width: 200,
    height: 200,
  },
});
