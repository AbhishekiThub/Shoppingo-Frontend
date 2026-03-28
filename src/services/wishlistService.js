import API from "./api";

export const getWishlist = () => 
  API.get("/wishlist");

export const addToWishlist = (id) =>
  API.post(`/wishlist/add/${id}`);

export const removeFromWishlist = (id) =>
  API.delete(`/wishlist/remove/${id}`);