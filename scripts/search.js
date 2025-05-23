document.getElementById('search-button').addEventListener('click', handleSearch);
document.getElementById('search-input').addEventListener('input', filtrerContenu);

async function handleSearch() {
  filtrerContenu();

  const cards = document.querySelectorAll('.card');
  const hasVisibleCards = Array.from(cards).some(card => card.style.display !== 'none');

  if (!hasVisibleCards) {
    const query = document.getElementById('search-input').value.trim();
    if (!query) return;

    const response = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&api_key=${TMDB_API_KEY}&language=fr-FR`);
    const data = await response.json();

    const container = document.getElementById('search-results-container');
    container.innerHTML = '';
    document.getElementById('search-results').hidden = false;

    if (!data.results || data.results.length === 0) {
      const msg = document.createElement('p');
      msg.textContent = `Aucun résultat trouvé pour "${query}".`;
      container.appendChild(msg);
      return;
    }

    data.results.forEach(media => {
      if (!media.poster_path) return;

      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.title = media.title || media.name || '';
      card.dataset.actors = '';
      card.dataset.director = '';
      card.dataset.genre = '';

      const img = document.createElement('img');
      img.src = `https://image.tmdb.org/t/p/w300${media.poster_path}`;
      img.alt = media.title || media.name;

      const title = document.createElement('h3');
      title.textContent = media.title || media.name;

      const addBtn = document.createElement('button');
      addBtn.textContent = 'Ajouter à la Watchlist';
      addBtn.onclick = () => {
        const mediaTitle = media.title || media.name;
        addToWatchlist(mediaTitle);
      };

      const seenBtn = document.createElement('button');
      seenBtn.textContent = 'Ajouter à la Seenlist';
      seenBtn.onclick = () => {
        const mediaTitle = media.title || media.name;
        addToSeenlist(mediaTitle);
      };

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(addBtn);
      card.appendChild(seenBtn);
      container.appendChild(card);
    });
  }
}

function filtrerContenu() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const cards = document.querySelectorAll('.card');
  let matchCount = 0;

  cards.forEach(card => {
    const searchable = `${card.dataset.title || ''} ${card.dataset.actors || ''} ${card.dataset.director || ''} ${card.dataset.genre || ''}`.toLowerCase();
    const visible = searchable.includes(query);
    card.style.display = visible ? 'block' : 'none';
    if (visible) matchCount++;
  });

  const errorMsg = document.getElementById('search-error');
  errorMsg.textContent = query && matchCount === 0 ? 'Aucun résultat trouvé.' : '';
}

function addToWatchlist(title) {
  const list = JSON.parse(localStorage.getItem('watchlist')) || [];
  if (!list.includes(title)) {
    list.push(title);
    localStorage.setItem('watchlist', JSON.stringify(list));
  }
}

function addToSeenlist(title) {
  const list = JSON.parse(localStorage.getItem('seenlist')) || [];
  if (!list.includes(title)) {
    list.push(title);
    localStorage.setItem('seenlist', JSON.stringify(list));
  }
}
