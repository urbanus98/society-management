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


const getSalesWithAmounts = async (db, eventID) => {
    return new Promise((resolve, reject) => {
        if (eventID === undefined) {
            var sqlSales = `
                SELECT
                id,
                DATE_FORMAT(date, "%d.%m.%Y") as date
                FROM
                sales
                ORDER BY date
            `;
        } else {
            var sqlSales = `
                SELECT
                id,
                DATE_FORMAT(date, "%d.%m.%Y") as date
                FROM
                sales
                WHERE sales.event_id IS NULL OR sales.event_id = ${eventID}
                ORDER BY date
            `;
        }
  
      db.query(sqlSales, async (err, resultSales) => {
        if (err) {
          return reject('Error fetching sales data:', err);
        }
  
        if (resultSales.length === 0) {
          return resolve([]);
        }
  
        try {
          const salesWithAmounts = await Promise.all(
            resultSales.map((sale) => {
              return new Promise((resolve, reject) => {
                const sqlStuffSold = `
                  SELECT
                    SUM(quantity * price_actual) as total
                  FROM
                    stuff_sold
                  WHERE
                    sale_id = ?
                `;
  
                db.query(sqlStuffSold, [sale.id], (err, resultStuffSold) => {
                  if (err) {
                    reject(err);
                  } else {
                    sale.total = resultStuffSold[0].total || 0;
                    resolve(sale);
                    // resolve([sale.date, total + " €", sale.id]);
                  }
                });
              });
            })
          );
  
          resolve(salesWithAmounts);
        } catch (error) {
          reject(error);
        }
        });
    });
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
  getSalesWithAmounts,
  hashPassword
 };