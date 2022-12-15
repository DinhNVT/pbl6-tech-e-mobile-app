import Config from "react-native-config";
import AuthenticationService from "../service/AuthenticationService";
const API_URL = new URL(Config.API_URL);

async function getToken() {
  if (await AuthenticationService.isLogin()) {
    let data = await AuthenticationService.getTokenUser();
    return "Bearer " + data.access;
  }
}

// const header = {
//   Accept: "application/json",
//   "Content-Type": "application/json",
//   Authorization: "",
// };

function APIGet(url) {
  url = API_URL.toString() + url;
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
}

function APIPost(url, params) {
  url = API_URL.toString() + url;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  }).then((response) => response.json());
}

async function APIGetWithToken(url) {
  url = API_URL.toString() + url;
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: await getToken(),
    },
  }).then((response) => response.json());
}

async function APIPostWithToken(url, params) {
  url = API_URL.toString() + url;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: await getToken(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  }).then((response) => response.json());
}

async function APIPutWithToken(url, params) {
  url = API_URL.toString() + url;
  return fetch(url, {
    method: "PUT",
    headers: {
      Authorization: await getToken(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  }).then((response) => response.json());
}

async function APIPatchWithToken(url, params) {
  url = API_URL.toString() + url;
  return fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: await getToken(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  }).then((response) => response.json());
}

async function APIPostWithFormData(url, body) {
  url = url = API_URL.toString() + url;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: await getToken(),
    },
    body: body,
  }).then((response) => response.json());
}

async function APIPutWithFormData(url, body) {
  url = url = API_URL.toString() + url;
  return fetch(url, {
    method: "PUT",
    headers: {
      Authorization: await getToken(),
    },
    body: body,
  }).then((response) => response.json());
}

// function checkStatus(response) {
//   if (response.status === 500) {
//     errorAlert("Server Error!", "Something went wrong!");
//     return;
//   }
//   return response;
// }

const HandleApi = {
  APIGet,
  APIPost,
  APIPostWithToken,
  APIGetWithToken,
  APIPatchWithToken,
  APIPostWithFormData,
  APIPutWithFormData,
  APIPutWithToken
};

export default HandleApi;
