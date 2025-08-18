import { SearchView } from './search.js';
import { TrendingView } from './trending.js';
import { FavoritesView } from './favorites.js';
import { MovieDetailsView } from './movie-details.js';
import { NotFoundView } from './views-not-found.js';

export function router() {
  const mount = document.getElementById('app-view');
  if (!mount) return;
  mount.innerHTML = '';
  const hash = location.hash || '#/search';
  const movieMatch = hash.match(/^#\/movie\/(\d+)$/);
  if (movieMatch) return MovieDetailsView(mount, { id: movieMatch[1] });

  switch (hash) {
    case '#/':
    case '#/search':   return SearchView(mount);
    case '#/trending': return TrendingView(mount);
    case '#/favorites':return FavoritesView(mount);
    default:           return NotFoundView(mount);
  }
}
