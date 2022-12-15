import HandleApi from "../api/HandleAPI";

const getListProducts = async (params) => {
  return await HandleApi.APIGet(`product-list/?${params}`);
};

const getDetailProduct = async (id) => {
  return await HandleApi.APIGet(`product/${id}/`);
};

const ProductService = {
  getListProducts,
  getDetailProduct,
};

export default ProductService;
