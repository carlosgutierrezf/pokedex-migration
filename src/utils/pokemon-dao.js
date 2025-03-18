const axios = require("axios");

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

class PokemonDAO {
  readObject = async (name, limit) => {
    const response = await axios.get(
      `${POKEAPI_BASE_URL}/${name}?limit=${limit}`
    );
    const pokemons = await Promise.all(
      response.data.results.map(async (pokemon) => {
        const details = await axios.get(pokemon.url);
        return details.data;
      })
    );
    return pokemons;
  };
}
module.exports = { PokemonDAO };
