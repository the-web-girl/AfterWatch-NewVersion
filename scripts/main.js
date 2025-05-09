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