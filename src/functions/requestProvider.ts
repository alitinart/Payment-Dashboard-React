import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;
const API_URL = process.env.REACT_APP_API_URL;

export default function requestProvider(
  pathname: string,
  method: "GET" | "POST" | "DELETE" | "PATCH",
  data?: any,
  requestHeaders?: any
) {
  const headers = {
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
    ...requestHeaders,
  };
  switch (method) {
    case "POST":
      return axios.post(`${API_URL}${pathname}`, data, {
        headers,
      });
    case "GET":
      return axios.get(`${API_URL}${pathname}`, {
        headers,
      });
    case "DELETE":
      return axios.delete(`${API_URL}${pathname}`, { data, headers });
    case "PATCH":
      return axios.patch(`${API_URL}${pathname}`, { data, headers });
  }
}
