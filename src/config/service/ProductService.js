import HandleApi from "../api/HandleAPI";

const getListProducts = async (params) => {
  return await HandleApi.APIGet(`product-list/?${params}`);
};

const getDetailProduct = async (id) => {
  return await HandleApi.APIGet(`product/${id}/`);
};

const getProductByIdSeller = async (id) => {
  return await HandleApi.APIGetWithToken(`product-list/?seller=${id}`);
};

const getListCategory = async () => {
  return await HandleApi.APIGet(`category/`);
};

const postCreateProduct = async (params) => {
  return await HandleApi.APIPostWithToken(`product/`, params);
};

const deleteProduct = async (id) => {
  return await HandleApi.APIDeleteWithToken(`product/${id}/`);
};

const postAddProductIMG = async (formData) => {
  return await HandleApi.APIPostWithFormData(`product-images/`, formData);
};

const postAddProductChild = async (formData) => {
  return await HandleApi.APIPostWithFormData(`product-childs/`, formData);
};

const deleteProductChild = async (id) => {
  return await HandleApi.APIDeleteWithToken(`product-childs/${id}/`);
};

const postAddProductVariant = async (params) => {
  return await HandleApi.APIPostWithToken(`product-variants/`, params);
};

const ProductService = {
  getListProducts,
  getDetailProduct,
  getProductByIdSeller,
  getListCategory,
  postCreateProduct,
  deleteProduct,
  postAddProductIMG,
  postAddProductChild,
  deleteProductChild,
  postAddProductVariant,
};

export default ProductService;
