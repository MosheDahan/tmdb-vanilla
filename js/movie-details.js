// js/movie-details.js
import { movieDetails, movieCredits, posterUrl } from './api.js';

export async function MovieDetailsView(root, { id }) {
  // מצב טעינה התחלתי
  root.innerHTML = `
    <section class="text-center p-4">
      <div class="spinner-border" role="status"></div>
      <div class="mt-2">טוען פרטי סרט…</div>
    </section>
  `;

  // פונקציות עזר לפורמט
  const fmtYear = (d) => (d || '').slice(0, 4) || '—';
  const fmtRuntime = (min) => {
    if (min === null || min === undefined) return '—';
    const h = Math.floor(min / 60), m = min % 60;
    return (h ? `${h}ש׳ ` : '') + (m ? `${m}ד׳` : (h ? '' : '—'));
  };
  const fmtVote = (v) => (v ?? 0).toFixed(1);

  try {
    // מושכים פרטים וקרדיטים במקביל
    const [details, credits] = await Promise.all([
      movieDetails(id),
      movieCredits(id),
    ]);

    const title   = details.title || details.name || 'ללא כותרת';
    const year    = fmtYear(details.release_date);
    const runtime = fmtRuntime(details.runtime);
    const rating  = fmtVote(details.vote_average);
    const votes   = details.vote_count ?? 0;
    const genres  = (details.genres || []).map(g => g.name);
    const poster  = posterUrl(details.poster_path);

    const cast = (credits?.cast || [])
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .slice(0, 10);

    // תבנית הדף
    root.innerHTML = `
      <section class="mb-4">
        <a id="back-link" class="btn btn-sm btn-outline-secondary" href="javascript:void(0)">← חזרה</a>
      </section>

      <section class="row g-3">
        <div class="col-12 col-md-4 col-lg-3">
          <div class="card shadow-sm">
            <img class="card-img-top movie-poster"
                 src="${poster}" alt="${title}"
                 onerror="this.onerror=null; this.src='./assets/no-poster.svg';" />
          </div>
        </div>

        <div class="col-12 col-md-8 col-lg-9">
          <header class="mb-3">
            <h1 class="h3 m-0">${title} <small class="text-muted">(${year})</small></h1>
            <div class="text-muted mt-1">
              ⭐ ${rating} · ${votes.toLocaleString()} הצבעות · ${runtime}
            </div>
            <div class="mt-2">
              ${genres.map(g => `<span class="badge text-bg-light me-1 mb-1">${g}</span>`).join('')}
            </div>
          </header>

          <article class="mb-4">
            <h2 class="h6">תקציר</h2>
            <p class="mb-0">${details.overview ? details.overview : 'אין תקציר זמין בשפה זו.'}</p>
          </article>

          <section>
            <h2 class="h6">שחקנים מובילים</h2>
            ${
              cast.length
                ? `<div>
                     ${cast.map(p => `<span class="badge text-bg-secondary badge-cast">${p.name}</span>`).join('')}
                   </div>`
                : `<div class="text-muted">אין פרטי שחקנים.</div>`
            }
          </section>
        </div>
      </section>
    `;

    // כפתור חזרה חכם: אם יש היסטוריה חוזר אחורה, אחרת הולך לחיפוש
    const back = root.querySelector('#back-link');
    back.addEventListener('click', () => {
      if (history.length > 1) history.back();
      else location.hash = '#/search';
    });
  } catch (err) {
    console.error('[MovieDetails] error:', err);
    root.innerHTML = `
      <section class="alert alert-danger">
        שגיאה בטעינת פרטי הסרט. נסה שוב מאוחר יותר.
      </section>
      <a id="back-link" class="btn btn-sm btn-outline-secondary" href="javascript:void(0)">← חזרה</a>
    `;
    const back = root.querySelector('#back-link');
    back?.addEventListener('click', () => {
      if (history.length > 1) history.back();
      else location.hash = '#/search';
    });
  }
}
