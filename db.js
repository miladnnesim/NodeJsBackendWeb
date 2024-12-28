const mysql = require('mysql2');
require('dotenv').config(); // Laadt de variabelen uit het .env-bestand

// Maak een databaseverbinding met configuratie uit .env
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

// Test de verbinding
connection.connect((err) => {
    if (err) {
        console.error('Fout bij het verbinden met de database:', err);
        process.exit(1); // Stop het proces als er een fout is
    }
    console.log('Succesvol verbonden met de database');
});

module.exports = connection;
