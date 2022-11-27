import Config from "react-native-config";
import AuthenticationService from "../service/AuthenticationService";
const API_URL = new URL(Config.API_URL);

async function getToken() {
  if (await AuthenticationService.isLogin()) {
    let data = await AuthenticationService.getTokenUser()
    return "Bearer " + data.access;
  }
}

const header = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: "",
};

function APIPost(url, params) {
  url = API_URL.toString() + url;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  }).then((response) => response.json())
}

async function APIGetWithToken(url) {
  url = API_URL + url;
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: await getToken(),
    },
  })
    .then((response) => response.json());
}

function APIPostWithToken(url, params) {
  url = REACT_APP_API_ENDPOINT + "api/v1/" + url;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: getToken(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })
    .then(checkStatus)
    .then((response) => response.text());
}

function APIPostWithFormData(url, body) {
  url = REACT_APP_API_ENDPOINT + "api/v1/" + url;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: getToken(),
    },
    body: body,
  })
    .then(checkStatus)
    .then((response) => response.text());
}

// function checkStatus(response) {
//   if (response.status === 500) {
//     errorAlert("Server Error!", "Something went wrong!");
//     return;
//   }
//   return response;
// }

const HandleApi = {
  APIPost,
  APIPostWithToken,
  APIGetWithToken,
};

export default HandleApi;
