import { StyleSheet, Text, View } from "react-native";
import { React, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import LoginScreen from "../screen/LoginScreen";
import SignUpScreen from "../screen/SignUpScreen";
import ResetPasswordScreen from "../screen/ResetPasswordScreen";
import SearchScreen from "../screen/SearchScreen";
import ProfileScreen from "../screen/ProfileScreen";
import HomeScreen from "../screen/HomeScreen";
import ProductDetailScreen from "../screen/ProductDetailScreen";
import ListProductScreen from "../screen/ListProductScreen";

import AppStyles from "../theme/AppStyles";
import Icon from "react-native-vector-icons/FontAwesome5";

import AuthenticationService from "../config/service/AuthenticationService";
import { useDispatch } from "react-redux";
import {
  setDataUser,
  setTokenUser,
  clearDataUser,
} from "../config/redux/features/authSlice";
import jwt_decode from "jwt-decode";
import { useIsFocused } from "@react-navigation/native";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const LoginStack = ({ route }) => (
  <Stack.Navigator
    initialRouteName="LoginScreen"
    screenOptions={{
      // headerTitleStyle: styles.headerTitleStyle,
      headerMode: "float",
      headerShown: false,
    }}
  >
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
    <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
  </Stack.Navigator>
);

const HomeStack = (props) => {
  const isFocused = useIsFocused();
  useEffect(() => {
    AuthenticationService.isLogin();
  }, [props, isFocused]);
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        // headerTitleStyle: styles.headerTitleStyle,
        headerMode: "float",
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="ProductDetailScreen"
        component={ProductDetailScreen}
      />
      <Stack.Screen
        options={{
          headerShown: true,
        }}
        name="ListProductScreen"
        component={ListProductScreen}
      />
    </Stack.Navigator>
  );
};

const TabStack = (props) => {
  const isFocused = useIsFocused();
  useEffect(() => {
    AuthenticationService.isLogin();
  }, [props, isFocused]);
  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontWeight: "600",
          fontSize: 14,
        },
        tabBarInactiveTintColor: AppStyles.ColorStyles.color.secondary_400,
        tabBarActiveTintColor: AppStyles.ColorStyles.color.primary_normal,
        inactiveTintColor: "#ccc",
        style: {
          backgroundColor: "#fff",
          // borderTopColor: "rgba(225,225,225,0.2)",
        },
      }}
    >
      <Tab.Screen
        options={({ route }) => ({
          tabBarStyle: { display: getTabBarVisibility(route) },
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
          title: "Home",
        })}
        name="HomeStack"
        component={HomeStack}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" size={size} color={color} />
          ),
          title: "Tìm kiếm",
        }}
        name="SearchScreen"
        component={SearchScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="user-alt" size={size} color={color} />
          ),
          title: "Cá nhân",
        }}
        name="ProfileScreen"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

const RootNavigator = (props) => {
  const isFocused = useIsFocused();
  useEffect(() => {
    AuthenticationService.isLogin();
  }, [props, isFocused]);
  return (
    <Stack.Navigator
      initialRouteName="TabStack"
      screenOptions={{
        headerShown: false,
        statusBarColor: AppStyles.ColorStyles.color.primary_normal,
      }}
    >
      <Stack.Screen name="LoginStack" component={LoginStack} />
      <Stack.Screen name="TabStack" component={TabStack} />
    </Stack.Navigator>
  );
};

const AppNavigation = () => {
  const dispatch = useDispatch();
  const getInitUser = async () => {
    const token = await AuthenticationService.getTokenUser();
    const data = await AuthenticationService.getDataUser();
    if (!!token) {
      const tokenDecodedRefresh = jwt_decode(token.refresh);
      const tokenDecodedAccess = jwt_decode(token.access);
      if (tokenDecodedRefresh.exp < Math.floor(Date.now() / 1000)) {
        AuthenticationService.clearDataLogin();
      } else if (tokenDecodedAccess.exp < Math.floor(Date.now() / 1000)) {
        AuthenticationService.refreshToken();
      }
      dispatch(setDataUser(data));
      dispatch(
        setTokenUser({
          refresh: token.refresh,
          access: token.access,
        })
      );
    } else {
      dispatch(clearDataUser());
    }
  };
  useEffect(() => {
    getInitUser();
  }, []);
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default AppNavigation;

const getTabBarVisibility = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Feed";
  if (routeName == "ProductDetailScreen" || routeName == "ListProductScreen") {
    return "none";
  }
  return "flex";
};

const styles = StyleSheet.create({
  buttonBar: {
    fontSize: 16,
  },
});
