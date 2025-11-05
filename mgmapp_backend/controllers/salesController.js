const db = require('../db');
const { insertBlackFlow } = require('../services/blackDebtService');
const { performInsert, performUpdate, performQuery } = require('../services/genericActions');
const { updateBlackSaleFlow } = require('./blackController');

// ** MERCH SALES **

const getSalesRows = async (req, res) => {
    try {
        var sql = `
        SELECT
            id,
            note,
            discount,
            DATE_FORMAT(date, "%d.%m.%Y") as date
        FROM
            sales
        ORDER BY sales.date DESC, id DESC
    `;
        const salesWithAmounts = await getSalesWithAmounts(sql);
        console.log(salesWithAmounts);
        res.json(salesWithAmounts.map((row) => {
            return {
                date: row.date,
                price: row.total + " €",
                note: row.note,
                id: row.id,
            };
        }));
    } catch (error) {
        console.error('Error fetching sales with amounts:', error);
        res.status(500).json({ error: 'Failed to fetch sales with amounts' });
    }
};

const postSale = async (req, res) => {
    try {
        var { date, note, discount, sold } = req.body;

        const saleId = await insertSale(date, discount, note);
        await insertStuffSold(sold, saleId);
        await insertBlackFlow(saleId, null, "Merch Sale", sold.reduce((acc, { quantity, price }) => acc + quantity * price, 0) - discount, 0, date);

        return res.status(201).json({ message: 'Data created successfully' });
    } catch (error) {
        console.error('Error inserting data:', error);
        return res.status(500).json({ error: 'Failed to store data in the database' });
    }
};

const getSale = async (req, res) => {
    const result = await getSaleData(req.params.id);
    return res.json(result);
};

const putSale = async (req, res) => {
    try {
        const id = req.params.id;
        var { date, note, discount, sold } = req.body;

        await updateSale(date, note, discount, id);

        const stuffSold = await getSaleStuffSold(id);
        await handleStuffSold(id, stuffSold, sold);

        await updateBlackSaleFlow(sold.reduce((acc, { quantity, price }) => acc + quantity * price, 0) - discount, date, id);

        return res.status(200).json({ message: 'Data updated successfully' });
    } catch (error) {
        console.error('Error updating sales data:', error);
        return res.status(500).json({ error: 'Failed to update sales data' });
    }
};

const getSalesWithAmounts = async (sqlSales) => {
    try {
        const sales = await getSales(sqlSales);

        if (sales.length === 0) {
            return ([]);
        }
        const formattedSales = await formatAndAggregateSales(sales)
        return formattedSales;
    } catch (error) {
        return (error);
    }
}

module.exports = {
    getSalesRows,
    postSale,
    getSale,
    putSale,
    getSalesWithAmounts
};


const getSales = (sql) => {
    return new Promise((resolve, reject) => {
        db.query(sql, async (err, result) => {
            if (err) {
                reject('Error fetching sales data:', err);
            }
            resolve(result)
        });
    });
}

const formatAndAggregateSales = async (sales) => {
    const salesWithAmounts = await Promise.all(
        sales.map((sale) => {
            return new Promise((resolve, reject) => {
                const sqlStuffSold = `
              SELECT
                SUM(ss.quantity * ss.price_actual) as subtotal,
                s.discount
              FROM
                sales s
              JOIN stuff_sold ss on s.id = ss.sale_id
              WHERE
                sale_id = ?
            `;

                db.query(sqlStuffSold, [sale.id], (err, resultStuffSold) => {
                    if (err) {
                        reject(err);
                    } else {
                        sale.total = resultStuffSold[0].subtotal - resultStuffSold[0].discount || 0;
                        resolve(sale);
                        // resolve([sale.date, total + " €", sale.id]);
                    }
                });
            });
        })
    );

    return (salesWithAmounts);
}

const insertSale = async (date, discount, note) => {
    const sql = `INSERT INTO sales (date, discount, note) VALUES (?, ?, ?)`;
    const insertID = await performInsert(sql, [date, discount, note]);
    return insertID;
};

const insertStuffSold = (newDetails, saleId) => {
    return new Promise((resolve, reject) => {
        if (newDetails.length === 0) return resolve();

        const values = newDetails.map(({ stuffType_id, quantity, price }) => [saleId, stuffType_id, quantity, price]);
        const sql = `INSERT INTO stuff_sold (sale_id, stufftype_id, quantity, price_actual) VALUES ?`;

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error inserting stuff sold:", err);
                return reject("Failed to insert new stuff sold records");
            }
            resolve(result);
        });
    });
};

const updateSale = async (date, note, discount, id) => {
    const sql = `UPDATE sales SET date = '${date}', discount = '${discount}', note = '${note}' WHERE id = ${id}`;
    const result = await performUpdate(sql);
};

const getSaleStuffSold = (id) => {
    return new Promise((resolve, reject) => {
        var sqlStuffSoldQuery = `SELECT id FROM stuff_sold WHERE sale_id = ${id}`;

        db.query(sqlStuffSoldQuery, (err, stuffSoldResult) => {
            if (err) {
                console.error('Error fetching data from database:', err);
                reject('Failed to fetch data from the database');
            }

            console.log('Stuff sold fetched successfully:', stuffSoldResult);
            resolve(stuffSoldResult);
        });
    });
};

const handleStuffSold = async (saleId, stuffSoldResult, sold) => {
    try {
        let oldDetails = sold.slice(0, stuffSoldResult.length);
        let newDetails = sold.slice(stuffSoldResult.length);

        // console.log('Old Details:', oldDetails);
        // console.log('New Details:', newDetails);

        await updateOldStuffSold(oldDetails, stuffSoldResult);
        await insertStuffSold(newDetails, saleId);

        return { success: true };
    } catch (error) {
        console.error('Error updating stuff sold:', error);
        return res.status(500).json({ error: 'Failed to update stuff sold records' });
    }
};

const updateOldStuffSold = (oldDetails, stuffSoldResult) => {
    return Promise.all(
        oldDetails.map(({ stuffType_id, quantity, price }, index) => {
            const sql = `UPDATE stuff_sold SET quantity = ?, price_actual = ?, stufftype_id = ? WHERE id = ?`;
            return new Promise((resolve, reject) => {
                db.query(sql, [quantity, price, stuffType_id, stuffSoldResult[index].id], (err, result) => {
                    if (err) {
                        console.error("Error updating stuff sold:", err);
                        return reject("Failed to update stuff sold records");
                    }
                    resolve(result);
                });
            });
        })
    );
};

const getSaleData = (saleId) => {
    return new Promise((resolve, reject) => {
        const sqlStuffSold = `
            SELECT 
                stuff_types.id as type_id, 
                stuff_sold.quantity as quantity, 
                stuff_sold.price_actual as price, 
                stuff_types.type as type, 
                stuff.name as name,
                DATE_FORMAT(sales.date, "%Y-%m-%d") as date,
                sales.discount,
                sales.note
            FROM sales
            LEFT JOIN stuff_sold on sales.id = stuff_sold.sale_id
            LEFT JOIN stuff_types on stuff_sold.stufftype_id = stuff_types.id
            LEFT JOIN stuff on stuff_types.stuff_id = stuff.id
            WHERE sales.id = ${saleId}
        `;
        // console.log(sqlStuffSold);

        db.query(sqlStuffSold, (err, resultStuffSold) => {
            if (err) {
                console.error('Error fetching sale:', err);
                reject(err);
            }
            console.log('Data fetched successfully:', resultStuffSold);

            const formattedResult = {
                date: resultStuffSold[0].date,
                note: resultStuffSold[0].note,
                discount: resultStuffSold[0].discount,
                types: resultStuffSold.map((row) => {
                    // console.log(row.type_id);
                    return {
                        name: row.name + " - " + row.type,
                        quantity: row.quantity,
                        stufftype_id: row.type_id,
                        price: row.price,
                    };
                }),
            };

            resolve(formattedResult);
        });
    });
}
