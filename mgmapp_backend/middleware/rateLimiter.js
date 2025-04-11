const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    message: "Too many login attempts from this IP, please try again after 15 minutes",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = {
  loginLimiter
};
