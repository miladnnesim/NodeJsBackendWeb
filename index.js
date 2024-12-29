const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config(); // Omgeving variabelen inladen
const scrimsRoutes = require('./routes/scrims'); // Importeer de scrim-routes
const usersRoutes = require('./routes/users'); // Importeer de scrim-routes


const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.json()); // Voor JSON-verwerking

// Basisroute
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>API Documentatie</title>
        </head>
        <body>
            <h1>API Documentatie</h1>
            <h2>Users CRUD Endpoints</h2>
            <ul>
                <li><strong>GET /users</strong> - Haal alle gebruikers op</li>
                <li><strong>GET /users/paginated?limit=10&offset=0</strong> - Haal gebruikers op met paginering</li>
                <li><strong>GET /users/:id</strong> - Haal een specifieke gebruiker op via ID</li>
                <li><strong>GET /users/search?name=[name]&username=[username]&role=[role]&email=[email]</strong> - Zoek gebruikers op meerdere velden</li>
                <li><strong>POST /users</strong> - Voeg een nieuwe gebruiker toe
                    <br>Body:
                    <pre>
{
    "name": "John Doe",
    "username": "johnd",
    "riot_id": "riot123",
    "role": "user",
    "birthday": "2000-01-01",
    "profile_photo": "http://example.com/photo.jpg",
    "about_me": "Hello world",
    "email": "john@example.com"
}
                    </pre>
                </li>
                <li><strong>PUT /users/:id</strong> - Update een bestaande gebruiker
                    <br>Body: (alle velden zijn optioneel)
                    <pre>
{
    "name": "Jane Doe",
    "role": "admin"
}
                    </pre>
                </li>
                <li><strong>DELETE /users/:id</strong> - Verwijder een gebruiker via ID</li>
            </ul>

            <h2>Scrims CRUD Endpoints</h2>
            <ul>
                <li><strong>GET /scrims</strong> - Haal alle scrims op</li>
                <li><strong>GET /scrims/search?type=[type]&date=[date]&language=[language]</strong> - Zoek scrims op basis van type, datum, of taal</li>
                <li><strong>GET /scrims/:id</strong> - Haal een specifieke scrim op via ID</li>
                <li><strong>POST /scrims</strong> - Voeg een nieuwe scrim toe
                    <br>Body:
                    <pre>
{
    "type": "Ranked",
    "date": "2024-01-01",
    "start_time": "14:00",
    "end_time": "16:00",
    "players_needed": 5,
    "language": "EN",
    "min_rank": "Bronze",
    "max_rank": "Gold",
    "notes": "Casual play",
    "organizer_id": 1
}
                    </pre>
                </li>
                <li><strong>PUT /scrims/:id</strong> - Update een bestaande scrim
                    <br>Body: (alle velden zijn optioneel)
                    <pre>
{
    "type": "Casual",
    "players_needed": 8
}
                    </pre>
                </li>
                <li><strong>DELETE /scrims/:id</strong> - Verwijder een scrim via ID</li>
            </ul>
        </body>
        </html>
    `);
});

// Scrim-routes
app.use('/scrims', scrimsRoutes); // Gebruik de scrim-routes
app.use('/users', usersRoutes); // Gebruik de scrim-routes


// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Er is iets fout gegaan!');
});

// Start de server
app.listen(port, () => {
    console.log(`Server draait op http://localhost:${port}`);
});
