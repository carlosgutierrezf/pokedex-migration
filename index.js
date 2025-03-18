const express = require('express');
const dotenv = require('dotenv');
const { fetchPokemons, fetchMoves, fetchLocations } = require('./src/services/pokeapi'); // Correct import
const hubspot = require('./src/services/hubspot');
const { z } = require('zod');
const cors = require('cors');
const helmet = require('helmet');

const userSchema = z.object({
  limit: z.number().int(),
});

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerSetup = require('./swagger');
swaggerSetup(app);

// Use Helmet to set security-related HTTP headers
app.use(helmet());

app.use(cors({
  origin: '*'
}));


app.use(express.json());

/**
 * @swagger
 * /migrate:
 *   post:
 *     summary: Migrate Pokemon data to HubSpot
 *     responses:
 *       200:
 *         description: Migration completed successfully
 *       500:
 *         description: Internal Server Error
 */
app.post('/migrate', async (req, res) => {
  try {
    const { limit } = userSchema.parse(req.body);
    const pokemons = await fetchPokemons(limit); // Use the imported function
    const moves = await fetchMoves(limit);
    const locations = await fetchLocations(limit);

    // Migrate data to HubSpot
    await hubspot.migratePokemons(pokemons);
    await hubspot.migrateMoves(moves);
    await hubspot.migrateLocations(locations);

    res.status(200).json({ message: 'Migration completed successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});