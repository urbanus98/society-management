const { put } = require("../routes/events");
const { performQuery, performInsert, priceDivide, priceMultiply, performUpdate  } = require("../services/genericActions");

const getProformaRows = async (req, res) => {
    try {
        const sql = `
            SELECT 
                proforma.id, 
                proforma.number, 
                proforma.name, 
                proforma.amount, 
                DATE_FORMAT(proforma.issue_date, "%d.%m.%Y") as issueDate, 
                entities.name as entity,
                invoices.number as invoiceNumber
            FROM proforma
                INNER JOIN invoices ON proforma.invoice_id = invoices.id
                INNER JOIN entities ON invoices.payer_id = entities.id
            ORDER BY proforma.issue_date DESC, proforma.number DESC
        `;
        const result = await performQuery(sql);
        const rows = result.map((row) => {
            return {
              number: row.number,
              entity: row.entity,
              amount: priceDivide(row.amount) + "€",
              date: row.issueDate,
              link: `/invoices/create/${row.id}`,
              id: row.id, 
              actionDisabled: row.invoiceNumber !== null
            };
        });
        return res.json(rows);
    } catch (error) {
        console.error('Error fetching proforma invoices from database:', error);
        return res.status(500).json({ error: 'Failed to get proforma invoices from database' });
    }
};

const postProforma = async (req, res) => {
    try {
        var { entityId, amount, serviceName, issueDate, serviceDate } = req.body;
        var number = await getProformaInvoiceNumber();

        const invoiceId = await insertInvoice(entityId);
        await insertProforma(invoiceId, number, serviceName, amount, serviceDate, issueDate);
        
        return res.json({ message: 'Proforma invoice created successfully' });
    } catch (error) {
        console.error('Error inserting invoice in database:', error);
        return res.status(500).json({ error: 'Failed to insert invoice in the database' });
    }
};

const getProforma = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `
            SELECT 
                proforma.id, 
                proforma.invoice_id as invoiceId, 
                proforma.number, 
                proforma.name,
                ROUND(proforma.amount / 100, 2) as amount,
                DATE_FORMAT(proforma.issue_date, "%Y-%m-%d") as issueDate,
                DATE_FORMAT(proforma.service_date, "%Y-%m-%d") as serviceDate,
                invoices.payer_id as payerId
            FROM proforma
                INNER JOIN invoices ON proforma.invoice_id = invoices.id
            WHERE proforma.id = ${id}
        `;
        const result = await performQuery(sql);
        const data = result[0];
        data.invoiceNumber = await getInvoiceNumber();
        return res.json(data);
    } catch (error) {
        console.error('Error fetching proforma invoice from database:', error);
        return res.status(500).json({ error: 'Failed to get proforma invoice from database' });
    }
};

const putProforma = async (req, res) => {
    try {
        const { id } = req.params;
        const { entityId, serviceName, number, amount, issueDate, serviceDate } = req.body;

        const invoiceId = await performQuery(`SELECT invoice_id FROM proforma WHERE id = ${id}`);
        await updateInvoice(invoiceId[0].invoice_id, entityId);
        await updateProforma(id, number, serviceName, amount, serviceDate, issueDate);
        return res.json({ message: 'Proforma invoice updated successfully' });
    } catch (error) {
        console.error('Error updating proforma invoice in database:', error);
        return res.status(500).json({ error: 'Failed to update proforma invoice in the database' });
    }
}

module.exports = { getProformaRows, postProforma, getProforma, putProforma };

const insertInvoice = async (entityId) => {
    const sql = `INSERT INTO invoices (payer_id, receiver_id) VALUES ('${entityId}', '1')`;
    const result = await performInsert(sql);
    return result.id;
}

const updateInvoice = async (id, entityId) => {
    const sql = `UPDATE invoices SET payer_id = '${entityId}' WHERE id = ${id}`;
    await performUpdate(sql);
}

const insertProforma = async (invoiceId, number, name, amount, serviceDate, issueDate) => {
    const sql = `INSERT INTO proforma (invoice_id, number, name, amount, service_date, issue_date) VALUES ('${invoiceId}', '${number}', "${name}", '${priceMultiply(amount)}', '${serviceDate}', '${issueDate}')`;
    await performInsert(sql);
}

const updateProforma = async (id, number, name, amount, serviceDate, issueDate) => {
    const sql = `UPDATE proforma SET number = ${number}, name = "${name}", amount = '${priceMultiply(amount)}', service_date = '${serviceDate}', issue_date = '${issueDate}' WHERE id = ${id}`;
    await performUpdate(sql);
}

async function getProformaInvoiceNumber() {
    const sql = `
        SELECT MAX(number) AS highestInvoiceNumber 
        FROM proforma
        WHERE YEAR(issue_date) = YEAR(CURDATE())
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