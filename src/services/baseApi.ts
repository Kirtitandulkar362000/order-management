import axios from "axios";

const url = import.meta.env.VITE_API;

const baseURL = `${url}/api/v1`;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000000,
});

// request interceptor
const requestInterceptor = (config: any) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

// response interceptor
const responseInterceptor = (response: any) => response;

const errorInterceptor = (error: any) => {
  const status = error.response?.status;

  switch (status) {
    case 401:
      window.location.replace("/");
      break;

    case 500:
      console.error("Server Error");
      break;

    default:
      console.error("Error:", error.message);
  }

  return Promise.reject(error);
};

api.interceptors.request.use(requestInterceptor, errorInterceptor);

api.interceptors.response.use(responseInterceptor, errorInterceptor);

export { api };
