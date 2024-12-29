const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const router = express.Router();

// Alle users ophalen
router.get('/', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Fout bij het ophalen van users:', err);
            return res.status(500).send('Serverfout');
        }
        res.json(results);
    });
});
// Users ophalen met limit en offset
router.get('/paginated', (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const query = 'SELECT * FROM users LIMIT ? OFFSET ?';
    db.query(query, [limit, offset], (err, results) => {
        if (err) {
            console.error('Fout bij het ophalen van users met paginering:', err);
            return res.status(500).send('Serverfout');
        }
        res.json(results);
    });
});


// User details ophalen
router.get('/:id', (req, res) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error('Fout bij het ophalen van de user:', err);
            return res.status(500).send('Serverfout');
        }
        if (results.length === 0) {
            return res.status(404).send('User niet gevonden');
        }
        res.json(results[0]);
    });
});

// Users zoeken op meerdere velden
router.get('/search', (req, res) => {
    const { name, username, role, email } = req.query;

    let query = 'SELECT * FROM users WHERE 1=1';
    const params = [];

    if (name) {
        query += ' AND name LIKE ?';
        params.push(`%${name}%`);
    }
    if (username) {
        query += ' AND username LIKE ?';
        params.push(`%${username}%`);
    }
    if (role) {
        query += ' AND role = ?';
        params.push(role);
    }
    if (email) {
        query += ' AND email LIKE ?';
        params.push(`%${email}%`);
    }

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Fout bij het zoeken naar users:', err);
            return res.status(500).send('Serverfout');
        }
        res.json(results);
    });
});


// Nieuwe user toevoegen
router.post(
    '/',
    [
        body('name').notEmpty().withMessage('Naam is verplicht').isAlpha('nl-NL', { ignore: ' ' }).withMessage('Naam mag alleen letters bevatten'),
        body('username').optional().isAlphanumeric().withMessage('Gebruikersnaam mag alleen letters en cijfers bevatten'),
        body('riot_id').optional().isString().withMessage('Riot ID moet een geldige string zijn'),
        body('role').isIn(['user', 'admin']).withMessage('Rol moet user of admin zijn'),
        body('birthday').optional().isDate().withMessage('Geboortedatum moet een geldige datum zijn'),
        body('profile_photo').optional().isURL().withMessage('Profielfoto moet een geldige URL zijn'),
        body('about_me').optional().isLength({ max: 500 }).withMessage('Over mij mag niet meer dan 500 tekens bevatten'),
        body('email').notEmpty().withMessage('E-mail is verplicht').isEmail().withMessage('E-mail moet geldig zijn'),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const query = `INSERT INTO users (name, username, riot_id, role, birthday, profile_photo, about_me, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const { name, username, riot_id, role, birthday, profile_photo, about_me, email } = req.body;

        db.query(query, [name, username || null, riot_id || null, role, birthday || null, profile_photo || null, about_me || null, email], (err, results) => {
            if (err) {
                console.error('Fout bij het toevoegen van de user:', err);
                return res.status(500).send('Serverfout');
            }
            res.status(201).send('User toegevoegd');
        });
    }
);

// User updaten
router.put(
    '/:id',
    [
        body('name').optional().isAlpha('nl-NL', { ignore: ' ' }).withMessage('Naam mag alleen letters bevatten'),
        body('username').optional().isAlphanumeric().withMessage('Gebruikersnaam mag alleen letters en cijfers bevatten'),
        body('riot_id').optional().isString().withMessage('Riot ID moet een geldige string zijn'),
        body('role').optional().isIn(['user', 'admin']).withMessage('Rol moet user of admin zijn'),
        body('birthday').optional().isDate().withMessage('Geboortedatum moet een geldige datum zijn'),
        body('profile_photo').optional().isURL().withMessage('Profielfoto moet een geldige URL zijn'),
        body('about_me').optional().isLength({ max: 500 }).withMessage('Over mij mag niet meer dan 500 tekens bevatten'),
        body('email').optional().isEmail().withMessage('E-mail moet geldig zijn'),
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

        const query = `UPDATE users SET ${updates} WHERE id = ?`;

        db.query(query, values, (err, results) => {
            if (err) {
                console.error('Fout bij het updaten van de user:', err);
                return res.status(500).send('Serverfout');
            }
            res.send('User bijgewerkt');
        });
    }
);

// User verwijderen
router.delete('/:id', (req, res) => {
    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error('Fout bij het verwijderen van de user:', err);
            return res.status(500).send('Serverfout');
        }
        res.send('User verwijderd');
    });
});

module.exports = router;
