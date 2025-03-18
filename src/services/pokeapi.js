const axios = require("axios");
const { PokemonDAO } = require('../utils/pokemon-dao');
const pokemon = new PokemonDAO();


// Fetch Pokémon data
async function fetchPokemons(limit = 100) {
  let i = 0;
  while (true) {
    try {
      const pokemons = (await pokemon.readObject('pokemon', limit)).map(
        pokemon => {
          return {
            id: pokemon.id,
            name: pokemon.name,
            hp: pokemon.stats.find(stat => stat.stat.name === 'hp').base_stat,
            attack: pokemon.stats.find(stat => stat.stat.name === 'attack')
              .base_stat,
            defense: pokemon.stats.find(stat => stat.stat.name === 'defense')
              .base_stat,
            specialAttack: pokemon.stats.find(
              stat => stat.stat.name === 'special-attack',
            ).base_stat,
            specialDefense: pokemon.stats.find(
              stat => stat.stat.name === 'special-defense',
            ).base_stat,
            speed: pokemon.stats.find(stat => stat.stat.name === 'speed')
              .base_stat,
            types: pokemon.types.map(type => type.type.name),
            moves: pokemon.moves.map(move => move.move.name),
            locations: pokemon.location_area_encounters,
          };
        },
      );
      return pokemons;
    } catch (error) {
      if (i <= 3) {
        i++;
        await new Promise(resolve => setTimeout(resolve, 500));
        continue;
      }
      throw new Error(`Failed to fetch Pokémon: ${error.message}`);
    }
  }
}

// Fetch Moves data
async function fetchMoves(limit = 100) {
  let i = 0;
  while (true) {
    try {
      const moves = (await pokemon.readObject('move', limit)).map((move) => {
        return {
          id: move.id,
          name: move.name,
          pp: move.pp,
          power: move.power,
        };
      });
      return moves;
    } catch (error) {
      if (i <= 3) {
        i++;
        await new Promise(resolve => setTimeout(resolve, 500));
        continue;
      }
      throw new Error(`Failed to fetch moves: ${error.message}`);
    }
  }
}

// Fetch Locations data
async function fetchLocations(limit = 100) {
  let i = 0;
  while (true) {
    try {
      const locations = (await pokemon.readObject('location', limit)).map((location) => {
        return {
            id: details.data.id,
            name: details.data.name,
            region: details.data.region.name,
            generation:
              details.data.game_indices[0]?.generation?.name || "unknown",
            numberOfAreas: details.data.areas.length,
          };
      });
      return locations;
    } catch (error) {
      if (i <= 3) {
        i++;
        await new Promise(resolve => setTimeout(resolve, 500));
        continue;
      }
      
      throw new Error(`Failed to fetch locations: ${error.message}`);
    }
  }
}

// Export the function
module.exports = { fetchPokemons, fetchMoves, fetchLocations };
