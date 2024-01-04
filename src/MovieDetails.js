import { useState, useEffect } from "react"
import Loader from "./Loader"
import StarRating from "./StarRating"

export default function MovieDetails({ selectedId, onCloseMovie, onAddWatch }) {
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

  function handleAdd(){
    const newMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0))
    }
    onAddWatch(newMovie)
    onCloseMovie()
  }

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
    <div className="details">
      {isLoading ? <Loader /> :
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>⬅</button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>{released} &bull; {runtime}</p>
              <p>{genre}</p>
              <p><span>⭐</span>{imdbRating}IMDb Rating</p>
            </div>
          </header>
          <section>
            <div className="rating">
              <StarRating maxRating={10} size={24} />
              <button className="btn-add" onClick={handleAdd}>Add to list</button>
            </div>
            <p><em>{plot}</em></p>
            <p>Director by {director}</p>
          </section>
        </>
      }
    </div>
  )
}