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
import ProfileScreen from "../screen/Profile/ProfileScreen";
import HomeScreen from "../screen/HomeScreen";
import ProductDetailScreen from "../screen/Products/ProductDetailScreen";
import ListProductScreen from "../screen/Products/ListProductScreen";
import EditUserProfileScreen from "../screen/Profile/EditUserProfileScreen";
import ChangePasswordScreen from "../screen/Profile/ChangePasswordScreen";
import RegisterSellerScreen from "../screen/Profile/RegisterSellerScreen";
import ChangeAvtUserScreen from "../screen/Profile/ChangeAvtUserScreen";
import MainShopScreen from "../screen/Shops/MainShopScreen";
import AddProductScreen from "../screen/Shops/AddProductScreen";
import AddImageProduct from "../screen/Shops/AddImageProduct";
import AddProductChildScreen from "../screen/Shops/AddProductChildScreen";
import AddProductVariantScreen from "../screen/Shops/AddProductVariantScreen";
import MainUpdateProduct from "../screen/Shops/MainUpdateProduct";
import CartScreen from "../screen/Cart/CartScreen";
import ViewProductScreen from "../screen/Shops/ViewProductScreen";
import OrderScreen from "../screen/Cart/OrderScreen";
import ReviewProductScreen from "../screen/Products/ReviewProductScreen";
import MainAddressScreen from "../screen/Address/MainAddressScreen";
import PayOutScreen from "../screen/Shops/PayOutScreen";

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

const LoginStack = ({ route }) => {
  return (
    <Stack.Navigator
      initialRouteName={
        route.params.name == "Login" ? "LoginScreen" : "SignUpScreen"
      }
      screenOptions={{
        // headerTitleStyle: styles.headerTitleStyle,
        headerMode: "float",
        headerShown: false,
      }}
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
      />
    </Stack.Navigator>
  );
};

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
          headerShown: false,
        }}
        name="ListProductScreen"
        component={ListProductScreen}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Đánh giá sản phẩm",
        }}
        name="ReviewProductScreen"
        component={ReviewProductScreen}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = (props) => {
  const isFocused = useIsFocused();
  useEffect(() => {
    AuthenticationService.isLogin();
  }, [props, isFocused]);
  return (
    <Stack.Navigator
      initialRouteName="ProfileScreen"
      screenOptions={{
        headerMode: "float",
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Sửa hồ sơ",
          headerTitleAlign: "center",
        }}
        name="EditUserProfileScreen"
        component={EditUserProfileScreen}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Đổi mật khẩu",
          headerTitleAlign: "center",
        }}
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Đổi ảnh đại diện",
          headerTitleAlign: "center",
        }}
        name="ChangeAvtUserScreen"
        component={ChangeAvtUserScreen}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Đăng ký bán hàng",
          headerTitleAlign: "center",
        }}
        name="RegisterSellerScreen"
        component={RegisterSellerScreen}
      />
      <Stack.Screen
        options={{
          headerShown: true,
        }}
        name="MainShopScreen"
        component={MainShopScreen}
      />
      <Stack.Screen
        options={{
          headerShown: true,
        }}
        name="AddProductScreen"
        component={AddProductScreen}
      />
      <Stack.Screen
        options={{
          headerShown: true,
        }}
        name="AddImageProduct"
        component={AddImageProduct}
      />
      <Stack.Screen
        options={{
          headerShown: true,
        }}
        name="AddProductChildScreen"
        component={AddProductChildScreen}
      />
      <Stack.Screen
        options={{
          headerShown: true,
        }}
        name="AddProductVariantScreen"
        component={AddProductVariantScreen}
      />
      <Stack.Screen
        options={{
          headerShown: true,
        }}
        name="MainUpdateProduct"
        component={MainUpdateProduct}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="ViewProductScreen"
        component={ViewProductScreen}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Thông tin tài khoản'
        }}
        name="PayOutScreen"
        component={PayOutScreen}
      />
    </Stack.Navigator>
  );
};

const CartStack = (props) => {
  const isFocused = useIsFocused();
  useEffect(() => {
    AuthenticationService.isLogin();
  }, [props, isFocused]);
  return (
    <Stack.Navigator
      initialRouteName="CartScreen"
      screenOptions={{
        headerMode: "float",
        headerShown: false,
      }}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Giỏ hàng",
          headerTitleAlign: "center",
        }}
        name="CartScreen"
        component={CartScreen}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Thanh toán",
          headerTitleAlign: "center",
        }}
        name="OrderScreen"
        component={OrderScreen}
      />
    </Stack.Navigator>
  );
};

const AddressStack = (props) => {
  const isFocused = useIsFocused();
  useEffect(() => {
    AuthenticationService.isLogin();
  }, [props, isFocused]);
  return (
    <Stack.Navigator
      initialRouteName="MainAddressScreen"
      screenOptions={{
        headerMode: "float",
        headerShown: false,
      }}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Chỉnh sửa thông tin",
          headerTitleAlign: "center",
        }}
        name="MainAddressScreen"
        component={MainAddressScreen}
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
        initialParams={(keyword = "")}
        options={({ route }) => ({
          tabBarStyle: { display: getTabBarVisibility(route) },
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" size={size} color={color} />
          ),
          title: "Tìm kiếm",
        })}
        name="SearchScreen"
        component={SearchScreen}
      />
      <Tab.Screen
        options={({ route }) => ({
          tabBarStyle: { display: getTabBarVisibility(route) },
          tabBarIcon: ({ color, size }) => (
            <Icon name="user-alt" size={size} color={color} />
          ),
          title: "Cá nhân",
        })}
        name="ProfileStack"
        component={ProfileStack}
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
      <Stack.Screen name="CartStack" component={CartStack} />
      <Stack.Screen name="AddressStack" component={AddressStack} />
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
      if (tokenDecodedRefresh.exp - 7200 < Math.floor(Date.now() / 1000)) {
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
  const checkList = [
    "ProductDetailScreen",
    "ListProductScreen",
    "EditUserProfileScreen",
    "ChangePasswordScreen",
    "RegisterSellerScreen",
    "ChangeAvtUserScreen",
    "MainShopScreen",
    "AddProductScreen",
    "AddImageProduct",
    "AddProductChildScreen",
    "AddProductVariantScreen",
    "MainUpdateProduct",
    "ReviewProductScreen",
    "PayOutScreen"
  ];
  if (checkList.includes(routeName)) {
    return "none";
  }
  return "flex";
};

const styles = StyleSheet.create({
  buttonBar: {
    fontSize: 16,
  },
});
