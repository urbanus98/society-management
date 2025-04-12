const { performQuery, performUpdate } = require("../services/genericActions");
const hashPassword = require('../services/misc').hashPassword;

const getUsers = async (req, res)=>{
    const sql = "SELECT * FROM users";
    const result = await performQuery(sql);
    return res.json(result);
};

const getUser = async (req, res)=>{
    const sql = "SELECT * FROM users WHERE id = ?";
    const result = await performQuery(sql, [req.params.id]);
    return res.json(result[0]);
}

const putUser = async (req, res)=> {
    const { name, username, password } = req.body;
    try {
        if (password === '') {
            const sql = 'UPDATE users SET name = ?, username = ? WHERE id = ?';
            const result = await performUpdate(sql, [name, username, req.params.id]);
            return res.json(result);
        }
        if (password.length < 5) {
            return res.status(400).json({ error: 'Password must be at least 5 characters long' });
        } else {
            const hashedPassword = await hashPassword(password);
            const sql = 'UPDATE users SET name = ?, username = ?, password = ? WHERE id = ?';
            const result = await performUpdate(sql, [name, username, hashedPassword, req.params.id]);
            return res.json(result);
        }
    } catch (err) {
        console.error('Error updating user:', err);
        return res.status(500).json({ error: 'Failed to update user' });
    }
}

module.exports = { getUsers, getUser, putUser };