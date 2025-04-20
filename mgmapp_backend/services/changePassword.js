require('dotenv').config({ path: '../.env' });

const readline = require('readline');
const hashPassword = require('./misc').hashPassword;
const performUpdate = require('./genericActions').performUpdate;

async function updatePassword(username, password) {
    const sql = `UPDATE users SET password = ? WHERE username = ?`;
    const hashedPassword = await hashPassword(password);
    const result = await performUpdate(sql, [hashedPassword, username]);
    if (result.error) {
        console.error("Error updating password:", result.error);
        return;
    }
    console.log("Password updated successfully for user:", username);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

(async () => {
    rl.question('Who forgot their password again? ', (username) => {
      rl.question(`What do you want as your password, ${username}? `, async (password) => {
        await updatePassword(username, password);
        rl.close();
      });
    });
})();
  
