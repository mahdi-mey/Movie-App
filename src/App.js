import React, { useEffect, useState } from "react";

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
  const [isLoading, setIsLodaing] = useState(false)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const [watched, setWatched] = useState(function (){
    const storedValue = localStorage.getItem('watched')
    return JSON.parse(storedValue)
  });
  
  let api = `http://www.omdbapi.com/?apikey=f2f2e7d1&s=${query}`

  function hendleSelectMovie(id) {
    setSelectedId(prevId => (id === prevId ? null : id))
  }

  function handleCloseMovie() {
    setSelectedId(null)
  }

  function handleAddWatched(movie){
    setWatched((watched) => [...watched, movie])
  }

  function handleDeleteWatched(id){
    setWatched(watched => watched.filter(movie => movie.imdbID !== id))
  }

  useEffect(function (){
    localStorage.setItem('watched', JSON.stringify(watched))
  }, [watched])

  useEffect(function () {

    const controller = new AbortController()

    async function fetchMovies() {
      try {
        setIsLodaing(true)
        setError('')
        const res = await fetch(api, {signal: controller.signal})

        if (!res.ok) throw new Error('Something went wrong')

        const data = await res.json();

        if (data.Response === 'False') throw new Error('Movie not found')

        setMovies(data.Search)
        setError('')
      }
      catch (err) {
        if(err.name !== "AbortError" ){
          setError(err.message)
        }
        console.log(err.message)
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

    return () => {
      controller.abort()
      console.log('cleanup form app.js');
    }

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
        </p>
      </Header>
      <Main>
        <Box>
          {isLoading ? <Loader /> : (error ? <ErrorMessage message={error} /> : <MovieList movies={movies} onSelectMovie={hendleSelectMovie} />)}
        </Box>

        <Box>
          {
            selectedId ? <MovieDetails selectedId={selectedId} watched={watched} onCloseMovie={handleCloseMovie} onAddWatch={handleAddWatched} /> :
              <>
                <WatchedSummery watched={watched} />
                <WatchedMovieList watched={watched} onDelete={handleDeleteWatched} />
              </>
          }
        </Box>
      </Main>
    </>
  );
}