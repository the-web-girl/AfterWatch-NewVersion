document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button[data-title]');
    const watchlistElement = document.getElementById('liste-watchlist');
    const seenlistElement = document.getElementById('liste-seenlist');
  
    // Fonction pour charger la watchlist
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
  
        // Ajouter un bouton pour ajouter à la seenlist si le film est dans la watchlist
        const seenButton = document.createElement('button');
        seenButton.textContent = 'Ajouter à la Seenlist';
        seenButton.onclick = () => addToSeenlist(title);
        li.appendChild(seenButton);
  
        watchlistElement.appendChild(li);
      });
    }
  
    // Fonction pour charger la seenlist
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
  
    // Ajouter à la watchlist
    function addToWatchlist(title) {
      const list = JSON.parse(localStorage.getItem('watchlist')) || [];
      if (!list.includes(title)) {
        list.push(title);
        localStorage.setItem('watchlist', JSON.stringify(list));
        loadWatchlist();
      }
    }
  
    // Retirer de la watchlist
    function removeFromWatchlist(title) {
      let list = JSON.parse(localStorage.getItem('watchlist')) || [];
      list = list.filter(item => item !== title);
      localStorage.setItem('watchlist', JSON.stringify(list));
      loadWatchlist();
    }
  
    // Ajouter à la seenlist
    function addToSeenlist(title) {
      const list = JSON.parse(localStorage.getItem('seenlist')) || [];
      if (!list.includes(title)) {
        list.push(title);
        localStorage.setItem('seenlist', JSON.stringify(list));
        loadSeenlist();
      }
    }
  
    // Retirer de la seenlist
    function removeFromSeenlist(title) {
      let list = JSON.parse(localStorage.getItem('seenlist')) || [];
      list = list.filter(item => item !== title);
      localStorage.setItem('seenlist', JSON.stringify(list));
      loadSeenlist();
    }
  
    // Gestion des boutons d'ajout dans la watchlist
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.dataset.title;
        addToWatchlist(title); // Ajoute à la Watchlist
        btn.disabled = true; // Désactive le bouton une fois ajouté
      });
    });
  
    loadWatchlist();
    loadSeenlist();
  });


  document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const modalGenres = document.getElementById('modal-genres');
    const modalReleaseDate = document.getElementById('modal-release-date');
    const modalRating = document.getElementById('modal-rating');
    const closeModalBtn = document.getElementById('close-modal');
  
    // Fonction pour ouvrir la modale avec les détails
    function openModal(card) {
      const title = card.dataset.title;
      const actors = card.dataset.actors;
      const director = card.dataset.director;
      const genre = card.dataset.genre;
  
      modalTitle.textContent = title;
      modalImage.src = card.querySelector('img').src;
      modalImage.alt = title;
      modalDescription.textContent = `Acteurs : ${actors}\nRéalisateur : ${director}`;
      modalGenres.textContent = genre;
      modalReleaseDate.textContent = "Date inconnue"; // À remplacer par la vraie date si disponible
      modalRating.textContent = "Non noté"; // À remplacer par la vraie note si disponible
  
      modal.hidden = false;
      modal.focus();
    }
  
    // Fonction pour fermer la modale
    function closeModal() {
      modal.hidden = true;
    }
  
    // Événement pour fermer la modale en cliquant sur le bouton de fermeture
    closeModalBtn.addEventListener('click', closeModal);
  
    // Événement pour fermer la modale en appuyant sur la touche Échap
    document.addEventListener('keydown', (e) => {
      if (!modal.hidden && e.key === 'Escape') {
        closeModal();
      }
    });
  
    // Événement pour ouvrir la modale en cliquant sur une carte
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Empêche l'ouverture du lien si l'utilisateur clique sur le bouton "+ Ajouter"
        if (e.target.tagName.toLowerCase() === 'button') return;
        e.preventDefault();
        openModal(card);
      });
    });
  });
  

//   const API_KEY = 'TA_CLE_API_ICI'; // remplace par ta clé
const API_KEY = '124bdc1601294994a241722466e53891';
const API_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

// Liste des titres que tu veux afficher (ou ID si tu les connais)
const TITLES = [
  "Breaking Bad",
  "Stranger Things",
  "Interstellar",
  "Star Wars"
];

// Fonction pour chercher un film/série par titre
async function fetchDetails(title) {
  const response = await fetch(`${API_URL}/search/multi?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(title)}`);
  const data = await response.json();
  return data.results?.[0]; // Le 1er résultat est souvent le plus pertinent
}

// Fonction pour générer une carte HTML
function createCard(data) {
  const container = document.getElementById('card-container');

  const article = document.createElement('article');
  article.className = 'card';
  article.dataset.title = data.title || data.name;

  article.innerHTML = `
    <a href="detail.html?title=${encodeURIComponent(data.title || data.name)}">
      <img src="${IMG_BASE + data.poster_path}" alt="${data.title || data.name}">
      <h3>${data.title || data.name}</h3>
    </a>
    <button data-title="${data.title || data.name}">+ Ajouter</button>
  `;

  container.appendChild(article);
}

// Chargement automatique des cartes au chargement
document.addEventListener('DOMContentLoaded', async () => {
  for (const title of TITLES) {
    try {
      const result = await fetchDetails(title);
      if (result) {
        createCard(result);
      } else {
        console.warn(`Aucun résultat pour "${title}"`);
      }
    } catch (err) {
      console.error('Erreur de récupération TMDb :', err);
    }
  }
});
