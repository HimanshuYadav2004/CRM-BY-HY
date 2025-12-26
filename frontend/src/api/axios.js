import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.53:3000",
  withCredentials: true,
});

export default api;
