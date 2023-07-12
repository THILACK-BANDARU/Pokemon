const apiUrl = 'https://pokeapi.co/api/v2/pokemon';
const limit = 50;
let offset = 0;
let currentPage = 1;

// Function to create HTML elements
function createElement(tagName, className = '', textContent = '') {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = textContent;
  return element;
}

// Function to fetch Pokemon data from the API
async function getPokemonData() {
  try {
    const response = await fetch(`${apiUrl}?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.log('Error:', error);
  }
}

// Function to fetch additional details for each Pokemon
async function getPokemonDetails(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error:', error);
  }
}

// Function to display Pokemon data
function displayPokemonData(pokemonData) {
  const pokemonList = document.getElementById('pokemon-list');
  pokemonList.innerHTML = '';

  pokemonData.forEach(async (pokemon) => {
    const pokemonDetails = await getPokemonDetails(pokemon.url);

    const pokemonCard = createElement('div', 'card');

    const pokemonImage = createElement('img');
    pokemonImage.src = pokemonDetails.sprites.other['official-artwork'].front_default;
    pokemonImage.alt = pokemonDetails.name;

    const pokemonName = createElement('h3', '', pokemonDetails.name);

    pokemonCard.appendChild(pokemonImage);
    pokemonCard.appendChild(pokemonName);

    pokemonList.appendChild(pokemonCard);
  });
}

// Function to handle pagination
function handlePagination(pokemonCount) {
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');
  const pageButtons = document.getElementById('page-buttons');

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === Math.ceil(pokemonCount / limit);

  pageButtons.innerHTML = '';
  const totalPages = Math.ceil(pokemonCount / limit);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = createElement('button', 'page-button', i);
    if (i === currentPage) {
      pageButton.classList.add('active');
    }
    pageButton.addEventListener('click', () => {
      currentPage = i;
      offset = (currentPage - 1) * limit;
      fetchPokemon();
    });
    pageButtons.appendChild(pageButton);
  }
}

// Event listener for previous button
document.getElementById('prev-button').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    offset = (currentPage - 1) * limit;
    fetchPokemon();
  }
});

// Event listener for next button
document.getElementById('next-button').addEventListener('click', () => {
  offset += limit;
  currentPage++;
  fetchPokemon();
});

// Function to fetch Pokemon and display data
async function fetchPokemon() {
  const pokemonData = await getPokemonData();
  displayPokemonData(pokemonData);
  handlePagination(pokemonData.length);
}

// Initial fetch
fetchPokemon();
