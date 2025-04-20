require('dotenv').config({ path: '../.env' });

const db = require("../db");
const { hashPassword } = require("./misc");

const createAdmin = async () => {
  const username = "admin";
  const password = "123";
  const hashedPassword = await hashPassword(password);

  const sql = `INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)`;
  db.query(sql, ["Administrator", username, hashedPassword, "admin"], (err, result) => {
    if (err) {
      console.error("Error creating admin:", err);
    } else {
      console.log("Admin user created successfully.");
    }
    process.exit();
  });
};

createAdmin();
