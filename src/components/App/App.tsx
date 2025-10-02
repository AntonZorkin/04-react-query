import { useState } from "react";
import MovieGrid from "../MovieGrid/MovieGrid";
import SearchBar from "../SearchBar/SearchBar";
import css from "./App.module.css";
import { Toaster } from "react-hot-toast";
import fetchMovies from "../../services/movieService";
import type { Movie } from "../../types/movie";
import { toast } from "react-hot-toast";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSubmit = async (query: string) => {
    setMovies([]);
    try {
      setIsError(false);
      setIsLoading(true);
      const result = await fetchMovies(query);
      if (result.length === 0) {
        toast.error("No movies found for your request.");
        return;
      }
      setMovies(result);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSubmit} />
      <Toaster position="top-center" />
      {isError ? (
        <ErrorMessage />
      ) : (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}
      {isLoading && <Loader />}
      {selectedMovie !== null && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};
export default App;
