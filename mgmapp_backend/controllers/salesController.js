const db = require('../db');

const { getSalesWithAmounts } = require('./miscController');

// ** MERCH SALES **

exports.getSales =  async (req, res)=>{
    try {
        const salesWithAmounts = await getSalesWithAmounts(db);
        res.json(salesWithAmounts.map((row) => {
            return [
                row.date,
                row.total + " €",
                row.id,
            ];
        }));
    } catch (error) {
        console.error('Error fetching sales with amounts:', error);
        res.status(500).json({ error: 'Failed to fetch sales with amounts' });
    }
};

exports.postSale = (req, res)=>{
    var { date, sold } = req.body;
    const sqlSale = `INSERT INTO sales (date) VALUES ('${date}')`;
    console.log(sqlSale);

    db.query(sqlSale, (err, saleResult) => {
        if (err) {
            console.error('Error inserting sale:', err);
            return res.status(500).json({ error: 'Failed to create sale' });
        }
        console.log('Sale inserted successfully:', saleResult);

        const saleId = saleResult.insertId;
        console.log('Last inserted sale ID:', saleId);

        const stuffSoldValues = sold.map(({ stuffType_id, amount, price }) => [saleId, stuffType_id, amount, price]);
        const sqlStuffSold = `INSERT INTO stuff_sold (sale_id, stufftype_id, quantity, price_actual) VALUES ?`;
        console.log(sqlStuffSold);

        db.query(sqlStuffSold, [stuffSoldValues], (err, stuffSoldResult) => {
            if (err) {
                console.error('Error inserting stuff sold:', err);
                return res.status(500).json({ error: 'Failed to create stuff sold records' });
            }
            console.log('Stuff sold inserted successfully:', stuffSoldResult);

            return res.json({ message: 'Data created successfully' });
        });
    });
};

exports.getSale = (req, res)=>{
    const id = req.params.id;
    const sqlSale = `
    SELECT
    id,
    DATE_FORMAT(date, "%Y-%m-%d") as date
    FROM sales
    WHERE sales.id = ${id}
    `;
    db.query(sqlSale, (err, resultSale)=>{
        if (err) {
            console.error('Error fetching sale:', err);
            return res.status(500).json({ error: `Failed to get sale with id ${id}` });
        }
        console.log('Data fetched successfully:', resultSale);

        const sqlStuffSold = `
        SELECT stuff_sold.id as id, stuff_sold.quantity as quantity, stuff_sold.price_actual as price, stuff_types.type as type, stuff.name as name
        FROM stuff_sold
        JOIN stuff_types on stuff_sold.stufftype_id = stuff_types.id
        JOIN stuff on stuff_types.stuff_id = stuff.id
        WHERE stuff_sold.sale_id = ${resultSale[0].id}
        `;
        console.log(sqlStuffSold);

        db.query(sqlStuffSold, (err, resultStuffSold)=>{
            if (err) {
                console.error('Error fetching sale:', err);
                return res.status(500).json({ error: `Failed to get sale with id ${id}` });
            }
            console.log('Data fetched successfully:', resultStuffSold);

            const formattedResult = {
                date: resultSale[0].date,
                types: resultStuffSold.map((row) => {
                    return {
                        name: row.name + " - " + row.type,
                        amount: row.quantity,
                        stufftype_id: row.id,
                        price: row.price,
                    };
                }),
            };

            return res.json(formattedResult);
        });

    });
};

exports.putSale = (req, res)=>{
    const id = req.params.id;
    var { date, sold } = req.body;
    const sqlSale = `UPDATE sales SET date = '${date}' WHERE id = ${id}`;
    console.log(sqlSale);

    db.query(sqlSale, (err, saleResult) => {
        if (err) {
            console.error('Error updating sale:', err);
            return res.status(500).json({ error: 'Failed to update sale' });
        }
        console.log('Sale updated successfully:', saleResult);

        var sqlStuffSoldQuery = `SELECT id FROM stuff_sold WHERE sale_id = ${id}`;

        db.query(sqlStuffSoldQuery, (err, stuffSoldResult) => {
            if (err) {
                console.error('Error fetching data from database:', err);
                return res.status(500).json({ error: 'Failed to fetch data from the database' });
            }

            console.log('Stuff sold fetched successfully:', stuffSoldResult);

            // split parsedDetails into two arrays take n elements from the end
            let oldDetails = sold.slice(0, stuffSoldResult.length);
            let newDetails = sold.slice(stuffSoldResult.length);

            console.log('Old Details:', oldDetails);
            console.log('New Details:', newDetails);

            const sqlStuffSold = `UPDATE stuff_sold SET quantity = ?, price_actual = ?, stufftype_id = ? WHERE id = ?`;
            console.log(sqlStuffSold);

            oldDetails.forEach(({ stuffType_id, amount, price}, index ) => {
                db.query(sqlStuffSold, [amount, price, stuffType_id, stuffSoldResult[index].id], (err, stuffSoldResult) => {
                    if (err) {
                        console.error('Error updating stuff sold:', err);
                        return res.status(500).json({ error: 'Failed to update stuff sold records' });
                    }
                    console.log('Stuff sold updated successfully:', stuffSoldResult);
                });
            });

            if (newDetails.length === 0) {
                return res.status(200).json({ message: 'Data updated successfully' });
            }
              
            const newStuffSoldValues = newDetails.map(({ stuffType_id, amount, price }) => [id, stuffType_id, amount, price]);
            const newsqlStuffSold = `INSERT INTO stuff_sold (sale_id, stufftype_id,
                quantity, price_actual) VALUES ?`;
            console.log(newsqlStuffSold);

            db.query(newsqlStuffSold, [newStuffSoldValues], (err, newStuffSoldResult) => {
                if (err) {
                    console.error("Error inserting stuff sold:", err);
                    return res.status(500).json({ error: "Failed to create stuff sold records" });
                }
                console.log('Stuff sold inserted successfully:', newStuffSoldResult);
                return res.status(201).json({ message: 'Data updated successfully' });
            });
        });
    });
};