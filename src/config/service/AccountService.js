import HandleApi from "../api/HandleAPI";

const getUserProfile = async (id) => {
  return await HandleApi.APIGetWithToken(`auth/profile/${id}/`);
};

const postRegisterSeller = async (formData) => {
  return await HandleApi.APIPostWithFormData('auth/seller/', formData);
};

const getSellerProfile = async (id) => {
  return await HandleApi.APIGet(`auth/seller/${id}/`);
};

const putSellerProfile = async (id, formData) => {
  return await HandleApi.APIPutWithFormData(`auth/seller/${id}/`, formData);
};

const AccountService = {
  getUserProfile,
  postRegisterSeller,
  getSellerProfile,
  putSellerProfile
};

export default AccountService;
