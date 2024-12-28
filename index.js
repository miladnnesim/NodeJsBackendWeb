const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config(); // Omgeving variabelen inladen
const scrimsRoutes = require('./routes/scrims'); // Importeer de scrim-routes

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.json()); // Voor JSON-verwerking

// Basisroute
app.get('/', (req, res) => {
    res.send('Welkom bij mijn API! Bekijk de documentatie op /api-docs');
});

// Scrim-routes
app.use('/scrims', scrimsRoutes); // Gebruik de scrim-routes

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Er is iets fout gegaan!');
});

// Start de server
app.listen(port, () => {
    console.log(`Server draait op http://localhost:${port}`);
});
