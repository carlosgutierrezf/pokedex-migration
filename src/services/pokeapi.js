const axios = require('axios');

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

// Fetch Pokémon data
async function fetchPokemons(limit = 100) {
  try {
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}`);
    const pokemons = await Promise.all(
      response.data.results.map(async (pokemon) => {
        const details = await axios.get(pokemon.url);
        return {
          id: details.data.id,
          name: details.data.name,
          hp: details.data.stats.find((stat) => stat.stat.name === 'hp').base_stat,
          attack: details.data.stats.find((stat) => stat.stat.name === 'attack').base_stat,
          defense: details.data.stats.find((stat) => stat.stat.name === 'defense').base_stat,
          specialAttack: details.data.stats.find((stat) => stat.stat.name === 'special-attack').base_stat,
          specialDefense: details.data.stats.find((stat) => stat.stat.name === 'special-defense').base_stat,
          speed: details.data.stats.find((stat) => stat.stat.name === 'speed').base_stat,
          types: details.data.types.map((type) => type.type.name),
          moves: details.data.moves.map((move) => move.move.name),
          locations: details.data.location_area_encounters,
        };
      })
    );
    return pokemons;
  } catch (error) {
    throw new Error(`Failed to fetch Pokémon: ${error.message}`);
  }
}

// Fetch Moves data
async function fetchMoves(limit = 100) {
  try {
    const response = await axios.get(`${POKEAPI_BASE_URL}/move?limit=${limit}`);
    const moves = await Promise.all(
      response.data.results.map(async (move) => {
        const details = await axios.get(move.url);
        return {
          id: details.data.id,
          name: details.data.name,
          pp: details.data.pp,
          power: details.data.power,
        };
      })
    );
    
    return moves;
  } catch (error) {
    throw new Error(`Failed to fetch moves: ${error.message}`);
  }
}

// Fetch Locations data
async function fetchLocations(limit = 100) {
  try {
    const response = await axios.get(`${POKEAPI_BASE_URL}/location?limit=${limit}`);
    const locations = await Promise.all(
      response.data.results.map(async (location) => {
        const details = await axios.get(location.url);
        return {
          id: details.data.id,
          name: details.data.name,
          region: details.data.region.name,
          generation: details.data.game_indices[0]?.generation?.name || 'unknown',
          numberOfAreas: details.data.areas.length,
        };
      })
    );
    
    return locations;
  } catch (error) {
    throw new Error(`Failed to fetch locations: ${error.message}`);
  }
}

// Export the function
module.exports = { fetchPokemons, fetchMoves, fetchLocations };