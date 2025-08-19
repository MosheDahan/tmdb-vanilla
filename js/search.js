import { searchMovies, posterUrl, genreNames } from './api.js';

export function SearchView(root) {
  root.innerHTML = `
    <section class="mb-4">
      <h1 class="h4 mb-3">מסך חיפוש</h1>
      <form id="search-form" class="row g-2">
        <div class="col-sm-10">
          <input id="q" class="form-control" type="search"
                 placeholder="הקלד שם סרט (לפחות 3 תווים)" minlength="3" />
        </div>
        <div class="col-sm-2 d-grid">
          <button class="btn btn-primary" type="submit">חפש</button>
        </div>
      </form>
      <div id="hint" class="form-text">הקלד לפחות 3 תווים…</div>
    </section>

    <section id="results">
      <div class="alert alert-secondary">אין תוצאות עדיין.</div>
    </section>
  `;

  const form = root.querySelector('#search-form');
  const input = root.querySelector('#q');
  const results = root.querySelector('#results');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (q.length < 3) {
      results.innerHTML = `<div class="alert alert-warning">נא להקליד לפחות 3 תווים.</div>`;
      return;
    }

    results.innerHTML = `
      <div class="text-center p-4">
        <div class="spinner-border" role="status"></div>
        <div class="mt-2">טוען…</div>
      </div>`;

    try {
      const data = await searchMovies(q, 1);
      if (!data.results?.length) {
        results.innerHTML = `<div class="alert alert-info">לא נמצאו תוצאות.</div>`;
        return;
      }

      // בונים כרטיס לכל תוצאה
      const cards = await Promise.all(
        data.results.map(async (m) => {
          const names = await genreNames(m.genre_ids || []);
          const year   = (m.release_date || '').slice(0, 4) || '—';
          const rating = (m.vote_average ?? 0).toFixed(1);
          const poster = posterUrl(m.poster_path);

          return `
            <div class="col">
              <div class="card h-100 shadow-sm">
                <img class="card-img-top movie-poster"
                     src="${poster}" alt="${m.title || ''}"
                     onerror="this.onerror=null; this.src='./assets/no-poster.svg';" />
                <div class="card-body d-flex flex-column">
                  <h3 class="h6 mb-1 text-truncate-2" title="${m.title}">${m.title}</h3>
                  <div class="text-muted small mb-2">${year} · ⭐ ${rating}</div>
                  <div class="mb-2">
                    ${names.map(g => `<span class="badge text-bg-light badge-genre">${g}</span>`).join('')}
                  </div>
                  <div class="mt-auto">
                    <a class="btn btn-sm btn-outline-primary w-100" href="#/movie/${m.id}">לפרטים</a>
                  </div>
                </div>
              </div>
            </div>`;
        })
      );

      results.innerHTML = `
        <div class="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-3">
          ${cards.join('')}
        </div>`;
    } catch (err) {
      console.error(err);
      results.innerHTML = `<div class="alert alert-danger">שגיאה בטעינת נתונים. נסה שוב.</div>`;
    }
  });
}
