require('dotenv').config()

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const e = require('express');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

app.get('/', (re, res)=>{
    return res.json ("Hello World from backend");
})

// ** INVOICES **

app.get('/invoices-row', (req, res)=>{
    
    const statusMap = {
        0: "Plačano",
        1: "Neplačano",
        2: "Rok potekel"
    };

    const sql = `
    SELECT invoices.number, invoices.status, DATE_FORMAT(issue_date, "%d.%m.%Y") as issue_date, entities.name as entity, services.name as service, services.amount, invoices.id as id FROM invoices
    INNER JOIN entities ON invoices.payer_id = entities.id
    INNER JOIN services ON invoices.id = services.invoice_id
    `;
    db.query(sql, (err, result)=>{
        if(err) return res.json(err);
        const rows = result.map((row) => {
            return [
              row.number,
              row.entity,
              row.amount + " €",
              row.service,
              statusMap[row.status],
              row.issue_date,
              row.id, 
            ];
        });
        return res.json(rows);
    });
});

app.get('/invoices', (req, res)=>{
    const sql = "SELECT  FROM invoices";
    db.query(sql, (err, result)=>{
        if(err) return res.json(err);
        return res.json(result);
    });
});

app.post('/invoices', async (req, res) => {
    var { entity_id, serviceName, status, issue_date, type, amount } = req.body;
    var number = await getInvoiceNumber();
    
    if (number === undefined) { 
        number = 1; 
    } else { 
        number += 1; 
    }

    const sqlInvoices = `INSERT INTO invoices (payer_id, receiver_id, number, status, type, issue_date) VALUES ('${entity_id}', '1', '${number}', '${status}', '${type}', '${issue_date}')`;
    console.log(sqlInvoices);

    // Perform the first insert for invoices
    db.query(sqlInvoices, (err, invoiceResult) => {
        if (err) {
            console.error('Error inserting invoice:', err);
            return res.status(500).json({ error: 'Failed to create invoice' });
        }
        console.log('Invoice inserted successfully:', invoiceResult);

        // Get the last inserted ID (invoice ID)
        const invoiceId = invoiceResult.insertId;
        console.log('Last inserted invoice ID:', invoiceId);

        // Now insert the service linked to the invoice ID
        const sqlServices = `INSERT INTO services (invoice_id, name, amount) VALUES ('${invoiceId}', '${serviceName}', '${amount}')`;
        console.log(sqlServices);

        db.query(sqlServices, (err, serviceResult) => {
            if (err) {
                console.error('Error inserting service:', err);
                return res.status(500).json({ error: 'Failed to create service record' });
            }
            console.log('Service inserted successfully:', serviceResult);

            return res.json({ message: 'Invoice and service created successfully' });
        });
    });
});

app.put('/invoices/:id', (req, res)=>{
    const id = req.params.id;
    var {entity_id, serviceName, amount, type, number, status, issueDate} = req.body;
    const sql = `UPDATE invoices SET payer_id = '${entity_id}', status = '${status}', issue_date = '${issueDate}', type = '${type}', number = '${number}' WHERE id = ${id}`;
    console.log(sql);
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error updating invoice in database:', err);
            return res.status(500).json({ error: 'Failed to update invoice in the database' });
        }
        console.log('Invoice updated successfully:', result);

        const sqlServices = `UPDATE services SET name = '${serviceName}', amount = '${amount}' WHERE invoice_id = ${id}`;

        db.query(sqlServices, (err, serviceResult) => {
            if (err) {
                console.error('Error updating service in database:', err);
                return res.status(500).json({ error: 'Failed to update service in the database' });
            }
            console.log('Service updated successfully:', serviceResult);
        });

        // Respond with a success message
        return res.status(200).json({ message: 'Data updated successfully' });
    });
});

async function getInvoiceNumber() {
    const sql = `
        SELECT MAX(number) AS highestInvoiceNumber 
        FROM invoices 
        WHERE YEAR(issue_date) = YEAR(CURDATE())`;

    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                reject(err); // Handle errors
            } else {
                resolve(result[0].highestInvoiceNumber); // Resolve the highest invoice number
            }
        });
    });
}

app.get('/invoices/:id', (req, res)=>{
    const id = req.params.id;
    // const sql = `SELECT * FROM invoices WHERE id = ${id}`;
    const sql = `
    SELECT 
    invoices.number, 
    invoices.status, 
    invoices.type, 
    DATE_FORMAT(issue_date, "%Y-%m-%d") as issue_date, 
    invoices.payer_id as payer_id, 
    services.name as service, 
    services.amount, 
    invoices.id as id FROM invoices
    INNER JOIN services ON invoices.id = services.invoice_id
    WHERE invoices.id = ${id}`;

    // console.log(sql);

    db.query(sql, (err, result)=>{
        if(err) return res.json(err);
        // console.log(result);
        return res.json(result);
    });
});

// ** ENTITIES **

app.get('/entities', (req, res)=>{
    const sql = "SELECT * FROM entities";
    db.query(sql, (err, result)=>{
        if(err) return res.json(err);

        return res.json(result);
    });
});

app.get('/entities-row', (req, res)=>{
    const sql = "SELECT * FROM entities";
    db.query(sql, (err, result)=>{
        if(err) return res.json(err);

        const rows = result.map((row) => {
            return [
              row.name,
              row.place,
              row.id,
            ];
          });
        return res.json(rows);
    });
});

app.get('/entities/:id', (req, res)=>{
    const id = req.params.id;
    const sql = `SELECT * FROM entities WHERE id = ${id}`;
    db.query(sql, (err, result)=>{
        if(err) return res.json(err);
        return res.json(result);
    });
});

app.post('/entities', (req, res)=>{
    var {name, address, postal, place, iban, note} = req.body;
    if (iban === '') { iban = null;}
    if (note === '') { note = null;}
    const sql = `INSERT INTO entities (name, address, postal, place, iban, note) VALUES ('${name}', '${address}', '${postal}', '${place}', '${iban}', '${note}')`;
    console.log(sql);
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error inserting data into database:', err);
            return res.status(500).json({ error: 'Failed to store data in the database' });
        }

        console.log('Data inserted successfully:', result);

        // Respond with a success message
        return res.status(201).json({ message: 'Data stored successfully' });
    });
});

app.put('/entities/:id', (req, res)=>{
    const id = req.params.id;
    var {name, address, postal, place, iban, note} = req.body;
    const sql = `UPDATE entities SET name = '${name}', address = '${address}', postal = '${postal}', place = '${place}', iban = '${iban}', note = '${note}' WHERE id = ${id}`;
    console.log(sql);
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error updating data in database:', err);
            return res.status(500).json({ error: 'Failed to update data in the database' });
        }

        console.log('Data updated successfully:', result);

        // Respond with a success message
        return res.status(200).json({ message: 'Data updated successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
  

async function getData(sql) {
    try {
        const results = await query(sql);
        return results;  // Array of invoices
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return null;
    }
}

function performQuery(sql) {
    db.query(sql, (err, result)=>{
        if(err) return err;
        return result;
    });
}

function performInsert(sql) {
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error inserting data into database:', err);
            return false;
        }

        console.log('Data inserted successfully:', result);

        // Respond with a success message
        return true;
    });
}


