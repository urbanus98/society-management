// app.use(cors({
//     origin: "http://localhost:5173",  // Replace with your frontend URL
//     credentials: true                 // Allow credentials (cookies, authorization headers)
// }));

const whitelist = require('./whitelist');

const corsOptions = {
    origin: (origin, callback) =>{
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    // optionsSuccessStatus: 200
    credentials: true
};

module.exports = corsOptions;