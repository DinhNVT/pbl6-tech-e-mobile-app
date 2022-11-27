import "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { React, useEffect } from "react";
import SplashScreen from "react-native-splash-screen";
import store from "./src/config/redux/store";
import { Provider } from "react-redux";
import AppNavigation from "./src/navigations/AppNavigation";

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  });
  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
