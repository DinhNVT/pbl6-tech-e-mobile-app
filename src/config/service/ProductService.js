import HandleApi from "../api/HandleAPI";

const getListProducts = async (params) => {
  return await HandleApi.APIGet(`product-list/?${params}`);
};

const getListHOTProducts = async () => {
  return await HandleApi.APIGet(`product-list/hot/`);
};

const getDetailProduct = async (id) => {
  return await HandleApi.APIGet(`product/${id}/`);
};

const getProductByIdSeller = async (id, page) => {
  return await HandleApi.APIGetWithToken(
    `product-list/?seller=${id}&page=${page}`
  );
};

const getListCategory = async () => {
  return await HandleApi.APIGet(`category/`);
};

const postCreateProduct = async (params) => {
  return await HandleApi.APIPostWithToken(`product/`, params);
};

const putUpdateProduct = async (id, params) => {
  return await HandleApi.APIPutWithToken(`product/${id}/`, params);
};

const deleteProduct = async (id) => {
  return await HandleApi.APIDeleteWithToken(`product/${id}/`);
};

const postAddProductIMG = async (formData) => {
  return await HandleApi.APIPostWithFormData(`product-images/`, formData);
};

const putUpdateProductIMG = async (id, formData) => {
  return await HandleApi.APIPutWithFormData(`product-images/${id}/`, formData);
};

const deleteProductIMG = async (id) => {
  return await HandleApi.APIDeleteWithToken(`product-images/${id}/`);
};

const postAddProductChild = async (formData) => {
  return await HandleApi.APIPostWithFormData(`product-childs/`, formData);
};

const postUpdateProductChild = async (id, formData) => {
  return await HandleApi.APIPutWithFormData(`product-childs/${id}/`, formData);
};

const deleteProductChild = async (id) => {
  return await HandleApi.APIDeleteWithToken(`product-childs/${id}/`);
};

const postAddProductVariant = async (params) => {
  return await HandleApi.APIPostWithToken(`product-variants/`, params);
};

const putUpdateProductVariant = async (id, params) => {
  return await HandleApi.APIPutWithToken(`product-variants/${id}/`, params);
};

const deleteProductVariant = async (id) => {
  return await HandleApi.APIDeleteWithToken(`product-variants/${id}/`);
};

const postAddProductVariantOption = async (params) => {
  return await HandleApi.APIPostWithToken(`product-variant-options/`, params);
};

const deleteProductVariantOption = async (id) => {
  return await HandleApi.APIDeleteWithToken(`product-variant-options/${id}/`);
};

const getReview = async (id) => {
  return await HandleApi.APIGet(`product/${id}/interactives/`);
};

const postReviewProduct = async (params) => {
  return await HandleApi.APIPostWithFormData(`interactive/`, params);
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
  putUpdateProduct,
  putUpdateProductIMG,
  deleteProductIMG,
  postUpdateProductChild,
  putUpdateProductVariant,
  deleteProductVariant,
  postAddProductVariantOption,
  deleteProductVariantOption,
  getListHOTProducts,
  getReview,
  postReviewProduct,
};

export default ProductService;
