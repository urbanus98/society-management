const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});

// console.log('__dirname:', __dirname);
// console.log('cwd:', process.cwd());

// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_PASS exists:', !!process.env.DB_PASS);

const readline = require('readline');
const hashPassword = require('./misc').hashPassword;
const performUpdate = require('./genericActions').performUpdate;

async function updatePassword(username, password) {
  const sql = `UPDATE users SET password = ? WHERE username = ?`;
  const hashedPassword = await hashPassword(password);
  const result = await performUpdate(sql, [hashedPassword, username]);
  if (result.affectedRows === 0) {
    throw new Error(`User "${username}" not found`);
  }
  return true;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (q) =>
  new Promise(resolve => rl.question(q, resolve));

(async () => {
  try {
    const username = await question('Who forgot their password again? ');
    const password = await question(`What do you want as your password, ${username}? `);

    await updatePassword(username, password);

    console.log(`Password updated successfully for user: ${username}`);
  } catch (err) {
    console.error('Password update failed:', err.message);
  } finally {
    rl.close();
    process.exit(0);
  }
})();
  
