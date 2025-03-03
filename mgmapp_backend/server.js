require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const path = require("path");

const errorHandler = require('./middleware/errorHandler');
const credentials = require('./middleware/credentials');
const { logger } = require('./middleware/logEvents');
const verifyJWT = require('./middleware/verifyJWT');

const corsOptions = require('./config/corsOptions');
const PORT = process.env.PORT;
const db = require('./db');
const app = express();

// middleware for logging
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

// middleware for form data
app.use(express.urlencoded({ extended: false }));

// middleware for JSON
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// routes
app.use('/auth', require('./routes/Auth/auth'));
app.use('/refresh', require('./routes/Auth/refresh'));
app.use('/logout', require('./routes/Auth/logout'));

app.use(verifyJWT);

app.use('/register', require('./routes/Auth/register'));
app.use('/events', require('./routes/events'));
app.use('/sales', require('./routes/sales'));
app.use('/invoices', require('./routes/invoices'));
app.use('/entities', require('./routes/entities'));
app.use('/merch', require('./routes/merch'));
app.use('/orders', require('./routes/orders'));
app.use('/traffic', require('./routes/traffic'));
app.use('/debts', require('./routes/debts'));
app.use('/black', require('./routes/black'));
app.use('/data', require('./routes/data'));
app.use('/trips', require('./routes/trips'));

app.get('/dummy', (req, res) => {
    const sql = "SELECT 1";
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
        return res.json(result);
    });
});

app.get('/users', (req, res)=>{
    const sql = "SELECT * FROM users";
    db.query(sql, (err, result)=>{
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
        return res.json(result);
    });
});

app.all('*', (req, res) => {
    res.status(404).json({ error: 'Invalid route' });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

  
