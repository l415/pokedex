async function getPokemonNames() {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=1025');
  const data = await response.json();
  return data.results.map(pokemon => ({
      name: pokemon.name,
      url: pokemon.url
  }));
}

async function renderPokemonCards(pokemonList) {
  const pokeContainer = document.getElementById('pokeContainer');
  pokeContainer.innerHTML = '';

  for (const pokemon of pokemonList) {
    const response = await fetch(pokemon.url);
    const data = await response.json();
    const types = data.types.map(type => type.type.name);

    const card = document.createElement('div');
    card.classList.add('card');
    card.classList.add(types[0]);

    card.innerHTML = `
      <img src="${data.sprites.front_default}" class="card-img-top" alt="${pokemon.name}">
      <div class="card-body">
          <h5 class="card-title">${pokemon.name}</h5>
          <p class="card-text">Número: ${data.id}</p>
          <p class="card-text">Tipo: ${types.join(', ')}</p>
          <button class="cry-button">Reproducir Cry</button>
      </div>
    `;

    const info = document.createElement('p');
    info.classList.add('hidden');
    card.appendChild(info);


    card.addEventListener('mouseover', () => {
      info.classList.remove('hidden');
      info.textContent = `Peso: ${data.weight / 10} kg, Altura: ${data.height / 10} m`;
    });

    card.addEventListener('mouseout', () => {
      info.classList.add('hidden');
    });

   
    const cryButton = card.querySelector('.cry-button');
    cryButton.addEventListener('click', async () => {
      try {
        const cryUrl = data.cries.latest || data.cries.legacy;
        if (!cryUrl) throw new Error("No se encontró el cry del Pokémon");
        const crySound = new Audio(cryUrl);
        crySound.play();
      } catch (error) {
        console.error(error.message);
      }
    });

    pokeContainer.appendChild(card);
  }
}

async function searchPokemon() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const pokemonList = await getPokemonNames();
  const filteredPokemon = pokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(searchInput));
  renderPokemonCards(filteredPokemon);
}

getPokemonNames().then(renderPokemonCards);

document.getElementById('searchButton').addEventListener('click', searchPokemon);
