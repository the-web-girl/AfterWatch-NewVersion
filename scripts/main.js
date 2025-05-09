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
  
    const TITLES = [
      "Breaking Bad",
      "Stranger Things",
      "Interstellar",
      "Star Wars"
    ];
  
    // Chargement des cartes
    async function loadCards() {
      for (const title of TITLES) {
        try {
          const data = await fetchMovieDetails(title);
          if (data) {
            createCard(data);
          } else {
            console.warn(`Aucun résultat pour "${title}"`);
          }
        } catch (err) {
          console.error('Erreur de récupération TMDb :', err);
        }
      }
    }
  
    // Récupération des détails du film/série
    async function fetchMovieDetails(title) {
      const response = await fetch(`${API_BASE}/search/multi?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(title)}`);
      const data = await response.json();
      return data.results?.[0];
    }
  
    // Création d'une carte
    function createCard(data) {
      const article = document.createElement('article');
      article.className = 'card';
      article.dataset.title = data.title || data.name;
  
      article.innerHTML = `
        <img src="${IMG_BASE + data.poster_path}" alt="${data.title || data.name}">
        <h3>${data.title || data.name}</h3>
        <button data-title="${data.title || data.name}">+ Ajouter</button>
      `;
  
      // Événement pour afficher la modale
      article.addEventListener('click', (e) => {
        if (e.target.tagName.toLowerCase() === 'button') return;
        e.preventDefault();
        showModal(data);
      });
  
      // Événement pour ajouter à la watchlist
      const addButton = article.querySelector('button[data-title]');
      addButton.addEventListener('click', () => {
        const title = addButton.dataset.title;
        addToWatchlist(title);
        addButton.disabled = true;
      });
  
      cardContainer.appendChild(article);
    }
  
    // Affichage de la modale
    function showModal(data) {
      modalTitle.textContent = data.title || data.name;
      modalImage.src = IMG_BASE + data.poster_path;
      modalImage.alt = `Affiche de ${data.title || data.name}`;
      modalDescription.textContent = data.overview || "Aucune description disponible.";
      modalGenres.textContent = data.genre_ids ? data.genre_ids.join(', ') : "Genres inconnus";
      modalReleaseDate.textContent = data.release_date || "Date inconnue";
      modalRating.textContent = data.vote_average ?? "Non noté";
  
      openModal();
    }
  
    function openModal() {
      modal.hidden = false;
      modal.focus();
      trapFocus(modal);
    }
  
    function closeModal() {
      modal.hidden = true;
      releaseFocusTrap();
    }
  
    closeModalBtn.addEventListener('click', closeModal);
  
    document.addEventListener('keydown', (e) => {
      if (!modal.hidden && e.key === 'Escape') {
        closeModal();
      }
    });
  
    // Gestion du focus dans la modale
    let focusableElements = [];
    let firstFocusable, lastFocusable;
  
    function trapFocus(element) {
      focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable = focusableElements[0];
      lastFocusable = focusableElements[focusableElements.length - 1];
  
      document.addEventListener('keydown', handleFocusTrap);
    }
  
    function releaseFocusTrap() {
      document.removeEventListener('keydown', handleFocusTrap);
    }
  
    function handleFocusTrap(e) {
      if (e.key !== 'Tab') return;
  
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  
    // Gestion des listes
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
  
        const seenButton = document.createElement('button');
        seenButton.textContent = 'Ajouter à la Seenlist';
        seenButton.onclick = () => addToSeenlist(title);
        li.appendChild(seenButton);
  
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
  
    // Initialisation
    loadCards();
    loadWatchlist();
    loadSeenlist();
  });
  