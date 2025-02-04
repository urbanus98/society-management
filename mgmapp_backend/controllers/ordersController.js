const db = require('../db');



const getOrders = (req, res)=>{
    const sql = `
    SELECT
    orders.id,
    orders.price_total, 
    DATE_FORMAT(orders.date, "%d.%m.%Y") as date
    FROM orders
    ORDER BY date
    `;
    db.query(sql, (err, result)=>{
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ error: 'Failed to get orders' });
        }

        const rows = result.map((row) => {
            return [
                row.price_total + " €",
                row.date,
                row.id,
            ];
        });
        return res.json(rows);
    });
};

const postOrders = (req, res)=>{
    const { price, date, details } = req.body;
    const sqlOrders = `INSERT INTO orders (price_total, date) VALUES ('${price}', '${date}')`;
    console.log(sqlOrders);
    console.log(details);

    // Perform the first insert for orders
    db.query(sqlOrders, (err, orderResult) => {
        if (err) {
            console.error('Error inserting order:', err);
            return res.status(500).json({ error: 'Failed to create order' });
        }
        console.log('Order inserted successfully:', orderResult);

        // Get the last inserted ID (order ID)
        const orderId = orderResult.insertId;
        console.log('Last inserted order ID:', orderId);

        const orderValues = details.map(({ stuffType_id, amount }) => [orderId, stuffType_id, amount]);
        const sqlOrderedStuff = `INSERT INTO ordered_stuff (order_id, stufftype_id, amount) VALUES ?`;
        console.log(sqlOrderedStuff);

        db.query(sqlOrderedStuff, [orderValues], (err, orderedStuffResult) => {
            if (err) {
                console.error('Error inserting ordered stuff:', err);
                return res.status(500).json({ error: 'Failed to create ordered stuff records' });
            }
            console.log('Ordered stuff inserted successfully:', orderedStuffResult);

            const sqlTraffic = `INSERT INTO traffic (name, amount, direction, date, order_id) VALUES ('Narocilo', '${price}', 1, '${date}', '${orderId}')`;
            console.log(sqlTraffic);

            db.query(sqlTraffic, (err, trafficResult) => {
                if (err) {
                    console.error('Error inserting traffic:', err);
                    return res.status(500).json({ error: 'Failed to create traffic records' });
                }
                console.log('Traffic inserted successfully:', trafficResult);
            });

            return res.json({ message: 'Data created successfully' });
        });
    });
};

const getOrder = (req, res)=>{
    const id = req.params.id;
    const sqlOrder = `
    SELECT
    id,
    price_total, 
    DATE_FORMAT(date, "%Y-%m-%d") as date
    FROM orders
    WHERE orders.id = ${id}
    `;
    db.query(sqlOrder, (err, resultOrder)=>{
        if (err) {
            console.error('Error fetching order:', err);
            return res.status(500).json({ error: `Failed to get order with id ${id}` });
        }
        console.log('Data fetched successfully:', resultOrder);

        const sqlStuff = `
        SELECT ordered_stuff.id as id, ordered_stuff.amount as amount, ordered_stuff.stufftype_id, stuff_types.type as type, stuff.name as name
        FROM ordered_stuff
        JOIN stuff_types on ordered_stuff.stufftype_id = stuff_types.id
        JOIN stuff on stuff_types.stuff_id = stuff.id
        WHERE ordered_stuff.order_id = ${resultOrder[0].id}
        `;
        console.log(sqlStuff);

        db.query(sqlStuff, (err, resultStuff)=>{
            if (err) {
                console.error('Error fetching order:', err);
                return res.status(500).json({ error: `Failed to get order with id ${id}` });
            }
            console.log('Data fetched successfully:', resultStuff);

            const formattedResult = {
                price: resultOrder[0].price_total,
                date: resultOrder[0].date,
                types: resultStuff.map((row) => {
                    return {
                        name: row.name + " - " + row.type,
                        id: row.id,
                        amount: row.amount,
                        stufftype_id: row.stufftype_id,
                    };
                }),
            };

            return res.json(formattedResult);
        });

    });
};

const putOrder = (req, res)=>{
    const id = req.params.id;
    const { price, date, details } = req.body;
    const sqlOrders = `UPDATE orders SET price_total = '${price}', date = '${date}' WHERE id = ${id}`;
    console.log(sqlOrders);
    console.log(details);

    db.query(sqlOrders, (err, orderResult) => {
        if (err) {
            console.error('Error updating order:', err);
            return res.status(500).json({ error: 'Failed to update order' });
        }
        console.log('Order updated successfully:', orderResult);

        var sqlOrderedStuffQuery = `SELECT id FROM ordered_stuff WHERE order_id = ${id}`;

        db.query(sqlOrderedStuffQuery, (err, orderedTypesResult) => {
            if (err) {
                console.error('Error fetching data from database:', err);
                return res.status(500).json({ error: 'Failed to fetch data from the database' });
            }

            console.log('Ordered stuff fetched successfully:', orderedTypesResult);

            // split parsedDetails into two arrays take n elements from the end
            let oldDetails = details.slice(0, orderedTypesResult.length);
            let newDetails = details.slice(orderedTypesResult.length);

            console.log('Old Details:', oldDetails);
            console.log('New Details:', newDetails);

            const sqlOrderedStuff = `UPDATE ordered_stuff SET amount = ?, stufftype_id = ? WHERE id = ?`;
            console.log(sqlOrderedStuff);

            oldDetails.forEach(({ stuffType_id, amount}, index ) => {
                db.query(sqlOrderedStuff, [amount, stuffType_id, orderedTypesResult[index].id], (err, orderedStuffResult) => {
                    if (err) {
                        console.error('Error updating ordered stuff:', err);
                        return res.status(500).json({ error: 'Failed to update ordered stuff records' });
                    }
                    console.log('Ordered stuff updated successfully:', orderedStuffResult);
                });
            });

            if (newDetails.length === 0) {
                return res.status(200).json({ message: 'Data updated successfully' });
            }
              
            const newOrderedStuffValues = newDetails.map(({ stuffType_id, amount }) => [stuffType_id, id, amount ]);
            const newsqlStuffType = `INSERT INTO ordered_stuff (stufftype_id, order_id, amount) VALUES ?`;
            console.log(newsqlStuffType);

            db.query(newsqlStuffType, [newOrderedStuffValues], (err, newOrderedStuffResult) => {
                if (err) {
                console.error("Error inserting stuff types:", err);
                return res.status(500).json({ error: "Failed to create stuff type records" });
                }
                console.log('Stuff types inserted successfully:', newOrderedStuffResult);
                return res.status(201).json({ message: 'Data updated successfully' });
            });
        });
    });
};

module.exports = { getOrders, postOrders, getOrder, putOrder };