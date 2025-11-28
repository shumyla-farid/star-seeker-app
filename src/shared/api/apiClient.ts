import axios from "axios";

const API_BASE_URL = "https://hstc-api.testing.keyholding.com";
const API_KEY = "94962B9A-966C-43FC-8E1A-145DEAA5970C";

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
