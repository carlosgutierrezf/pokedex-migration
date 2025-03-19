const axios = require('axios');
const dotenv = require('dotenv');
const { logger } = require('./logger.js');

dotenv.config();

const HUBSPOT_BASE_URL = 'https://api.hubapi.com';
const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;

async function checkIfRecordExists(endpoint, uniqueProperty, uniqueValue) {
    try {
        const response = await axios.post(
            `${HUBSPOT_BASE_URL}/crm/v3/objects/${endpoint}/search`,
            {
                filterGroups: [
                    {
                        filters: [
                            {
                                propertyName: uniqueProperty,
                                operator: 'EQ',
                                value: uniqueValue,
                            },
                        ],
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${HUBSPOT_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // If records are found, return the first record's ID
        if (response.data.results.length > 0) {
            return response.data.results[0].id;
        }
        return null; // No record found
    } catch (error) {
        logger.log({ level: 'error', message: `Error checking if record exists: ${error.message}` });
        throw error;
    }
}

// Migrate Pokémon to Contacts
async function migratePokemons(pokemons) {
    try {
        for (const pokemon of pokemons) {
            const contactData = {
                properties: {
                    email: `${pokemon.name.toLowerCase()}@pokemon.com`, // Unique email
                    firstname: pokemon.name,
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

            // Check if the contact already exists
            const existingContactId = await checkIfRecordExists('contacts', 'email', contactData.properties.email);

            if (existingContactId) {
                // Update existing contact
                await axios.patch(`${HUBSPOT_BASE_URL}/crm/v3/objects/contacts/${existingContactId}`, contactData, {
                    headers: {
                        Authorization: `Bearer ${HUBSPOT_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                });
                logger.log({ level: 'info', message: `Pokémon updated successfully: ${JSON.stringify(pokemon)}` });
            } else {
                // Create new contact
                await axios.post(`${HUBSPOT_BASE_URL}/crm/v3/objects/contacts`, contactData, {
                    headers: {
                        Authorization: `Bearer ${HUBSPOT_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                });
                logger.log({ level: 'info', message: `Pokémon created successfully: ${JSON.stringify(pokemon)}` });
            }
        }
    } catch (error) {
        logger.log({ level: 'error', message: `Error response: ${JSON.stringify(error.response?.data)}` });
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

            // Check if the move already exists
            const existingMoveId = await checkIfRecordExists('moves', 'id', moveData.properties.id);

            if (existingMoveId) {
                // Update existing move
                await axios.patch(`${HUBSPOT_BASE_URL}/crm/v3/objects/moves/${existingMoveId}`, moveData, {
                    headers: {
                        Authorization: `Bearer ${HUBSPOT_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log(`Move updated successfully: ${move.name}`);
            } else {
                // Create new move
                await axios.post(`${HUBSPOT_BASE_URL}/crm/v3/objects/moves`, moveData, {
                    headers: {
                        Authorization: `Bearer ${HUBSPOT_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log(`Move created successfully: ${move.name}`);
            }
        }
    } catch (error) {
        console.error('Error response:', error.response?.data);
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

            // Check if the company already exists
            const existingCompanyId = await checkIfRecordExists('companies', 'location_id', companyData.properties.location_id);

            if (existingCompanyId) {
                // Update existing company
                await axios.patch(`${HUBSPOT_BASE_URL}/crm/v3/objects/companies/${existingCompanyId}`, companyData, {
                    headers: {
                        Authorization: `Bearer ${HUBSPOT_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log(`Location updated successfully: ${location.name}`);
            } else {
                // Create new company
                await axios.post(`${HUBSPOT_BASE_URL}/crm/v3/objects/companies`, companyData, {
                    headers: {
                        Authorization: `Bearer ${HUBSPOT_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log(`Location created successfully: ${location.name}`);
            }
        }
    } catch (error) {
        console.error('Error response:', error.response?.data);
        throw new Error(`Failed to migrate Locations: ${error.message}`);
    }
}

module.exports = {
    migratePokemons,
    migrateMoves,
    migrateLocations,
};