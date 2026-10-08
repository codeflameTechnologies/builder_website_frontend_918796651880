import axios from "axios";

const api = axios.create({
  baseURL:  "https://builderwebsitebackend918796651880.vercel.app/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("codeflame_builder_adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("codeflame_builder_adminToken");
      localStorage.removeItem("codeflame_builder_adminInfo");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default api;
