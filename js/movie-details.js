export function MovieDetailsView(root, { id }) {
  root.innerHTML = `<section class="py-4">
    <h2 class="h5">פרטי סרט (דמו)</h2>
    <p>מזהה הסרט: <code>${id}</code></p>
  </section>`;
}
