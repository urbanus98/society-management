const db = require('../db');
const { getSalesWithAmounts } = require('./salesController');

// ** EVENTS **

exports.getEventTypes = (req, res)=>{
    const sql = "SELECT * FROM event_types";
    db.query(sql, (err, result)=>{
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
        return res.json(result);
    });
};

exports.getEvents = (req, res)=>{
    console.log("getEvents called");
    const sql = `
        SELECT 
            event_types.name as type, 
            events.name as name, 
            DATE_FORMAT(date, "%d.%m.%Y") as date_formatted, 
            events.id 
        FROM events
            INNER JOIN event_types ON events.type_id = event_types.id
        ORDER BY date DESC;
    `;
    db.query(sql, (err, result)=>{
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
        const rows = result.map((row) => {
            return {
              name: row.name == "" ? row.type : row.type + " - " + row.name,
              date: row.date_formatted,
              id: row.id,
            };
        });
        return res.json(rows);
    });
};

exports.postEvent = (req, res) => {
    var {name, duration, typeId, date, eSaleId, eInvoiceId} = req.body;
    const sql = `INSERT INTO events (name, duration, type_id, date) VALUES ('${name}', '${duration}', '${typeId}', '${date}')`;
    // console.log(sql);

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error inserting data into database:', err);
            return res.status(500).json({ error: 'Failed to store data in the database' });
        }

        console.log('Data inserted successfully:', result);
        const id = result.insertId;

        if (eInvoiceId == "" && eSaleId == "") return res.status(201).json({ message: 'Data stored successfully' });

        var sqlIDs = `
            START TRANSACTION;
        `;
        if (eSaleId != "") {
            sqlIDs += `
            UPDATE sales SET event_id = ${id} WHERE id = ${eSaleId};
            `;
        }
        if (eInvoiceId != "") {
            sqlIDs += `
            UPDATE invoices SET event_id = ${id} WHERE id = ${eInvoiceId};
            `;
        }
        sqlIDs += `COMMIT;`;
        
        db.query(sqlIDs, (err, resultID) => {
            if (err) {
                console.error('Error updating event IDs:', err);
                return db.query('ROLLBACK', () => {
                    return res.status(500).json({ error: 'Failed to update event IDs' });
                });
            }
            console.log('Event IDs updated successfully:', resultID);
            
            return res.status(201).json({ message: 'Data stored successfully' });
        });
    });
};

exports.getEvent = (req, res)=>{
    const id = req.params.id;
    const sql = `
        SELECT 
        events.type_id, 
        events.name, 
        events.duration, 
        DATE_FORMAT(events.date, "%Y-%m-%d") as date,
        invoices.id as invoice_id,
        sales.id as sale_id
        FROM events 
        LEFT JOIN invoices on events.id = invoices.event_id
        LEFT JOIN sales on events.id = sales.event_id
        WHERE events.id = ${id}
    `;
    db.query(sql, (err, result)=>{
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
        // console.log(result);


        return res.json(result[0]);
    });
};

exports.putEvent = (req, res)=>{
    const id = req.params.id;
    var {name, duration, typeId, date, eSaleId, eInvoiceId} = req.body;
    console.log("invoice:" + eInvoiceId);
    console.log("sale:" + eSaleId);

    const sqlEvent = `
    UPDATE events SET name = '${name}', duration = '${duration}', type_id = '${typeId}', date = '${date}' WHERE id = ${id};
    
    `;
    // console.log(sqlEvent);
    db.query(sqlEvent, (err, result) => {
        if (err) {
            console.error('Error updating event in database:', err);
            return res.status(500).json({ error: 'Failed to update event in the database' });
        }
        console.log('Event updated successfully:', result);

        var sqlIDs = `
            START TRANSACTION;
            UPDATE sales SET event_id = NULL WHERE event_id = ${id};
            UPDATE invoices SET event_id = NULL WHERE event_id = ${id};
        `;

        if (eSaleId != "") {
            sqlIDs += `
            UPDATE sales SET event_id = ${id} WHERE id = ${eSaleId};
            `;
        }
        if (eInvoiceId != "") {
            sqlIDs += `
            UPDATE invoices SET event_id = ${id} WHERE id = ${eInvoiceId};
            `;
        }
        sqlIDs += `COMMIT;`;
        
        db.query(sqlIDs, (err, resultID) => {
            if (err) {
                console.error('Error updating event IDs:', err);
                return db.query('ROLLBACK', () => {
                    return res.status(500).json({ error: 'Failed to update event IDs' });
                });
            }
            console.log('Event IDs updated successfully:', resultID);
            
            return res.status(200).json({ message: 'Data updated successfully' });
        });
        
    });
};

exports.getEventIDs = async (req, res)=>{
    const id = req.params.id;
    const sqlInvoices = `
        SELECT invoices.id, entities.name, DATE_FORMAT(issue_date, "%d.%m.%Y") as issue_date, ROUND(traffic.amount / 100, 2) as amount
        FROM invoices
        JOIN entities ON invoices.payer_id = entities.id
        JOIN traffic ON invoices.id = traffic.invoice_id
        WHERE invoices.event_id IS NULL OR invoices.event_id = ${id}
        ORDER BY issue_date, id DESC
    `;
    db.query(sqlInvoices, async (err, resultInvoices)=>{
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }

        var sqlSales = `
            SELECT
                id,
                date as dateS,
                DATE_FORMAT(date, "%d.%m.%Y") as date
            FROM
                sales
            WHERE sales.event_id IS NULL OR sales.event_id = ${id}
            ORDER BY dateS DESC, id DESC
        `;
        const resultSales = await getSalesWithAmounts(sqlSales);
        console.log("resultInvoices");
        console.log(resultInvoices);
        console.log("resultSales");
        console.log(resultSales);

        return res.json({
            invoices: resultInvoices.map((row) => {
                return {
                    id: row.id,
                    name: row.issue_date + ", " + row.name + " - " + row.amount + " €",
                };
            }),
            sales: resultSales.map((row) => {
                return {
                    id: row.id,
                    name: row.date + " - " + row.total + " €",
                };
            })
        });
    });
};
