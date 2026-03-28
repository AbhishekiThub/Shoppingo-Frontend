import { getCart } from "../services/cartService";
import { setCart, clearCart } from "../features/cartSlice";

export const syncCartFromBackend = async (dispatch) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      dispatch(clearCart());
      return;
    }

    const { data } = await getCart();

    const normalizedItems = (data.cart?.items || []).map((item) => ({
      _id: item.product?._id,
      name: item.product?.name || "",
      price: item.product?.price || 0,
      image: item.product?.images?.[0]?.url || "",
      quantity: item.quantity || 1,
    }));

    dispatch(setCart(normalizedItems));
  } catch (error) {
    console.log(error);
    dispatch(clearCart());
  }
};