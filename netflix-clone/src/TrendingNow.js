import React from "react";
import "./TrendingNow.css";

function TrendingNow({ movies }) {
  const topMovies = movies.slice(0, 5);

  return (
    <div className="trending">
      <h2 className="trending__title">Trending Now</h2>
      <div className="trending__container">
        {topMovies.map((movie, index) => (
          <div key={movie.id} className="trending__item">
            <div className="trending__rank">{index + 1}</div>
            <img
              className="trending__poster"
              src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
              alt={movie.title}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrendingNow;