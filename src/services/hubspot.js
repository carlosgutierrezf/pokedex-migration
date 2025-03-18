const axios = require('axios');
const dotenv = require('dotenv');
const { logger } = require('./logger.js');

dotenv.config();

const HUBSPOT_BASE_URL = 'https://api.hubapi.com';
const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;

// Migrate Pokémon to Contacts
async function migratePokemons(pokemons) {
    try {
        for (const pokemon of pokemons) {
            const contactData = {
                properties: {
                    email: `${pokemon.name.toLowerCase()}@pokemon.com`, // Add a unique email
                    pokedex_id: pokemon.id,
                    pokemon_name: pokemon.name,
                    hp: pokemon.hp,
                    attack: pokemon.attack,
                    defense: pokemon.defense,
                    special_attack: pokemon.specialAttack,
                    special_defense: pokemon.specialDefense,
                    speed: pokemon.speed,
                    types: pokemon.types.join(';'),
                },
            };
            await axios.post(`${HUBSPOT_BASE_URL}/crm/v3/objects/contacts`, contactData, {
                headers: {
                    Authorization: `Bearer ${HUBSPOT_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });

            logger.log({ level: 'info', message: `Pokémon migrated successfully: ${ JSON.stringify( pokemon ) }` });
        }
        
    } catch (error) {
        logger.log ({ level: 'error', message: `Error response: ${ JSON.stringify( error.response?.data ) }` }); // Log the full error response
        throw new Error(`Failed to migrate Pokémon: ${error.message}`);
    }
}

// Migrate Moves to Custom Objects
async function migrateMoves(moves) {
    try {
        for (const move of moves) {
            const moveData = {
                properties: {
                    id: move.id,
                    name: move.name,
                    pp: move.pp,
                    power: move.power,
                },
            };
            await axios.post(`${HUBSPOT_BASE_URL}/crm/v3/objects/moves`, moveData, {
                headers: {
                    Authorization: `Bearer ${HUBSPOT_API_KEY}`
                },
            });
        }
        console.log('Moves migrated successfully!');
    } catch (error) {
        console.error('Error response:', error.response?.data); // Log the full error response
        throw new Error(`Failed to migrate Moves: ${error.message}`);
    }
}

// Migrate Locations to Companies
async function migrateLocations(locations) {
    try {
        for (const location of locations) {
            const companyData = {
                properties: {
                    location_id: location.id,
                    name: location.name,
                    region: location.region,
                    generation: location.generation,
                    number_of_areas: location.numberOfAreas,
                },
            };
            await axios.post(`${HUBSPOT_BASE_URL}/crm/v3/objects/companies`, companyData, {
                headers: {
                    Authorization: `Bearer ${HUBSPOT_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });
        }
        console.log('Locations migrated successfully!');
    } catch (error) {
        console.error('Error response:', error.response?.data); // Log the full error response
        throw new Error(`Failed to migrate Locations: ${error.message}`);
    }
}

module.exports = {
    migratePokemons,
    migrateMoves,
    migrateLocations
};