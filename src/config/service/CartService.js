import HandleApi from "../api/HandleAPI";

const getCartItem = async () => {
  return await HandleApi.APIGetWithToken(`cart-item/`);
};

const getOrder = async (id) => {
  return await HandleApi.APIGetWithToken(`tech/order/${id}/`);
};

const postCreateOrder = async (params) => {
  return await HandleApi.APIPostWithToken(`tech/order/`, params);
};

const postCheckOut = async (params) => {
  return await HandleApi.APIPostWithToken(`tech/checkout/`, params);
};

const deleteOrder = async (id) => {
  return await HandleApi.APIDeleteWithToken(`tech/order/${id}/`);
};

const postAddToCart = async (params) => {
  return await HandleApi.APIPostWithToken(`cart-item/`, params);
};

const deleteCartItem = async (id) => {
  return await HandleApi.APIDeleteWithToken(`cart-item/${id}/`);
};

const deleteAllCartItem = async (params) => {
  return await HandleApi.APIPostWithToken(`cart-item/delete/`, params);
};

const putUpdateCartItem = async (id, params) => {
  return await HandleApi.APIPutWithToken(`cart-item/${id}/`, params);
};

const CartService = {
  getCartItem,
  postAddToCart,
  deleteCartItem,
  putUpdateCartItem,
  deleteAllCartItem,
  getOrder,
  postCreateOrder,
  deleteOrder,
  postCheckOut,
};

export default CartService;
