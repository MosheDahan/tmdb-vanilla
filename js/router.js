import { SearchView } from './search.js';
import { TrendingView } from './trending.js';
import { FavoritesView } from './favorites.js';
import { MovieDetailsView } from './movie-details.js';
import { NotFoundView } from './views-not-found.js';

export function router() {
    const mount = document.getElementById('app-view'); // מאתר את התושבת
    if (!mount) return;                                // אם לא נמצא - יציאה שקטה

    mount.innerHTML = '';                               // מנקה תצוגה קודמת

    const hash = location.hash || '#/search';            // קורא את ה-hash; ברירת מחדל "חיפוש"

    // נתיב פרטי סרט: #/movie/<id>  (למשל #/movie/12345)
    const movieMatch = hash.match(/^#\/movie\/(\d+)$/);
    if(movieMatch) {
        const id = movieMatch[1];                       // קבוצה 1 בביטוי - המספר
        return MovieDetailsView(mount, { id });         // מציירים את תצוגת הפרטים
    }

    // ראוטים רגילים
    switch (hash) {
        case '#/':
        case '#/search':
            return SearchView(mount);
        case '#/trending':
            return TrendingView(mount);
        case '#/favorites':
            return FavoritesView(mount);
        default:
            return NotFoundView(mount);
    }
}








































// import { SearchView } from './search.js';
// import { TrendingView } from './trending.js';
// import { FavoritesView } from './favorites.js';
// import { MovieDetailsView } from './movie-details.js';
// import { NotFoundView } from './views-not-found.js';

// export function router() {
//   const mount = document.getElementById('app-view');
//   if (!mount) return;
//   mount.innerHTML = '';
//   const hash = location.hash || '#/search';
//   const movieMatch = hash.match(/^#\/movie\/(\d+)$/);
//   if (movieMatch) return MovieDetailsView(mount, { id: movieMatch[1] });

//   switch (hash) {
//     case '#/':
//     case '#/search':   return SearchView(mount);
//     case '#/trending': return TrendingView(mount);
//     case '#/favorites':return FavoritesView(mount);
//     default:           return NotFoundView(mount);
//   }
// }
