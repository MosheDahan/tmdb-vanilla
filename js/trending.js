import { trendingMovies, posterUrl, genreNames } from './api.js';

export function TrendingView(root) {
  root.innerHTML = `
    <section class="d-flex justify-content-between align-items-center mb-3">
      <h1 class="h4 m-0">Trending</h1>

      <div class="d-flex gap-2 align-items-center">
        <select id="win" class="form-select form-select-sm w-auto">
          <option value="day" selected>היום</option>
          <option value="week">השבוע</option>
        </select>

        <div class="btn-group btn-group-sm" role="group" aria-label="pager">
          <button id="prev" class="btn btn-outline-secondary" type="button">‹</button>
          <span id="page" class="btn btn-outline-secondary disabled">1</span>
          <button id="next" class="btn btn-outline-secondary" type="button">›</button>
        </div>
      </div>
    </section>

    <section id="results">
      <div class="text-center p-4">
        <div class="spinner-border" role="status"></div>
        <div class="mt-2">טוען…</div>
      </div>
    </section>
  `;

  const results = root.querySelector('#results');
  const winSel  = root.querySelector('#win');
  const prevBtn = root.querySelector('#prev');
  const nextBtn = root.querySelector('#next');
  const pageLbl = root.querySelector('#page');

  const state = { page: 1, window: 'day', totalPages: 1 };

  async function load() {
    results.innerHTML = `
      <div class="text-center p-4">
        <div class="spinner-border" role="status"></div>
        <div class="mt-2">טוען…</div>
      </div>`;

    try {
      const data = await trendingMovies(state.page, state.window);
      state.totalPages = data.total_pages ?? 1;

      if (!data.results?.length) {
        results.innerHTML = `<div class="alert alert-info">אין תוצאות כרגע.</div>`;
        pageLbl.textContent = `${state.page}`;
        prevBtn.disabled = state.page <= 1;
        nextBtn.disabled = state.page >= state.totalPages;
        return;
      }

      const cards = await Promise.all(
        data.results.map(async (m) => {
          const names  = await genreNames(m.genre_ids || []);
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

      pageLbl.textContent = `${state.page}`;
      prevBtn.disabled = state.page <= 1;
      nextBtn.disabled = state.page >= state.totalPages;
    } catch (err) {
      console.error('[Trending] error:', err);
      results.innerHTML = `<div class="alert alert-danger">שגיאה בטעינת Trending. נסה שוב.</div>`;
      pageLbl.textContent = `${state.page}`;
      prevBtn.disabled = state.page <= 1;
      nextBtn.disabled = true;
    }
  }

  winSel.addEventListener('change', () => {
    state.window = winSel.value;   // 'day' | 'week'
    state.page = 1;
    load();
  });

  prevBtn.addEventListener('click', () => {
    if (state.page > 1) { state.page--; load(); }
  });

  nextBtn.addEventListener('click', () => {
    if (state.page < state.totalPages) { state.page++; load(); }
  });

  // טוען בפעם הראשונה
  load();
}
