# API Project: Users & Scrims Management

## Overzicht

Dit project is een API gebouwd met **Node.js** en **Express**, ontworpen om twee entiteiten te beheren:

1. **Users** (gebruikers)
2. **Scrims** (scrimmages voor games zoals Valorant)

De API biedt volledige **CRUD-functionaliteit** (Create, Read, Update, Delete) voor beide entiteiten en ondersteunt geavanceerde zoek- en validatiefunctionaliteiten. Het is verbonden met een MySQL-database en bevat extra beveiliging met validaties en query-parameters.

## Functionaliteiten

### Users

- Beheer gebruikers met velden zoals naam, e-mailadres, gebruikersnaam, etc.
- Ondersteunt:
  - Zoeken op meerdere velden (naam, rol, e-mail, enz.).
  - Paginering met `limit` en `offset`.

### Scrims

- Beheer game scrimmages met velden zoals type, datum, spelersaantal, rangen, enz.
- Ondersteunt:
  - Validatie van rangen en tijden.
  - Zoeken op type, datum en taal.

## Installatie en Configuratie

Volg deze stappen om het project lokaal te installeren en uit te voeren.

### Benodigdheden

- **Node.js** (versie 20 of hoger)
- **MySQL database**
- **npm** (Node Package Manager)

### 1. Project Clonen

Kloon deze repository naar je lokale machine:

git clone https://github.com/miladnnesim/NodeJsBackendWeb.git
cd NodeJsBackendWeb/

### 2. Installeren van afhankelijkheden

Installeer alle benodigde dependencies:

npm install

### 3. Configureren van de `.env` file

Maak een `.env` bestand in de root van de project

### 4. MySQL Database instellen

Ik heb dezelfde DB gebruikt als voor mijn Laravel project

### 5. Server Starten

Start de server met het volgende commando:

node index.js

Als alles correct is ingesteld, draait de server op:  
http://localhost:3000

## API Endpoints

### Users

| Methode | Endpoint           | Beschrijving                        |
| ------- | ------------------ | ----------------------------------- |
| GET     | `/users`           | Haal alle gebruikers op.            |
| GET     | `/users/paginated` | Haal gebruikers op met paginering.  |
| GET     | `/users/:id`       | Haal een specifieke gebruiker op.   |
| GET     | `/users/search`    | Zoek gebruikers op meerdere velden. |
| POST    | `/users`           | Voeg een nieuwe gebruiker toe.      |
| PUT     | `/users/:id`       | Update een bestaande gebruiker.     |
| DELETE  | `/users/:id`       | Verwijder een gebruiker.            |

### Scrims

| Methode | Endpoint         | Beschrijving                    |
| ------- | ---------------- | ------------------------------- |
| GET     | `/scrims`        | Haal alle scrims op.            |
| GET     | `/scrims/search` | Zoek scrims op meerdere velden. |
| GET     | `/scrims/:id`    | Haal een specifieke scrim op.   |
| POST    | `/scrims`        | Voeg een nieuwe scrim toe.      |
| PUT     | `/scrims/:id`    | Update een bestaande scrim.     |
| DELETE  | `/scrims/:id`    | Verwijder een scrim.            |

## Bronnen
Ik heb gewerkt aan 1 grote chatgpt chat, maar omdat ik fotos heb geupload in dat chat, kan ik die niet delen.
Ik heb dat chat gebruikt grotendeels voor debug en informatie opvulling.

start node: https://chatgpt.com/share/677066f1-f168-800c-8539-d6d33dbd7795

db connectionn : https://chatgpt.com/share/677173bc-5d24-800c-b838-dd86763ab66f
