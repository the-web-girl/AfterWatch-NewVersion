function filtrerContenu() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    let matchCount = 0;

    cards.forEach(card => {
      const searchable = `${card.dataset.title} ${card.dataset.actors} ${card.dataset.director} ${card.dataset.genre}`.toLowerCase();
      const visible = searchable.includes(query);
      card.style.display = visible ? 'block' : 'none';
      if (visible) matchCount++;
    });

    const errorMsg = document.getElementById('search-error');
    if (query && matchCount === 0) {
      errorMsg.textContent = 'Aucun résultat trouvé.';
    } else {
      errorMsg.textContent = '';
    }
  }

  document.getElementById('search-button').addEventListener('click', filtrerContenu);
  document.getElementById('search-input').addEventListener('input', filtrerContenu);