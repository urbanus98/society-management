const db = require("../db");

const insertBlackFlow = (sale_id, debt_id, name, amount, direction, date) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO black_traffic (sale_id, debt_id, name, amount, direction, date) VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(sql, [sale_id, debt_id, name, amount, direction, date], (err, result) => {
            if (err) {
                console.error("Error inserting into black_traffic table:", err);
                return reject(err);
            }
            console.log("Debt flow inserted successfully:", result);
            resolve(result.insertId);
        });
    });
};

const updateDebt = (debtId, amount) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE debts SET amount = ${amount} WHERE id = ${debtId};`;

        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error updating data in database:', err);
                reject(err);
            }

            console.log('Data updated successfully:', result);
            resolve();
        });
    });
}

const updateFlow = (name, amount, date, debtId) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE black_traffic SET name = "${name}", amount = ${amount}, date = '${date}' WHERE debt_id = ${debtId};`;
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error updating data in database:', err);
                return reject(err);
            }
            console.log('Data updated successfully:', result);

            resolve();
        });
    });
}

module.exports = { insertBlackFlow, updateDebt, updateFlow };