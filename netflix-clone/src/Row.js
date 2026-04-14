import React, { useState, useEffect, useRef } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";

const base_url = "https://image.tmdb.org/t/p/original/";
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

function Row({ title, fetchUrl, isLargeRow, searchTerm = "" }) {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [displayMovie, setDisplayMovie] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [columnsPerRow, setColumnsPerRow] = useState(4);
  const [loadedImages, setLoadedImages] = useState({});
  const containerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  useEffect(() => {
    const closeHandler = (e) => {
      if (e.detail.rowTitle !== title) {
        setSelectedMovie(null);
        setTimeout(() => setDisplayMovie(null), 600);
      }
    };
    window.addEventListener("closeOtherRows", closeHandler);
    return () => window.removeEventListener("closeOtherRows", closeHandler);
  }, [title]);

  useEffect(() => {
    if (!searchTerm || !gridRef.current) return;
    const updateColumns = () => {
      const gridWidth = gridRef.current?.offsetWidth || 0;
      const cols = Math.floor(gridWidth / 265) || 1;
      setColumnsPerRow(cols);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, [searchTerm, movies]);

  const filteredMovies = movies.filter((movie) =>
    (movie?.title || movie?.name || movie?.original_name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const opts = {
    height: "450",
    width: "100%",
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
    },
  };

  const handleReady = (e) => {
    try {
      e.target.playVideo();
    } catch (err) {
      console.warn("YouTube player not ready yet:", err);
    }
  };

  const handleImageLoad = (key) => {
    setLoadedImages((prev) => ({ ...prev, [key]: true }));
  };

  const handleClick = async (movie, index) => {
    if (selectedMovie?.id === movie.id) {
      setSelectedMovie(null);
      setSelectedIndex(null);
      setTimeout(() => {
        setDisplayMovie(null);
        setTrailerUrl("");
      }, 600);
    } else {
      if (!searchTerm) {
        window.dispatchEvent(new CustomEvent("closeOtherRows", { detail: { rowTitle: title } }));
      }
      setTrailerUrl("");
      setSelectedMovie(movie);
      setDisplayMovie(movie);
      setSelectedIndex(index);

      try {
        const isTV = movie.first_air_date || movie.media_type === "tv" || title.includes("Netflix Originals");
        const mediaType = isTV ? "tv" : "movie";
        const request = await axios.get(`/${mediaType}/${movie.id}/videos?api_key=${API_KEY}`);
        const trailer = request.data.results.find(
          (vid) => vid.site === "YouTube" && (vid.type === "Trailer" || vid.type === "Teaser")
        ) || request.data.results[0];
        if (trailer) setTrailerUrl(trailer.key);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const renderDetailPanel = (keyPrefix, isOpen) => (
    <div key={keyPrefix} className={`row__searchDetailWrapper ${isOpen ? "row__searchDetailWrapper--open" : ""}`}>
      <div className="row__detailVideo">
        {trailerUrl ? (
          <YouTube videoId={trailerUrl} opts={opts} className="youtube-container" onReady={handleReady} />
        ) : (
          displayMovie && <img src={`${base_url}${displayMovie.backdrop_path}`} alt={displayMovie?.name} />
        )}
        <div className="row__detailFade" />
      </div>
      <div className="row__detailContent">
        <h1>{displayMovie?.title || displayMovie?.name || displayMovie?.original_name}</h1>
        <div className="row__detailStats">
          <span className="row__detailRating">Rating: {displayMovie?.vote_average?.toFixed(1)} / 10</span>
          <span className="row__detailYear">
            {displayMovie?.release_date?.substring(0, 4) || displayMovie?.first_air_date?.substring(0, 4)}
          </span>
        </div>
        <p className="row__detailOverview">{displayMovie?.overview}</p>
        <button className="row__detailButton" onClick={() => {
          setSelectedMovie(null);
          setSelectedIndex(null);
          setTimeout(() => setDisplayMovie(null), 600);
        }}>Close</button>
      </div>
    </div>
  );

  const renderSearchGrid = () => {
    const items = [];
    filteredMovies.forEach((movie, index) => {
      if (!movie.backdrop_path) return;
      const imgKey = `${movie.id}-${index}`;
      items.push(
        <div key={imgKey} className="row__posterWrapper">
          {!loadedImages[imgKey] && <div className="row__posterSkeleton" />}
          <img
            onClick={() => handleClick(movie, index)}
            className="row__poster"
            src={`${base_url}${movie.backdrop_path}`}
            alt={movie.name}
            style={{ opacity: loadedImages[imgKey] ? 1 : 0, transition: "opacity 0.5s ease" }}
            onLoad={() => handleImageLoad(imgKey)}
          />
        </div>
      );
      const isLastInRow = (index + 1) % columnsPerRow === 0;
      const isLastItem = index === filteredMovies.length - 1;
      const rowIndex = Math.floor(index / columnsPerRow);
      const selectedRowIndex = selectedIndex !== null ? Math.floor(selectedIndex / columnsPerRow) : -1;
      if ((isLastInRow || isLastItem) && rowIndex === selectedRowIndex) {
        items.push(renderDetailPanel(`detail-${rowIndex}`, !!selectedMovie));
      }
    });
    return items;
  };

  return (
    <div className="row" ref={containerRef}>
      {!searchTerm && <h2>{title}</h2>}
      {searchTerm ? (
        <div className="row__searchGrid" ref={gridRef}>{renderSearchGrid()}</div>
      ) : (
        <div className="row__posters">
          {filteredMovies.map((movie, index) => {
            const imgKey = `${movie.id}-${index}`;
            return (
              (isLargeRow ? movie.poster_path : movie.backdrop_path) && (
                <div key={imgKey} className="row__posterWrapper">
                  {!loadedImages[imgKey] && <div className="row__posterSkeleton" />}
                  <img
                    onClick={() => handleClick(movie, index)}
                    className={`row__poster ${isLargeRow ? "row__posterLarge" : ""}`}
                    src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                    alt={movie.name}
                    style={{ opacity: loadedImages[imgKey] ? 1 : 0, transition: "opacity 0.5s ease" }}
                    onLoad={() => handleImageLoad(imgKey)}
                  />
                </div>
              )
            );
          })}
        </div>
      )}
      {!searchTerm && (
        <div className={`row__detail ${selectedMovie ? "row__detail--open" : ""}`}>
          {displayMovie && renderDetailPanel("standard-detail", true)}
        </div>
      )}
    </div>
  );
}

export default Row;