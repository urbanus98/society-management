const db = require("../db");
const { insertTraffic } = require("./trafficController");
const { priceDivide, priceMultiply, performQuery, performUpdate } = require("../services/genericActions");

const getInvoices = async (req, res) => {

    const statusMap = {
        0: "Plačano",
        1: "Neplačano",
        2: "Rok potekel"
    };

    const sql = `
        SELECT invoices.number, invoices.status, DATE_FORMAT(invoices.issue_date, "%d.%m.%Y") as issueDate, entities.name as entity, traffic.name as service, traffic.amount, invoices.id as id FROM invoices
        INNER JOIN entities ON invoices.payer_id = entities.id
        INNER JOIN traffic ON invoices.id = traffic.invoice_id
        ORDER BY invoices.issue_date DESC
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
        const rows = result.map((row) => {
            return {
                number: row.number,
                entity: row.entity,
                amount: priceDivide(row.amount) + "€",
                //   row.service,
                status: statusMap[row.status],
                date: row.issueDate,
                id: row.id,
            };
        });
        return res.json(rows);
    });
};


const postInvoice = async (req, res) => {
    try {
        var { entity_id, serviceName, status, issueDate, serviceDate, type, amount } = req.body;
        var number = await getInvoiceNumber();

        const invoiceId = await insertInvoice(entity_id, number, issueDate, status, type);
        await insertTraffic(invoiceId, null, serviceName, amount, 0, serviceDate);

        return res.json({ message: 'Invoice and service created successfully' });
    } catch (error) {
        console.error('Error inserting invoice in database:', error);
        return res.status(500).json({ error: 'Failed to insert invoice in the database' });
    }

};

const getInvoice = async (req, res) => {
    const id = req.params.id;
    const sql = `
    SELECT 
        invoices.number as invoiceNumber, 
        invoices.status, 
        invoices.type, 
        DATE_FORMAT(traffic.date, "%Y-%m-%d") as serviceDate, 
        DATE_FORMAT(invoices.issue_date, "%Y-%m-%d") as issueDate, 
        invoices.payer_id as payerId, 
        traffic.name as name, 
        ROUND(traffic.amount / 100, 2) as amount,
        invoices.id as id 
    FROM invoices
        INNER JOIN traffic ON invoices.id = traffic.invoice_id
    WHERE invoices.id = ${id}`;

    console.log(sql);

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
        console.log('Data fetched successfully:', result);
        return res.json(result[0]);
    });
};

const putInvoice = async (req, res) => {
    const invoiceId = req.params.id;
    var { entityId, serviceName, amount, type, number, status, issueDate, serviceDate } = req.body;

    const sql = `UPDATE invoices SET payer_id = '${entityId}', status = '${status}', type = '${type}', number = '${number}', issue_date = '${issueDate}' WHERE id = ${invoiceId}`;
    await performUpdate(sql);

    const traffic = await performQuery(`SELECT * FROM traffic WHERE invoice_id = ${invoiceId}`);
    if (traffic.length === 0) {
        await insertTraffic(invoiceId, null, serviceName, amount, 0, serviceDate);
    } else {
        const sqlTraffic = `UPDATE traffic SET name = '${serviceName}', amount = '${priceMultiply(amount)}', date = '${serviceDate}' WHERE invoice_id = ${invoiceId}`;
        await performUpdate(sqlTraffic);
    }
    return res.status(200).json({ message: 'Data updated successfully' });
};

module.exports = { getInvoices, postInvoice, putInvoice, getInvoice };

async function getInvoiceNumber() {
    const sql = `
        SELECT MAX(number) AS highestInvoiceNumber 
        FROM invoices 
        INNER JOIN traffic ON invoices.id = traffic.invoice_id
        WHERE YEAR(traffic.date) = YEAR(CURDATE())
    `;
    const result = await performQuery(sql);
    let number = result[0].highestInvoiceNumber;

    if (number === undefined) {
        number = 1;
    } else {
        number += 1;
    }
    return number;
}

const insertInvoice = async (entity_id, number, issueDate, status, type) => {
    const sql = `INSERT INTO invoices (payer_id, receiver_id, number, issue_date, status, type) VALUES ('${entity_id}', '1', '${number}', '${issueDate}', '${status}', '${type}')`;
    const insertID = await performInsert(sql);
    return insertID;
}