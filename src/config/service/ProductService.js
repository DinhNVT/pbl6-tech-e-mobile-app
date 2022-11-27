import HandleApi from "../api/HandleAPI";

const getListProducts = async () => {
  return await HandleApi.APIGetWithToken("tech/product-list");
};

const ProductService = {
  getListProducts
};

export default ProductService;
