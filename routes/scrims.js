const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const router = express.Router();

const VALID_RANKS = [
    'Iron',
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Ascendant',
    'Immortal',
    'Radiant',
];

// Alle scrims ophalen
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
            console.error('Fout bij het zoeken naar scrims:', err);
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
            console.error('Fout bij het ophalen van de scrim:', err);
            return res.status(500).send('Serverfout');
        }
        if (results.length === 0) {
            return res.status(404).send('Scrim niet gevonden');
        }
        res.json(results[0]);
    });
});

// Nieuwe scrim toevoegen
router.post(
    '/',
    [
        body('type')
            .notEmpty().withMessage('Type is verplicht')
            .isIn(['ranked', 'casual']).withMessage('Type moet ranked of casual zijn'),
        body('date').isDate().withMessage('Datum moet een geldige datum zijn'),
        body('start_time').notEmpty().withMessage('Starttijd is verplicht'),
        body('end_time')
            .notEmpty().withMessage('Eindtijd is verplicht')
            .custom((value, { req }) => {
                if (value <= req.body.start_time) {
                    throw new Error('Eindtijd moet later zijn dan starttijd');
                }
                return true;
            }),
        body('players_needed').isInt({ min: 1 }).withMessage('Aantal spelers moet een positief geheel getal zijn'),
        body('language')
            .isIn(['EN', 'NL']).withMessage('Taal moet EN of NL zijn'),
        body('min_rank')
            .isIn(VALID_RANKS).withMessage('Minimale rang is ongeldig')
            .custom((value, { req }) => {
                if (VALID_RANKS.indexOf(value) > VALID_RANKS.indexOf(req.body.max_rank)) {
                    throw new Error('Minimale rang kan niet hoger zijn dan maximale rang');
                }
                return true;
            }),
        body('max_rank')
            .isIn(VALID_RANKS).withMessage('Maximale rang is ongeldig')
            .custom((value, { req }) => {
                if (VALID_RANKS.indexOf(value) < VALID_RANKS.indexOf(req.body.min_rank)) {
                    throw new Error('Maximale rang kan niet lager zijn dan minimale rang');
                }
                return true;
            }),
        body('notes').optional().isLength({ max: 500 }).withMessage('Notities mogen niet meer dan 500 tekens bevatten'),
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
            res.status(201).send('Scrim toegevoegd');
        });
    }
);

// Scrim updaten
router.put(
    '/:id',
    [
        body('type')
            .optional()
            .isIn(['ranked', 'casual']).withMessage('Type moet ranked of casual zijn'),
        body('date').optional().isDate().withMessage('Datum moet een geldige datum zijn'),
        body('players_needed').optional().isInt({ min: 1 }).withMessage('Aantal spelers moet een positief geheel getal zijn'),
        body('language').optional().isIn(['EN', 'NL']).withMessage('Taal moet EN of NL zijn'),
        body('min_rank')
            .optional()
            .isIn(VALID_RANKS).withMessage('Minimale rang is ongeldig')
            .custom((value, { req }) => {
                if (req.body.max_rank && VALID_RANKS.indexOf(value) > VALID_RANKS.indexOf(req.body.max_rank)) {
                    throw new Error('Minimale rang kan niet hoger zijn dan maximale rang');
                }
                return true;
            }),
        body('max_rank')
            .optional()
            .isIn(VALID_RANKS).withMessage('Maximale rang is ongeldig')
            .custom((value, { req }) => {
                if (req.body.min_rank && VALID_RANKS.indexOf(value) < VALID_RANKS.indexOf(req.body.min_rank)) {
                    throw new Error('Maximale rang kan niet lager zijn dan minimale rang');
                }
                return true;
            }),
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
                console.error('Fout bij het updaten van de scrim:', err);
                return res.status(500).send('Serverfout');
            }
            res.send('Scrim bijgewerkt');
        });
    }
);

module.exports = router;
