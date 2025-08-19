import { TMDB_API_KEY, TMDB_LANG } from './config.js';

const BASE = 'https://api.themoviedb.org/3';
export const IMG_BASE = 'https://image.tmdb.org/t/p/';
export const DEFAULT_POSTER_SIZE = 'w342';
const NO_POSTER = './assets/no-poster.svg';   // גיבוי מקומי

let _genresMap = null;

function buildUrl(path, params = {}) {
  const url = new URL(BASE + path);
  url.searchParams.set('api_key', TMDB_API_KEY);
  url.searchParams.set('language', TMDB_LANG);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  }
  return url.toString();
}

export function posterUrl(poster_path, size = DEFAULT_POSTER_SIZE) {
  return poster_path ? `${IMG_BASE}${size}${poster_path}` : NO_POSTER;
}

async function fetchJson(path, params) {
  const res = await fetch(buildUrl(path, params));
  if (!res.ok) throw new Error(`TMDb ${res.status} ${res.statusText}`);
  return res.json();
}

// ===== Endpoints שנשתמש בהם =====
export async function searchMovies(query, page = 1) {
  return fetchJson('/search/movie', { query, page, include_adult: 'false' });
}
export async function trendingMovies(page = 1, window = 'day') {
  return fetchJson(`/trending/movie/${window}`, { page });
}
export async function movieDetails(id) { return fetchJson(`/movie/${id}`); }
export async function movieCredits(id) { return fetchJson(`/movie/${id}/credits`); }

// ===== ז'אנרים — טעינה חד־פעמית + קאש =====
export async function ensureGenres() {
  if (_genresMap) return _genresMap;
  try {
    const data = await fetchJson('/genre/movie/list');
    _genresMap = new Map(data.genres.map(g => [g.id, g.name]));
  } catch {
    // נפילת גיבוי לקובץ מקומי אם הרשת תחסום
    const res = await fetch('./data/genres.he.json'); // ודא שהשם כזה (he), לא hs
    const data = await res.json();
    _genresMap = new Map(data.genres.map(g => [g.id, g.name]));
  }
  return _genresMap;
}

export async function genreNames(ids = []) {
  const map = await ensureGenres();
  return ids.map(id => map.get(id)).filter(Boolean);
}
