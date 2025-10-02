import { useState } from "react";
import MovieGrid from "../MovieGrid/MovieGrid";
import SearchBar from "../SearchBar/SearchBar";
import css from "./App.module.css";
import { Toaster} from "react-hot-toast";
import fetchMovies from "../../services/movieService";
import type { Movie } from "../../types/movie";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useQuery } from "@tanstack/react-query";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery<Movie[]>({
    queryKey: ["movies", searchTerm],
    queryFn: () => fetchMovies(searchTerm),
    enabled: searchTerm.trim() !== "",
    
  });

  const handleSubmit = async (query: string) => {
    setSearchTerm(query.trim());  
    setSelectedMovie(null);
  };
  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSubmit} />
      <Toaster position="top-center" />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && <MovieGrid movies={data} onSelect={setSelectedMovie}/>}
      {data?.length===0 && <p className={css.text}>No movies found for your search.</p>}
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
