const db = require('../../db');
const jwt = require('jsonwebtoken');

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    
    if (!cookies?.jwt) return res.sendStatus(401);

    // console.log('jwt', cookies.jwt);
    const refreshToken = cookies.jwt;

    // Fetch the user from the database by refreshToken
    const sql = 'SELECT * FROM users WHERE refresh_token = ?';
    db.query(sql, [refreshToken], async (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Check if user exists
        if (results.length === 0) {
            return res.sendStatus(403); // Forbidden
        }

        const user = results[0];

        jwt.verify(
            refreshToken, 
            process.env.REFRESH_TOKEN_SECRET, 
            (err, decoded) => {
                if (err || user.username !== decoded.username) {
                    return res.sendStatus(403);
                }
                const accessToken = jwt.sign(
                    { username: decoded.username }, 
                    process.env.ACCESS_TOKEN_SECRET, 
                    { expiresIn: '15m' });

                res.json({ accessToken });
            }
        );
        
    });
};

module.exports = { handleRefreshToken };