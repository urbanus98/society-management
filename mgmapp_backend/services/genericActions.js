const db = require("../db");

const performQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) {
                console.error("Database query error:", err);
                reject({ error: "Database query failed", details: err });
            } else {
                resolve(result);
            }
        });
    });
};

const performInsert = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) {
                console.error("Database insert error:", err);
                reject({ error: "Database insert failed", details: err });
            } else {
                resolve({ id: result.insertId });
            }
        });
    });
};

const performUpdate = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) {
                console.error("Database update error:", err);
                reject({ error: "Database update failed", details: err });
            } else {
                resolve({ success: true });
            }
        });
    });
};

const performDelete = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) {
                console.error("Database delete error:", err);
                reject({ error: "Database delete failed", details: err });
            } else {
                resolve({ success: true });
            }
        });
    });
};

const performMassUpdate = (sql, dataArray, keys) => {
    return Promise.all(
        dataArray.map((item, index) => {
            return new Promise((resolve, reject) => {
                const values = keys.map((key) => item[key]); // Extract values based on keys
                db.query(sql, values, (err, result) => {
                    if (err) {
                        console.error("Error updating records:", err);
                        return reject("Failed to update records");
                    }
                    // console.log(`Record ${index + 1} updated`);
                    resolve(result);
                });
            });
        })
    );
};

const performMassInsertO = (table, data, fields) => {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(data) || data.length === 0) {
            return resolve("No data provided for insertion");
        }

        // Extract values dynamically
        const placeholders = data.map(() => `(${fields.map(() => "?").join(", ")})`).join(", ");
        const values = data.flatMap((item) => fields.map((field) => item[field]));

        const sql = `INSERT INTO ${table} (${fields.join(", ")}) VALUES ${placeholders}`;

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Error inserting records:", err);
                return reject("Failed to insert records");
            }
            resolve(result);
        });
    });
};

const performMassInsert = (sql, records, dynamicFields, staticValues = []) => {
    return new Promise((resolve, reject) => {
        if (records.length === 0) return resolve("No records to insert.");

        // Flatten values: Extract dynamic fields + Append static values for each record
        const values = records.flatMap(record => [
            ...dynamicFields.map(field => record[field]), // Extract only required fields
            ...staticValues // Add fixed values for each row
        ]);

        // Generate placeholders dynamically (e.g., (?, ?, ?, ?), (?, ?, ?, ?))
        const placeholders = records.map(() => `(${new Array(dynamicFields.length + staticValues.length).fill('?').join(', ')})`).join(', ');

        const finalSql = sql.replace('VALUES ?', `VALUES ${placeholders}`);

        db.query(finalSql, values, (err, result) => {
            if (err) {
                console.error("Error inserting records:", err);
                return reject("Failed to insert records");
            }
            resolve(result);
        });
    });
};

const priceMultiply = (value) => {
    return value * 100;
}
const priceDivide = (value) => {
    return (value / 100).toFixed(2);
}

module.exports = { performQuery, performInsert, performUpdate, performDelete, performMassInsert, performMassInsertO, performMassUpdate, priceMultiply, priceDivide };
