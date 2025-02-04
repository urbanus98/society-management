const db = require('../../db');
const hashPassword = require('../miscController').hashPassword;

const handleNewUser = async (req, res) => {
    const { name, username, password, role } = req.body;

    try {
        const hashedPassword = await hashPassword(password);

        // Insert the user into the database
        const sql = 'INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)';
        db.query(sql, [name, username, hashedPassword, role], (err, result) => {
            if (err) {
                console.error('Error inserting user into database:', err);
                return res.status(500).json({ error: 'Failed to register user' });
            }
            console.log('User inserted successfully:', result);
            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (err) {
        console.error('Error hashing password:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { handleNewUser };