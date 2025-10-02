import axios from "axios";
import type { Movie } from "../types/movie";
const myKey = import.meta.env.VITE_TMDB_TOKEN;

interface MoviesHttpResponse {
  results: Movie[];
}

const fetchMovies = async (query: string): Promise<Movie[]> => {
      if (query === "") {
    return [];
  }
  const response = await axios.get<MoviesHttpResponse>(
    `https://api.themoviedb.org/3/search/movie`,
    {
      params: {
        query: query,
        include_adult: false,
        page: 1,
        language: "en-US",
      },
      headers: { Authorization: `Bearer ${myKey}` },
    }
  );
const data = response.data.results;
  return data
};

export default fetchMovies;
