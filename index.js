const express = require('express');
const dotenv = require('dotenv');
const { fetchPokemons, fetchMoves, fetchLocations } = require('./src/services/pokeapi'); // Correct import
const hubspot = require('./src/services/hubspot');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint to trigger migration
app.post('/migrate', async (req, res) => {
  try {
    const pokemons = await fetchPokemons(100); // Use the imported function
    const moves = await fetchMoves(100);
    const locations = await fetchLocations(100);

    // Migrate data to HubSpot
    //await hubspot.migratePokemons(pokemons);
    await hubspot.migrateMoves(moves);
    //await hubspot.migrateLocations(locations);

    res.status(200).json({ message: 'Migration completed successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});