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
            <style>
                body {
                width: 80%;
                margin: 0 auto;
                    font-family: Jersey, sans-serif;
                    line-height: 1.6;
                }
                h1, h2 {
                    font-family: 'Verdana', sans-serif;
                }
                pre {
                    background-color: #f4f4f4;
                    padding: 10px;
                    border-radius: 5px;
                    overflow-x: auto;
                }
                ul {
                    list-style-type: none;
                    padding: 0;
                }
                li {
                    margin-bottom: 15px;
                }
                strong {
                    color: #333;
                }
                    </style>
        </head>
        <body>
            <h1>API Documentatie</h1>
            <h2>Users CRUD Endpoints</h2>
            <ul>
                <li><strong>GET /users</strong> - Haal alle gebruikers op</li>
                <li><strong>GET /users/paginated?limit=[number]&offset=[number]</strong> - Haal gebruikers op met paginering
                    <br>Query parameters:
                    <ul>
                        <li><strong>limit</strong>: (optioneel) Het maximum aantal gebruikers om op te halen (standaard: 10)</li>
                        <li><strong>offset</strong>: (optioneel) Het aantal gebruikers om over te slaan (standaard: 0)</li>
                    </ul>
                </li>
                <li><strong>GET /users/:id</strong> - Haal een specifieke gebruiker op via ID
                    <br>Route parameter:
                    <ul>
                        <li><strong>id</strong>: De ID van de gebruiker (vereist)</li>
                    </ul>
                </li>
                <li><strong>GET /users/search?name=[name]&username=[username]&role=[role]&email=[email]</strong> - Zoek gebruikers op meerdere velden
                    <br>Query parameters (optioneel):
                    <ul>
                        <li><strong>name</strong>: De naam van de gebruiker</li>
                        <li><strong>username</strong>: De gebruikersnaam</li>
                        <li><strong>role</strong>: De rol van de gebruiker (user of admin)</li>
                        <li><strong>email</strong>: Het e-mailadres van de gebruiker</li>
                    </ul>
                </li>
                <li><strong>POST /users</strong> - Voeg een nieuwe gebruiker toe
                    <br>Body:
                    <pre>
{
    "name": "John Doe",        // Vereist: Volledige naam (alleen letters)
    "username": "johnd",       // Optioneel: Alfanumerieke gebruikersnaam
    "riot_id": "riot123",      // Optioneel: String
    "role": "user",            // Vereist: user of admin
    "birthday": "2000-01-01",  // Optioneel: Datum (YYYY-MM-DD)
    "profile_photo": "http://example.com/photo.jpg", // Optioneel: Geldige URL
    "about_me": "Hello world", // Optioneel: Maximaal 500 tekens
    "email": "john@example.com"// Vereist: Geldig e-mailadres
}
                    </pre>
                </li>
                <li><strong>PUT /users/:id</strong> - Update een bestaande gebruiker
                    <br>Route parameter:
                    <ul>
                        <li><strong>id</strong>: De ID van de gebruiker (vereist)</li>
                    </ul>
                    <br>Body (alle velden optioneel):
                    <pre>
{
    "name": "Jane Doe",         // Volledige naam
    "role": "admin"             // user of admin
}
                    </pre>
                </li>
                <li><strong>DELETE /users/:id</strong> - Verwijder een gebruiker via ID
                    <br>Route parameter:
                    <ul>
                        <li><strong>id</strong>: De ID van de gebruiker (vereist)</li>
                    </ul>
                </li>
            </ul>

            <h2>Scrims CRUD Endpoints</h2>
            <ul>
                <li><strong>GET /scrims</strong> - Haal alle scrims op</li>
                <li><strong>GET /scrims/search?type=[type]&date=[date]&language=[language]</strong> - Zoek scrims op basis van type, datum, of taal
                    <br>Query parameters (optioneel):
                    <ul>
                        <li><strong>type</strong>: Type scrim (ranked of casual)</li>
                        <li><strong>date</strong>: Datum van de scrim (YYYY-MM-DD)</li>
                        <li><strong>language</strong>: Taal van de scrim (EN of NL)</li>
                    </ul>
                </li>
                <li><strong>GET /scrims/:id</strong> - Haal een specifieke scrim op via ID
                    <br>Route parameter:
                    <ul>
                        <li><strong>id</strong>: De ID van de scrim (vereist)</li>
                    </ul>
                </li>
                <li><strong>POST /scrims</strong> - Voeg een nieuwe scrim toe
                    <br>Body:
                    <pre>
{
    "type": "Ranked",           // Vereist: ranked of casual
    "date": "2024-01-01",       // Vereist: Datum (YYYY-MM-DD)
    "start_time": "14:00",      // Vereist: Starttijd (HH:MM)
    "end_time": "16:00",        // Vereist: Eindtijd (HH:MM)
    "players_needed": 5,        // Vereist: Aantal spelers (positief geheel getal)
    "language": "EN",           // Vereist: EN of NL
    "min_rank": "Bronze",       // Vereist: Minimale rang (geldige rang)
    "max_rank": "Gold",         // Vereist: Maximale rang (geldige rang)
    "notes": "Casual play",     // Optioneel: Maximaal 500 tekens
    "organizer_id": 1           // Vereist: ID van de organisator (integer)
}
                    </pre>
                </li>
                <li><strong>PUT /scrims/:id</strong> - Update een bestaande scrim
                    <br>Route parameter:
                    <ul>
                        <li><strong>id</strong>: De ID van de scrim (vereist)</li>
                    </ul>
                    <br>Body (alle velden optioneel):
                    <pre>
{
    "type": "Casual",           // ranked of casual
    "players_needed": 8         // Positief geheel getal
}
                    </pre>
                </li>
                <li><strong>DELETE /scrims/:id</strong> - Verwijder een scrim via ID
                    <br>Route parameter:
                    <ul>
                        <li><strong>id</strong>: De ID van de scrim (vereist)</li>
                    </ul>
                </li>
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
