import { useState } from "react";
import MovieGrid from "../MovieGrid/MovieGrid";
import SearchBar from "../SearchBar/SearchBar";
import css from "./App.module.css";
import { Toaster } from "react-hot-toast";
import fetchMovies from "../../services/movieService";
import type { Movie, MoviesHttpResponse } from "../../types/movie";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useQuery<MoviesHttpResponse>({
    queryKey: ["movies", searchTerm, currentPage],
    queryFn: () => fetchMovies(searchTerm, currentPage),
    enabled: searchTerm.trim() !== "",
    placeholderData: keepPreviousData,
  });

  const handleSubmit = async (query: string) => {
    setCurrentPage(1);
    setSearchTerm(query.trim());
    setSelectedMovie(null);
  };
  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSubmit} />
      <Toaster position="top-center" />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && data.total_pages > 1 && data.results.length > 0 && (
        <ReactPaginate
          pageCount={data.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {data && <MovieGrid movies={data.results} onSelect={setSelectedMovie} />}
      {data?.results.length === 0 && !isLoading && (
        <p className={css.text}>No movies found for your search.</p>
      )}
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
