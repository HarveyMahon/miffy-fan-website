// Miffy Fan Site: loads items.json and renders the gallery, favourites, credits and detail view.

const CATEGORIES = ["All", "Plushies", "Memorabilia"];

const state = {
  items: [],
  category: "All",
  query: ""
};

const $ = (id) => document.getElementById(id);

function esc(text) {
  return String(text ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

function placeholderHtml(item) {
  return `<div class="placeholder">Photo coming soon</div>`;
}

function mediaHtml(item) {
  if (!item.image) return placeholderHtml(item);
  // If the image file is missing, swap in the placeholder instead of a broken icon.
  return `<img src="images/${esc(item.image)}" alt="${esc(item.name)}" loading="lazy"
    onerror="this.replaceWith(Object.assign(document.createElement('div'), {className: 'placeholder', textContent: 'Photo coming soon'}))">`;
}

function creditText(credit) {
  if (!credit) return "";
  return `Photo: ${credit.author} · ${credit.licence}`;
}

function cardHtml(item) {
  const meta = [item.year, item.origin].filter(Boolean).join(" · ");
  return `
    <button class="card" type="button" data-id="${esc(item.id)}" aria-label="View details for ${esc(item.name)}">
      <div class="card-media">
        ${mediaHtml(item)}
        ${item.favourite ? `<span class="fav-badge">♥ Favourite</span>` : ""}
      </div>
      <div class="card-body">
        <h3>${esc(item.name)}</h3>
        <p class="card-meta">${esc(meta)}</p>
        ${item.credit ? `<p class="card-credit">${esc(creditText(item.credit))}</p>` : ""}
      </div>
    </button>`;
}

function renderChips() {
  $("chips").innerHTML = CATEGORIES.map((c) =>
    `<button class="chip" type="button" data-cat="${c}" aria-pressed="${c === state.category}">${c}</button>`
  ).join("");
}

function filteredItems() {
  const q = state.query.trim().toLowerCase();
  return state.items.filter((item) =>
    (state.category === "All" || item.category === state.category) &&
    (!q || item.name.toLowerCase().includes(q))
  );
}

function renderGrid() {
  const list = filteredItems();
  $("grid").innerHTML = list.length
    ? list.map(cardHtml).join("")
    : `<p class="empty">No items match that search.</p>`;
  $("count").textContent = `Showing ${list.length} of ${state.items.length} items`;
}

function renderFavourites() {
  const favs = state.items.filter((i) => i.favourite);
  $("fav-row").innerHTML = favs.map(cardHtml).join("");
  $("fav-row").closest("section").hidden = favs.length === 0;
}

function renderCredits() {
  const credited = state.items.filter((i) => i.credit);
  $("credit-list").innerHTML = credited.map((i) => {
    const c = i.credit;
    const licence = c.licenceUrl
      ? `<a href="${esc(c.licenceUrl)}" target="_blank" rel="noopener">${esc(c.licence)}</a>`
      : esc(c.licence);
    return `<li><a href="${esc(c.source)}" target="_blank" rel="noopener">${esc(i.name)}</a> by ${esc(c.author)}, ${licence}</li>`;
  }).join("");
}

function openModal(id) {
  const item = state.items.find((i) => i.id === id);
  if (!item) return;
  const c = item.credit;
  const rows = [
    ["Category", item.category],
    ["Year", item.year],
    ["Origin", item.origin],
    ["Size", item.size]
  ].filter(([, v]) => v);

  const imgHtml = item.image
    ? `<img src="images/${esc(item.image)}" alt="${esc(item.name)}"
        onerror="this.replaceWith(Object.assign(document.createElement('div'), {className: 'placeholder', textContent: 'Photo coming soon'}))">`
    : placeholderHtml(item);

  $("modal-body").innerHTML = `
    <div class="modal-media">${imgHtml}</div>
    <div class="modal-text">
      <span class="tag">${esc(item.category)}${item.favourite ? " · ♥ Favourite" : ""}</span>
      <h2 id="modal-title">${esc(item.name)}</h2>
      ${item.note ? `<p>${esc(item.note)}</p>` : ""}
      <dl class="details">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join("")}</dl>
      ${c ? `<p class="modal-credit">Photo by ${esc(c.author)}, licensed ${
          c.licenceUrl ? `<a href="${esc(c.licenceUrl)}" target="_blank" rel="noopener">${esc(c.licence)}</a>` : esc(c.licence)
        }. <a href="${esc(c.source)}" target="_blank" rel="noopener">View source on Wikimedia Commons</a></p>` : ""}
      ${item.link ? `<p><a href="${esc(item.link)}" target="_blank" rel="noopener">See where to find this item →</a></p>` : ""}
    </div>`;
  $("modal").showModal();
}

function bindEvents() {
  $("chips").addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    state.category = btn.dataset.cat;
    renderChips();
    renderGrid();
  });

  $("search").addEventListener("input", (e) => {
    state.query = e.target.value;
    renderGrid();
  });

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) openModal(card.dataset.id);
  });

  $("modal-close").addEventListener("click", () => $("modal").close());

  // Close when clicking the dark backdrop around the dialog.
  $("modal").addEventListener("click", (e) => {
    if (e.target === $("modal")) $("modal").close();
  });
}

async function init() {
  renderChips();
  bindEvents();
  try {
    const res = await fetch("items.json");
    if (!res.ok) throw new Error(res.status);
    state.items = await res.json();
  } catch (err) {
    $("grid").innerHTML = `<p class="empty">Couldn't load items.json. If you opened this file directly, run a local server instead (see README).</p>`;
    return;
  }
  renderFavourites();
  renderGrid();
  renderCredits();
}

init();
