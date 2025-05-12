document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = '124bdc1601294994a241722466e53891';
    const API_BASE = 'https://api.themoviedb.org/3';
    const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
  
    const watchlistElement = document.getElementById('liste-watchlist');
    const seenlistElement = document.getElementById('liste-seenlist');
    const cardContainer = document.getElementById('card-container');
  
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const modalGenres = document.getElementById('modal-genres');
    const modalReleaseDate = document.getElementById('modal-release-date');
    const modalRating = document.getElementById('modal-rating');
    const closeModalBtn = document.getElementById('close-modal');
  
    const fullDetailsLink = document.getElementById('full-details-link');
    const seasonSelector = document.getElementById('season-selector');
    const seasonSelect = document.getElementById('season-select');
    const addSeasonBtn = document.getElementById('add-season');
  
    const TITLES = [
      "Breaking Bad",
      "Stranger Things",
      "Interstellar",
      "Star Wars",
      "The Mandalorian",
      "The Rock",
      "MARVEL",
      "Dr House"
    ];
  
    loadCards();
    loadWatchlist();
    loadSeenlist();
  
    async function loadCards() {
      for (const title of TITLES) {
        const data = await fetchSearchResult(title);
        if (data) {
          createCard(data);
        }
      }
    }
  
    async function fetchSearchResult(query) {
      try {
        const res = await fetch(`${API_BASE}/search/multi?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`);
        const data = await res.json();
        return data.results?.[0] || null;
      } catch (err) {
        console.error('Erreur API :', err);
        return null;
      }
    }
  
    function createCard(data) {
      const article = document.createElement('article');
      article.className = 'card';
      article.dataset.title = data.title || data.name || '';
      article.dataset.actors = '';
      article.dataset.director = '';
      article.dataset.genre = '';
  
      const title = data.title || data.name;
      const imgSrc = data.poster_path ? IMG_BASE + data.poster_path : 'https://via.placeholder.com/300x450?text=No+Image';
      const mediaType = data.media_type || (data.first_air_date ? 'tv' : 'movie');
  
      article.innerHTML = `
        <img src="${imgSrc}" alt="Affiche de ${title}">
        <h3>${title}</h3>
      `;
  
      const addBtn = document.createElement('button');
      addBtn.textContent = '+ Ajouter à la Watchlist';
      addBtn.onclick = () => addToWatchlist(title);
  
      const seenBtn = document.createElement('button');
      seenBtn.textContent = 'Ajouter à la Seenlist';
      seenBtn.onclick = () => addToSeenlist(title);
  
      const detailsBtn = document.createElement('button');
      detailsBtn.textContent = 'Voir fiche complète';
      detailsBtn.onclick = () => fetchDetailsAndShowModal(mediaType, data.id);
  
      article.appendChild(addBtn);
      article.appendChild(seenBtn);
      article.appendChild(detailsBtn);
  
      cardContainer.appendChild(article);
    }
  
    async function fetchDetailsAndShowModal(type, id) {
      try {
        const res = await fetch(`${API_BASE}/${type}/${id}?api_key=${API_KEY}&language=fr-FR`);
        const details = await res.json();
        updateModal(details, type);
      } catch (err) {
        console.error("Erreur lors du chargement de la fiche détaillée :", err);
      }
    }
  
    function updateModal(details, type) {
      modalTitle.textContent = details.name || details.title;
      modalImage.src = IMG_BASE + details.poster_path;
      modalImage.alt = `Affiche de ${details.name || details.title}`;
      modalDescription.textContent = details.overview || "Aucune description disponible.";
      modalGenres.textContent = details.genres?.map(g => g.name).join(', ') || "Genres inconnus";
      modalReleaseDate.textContent = details.first_air_date || details.release_date || "Date inconnue";
      modalRating.textContent = details.vote_average ?? "Non noté";
  
      fullDetailsLink.href = `https://www.themoviedb.org/${type}/${details.id}`;
      fullDetailsLink.style.display = 'inline-block';
  
      if (type === 'tv' && details.seasons) {
        seasonSelector.hidden = false;
        seasonSelect.innerHTML = '';
        details.seasons.forEach(season => {
          const opt = document.createElement('option');
          opt.value = season.season_number;
          opt.textContent = `Saison ${season.season_number}`;
          seasonSelect.appendChild(opt);
        });
      } else {
        seasonSelector.hidden = true;
      }
  
      openModal();
    }
  
    addSeasonBtn.addEventListener('click', () => {
      const saison = seasonSelect.value;
      const titre = modalTitle.textContent;
      addToWatchlist(`${titre} - Saison ${saison}`);
    });
  
    function openModal() {
      modal.hidden = false;
      modal.setAttribute('aria-hidden', 'false');
      modal.focus();
      trapFocus(modal);
    }
  
    function closeModal() {
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
      releaseFocusTrap();
    }
  
    closeModalBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });
  
    let focusableElements = [], firstFocusable, lastFocusable;
  
    function trapFocus(el) {
      focusableElements = el.querySelectorAll('a[href], button:not([disabled]), textarea, input, select');
      firstFocusable = focusableElements[0];
      lastFocusable = focusableElements[focusableElements.length - 1];
      document.addEventListener('keydown', handleFocusTrap);
    }
  
    function releaseFocusTrap() {
      document.removeEventListener('keydown', handleFocusTrap);
    }
  
    function handleFocusTrap(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault(); lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault(); firstFocusable.focus();
      }
    }
  
    function loadWatchlist() {
      const list = JSON.parse(localStorage.getItem('watchlist')) || [];
      watchlistElement.innerHTML = '';
      list.forEach(title => {
        const li = document.createElement('li');
        li.textContent = title;
  
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✖';
        removeBtn.onclick = () => removeFromWatchlist(title);
        li.appendChild(removeBtn);
  
        const seenBtn = document.createElement('button');
        seenBtn.textContent = 'Ajouter à la Seenlist';
        seenBtn.onclick = () => addToSeenlist(title);
        li.appendChild(seenBtn);
  
        watchlistElement.appendChild(li);
      });
    }
  
    function loadSeenlist() {
      const list = JSON.parse(localStorage.getItem('seenlist')) || [];
      seenlistElement.innerHTML = '';
      list.forEach(title => {
        const li = document.createElement('li');
        li.textContent = title;
  
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✖';
        removeBtn.onclick = () => removeFromSeenlist(title);
        li.appendChild(removeBtn);
  
        seenlistElement.appendChild(li);
      });
    }
  
    function addToWatchlist(title) {
      const list = JSON.parse(localStorage.getItem('watchlist')) || [];
      if (!list.includes(title)) {
        list.push(title);
        localStorage.setItem('watchlist', JSON.stringify(list));
        loadWatchlist();
      }
    }
  
    function removeFromWatchlist(title) {
      let list = JSON.parse(localStorage.getItem('watchlist')) || [];
      list = list.filter(item => item !== title);
      localStorage.setItem('watchlist', JSON.stringify(list));
      loadWatchlist();
    }
  
    function addToSeenlist(title) {
      const list = JSON.parse(localStorage.getItem('seenlist')) || [];
      if (!list.includes(title)) {
        list.push(title);
        localStorage.setItem('seenlist', JSON.stringify(list));
        loadSeenlist();
      }
    }
  
    function removeFromSeenlist(title) {
      let list = JSON.parse(localStorage.getItem('seenlist')) || [];
      list = list.filter(item => item !== title);
      localStorage.setItem('seenlist', JSON.stringify(list));
      loadSeenlist();
    }
  
    const footer = document.querySelector('footer');
    const exportBtn = document.createElement('button');
    exportBtn.textContent = '📁 Exporter mes listes';
    exportBtn.addEventListener('click', exportLists);
    footer.appendChild(exportBtn);
  
    function exportLists() {
      const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
      const seenlist = JSON.parse(localStorage.getItem('seenlist')) || [];
  
      const blob = new Blob([
        JSON.stringify({
          watchlist,
          seenlist,
          exportedAt: new Date().toISOString()
        }, null, 2)
      ], { type: 'application/json' });
  
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'afterwatch-listes.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });
  
  // ... Tout le code précédent (inchangé) ...

  // Bouton d'importation JSON
  const importLabel = document.createElement('label');
  importLabel.textContent = '📂 Importer mes listes';
  importLabel.setAttribute('for', 'import-file');
  importLabel.style.cursor = 'pointer';
  importLabel.style.marginLeft = '1rem';

  const importInput = document.createElement('input');
  importInput.type = 'file';
  importInput.id = 'import-file';
  importInput.accept = '.json';
  importInput.style.display = 'none';
  importInput.addEventListener('change', importLists);

  footer.appendChild(importBtn);
  footer.appendChild(importLabel);
  footer.appendChild(importInput);

  function importLists(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);
        if (Array.isArray(data.watchlist)) {
          localStorage.setItem('watchlist', JSON.stringify(data.watchlist));
        }
        if (Array.isArray(data.seenlist)) {
          localStorage.setItem('seenlist', JSON.stringify(data.seenlist));
        }
        loadWatchlist();
        loadSeenlist();
        alert('Listes importées avec succès !');
      } catch (err) {
        alert('Fichier invalide. Veuillez sélectionner un fichier JSON exporté depuis AfterWatch.');
      }
    };
    reader.readAsText(file);
  }
