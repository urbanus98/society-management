const db = require('../db');
const { priceMultiply, priceDivide } = require('../services/genericActions');
const { parseJSON } = require('../services/misc');
const { insertTraffic } = require('./trafficController');

const getOrders = (req, res)=>{
    const sql = `
        SELECT
            orders.id,
            traffic.amount,
            orders.pdf_path,
            DATE_FORMAT(traffic.date, "%d.%m.%Y") as date
        FROM orders
            JOIN traffic on traffic.order_id = orders.id
        ORDER BY traffic.date DESC, id DESC
    `;
    db.query(sql, (err, result)=>{
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ error: 'Failed to get orders' });
        }

        const rows = result.map((row) => {
            return {
                date: row.date,
                price: priceDivide(row.amount) + " €",
                // file: row.pdf_path,
                id: row.id,
            };
        });
        return res.json(rows);
    });
};

const postOrder = async (req, res)=>{
    try {
        const { price, date, details } = req.body;

        const orderId = await insertOrder(req);
        await insertNewStuffOrdered(details, orderId);
        await insertTraffic(null, orderId, 'Naročilo', price, 1, date);
        
        return res.json({ message: 'Data created successfully' });
    } catch (error) {
        console.error("Error inserting data:", error);
        return res.status(500).json({ error: "Failed to store data in the database" });
    }
};

const getOrder = async (req, res)=>{
    try {
        const orderId = req.params.id;
        
        const formattedResult = await getOrderData(orderId);
        
        return res.json(formattedResult);
    } catch (error) {
        console.error("Error inserting data:", error);
        return res.status(500).json({ error: "Failed to store data in the database" });
    }
};

const putOrder = async (req, res)=> {
    const orderId = req.params.id;
    const { price, date, details } = req.body;

    if (req.file) {
        await updateOrder(req, orderId);
    }
    await updateOrderTraffic(orderId, price, date);

    const orderedStuffIDs = await getOrderedStuffIDs(orderId);
    await handleOrderedStuff(orderId, orderedStuffIDs, details);

    return res.status(200).json({ message: 'Data updated successfully' });
};

module.exports = { getOrders, postOrder, getOrder, putOrder };


const updateOrderTraffic = (orderId, amount, date) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE traffic SET amount = '${priceMultiply(amount)}', date = '${date}' WHERE order_id = ${orderId}`;
        // console.log(sql);
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error updating data in database:', err);
                reject({ error: 'Failed to update data in the database' });
            }
            console.log('Data updated successfully:', result);
            
            resolve();
        });
    });
}

const updateOrder = (req, orderId) => {
    return new Promise((resolve, reject) => {
        const filePath = `uploads/${req.file.filename}`;
        var sql = `UPDATE orders SET pdf_path = '${filePath}' WHERE id = ${orderId}`;
        console.log(sql);

        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error updating order:', err);
                reject('Failed to update order');
            }
            console.log('Order updated successfully:', result);
            resolve(result);
        });
    });
};

const getOrderedStuffIDs = (id) => {
    return new Promise((resolve, reject) => {
        var sqlOrderedStuffQuery = `SELECT id FROM ordered_stuff WHERE order_id = ${id}`;

        db.query(sqlOrderedStuffQuery, (err, orderedTypesResult) => {
            if (err) {
                console.error('Error fetching data from database:', err);
                reject('Failed to fetch data from the database');
            }

            resolve(orderedTypesResult);
        });
    });
};

const handleOrderedStuff = async (orderId, alreadyOrderedStuffIDs, detailString) => {
    try {
        const details = parseJSON(detailString);
        
        let oldDetails = details.slice(0, alreadyOrderedStuffIDs.length);
        let newDetails = details.slice(alreadyOrderedStuffIDs.length);

        // console.log('Old Details:', oldDetails);
        // console.log('New Details:', newDetails);
        
        await updateOldStuffOrdered(oldDetails, alreadyOrderedStuffIDs);
        await insertNewStuffOrdered(newDetails, orderId);

        return true;
    } catch (error) {
        console.error('Error updating stuff sold:', error);
        return { error: 'Failed to update stuff sold records' };
    }
};

const updateOldStuffOrdered = (oldDetails, stuffSoldIDs) => {
    return Promise.all(
        oldDetails.map(({ stuffType_id, quantity }, index) => {
            const sql = `UPDATE ordered_stuff SET quantity = ?, stufftype_id = ? WHERE id = ?`;
            return new Promise((resolve, reject) => {
                db.query(sql, [quantity, stuffType_id, stuffSoldIDs[index].id], (err, result) => {
                    if (err) {
                        console.error('Error updating ordered stuff:', err);
                        return reject("Failed to update ordered stuff records");
                    }
                    resolve(result);
                });
            });
        })
    );
};

const insertNewStuffOrdered = (newDetails, orderId) => {
    return new Promise((resolve, reject) => {

        if (newDetails.length === 0) return resolve(); // No new items to insert
        console.log(newDetails);
        const values = newDetails.map(({ stuffType_id, quantity }) => [orderId, stuffType_id, quantity]);
        const sql = `INSERT INTO ordered_stuff (order_id, stufftype_id, quantity) VALUES ?`;

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error inserting stuff sold:", err);
                return reject("Failed to insert new stuff sold records");
            }
            resolve(result);
        });
    });
};

const insertOrder = (req) => {
    return new Promise((resolve, reject) => {
        const { date } = req.body;

        console.log(req.body);
        
        let filePath = null;
        if (req.file) {
            filePath = `uploads/${req.file.filename}`;
        }
        const sql = `INSERT INTO orders (pdf_path) VALUES (?)`;
        const values = filePath ? [filePath] : [null];
        // console.log(sql);

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error inserting order:', err);
                return reject('Failed to create order');
            }
            console.log('Order inserted successfully:', result);

            resolve(result.insertId);
        });
    });
};

const getOrderData = (orderId) => {
    return new Promise((resolve, reject) => {
        const sqlStuff = `
            SELECT 
                ordered_stuff.id as id, 
                ordered_stuff.quantity as quantity, 
                ordered_stuff.stufftype_id, 
                stuff_types.type as type, 
                stuff.name as name,
                traffic.amount as price_total,
                orders.pdf_path,
                DATE_FORMAT(traffic.date, "%Y-%m-%d") as date
            FROM ordered_stuff
                JOIN orders on orders.id = ordered_stuff.order_id
                JOIN traffic on traffic.order_id = orders.id
                JOIN stuff_types on ordered_stuff.stufftype_id = stuff_types.id
                JOIN stuff on stuff_types.stuff_id = stuff.id
            WHERE ordered_stuff.order_id = ${orderId}
        `;
        // console.log(sqlStuff);

        db.query(sqlStuff, (err, result)=>{
            if (err) {
                console.error('Error fetching order:', err);
                reject({ error: `Failed to get order with id ${orderId}` });
            }
            // console.log('Data fetched successfully:', result);

            const formattedResult = {
                price: priceDivide(result[0].price_total),
                date: result[0].date,
                filePath: result[0].pdf_path,
                types: result.map((row) => {
                    return {
                        name: row.name + " - " + row.type,
                        id: row.id,
                        quantity: row.quantity,
                        stufftype_id: row.stufftype_id,
                    };
                }),
            };

            resolve(formattedResult);
        });
    });
};
