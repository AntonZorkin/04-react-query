import axios from "axios";
import type { MoviesHttpResponse } from "../types/movie";

const myKey = import.meta.env.VITE_TMDB_TOKEN;


const fetchMovies = async (query: string, currentPage: number): Promise<MoviesHttpResponse> => {
      if (query === "") {
        return { results: [], total_pages: 0, page: 1 };
  }
  const response = await axios.get<MoviesHttpResponse>(
    `https://api.themoviedb.org/3/search/movie`,
    {
      params: {
        query: query,
        include_adult: false,
        page: currentPage,
        language: "en-US",
      },
      headers: { Authorization: `Bearer ${myKey}` },
    }
  );
  const data = response.data;

  return data
};

export default fetchMovies;
