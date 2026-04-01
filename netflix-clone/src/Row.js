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
  const rowRef = useRef(null);
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const velocity = useRef(0);
  const animationFrame = useRef(null);

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

  useEffect(() => {
    const el = rowRef.current;
    if (!el || movies.length === 0 || searchTerm) return;

    const applyMomentum = () => {
      if (Math.abs(velocity.current) > 0.1) {
        el.scrollLeft += velocity.current;
        velocity.current *= 0.95;
        const section = el.scrollWidth / 3;
        if (el.scrollLeft >= section * 2) el.scrollLeft -= section;
        else if (el.scrollLeft <= 0) el.scrollLeft += section;
        animationFrame.current = requestAnimationFrame(applyMomentum);
      }
    };

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        if (!e.cancelable) return;
        e.preventDefault();
        velocity.current += e.deltaY * 0.15;
        cancelAnimationFrame(animationFrame.current);
        applyMomentum();
      }
    };

    el.scrollLeft = el.scrollWidth / 3;
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(animationFrame.current);
    };
  }, [movies, searchTerm]);

  const filteredMovies = movies.filter((movie) =>
    (movie?.title || movie?.name || movie?.original_name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const finalMovies = searchTerm
    ? filteredMovies
    : [...filteredMovies, ...filteredMovies, ...filteredMovies];

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
    if (searchTerm) {
      if (selectedMovie?.id === movie.id) {
        setSelectedMovie(null);
        setSelectedIndex(null);
        setTimeout(() => {
          setDisplayMovie(null);
          setTrailerUrl("");
        }, 600);
      } else {
        setTrailerUrl("");
        setSelectedMovie(movie);
        setDisplayMovie(movie);
        setSelectedIndex(index);
        try {
          const isTV = movie.first_air_date || movie.media_type === "tv";
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
    } else {
      if (selectedMovie?.id === movie.id) {
        setSelectedMovie(null);
        setTimeout(() => {
          setDisplayMovie(null);
          setTrailerUrl("");
        }, 600);
      } else {
        window.dispatchEvent(new CustomEvent("closeOtherRows", { detail: { rowTitle: title } }));
        setSelectedMovie(null);
        setTimeout(async () => {
          setTrailerUrl("");
          setSelectedMovie(movie);
          setDisplayMovie(movie);
          containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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
        }, 600);
      }
    }
  };

  const renderDetailPanel = (keyPrefix, isOpen) => (
    <div
      key={keyPrefix}
      className={`row__searchDetailWrapper ${isOpen ? "row__searchDetailWrapper--open" : ""}`}
    >
      <div className="row__detailVideo">
        {trailerUrl ? (
          <YouTube
            videoId={trailerUrl}
            opts={opts}
            className="youtube-container"
            onReady={handleReady}
          />
        ) : (
          displayMovie && (
            <img
              src={`${base_url}${displayMovie.backdrop_path}`}
              alt={displayMovie?.name}
            />
          )
        )}
        <div className="row__detailFade" />
      </div>
      <div className="row__detailContent">
        <h1>{displayMovie?.title || displayMovie?.name || displayMovie?.original_name}</h1>
        <div className="row__detailStats">
          <span className="row__detailRating">
            Rating: {displayMovie?.vote_average?.toFixed(1)} / 10
          </span>
          <span className="row__detailYear">
            {displayMovie?.release_date?.substring(0, 4) || displayMovie?.first_air_date?.substring(0, 4)}
          </span>
        </div>
        <p className="row__detailOverview">{displayMovie?.overview}</p>
        <button
          className="row__detailButton"
          onClick={() => {
            setSelectedMovie(null);
            setSelectedIndex(null);
            setTimeout(() => setDisplayMovie(null), 600);
          }}
        >
          Close
        </button>
      </div>
    </div>
  );

  const renderSearchGrid = () => {
    const items = [];
    finalMovies.forEach((movie, index) => {
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
            style={{
              opacity: loadedImages[imgKey] ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
            onLoad={() => handleImageLoad(imgKey)}
          />
        </div>
      );

      const isLastInRow = (index + 1) % columnsPerRow === 0;
      const isLastItem = index === finalMovies.length - 1;
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
        <div className="row__searchGrid" ref={gridRef}>
          {renderSearchGrid()}
        </div>
      ) : (
        <div
          className="row__posters"
          ref={rowRef}
          style={{ scrollSnapType: "none", scrollBehavior: "auto" }}
        >
          {finalMovies.map((movie, index) => {
            const imgKey = `${movie.id}-${index}`;
            return (
              (isLargeRow ? movie.poster_path : movie.backdrop_path) && (
                <div
                  key={imgKey}
                  className="row__posterWrapper"
                  style={{
                    maxHeight: isLargeRow ? "250px" : "100px",
                    minWidth: isLargeRow ? "170px" : "177px",
                  }}
                >
                  {!loadedImages[imgKey] && <div className="row__posterSkeleton" />}
                  <img
                    onClick={() => handleClick(movie, index)}
                    className={`row__poster ${isLargeRow ? "row__posterLarge" : ""}`}
                    src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                    alt={movie.name}
                    style={{
                      opacity: loadedImages[imgKey] ? 1 : 0,
                      transition: "opacity 0.5s ease",
                    }}
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
          {displayMovie && (
            <>
              <div className="row__detailVideo">
                {trailerUrl ? (
                  <YouTube
                    videoId={trailerUrl}
                    opts={opts}
                    className="youtube-container"
                    onReady={handleReady}
                  />
                ) : (
                  <img src={`${base_url}${displayMovie.backdrop_path}`} alt={displayMovie.name} />
                )}
                <div className="row__detailFade" />
              </div>
              <div className="row__detailContent">
                <h1>{displayMovie?.title || displayMovie?.name || displayMovie?.original_name}</h1>
                <div className="row__detailStats">
                  <span className="row__detailRating">Rating: {displayMovie.vote_average?.toFixed(1)} / 10</span>
                  <span className="row__detailYear">
                    {displayMovie.release_date?.substring(0, 4) || displayMovie.first_air_date?.substring(0, 4)}
                  </span>
                </div>
                <p className="row__detailOverview">{displayMovie.overview}</p>
                <button
                  className="row__detailButton"
                  onClick={() => {
                    setSelectedMovie(null);
                    setTimeout(() => setDisplayMovie(null), 600);
                  }}
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Row;