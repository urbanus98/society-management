const db = require('../db');
const { getSalesWithAmounts } = require('./salesController');
const { performUpdate } = require("../services/genericActions");

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
    // console.log("getEvents called");
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
    var {name, duration, typeId, date} = req.body;
    const sql = `INSERT INTO events (name, duration, type_id, date) VALUES ("${name}", '${duration}', '${typeId}', '${date}')`;
    // console.log(sql);

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error inserting data into database:', err);
            return res.status(500).json({ error: 'Failed to store data in the database' });
        }

        console.log('Data inserted successfully:', result);
        const id = result.insertId;

        return res.status(201).json({ message: 'Data stored successfully' });
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
    var {name, duration, typeId, date} = req.body;
    const sqlEvent = `
        UPDATE events SET name = "${name}", duration = '${duration}', type_id = '${typeId}', date = '${date}' WHERE id = ${id};
    `;
    db.query(sqlEvent, (err, result) => {
        if (err) {
            console.error('Error updating event in database:', err);
            return res.status(500).json({ error: 'Failed to update event in the database' });
        }
        console.log('Event updated successfully:', result);

        return res.status(200).json({ message: 'Data updated successfully' });
    });
};

exports.updateEventInvoiceID = async (req, res)=> {
    try {
        const id = req.params.id;
        var {invoiceId} = req.body;

        const sqlReset = `UPDATE invoices SET event_id = NULL WHERE event_id = ${id};`;
        await performUpdate(sqlReset);
        
        if (invoiceId != "") {
            const sql = `UPDATE invoices SET event_id = ${id} WHERE id = ${invoiceId};`;
            await performUpdate(sql);
        }

        return res.status(200).json({ message: 'Račun uspešno dodeljen!' });
    } catch (error) {
        console.error('Error updating event invoice ID:', error);
        return res.status(500).json({ error: 'Failed to update event invoice ID' });
    }
};

exports.updateEventSaleID = async (req, res)=> {
    try {
        const id = req.params.id;
        var {saleId} = req.body;

        const sqlReset = `UPDATE sales SET event_id = NULL WHERE event_id = ${id};`;
        await performUpdate(sqlReset);

        if (saleId != "") {
            const sql = `UPDATE sales SET event_id = ${id} WHERE id = ${saleId};`;
            await performUpdate(sql);
        }

        return res.status(200).json({ message: 'Prodaja uspešno dodeljena!' });
    } catch (error) {
        console.error('Error updating event sale ID:', error);
        return res.status(500).json({ error: 'Failed to update event sale ID' });
    }
}

exports.getEventIDs = async (req, res)=>{
    const id = req.params.id;
    const sqlInvoices = `
        SELECT invoices.id, entities.short, DATE_FORMAT(traffic.date, "%d.%m.%Y") as issue_date, ROUND(traffic.amount / 100, 2) as amount
        FROM invoices
        JOIN entities ON invoices.payer_id = entities.id
        JOIN traffic ON invoices.id = traffic.invoice_id
        WHERE invoices.event_id IS NULL OR invoices.event_id = ${id}
        ORDER BY traffic.date DESC, id DESC
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
                note,
                DATE_FORMAT(date, "%d.%m.%Y") as date
            FROM
                sales
            WHERE sales.event_id IS NULL OR sales.event_id = ${id}
            ORDER BY dateS DESC, id DESC
        `;
        const resultSales = await getSalesWithAmounts(sqlSales);
        // console.log("resultInvoices");
        // console.log(resultInvoices);
        // console.log("resultSales");
        // console.log(resultSales);

        return res.json({
            invoices: resultInvoices.map((row) => {
                return {
                    id: row.id,
                    name: row.issue_date + ", " + row.short + " - " + row.amount + " €",
                };
            }),
            sales: resultSales.map((row) => {
                return {
                    id: row.id,
                    name: row.date + (row.note ? ", " + row.note : "") + " - " + row.total + " €",
                };
            })
        });
    });
};
