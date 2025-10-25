import axios from "axios";

const API_URL = import.meta.env.API_URL;
const API_KEY = import.meta.env.API_KEY;

// Fetch latest news, optionally filtered by category or query term.
export async function fetchNews({ category = "", q = "", page = 1 }) {
  try {
    const params = {
      apiKey: API_KEY,
      country: "us",
      page,
    };

    if (category) params.category = category;
    if (q) params.q = q;

    const response = await axios.get(`${API_URL}/top-headlines`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    return { articles: [], totalResults: 0, page: 1 };
  }
}
