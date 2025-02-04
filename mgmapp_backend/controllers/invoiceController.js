const db = require("../db");

const getInvoices = async (req, res)=>{
    
    const statusMap = {
        0: "Plačano",
        1: "Neplačano",
        2: "Rok potekel"
    };

    const sql = `
    SELECT invoices.number, invoices.status, DATE_FORMAT(issue_date, "%d.%m.%Y") as issue_date, entities.name as entity, traffic.name as service, traffic.amount, invoices.id as id FROM invoices
    INNER JOIN entities ON invoices.payer_id = entities.id
    INNER JOIN traffic ON invoices.id = traffic.invoice_id
    ORDER BY invoices.issue_date DESC
    `;
    db.query(sql, (err, result)=>{
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
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
};

// const getInvoices = (req, res)=>{
//     const sql = "SELECT * FROM invoices";
//     db.query(sql, (err, result)=>{
//         if(err) return res.json(err);
//         return res.json(result);
//     });
// };

const postInvoice = async (req, res) => {
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
        const sqlTraffic = `INSERT INTO traffic (invoice_id, name, amount, direction, date) VALUES ('${invoiceId}', '${serviceName}', '${amount}', 0, '${issue_date}')`;
        console.log(sqlTraffic);

        db.query(sqlTraffic, (err, serviceResult) => {
            if (err) {
                console.error('Error inserting service:', err);
                return res.status(500).json({ error: 'Failed to create service record' });
            }
            console.log('Service inserted successfully:', serviceResult);

            return res.json({ message: 'Invoice and service created successfully' });
        });
    });
};

const putInvoice = async (req, res)=>{
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

        const sqlTraffic = `UPDATE traffic SET name = '${serviceName}', amount = '${amount}', date = '${issueDate}' WHERE invoice_id = ${id}`;

        db.query(sqlTraffic, (err, serviceResult) => {
            if (err) {
                console.error('Error updating service in database:', err);
                return res.status(500).json({ error: 'Failed to update service in the database' });
            }
            console.log('Service updated successfully:', serviceResult);
        });

        // Respond with a success message
        return res.status(200).json({ message: 'Data updated successfully' });
    });
};

const getInvoice = async (req, res)=>{
    const id = req.params.id;
    const sql = `
    SELECT 
    invoices.number, 
    invoices.status, 
    invoices.type, 
    DATE_FORMAT(issue_date, "%Y-%m-%d") as issue_date, 
    invoices.payer_id as payer_id, 
    traffic.name as service, 
    traffic.amount, 
    invoices.id as id FROM invoices
    INNER JOIN traffic ON invoices.id = traffic.invoice_id
    WHERE invoices.id = ${id}`;

    console.log(sql);

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
        console.log('Data fetched successfully:', result);
        return res.json(result);
    });
};

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

module.exports = { getInvoices, postInvoice, putInvoice, getInvoice };