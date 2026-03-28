import API from "./api";

export const getVendorOrders = () => API.get("/vendor/orders");

export const updateVendorOrderStatus = (orderId, status) =>
  API.put(`/vendor/orders/${orderId}/status`, { status });