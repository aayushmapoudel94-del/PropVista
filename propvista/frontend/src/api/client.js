import axios from "axios";

const client = axios.create({
  baseURL: "/api",
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is missing/invalid/expired, the backend responds with
// 401 (Unauthorized) or 422 (bad token format). Instead of showing a
// confusing generic error, wipe the bad token and send the user back
// to Login automatically so they can get a fresh valid token.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 422) {
      localStorage.removeItem("access_token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default client;