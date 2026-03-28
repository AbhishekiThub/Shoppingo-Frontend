import API from "./api";

export const addReview = (productId, reviewData) =>
  API.post(`/reviews/${productId}`, reviewData);

export const getProductReviews = (productId) =>
  API.get(`/reviews/${productId}`);

export const deleteReview = (productId) =>
  API.delete(`/reviews/${productId}`);