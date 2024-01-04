import React, { useEffect, useState } from "react";

import StarRating       from './StarRating'
import Header           from "./Header";
import Box              from "./Box";
import ErrorMessage     from "./ErrorMessage";
import Loader           from "./Loader";
import Main             from "./Main";
import MovieList        from "./MovieList";
import WatchedSummery   from './WatchedSummery'
import WatchedMovieList from "./WatchedMovieList";
import MovieDetails     from "./MovieDetails";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('')
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLodaing] = useState(false)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  let api = `http://www.omdbapi.com/?apikey=f2f2e7d1&s=${query}`

  function hendleSelectMovie(id) {
    setSelectedId(prevId => (id === prevId ? null : id))
  }

  function handleCloseMovie() {
    setSelectedId(null)
  }

  useEffect(function () {
    async function fetchMovies() {
      try {
        setIsLodaing(true)
        setError('')
        const res = await fetch(api)

        if (!res.ok) throw new Error('Something went wrong')

        const data = await res.json();

        if (data.Response === 'False') throw new Error('Movie not found')

        setMovies(data.Search)
        // console.log(data.Search);
        // console.log(data);
      }
      catch (err) {
        console.log(err.message)
        setError(err.message)
      }
      finally {
        setIsLodaing(false)
      }
    }

    if (query.length < 3) {
      setMovies([])
      setError('')
      return
    }

    fetchMovies()
  }, [query])

  return (
    <>
      <Header>
        <div className="logo">
          <span role="img">🍿</span>
          <h1>usePopcorn</h1>
        </div>
        <input
          className="search"
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <p className="num-results">
          Found <strong>{movies.length}</strong> results
          {/* Found <strong>X</strong> results */}
        </p>
      </Header>
      <Main>
        <Box>
          {/* {isLoading && <Loader />}
          {isLoading && !error && <MovieList movies={movies} />}
          {error && <ErrorMessage message={error} />} */}
          {isLoading ? <Loader /> : (error ? <ErrorMessage message={error} /> : <MovieList movies={movies} onSelectMovie={hendleSelectMovie} />)}
        </Box>

        <Box>
          {
            selectedId ? <MovieDetails selectedId={selectedId} onCloseMovie={handleCloseMovie} /> :
              <>
                <WatchedSummery watched={watched} />
                <WatchedMovieList watched={watched} />
              </>
          }
        </Box>
      </Main>
    </>
  );
}