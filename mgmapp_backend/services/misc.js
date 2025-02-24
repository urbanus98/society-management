const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  try {
      const saltRounds = 10; // Number of salt rounds (recommended: 10-12)
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
  } catch (err) {
      console.error('Error hashing password:', err);
      throw err;
  }
};

function parseJSON(jsonString) {
  let parsedJSON;
  try {
      parsedJSON = JSON.parse(jsonString);
  } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return res.status(400).json({ error: "Invalid JSON format" });
  }

  // Validate
  if (!Array.isArray(parsedJSON)) {
      return res.status(400).json({ error: "'jsonString' must be an array" });
  }
  return parsedJSON;
}

module.exports = { 
  parseJSON,
  hashPassword,
 };