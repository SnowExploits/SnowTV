import axios from 'axios';

// This is a free API key from TMDB - in a real application, we should use environment variables
const API_KEY = '2dca580c2a14b55200e784d157207b4d';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const getImageUrl = (path: string | null, size: string = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: string = 'w1280') => {
  if (!path) return 'https://via.placeholder.com/1280x720?text=No+Backdrop';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Movies
export const getTrendingMovies = () => {
  return api.get('/trending/movie/week');
};

export const getPopularMovies = (page = 1) => {
  return api.get('/movie/popular', { params: { page } });
};

export const getMovieDetails = (id: string) => {
  return api.get(`/movie/${id}`, { params: { append_to_response: 'videos,credits' } });
};

export const searchMovies = (query: string, page = 1) => {
  return api.get('/search/movie', { params: { query, page } });
};

// TV Shows
export const getTrendingTVShows = () => {
  return api.get('/trending/tv/week');
};

export const getPopularTVShows = (page = 1) => {
  return api.get('/tv/popular', { params: { page } });
};

export const getTVShowDetails = (id: string) => {
  return api.get(`/tv/${id}`, { params: { append_to_response: 'videos,credits' } });
};

export const getTVSeasonDetails = (id: string, season: string) => {
  return api.get(`/tv/${id}/season/${season}`);
};

export const searchTVShows = (query: string, page = 1) => {
  return api.get('/search/tv', { params: { query, page } });
};

// Video Embeds
export const getMovieEmbedUrl = (id: string) => {
  return `https://vidsrc.xyz/embed/movie?tmdb=${id}`;
};

export const getTVEmbedUrl = (id: string, season: string, episode: string) => {
  return `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
};
