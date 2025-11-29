import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

if (!API_BASE_URL || !API_KEY) {
  throw new Error(
    "Missing required environment variables: EXPO_PUBLIC_API_BASE_URL and EXPO_PUBLIC_API_KEY",
  );
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "x-api-key": API_KEY,
  },
  timeout: 10000,
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout");
    }
    if (!error.response) {
      console.error("Network error");
    }
    return Promise.reject(error);
  },
);
