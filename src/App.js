import React, { useEffect, useState } from "react";
import StarRating from './StarRating'
import Header from "./Header";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);


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

function Loader() {
  return (
    <p className="loader">Loading...</p>
  )
}

function ErrorMessage({ message }) {
  return (
    <p className="error">{message} ⛔</p>
  )
}

function Main({ children }) {
  return (
    <main className="main">

      {children}

    </main>
  )
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  )
}


function MovieList({ movies, onSelectMovie }) {

  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  )
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li key={movie.imdbID} onClick={() => { onSelectMovie(movie.imdbID) }}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}

function WatchedSummery({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  )
}

function MovieDetails({ selectedId, onCloseMovie }) {
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLodaing] = useState(false)

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre
  } = movie

  useEffect(function () {
    async function getMovieDetails() {
      setIsLodaing(true)
      const res = await fetch(`http://www.omdbapi.com/?apikey=f2f2e7d1&i=${selectedId}`)
      const data = await res.json()
      // console.log(data);
      setMovie(data)
      setIsLodaing(false)
    }
    getMovieDetails()
  }, [selectedId])

  return (
    <div className="detail">
      {isLoading ? <Loader /> :
        <>
          <header className="header">
            <button className="btn-back" onClick={onCloseMovie}>⬅</button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <div>
                <h2>{title}</h2>
                <p>{released} &bull; {runtime}</p>
                <p>{genre}</p>
                <p><span>⭐</span>{imdbRating}Imdb Rating</p>
              </div>
              <section>
                <div className="rating">
                  <StarRating size={30} />
                </div>
                <p><em>{plot}</em></p>
                <p>Director by {director}</p>
              </section>
            </div>
          </header>
        </>
      }
    </div>
  )
}

function WatchedMovieList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  )
}
function WatchedMovie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  )
}