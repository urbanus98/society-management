const db = require('../../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { username, password } = req.body;

    // Fetch the user from the database by username
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Check if user exists
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = results[0];
        const role = user.role;
        const hashedPassword = user.password;

        try {
            const isMatch = await bcrypt.compare(password, hashedPassword);

            if (isMatch) {
                console.log('Password match:', isMatch);
                const accessToken = jwt.sign({ username: username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                const refreshToken = jwt.sign({ username: username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
                
                // console.log('Access token:', accessToken);

                const sql = 'UPDATE users SET refresh_token = ? WHERE username = ?';
                db.query(sql, [refreshToken, username], async (err, result) => {
                    if (err) {
                        console.error('Error setting refresh token:', err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 }); // day in ms
                    res.status(200).json({ role, name: user.name, id: user.id, accessToken });
                });
            } else {
                console.log('Password match:', isMatch);
                res.status(401).json({ error: 'Invalid username or password' });
            }
        } catch (err) {
            console.error('Error comparing passwords:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
};

module.exports = { handleLogin };