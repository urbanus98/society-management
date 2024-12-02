require('dotenv').config()

const express = require('express');
const multer = require("multer");
const mysql = require('mysql2');
const cors = require('cors');
const e = require('express');
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Save to the 'uploads/' folder
    },
    filename: (req, file, cb) => {
        const route = req.originalUrl.split('/')[1]; // Get the route name (e.g., "merch", "events")
        const prefix = route || "default"; // Default prefix if the route is not available
        const type = file.mimetype.split('/')[1]; // Get the file type (e.g., "jpg", "png")
        const uniqueName = `${prefix}_${Date.now()}.${type}`; // Create a unique name
      cb(null, uniqueName); // Save with the new filename
    },
  });
const upload = multer({ storage });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

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


// ** EVENTS **

app.get('/event-types', (req, res)=>{
    const sql = "SELECT * FROM event_types";
    db.query(sql, (err, result)=>{
        if(err) return res.json(err);
        return res.json(result);
    });
});

app.get('/events-row', (req, res)=>{
    const sql = `SELECT event_types.name as type, events.name as name, DATE_FORMAT(date, "%d.%m.%Y") as date, events.id FROM events
    INNER JOIN event_types ON events.type_id = event_types.id
    ORDER BY date DESC;
    `;
    db.query(sql, (err, result)=>{
        if(err) return res.json(err);
        const rows = result.map((row) => {
            return [
              row.type + " - " + row.name,
              row.date,
              row.id,
            ];
        });
        return res.json(rows);
    });
});

app.post('/events', (req, res)=>{
    var {name, duration, typeId, date} = req.body;
    const sql = `INSERT INTO events (name, duration, type_id, date) VALUES ('${name}', '${duration}', '${typeId}', '${date}')`;
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

app.get('/events/:id', (req, res)=>{
    const id = req.params.id;
    const sql = `SELECT type_id, name, duration, DATE_FORMAT(date, "%Y-%m-%d") as date FROM events WHERE id = ${id}`;
    db.query(sql, (err, result)=>{
        if(err) return res.json(err);
        console.log(result);
        return res.json(result[0]);
    });
});

app.put('/events/:id', (req, res)=>{
    const id = req.params.id;
    var {name, duration, typeId, date} = req.body;
    const sql = `UPDATE events SET name = '${name}', duration = '${duration}', type_id = '${typeId}', date = '${date}' WHERE id = ${id}`;
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

// ** MERCH **

app.get('/merch', (req, res)=>{
    const sql = "SELECT * FROM stuff order by name";
    db.query(sql, (err, result)=>{
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
        console.log('Data fetched successfully:', result);
        return res.json(result);
    });
});

app.post("/merch", upload.single("image"), (req, res) => {
    try {
      // Use req.body to get other form data
      const { name, price } = req.body;
      
      if (req.file) {
          // File information is available in req.file
          const { filename, path } = req.file;

      const imagePath = `uploads/${req.file.filename}`;
      var sql = `INSERT INTO stuff (name, price, image_path) VALUES ('${name}', '${price}', '${imagePath}')`;
      } else {
        var sql = `INSERT INTO stuff (name, price) VALUES ('${name}', '${price}')`;
      }

      // Save the file path and other details to the database
      db.query(sql, (err, result) => {
        if (err) {
          console.error("Error saving to database:", err);
          return res.status(500).json({ error: "Database error" });
        }
  
        res.status(201).json({ message: "Merch created successfully" });
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

app.get('/merch/:id', (req, res)=>{
    const id = req.params.id;
    const sql = `SELECT * FROM stuff WHERE id = ${id}`;
    db.query(sql, (err, result)=>{
        if(err) return res.json(err);
        return res.json(result);
    });
});

app.put('/merch/:id', upload.single("image"), (req, res)=>{
    const id = req.params.id;
    var {name, price} = req.body;

    if (req.file) {
        const imagePath = `uploads/${req.file.filename}`;
        var sql = `UPDATE stuff SET name = '${name}', price = '${price}', image_path = '${imagePath}' WHERE id = ${id}`;
    } else {
        var sql = `UPDATE stuff SET name = '${name}', price = '${price}' WHERE id = ${id}`;
    }

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

app.get('/merch/orders', (req, res)=>{
    const sql = `
    SELECT 
    merch.name, 
    merch.price, 
    merch.amount, 
    DATE_FORMAT(merch.date, "%d.%m.%Y") as date, 
    entities.name as entity, 
    merch.id as id 
    FROM merch 
    INNER JOIN entities ON merch.entity_id = entities
    `;
    db.query(sql, (err, result)=>{
        if(err) return res.json(err);
        return res.json(result);
    });
});

// ** TRAFFIC **

app.get('/traffic', (req, res)=> {
    const sql1 = "SELECT * FROM traffic WHERE direction = 0";
    const sql2 = "SELECT * FROM traffic WHERE direction = 1";

    db.query(sql1, (err1, result1) => {
        if (err1) return res.json(err1);
        const rows1 = result1.map((row) => {
            return [
              row.name,
              row.amount,
              row.date.toLocaleDateString('en-GB').replace(/\//g, '.'),
              row.id
            ];
        });

        db.query(sql2, (err2, result2) => {
            if (err2) return res.json(err2);
            const rows2 = result2.map((row) => {
                return [
                  row.name,
                  row.amount,
                  row.date.toLocaleDateString('en-GB').replace(/\//g, '.'),
                  row.id
                ];
            });

            return res.json({ incoming: rows1, outgoing: rows2 });
        });
    });
});

app.post('/traffic', (req, res) => {
    var { name, amount, direction, date } = req.body;
    const sql = `INSERT INTO traffic (name, amount, direction, date) VALUES ('${name}', '${amount}', '${direction}', '${date}')`;
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

app.get('/traffic/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT traffic.name, traffic.direction, traffic.amount, DATE_FORMAT(traffic.date, "%Y-%m-%d") as date FROM traffic WHERE id = ${id}`;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
        console.log('Data fetched successfully:', result);
        return res.json(result[0]);
    });
    // db.query(sql, (err, result) => {
    //     if (err) return res.json(err);
    //     console.log('Data fetched successfully:', result);
    //     return res.json(result);
    // });
});

app.put('/traffic/:id', (req, res) => {
    const id = req.params.id;
    var { name, amount, direction, date } = req.body;
    const sql = `UPDATE traffic SET name = '${name}', amount = '${amount}', direction = '${direction}', date = '${date}' WHERE id = ${id}`;
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

// ** INVOICES **

app.get('/invoices-row', (req, res)=>{
    
    const statusMap = {
        0: "Plačano",
        1: "Neplačano",
        2: "Rok potekel"
    };

    const sql = `
    SELECT invoices.number, invoices.status, DATE_FORMAT(issue_date, "%d.%m.%Y") as issue_date, entities.name as entity, traffic.name as service, traffic.amount, invoices.id as id FROM invoices
    INNER JOIN entities ON invoices.payer_id = entities.id
    INNER JOIN traffic ON invoices.id = traffic.invoice_id
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
    const sql = "SELECT * FROM invoices";
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
});

app.get('/invoices/:id', (req, res)=>{
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


