const apiUrl = 'https://pokeapi.co/api/v2/pokemon';
const itemsPerPage = 10;
const totalPages = 5;
let currentPage = 1;
let pokemonData = [];

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
    const response = await fetch(`${apiUrl}?limit=${itemsPerPage * totalPages}`);
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
function displayPokemonData() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const pokemonList = document.getElementById('pokemon-list');
  pokemonList.innerHTML = '';

  for (let i = startIndex; i < endIndex; i++) {
    if (!pokemonData[i]) break;

    const pokemon = pokemonData[i];
    const pokemonCard = createElement('div', 'card');

    const pokemonImage = createElement('img');
    pokemonImage.src = pokemon.sprites.front_default;
    pokemonImage.alt = pokemon.name;

    const pokemonName = createElement('h3', '', pokemon.name);

    pokemonCard.appendChild(pokemonImage);
    pokemonCard.appendChild(pokemonName);

    pokemonList.appendChild(pokemonCard);
  }
}

// Function to handle pagination
function handlePagination() {
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');
  const pageButtons = document.getElementById('page-buttons');

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;

  pageButtons.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = createElement('button', 'page-button', i);
    if (i === currentPage) {
      pageButton.classList.add('active');
    }
    pageButton.addEventListener('click', () => {
      currentPage = i;
      displayPokemonData();
      handlePagination();
    });
    pageButtons.appendChild(pageButton);
  }
}

// Event listener for previous button
document.getElementById('prev-button').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    displayPokemonData();
    handlePagination();
  }
});

// Event listener for next button
document.getElementById('next-button').addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    displayPokemonData();
    handlePagination();
  }
});

// Function to fetch Pokemon and display data
async function fetchPokemon() {
  try {
    pokemonData = await getPokemonData();
    const pokemonPromises = pokemonData.map((pokemon) => getPokemonDetails(pokemon.url));
    const pokemonDetails = await Promise.all(pokemonPromises);

    pokemonData.forEach((pokemon, index) => {
      pokemon.sprites = pokemonDetails[index].sprites;
    });

    displayPokemonData();
    handlePagination();
  } catch (error) {
    console.log('Error:', error);
  }
}

// Initial fetch
fetchPokemon();
