const db = require("../db");
const { insertTraffic } = require("./trafficController");

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
            return {
              number: row.number,
              entity: row.entity,
              amount: row.amount + " €",
            //   row.service,
              status: statusMap[row.status],
              date: row.issue_date,
              id: row.id, 
            };
        });
        return res.json(rows);
    });
};


const postInvoice = async (req, res) => {
    try {
        var { entity_id, serviceName, status, issue_date, type, amount } = req.body;
        var number = await getInvoiceNumber();
        
        if (number === undefined) { 
            number = 1; 
        } else { 
            number += 1; 
        }
        
        const invoiceId = await insertInvoice(entity_id, number, status, issue_date, type);
        await insertTraffic(invoiceId, null, serviceName, amount, 0, issue_date);
        
        return res.json({ message: 'Invoice and service created successfully' });
    } catch (error) {
        console.error('Error inserting invoice in database:', error);
        return res.status(500).json({ error: 'Failed to insert invoice in the database' });
    }

};

const putInvoice = async (req, res)=>{
    const id = req.params.id;
    var {entity_id, serviceName, amount, type, number, status, issueDate} = req.body;

    const sql = `UPDATE invoices SET payer_id = '${entity_id}', status = '${status}', issue_date = '${issueDate}', type = '${type}', number = '${number}' WHERE id = ${id}`;
    
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


const insertInvoice = (entity_id, number, status, issue_date, type) => {
    const sql = `INSERT INTO invoices (payer_id, receiver_id, number, status, type, issue_date) VALUES ('${entity_id}', '1', '${number}', '${status}', '${type}', '${issue_date}')`;
    // console.log(sql);

    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                reject({ error: 'Failed to create data' });
            }
            console.log('Data inserted successfully:', result);

            resolve(result.insertId);
        });
    });
}