require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const path = require("path");
const https = require('https');
const fs = require('fs');

const errorHandler = require('./middleware/errorHandler');
const credentials = require('./middleware/credentials');
const { logger } = require('./middleware/logEvents');
const verifyJWT = require('./middleware/verifyJWT');

const corsOptions = require('./config/corsOptions');
const DEV_MODE = process.env.DEV_MODE === 'true';
const PORT = process.env.PORT;
const app = express();

// middleware for logging
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// serve static files
app.use(express.static(path.join(__dirname, 'dist')));
// serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/public", express.static(path.join(__dirname, "public")));

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

// middleware for form data
app.use(express.urlencoded({ extended: false }));

// middleware for JSON
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// public routes
app.use('/auth', require('./routes/Auth/auth'));
app.use('/refresh', require('./routes/Auth/refresh'));
app.use('/logout', require('./routes/Auth/logout'));

app.use(verifyJWT);

// private routes
app.use('/api', require('./routes/api'));

// serve React frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handler
app.use(errorHandler);

if (DEV_MODE) {
    app.listen(PORT, () => {
        console.log(`HTTP Server running on http://localhost:${PORT}`);
    });
} else {
    const options = {
        key: fs.readFileSync(process.env.KEY_PATH),
        cert: fs.readFileSync(process.env.CERT_PATH),
    };
    https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS Server running on port ${PORT}`);
    });
}

