import axios from "axios";

const API = axios.create({
  baseURL: "https://shoppingo-backend.vercel.app/api",
  withCredentials: true
});

// Attach access token
API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// Handle token expiry
API.interceptors.response.use(
  (res) => res,

  async (error) => {

    const originalRequest = error.config;

    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        const { data } = await axios.post(
          "https://shoppingo-backend.vercel.app/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        localStorage.setItem("token", data.accessToken);

        originalRequest.headers.Authorization =
          `Bearer ${data.accessToken}`;

        return API(originalRequest);

      } catch (err) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return Promise.reject(err);
      }

    }

    return Promise.reject(error);
  }
);

export default API;