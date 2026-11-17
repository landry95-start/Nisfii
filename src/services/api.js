
import axios from "axios";

// Adresse de base de notre API
const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Adresse principale du serveur backend
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

// Configuration Axios
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

export default api;
