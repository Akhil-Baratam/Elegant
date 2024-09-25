import axios from 'axios';

export const fetchProducts = () => async (dispatch) => {
  try {
    const res = await axios.get('/products');
    dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: res.data });
  } catch (error) {
    dispatch({ type: 'FETCH_PRODUCTS_FAIL', payload: error.response.data });
  }
};

export const fetchProductDetails = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/products/${id}`);
    dispatch({ type: 'FETCH_PRODUCT_DETAILS_SUCCESS', payload: res.data });
  } catch (error) {
    dispatch({ type: 'FETCH_PRODUCT_DETAILS_FAIL', payload: error.response.data });
  }
};

export const addProduct = (product) => async (dispatch) => {
  try {
    const res = await axios.post('/products', product);
    dispatch({ type: 'ADD_PRODUCT_SUCCESS', payload: res.data });
  } catch (error) {
    dispatch({ type: 'ADD_PRODUCT_FAIL', payload: error.response.data });
  }
};

export const updateProduct = (id, product) => async (dispatch) => {
  try {
    const res = await axios.put(`/products/${id}`, product);
    dispatch({ type: 'UPDATE_PRODUCT_SUCCESS', payload: res.data });
  } catch (error) {
    dispatch({ type: 'UPDATE_PRODUCT_FAIL', payload: error.response.data });
  }
};

export const deleteProduct = (id) => async (dispatch) => {
  try {
    await axios.delete(`/products/${id}`);
    dispatch({ type: 'DELETE_PRODUCT_SUCCESS', payload: id });
  } catch (error) {
    dispatch({ type: 'DELETE_PRODUCT_FAIL', payload: error.response.data });
  }
};

export const searchProducts = (query, category, minPrice, maxPrice) => async (dispatch) => {
  try {
    const res = await axios.get('/search', { params: { query, category, minPrice, maxPrice } });
    dispatch({ type: 'SEARCH_PRODUCTS_SUCCESS', payload: res.data });
  } catch (error) {
    dispatch({ type: 'SEARCH_PRODUCTS_FAIL', payload: error.response.data });
  }
};