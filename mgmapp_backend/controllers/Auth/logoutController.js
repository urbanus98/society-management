const db = require('../../db');

const handleLogout = async (req, res) => {
    // on client, also delete access token
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // no content
    const refreshToken = cookies.jwt;

    // Fetch the user from the database by username
    const sql = 'UPDATE users SET refresh_token = null WHERE refresh_token = ?';
    db.query(sql, [refreshToken], async (err, result) => {
        if (err) {
            console.error('Error nulling refresh token:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    });
};

module.exports = { handleLogout };