import axios from "axios";

export const API_URL =
  import.meta.env.VITE_API_URL || "https://rank-rush-8mxd.onrender.com/api";

export const api = axios.create({ baseURL: API_URL });
