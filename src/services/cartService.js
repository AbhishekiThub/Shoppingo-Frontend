import API from "./api";

export const getCart = () => API.get("/cart");

export const addCartItem = (productId, quantity = 1) =>
API.post("/cart", { productId, quantity });

export const updateCartItem = (productId, quantity) =>
API.put(`/cart/${productId}`, { quantity });

export const removeCartItem = (productId) =>
API.delete(`/cart/${productId}`);
