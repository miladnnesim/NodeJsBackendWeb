const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
    const query = 'SELECT * FROM scrims';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Fout bij het ophalen van scrims:', err);
            return res.status(500).send('Serverfout');
        }
        res.json(results);
    });
});
// Scrims zoeken op een specifieke waarde
router.get('/search', (req, res) => {
    const { type, date, language } = req.query;

    let query = 'SELECT * FROM scrims WHERE 1=1';
    const params = [];

    if (type) {
        query += ' AND type = ?';
        params.push(type);
    }
    if (date) {
        query += ' AND date = ?';
        params.push(date);
    }
    if (language) {
        query += ' AND language = ?';
        params.push(language);
    }

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('fout bij het zoeken naar scrims:', err);
            return res.status(500).send('Serverfout');
        }
        res.json(results);
    });
});


// Details van een specifieke scrim ophalen
router.get('/:id', (req, res) => {
    const query = 'SELECT * FROM scrims WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error('fout bij het ophalen van de scrim:', err);
            return res.status(500).send('Serverfout');
        }
        if (results.length === 0) {
            return res.status(404).send('scrim niet gevonden');
        }
        res.json(results[0]);
    });
});

// Nieuwe scrim toevoegen
router.post(
    '/',
    [
        body('type').notEmpty().withMessage('type is verplicht'),
        body('date').isDate().withMessage('datum moet een geldige datum zijn'),
        body('start_time').notEmpty().withMessage('starttijd is verplicht'),
        body('end_time').notEmpty().withMessage('eindtijd is verplicht'),
        body('players_needed').isInt({ min: 1 }).withMessage('aantal spelers moet een positief geheel getal zijn'),
        body('language').notEmpty().withMessage('taal is verplicht'),
        body('min_rank').notEmpty().withMessage('minimale rang is verplicht'),
        body('max_rank').notEmpty().withMessage('maximale rang is verplicht'),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const query = `INSERT INTO scrims (type, date, start_time, end_time, players_needed, language, min_rank, max_rank, notes, organizer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const { type, date, start_time, end_time, players_needed, language, min_rank, max_rank, notes, organizer_id } = req.body;

        db.query(query, [type, date, start_time, end_time, players_needed, language, min_rank, max_rank, notes || null, organizer_id], (err, results) => {
            if (err) {
                console.error('Fout bij het toevoegen van de scrim:', err);
                return res.status(500).send('Serverfout');
            }
            res.status(201).send('scrim toegevoegd');
        });
    }
);

// Scrim updaten
router.put(
    '/:id',
    [
        body('type').optional().notEmpty().withMessage('type mag niet leeg zijn'),
        body('date').optional().isDate().withMessage('datum moet een geldige datum zijn'),
        body('players_needed').optional().isInt({ min: 1 }).withMessage('aantal spelers moet een positief geheel getal zijn'),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const updates = Object.entries(req.body)
            .map(([key, value]) => `${key} = ?`)
            .join(', ');
        const values = [...Object.values(req.body), req.params.id];

        const query = `UPDATE scrims SET ${updates} WHERE id = ?`;

        db.query(query, values, (err, results) => {
            if (err) {
                console.error('fout bij het updaten van de scrim:', err);
                return res.status(500).send('Serverfout');
            }
            res.send('scrim bijgewerkt');
        });
    }
);

// Scrim verwijderen
router.delete('/:id', (req, res) => {
    const query = 'DELETE FROM scrims WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error('Fout bij het verwijderen van de scrim:', err);
            return res.status(500).send('Serverfout');
        }
        res.send('scrim verwijderd');
    });
});

module.exports = router;
