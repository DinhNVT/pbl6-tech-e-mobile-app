import HandleApi from "../api/HandleAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";

const postRegister = async (params) => {
  return await HandleApi.APIPost("auth/register/", params);
};

const postLogin = async (params) => {
  return await HandleApi.APIPost("auth/login/", params);
};

const postResetPassword = async (params) => {
  return await HandleApi.APIPost("auth/resetpassword/", params);
};

const refreshToken = async () => {
  console.log("refresh token");
  const token = await getTokenUser();
  const access = await HandleApi.APIPost("auth/login/refresh/", {
    refresh: token.refresh,
  }).then((res) => {
    return res;
  });
  const value = await AsyncStorage.getItem("@Login");
  if (value !== null) {
    const data = JSON.parse(value);
    saveDataLogin({
      message: data.message,
      data: data.data,
      token: {
        refresh: data.token.refresh,
        access: access.access,
      },
    });
  }
};

const postLogout = async () => {
  const refreshToken = await getTokenUser();
  return await HandleApi.APIPost("auth/logout/", {
    refresh: refreshToken.refresh,
  });
};

const saveDataLogin = async (data) => {
  try {
    await AsyncStorage.setItem("@Login", JSON.stringify(data));
  } catch (e) {
    console.log(e);
  }
};

const getDataUser = async () => {
  try {
    const value = await AsyncStorage.getItem("@Login");
    if (value !== null) {
      return JSON.parse(value).data;
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};

const getTokenUser = async () => {
  try {
    const value = await AsyncStorage.getItem("@Login");
    if (value !== null) {
      return JSON.parse(value).token;
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};

const clearDataLogin = async () => {
  try {
    await AsyncStorage.removeItem("@Login");
  } catch (e) {
    console.log(e);
  }
};

const isLogin = async () => {
  const token = await getTokenUser();
  if (!!token) {
    const tokenDecodedRefresh = jwt_decode(token.refresh);
    const tokenDecodedAccess = jwt_decode(token.access);
    if (tokenDecodedRefresh.exp < Math.floor(Date.now() / 1000)) {
      AuthenticationService.clearDataLogin();
      return false;
    } else if (tokenDecodedAccess.exp < Math.floor(Date.now() / 1000)) {
      AuthenticationService.refreshToken();
    }
  } else {
    return false;
  }
  return true;
};

const AuthenticationService = {
  postRegister,
  postLogin,
  saveDataLogin,
  clearDataLogin,
  isLogin,
  refreshToken,
  postLogout,
  getDataUser,
  getTokenUser,
  postResetPassword,
};

export default AuthenticationService;
