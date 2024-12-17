require('dotenv').config()

const express = require('express');
const multer = require("multer");
const mysql = require('mysql2');
const cors = require('cors');
const e = require('express');
const path = require("path");

const app = express();
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cors());


// *** IMAGE UPLOAD ***

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
    multipleStatements: true
});

app.get('/', (re, res)=>{
    return res.json ("Hello World from backend");
})


// ** EVENTS **

app.get('/event-types', (req, res)=>{
    const sql = "SELECT * FROM event_types";
    db.query(sql, (err, result)=>{
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
        return res.json(result);
    });
});

app.get('/events-row', (req, res)=>{
    const sql = `SELECT event_types.name as type, events.name as name, DATE_FORMAT(date, "%d.%m.%Y") as date, events.id FROM events
    INNER JOIN event_types ON events.type_id = event_types.id
    ORDER BY date DESC;
    `;
    db.query(sql, (err, result)=>{
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
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
    var {name, duration, typeId, date, eSaleId, eInvoiceId} = req.body;
    const sql = `INSERT INTO events (name, duration, type_id, date) VALUES ('${name}', '${duration}', '${typeId}', '${date}')`;
    console.log(sql);

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
});

app.get('/events/:id', (req, res)=>{
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
        console.log(result);


        return res.json(result[0]);
    });
});

app.put('/events/:id', (req, res)=>{
    const id = req.params.id;
    var {name, duration, typeId, date, eSaleId, eInvoiceId} = req.body;
    console.log("invoice:" + eInvoiceId);
    console.log("sale:" + eSaleId);

    const sqlEvent = `
    UPDATE events SET name = '${name}', duration = '${duration}', type_id = '${typeId}', date = '${date}' WHERE id = ${id};
    
    `;
    console.log(sqlEvent);
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
});

app.get('/event-ids/:id', async (req, res)=>{
    const id = req.params.id;
    const sqlInvoices = `
        SELECT invoices.id, entities.name, DATE_FORMAT(issue_date, "%d.%m.%Y") as issue_date, traffic.amount
        FROM invoices
        JOIN entities ON invoices.payer_id = entities.id
        JOIN traffic ON invoices.id = traffic.invoice_id
        WHERE invoices.event_id IS NULL OR invoices.event_id = ${id}
        ORDER BY issue_date
    `;
    db.query(sqlInvoices, async (err, resultInvoices)=>{
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }

        const resultSales = await getSalesWithAmounts(db, id);

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
});

// ** MERCH **

app.get('/merch', (req, res) => {
    const sql = `
        SELECT 
            s.id AS stuff_id, 
            s.name AS stuff_name, 
            s.image_path, 
            st.type AS stuff_type, 
            st.price AS stuff_price
        FROM 
            stuff s
        LEFT JOIN 
            stuff_types st 
        ON 
            s.id = st.stuff_id
        ORDER BY 
            s.name, st.id
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }

        // Process data to group types under each stuff
        const groupedData = result.reduce((acc, row) => {
            const { stuff_id, stuff_name, image_path, stuff_type, stuff_price } = row;

            // Find existing stuff entry
            let stuff = acc.find(item => item.id === stuff_id);
            if (!stuff) {
                stuff = { id: stuff_id, name: stuff_name, image_path, types: [] };
                acc.push(stuff);
            }

            // Add type and price to the stuff's types array
            if (stuff_type) {
                stuff.types.push({ type: stuff_type, price: stuff_price });
            }

            return acc;
        }, []);

        // console.log('Grouped Data:', groupedData);
        return res.json(groupedData);
    });
});



app.post("/merch", upload.single("image"), (req, res) => {
    try {
      // Use req.body to get other form data
        const { name, details } = req.body;
        let imagePath = null;

        console.log(req.body);
        console.log(details);

        if (req.file) {
        imagePath = `uploads/${req.file.filename}`;
        }
        const sqlStuff = imagePath
            ? `INSERT INTO stuff (name, image_path) VALUES (?, ?)`
            : `INSERT INTO stuff (name) VALUES (?)`;
        const stuffValues = imagePath ? [name, imagePath] : [name];

      // Save the file path and other details to the database
      db.query(sqlStuff, stuffValues, (err, stuffResult) => {
        if (err) {
          console.error("Error saving to database:", err);
          return res.status(500).json({ error: "Database error" });
        }

        const stuffId = stuffResult.insertId;
        console.log('Last inserted invoice ID:', stuffId);

        let parsedDetails = parseJSON(details);

        const stuffTypeValues = parsedDetails.map(({ type, price }) => [stuffId, type, price]);
        const sqlStuffType = `INSERT INTO stuff_types (stuff_id, type, price) VALUES ?`;
        console.log(sqlStuffType);

        db.query(sqlStuffType, [stuffTypeValues], (err, stuffTypeResult) => {
            if (err) {
              console.error("Error inserting stuff types:", err);
              return res.status(500).json({ error: "Failed to create stuff type records" });
            }
            console.log('Stuff types inserted successfully:', stuffTypeResult);
            return res.json({ message: "Stuff and stuff types created successfully" });
          });
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  app.get('/merch/:id', (req, res) => {
    const stuffId = req.params.id;

    const sql = `
        SELECT 
            s.id AS stuff_id, 
            s.name AS stuff_name, 
            s.image_path, 
            st.type AS stuff_type, 
            st.price AS stuff_price
        FROM 
            stuff s
        LEFT JOIN 
            stuff_types st 
        ON 
            s.id = st.stuff_id
        WHERE 
            s.id = ?
        ORDER BY 
            st.id
    `;

    db.query(sql, [stuffId], (err, result) => {
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Stuff not found' });
        }

        // Process data to group types under the stuff item
        const groupedData = result.reduce((acc, row) => {
            const { stuff_id, stuff_name, image_path, stuff_type, stuff_price } = row;

            // If the stuff object is not created yet, create it
            if (!acc) {
                acc = { id: stuff_id, name: stuff_name, image_path, types: [] };
            }

            // Add type and price to the stuff's types array
            if (stuff_type) {
                acc.types.push({ type: stuff_type, price: stuff_price });
            }

            return acc;
        }, null);

        // console.log('Grouped Data:', groupedData);
        return res.json(groupedData);
    });
});


app.put('/merch/:id', upload.single("image"), (req, res)=>{
    const id = req.params.id;
    var {name, details} = req.body;

    if (req.file) {
        const imagePath = `uploads/${req.file.filename}`;
        var sqlStuffUpdate = `UPDATE stuff SET name = '${name}', image_path = '${imagePath}' WHERE id = ${id}`;
    } else {
        var sqlStuffUpdate = `UPDATE stuff SET name = '${name}' WHERE id = ${id}`;
    }

    db.query(sqlStuffUpdate, (err, stuffResult) => {
        if (err) {
            console.error('Error updating data in database:', err);
            return res.status(500).json({ error: 'Failed to update data in the database' });
        }

        console.log('Stuff updated successfully:', stuffResult);

        var sqlStuffTypesQuery = `SELECT id FROM stuff_types WHERE stuff_id = ${id}`;

        db.query(sqlStuffTypesQuery, (err, stuffTypesResult) => {
            if (err) {
                console.error('Error fetching data from database:', err);
                return res.status(500).json({ error: 'Failed to fetch data from the database' });
            }

            console.log('Stuff types fetched successfully:', stuffTypesResult);

            let parsedDetails = parseJSON(details);
            console.log(parsedDetails);

            // split parsedDetails into two arrays take n elements from the end
            let oldDetails = parsedDetails.slice(0, stuffTypesResult.length);
            let newDetails = parsedDetails.slice(stuffTypesResult.length);

            console.log('Old Details:', oldDetails);
            console.log('New Details:', newDetails);

            oldDetails.forEach(({ type, price}, index ) => {
                const oldsqlStuffType = `UPDATE stuff_types SET type = ?, price = ? WHERE id = ?`;
                db.query(oldsqlStuffType, [type, price, stuffTypesResult[index].id], (err, result) => {
                  if (err) {
                    console.error("Error updating stuff_types:", err);
                    return res.status(500).json({ error: "Failed to update stuff type records" });
                  }
                  console.log(`Updated stuff_type for stuff_id ${id}:`, result);
                });
            });

            if (newDetails.length === 0) {
                return res.status(200).json({ message: 'Data updated successfully' });
            }
              
            const newstuffTypeValues = newDetails.map(({ type, price }) => [id, type, price]);
            const newsqlStuffType = `INSERT INTO stuff_types (stuff_id, type, price) VALUES ?`;
            console.log(newsqlStuffType);

            db.query(newsqlStuffType, [newstuffTypeValues], (err, newstuffTypeResult) => {
                if (err) {
                console.error("Error inserting stuff types:", err);
                return res.status(500).json({ error: "Failed to create stuff type records" });
                }
                console.log('Stuff types inserted successfully:', newstuffTypeResult);
                return res.status(201).json({ message: 'Data updated successfully' });
            });
        });
    });
});

// ** MERCH SALES **

app.get('/sales', async (req, res)=>{
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
});

const getSalesWithAmounts = async (db, eventID) => {
    return new Promise((resolve, reject) => {
        if (eventID === undefined) {
            var sqlSales = `
                SELECT
                id,
                DATE_FORMAT(date, "%d.%m.%Y") as date
                FROM
                sales
                ORDER BY date
            `;
        } else {
            var sqlSales = `
                SELECT
                id,
                DATE_FORMAT(date, "%d.%m.%Y") as date
                FROM
                sales
                WHERE sales.event_id IS NULL OR sales.event_id = ${eventID}
                ORDER BY date
            `;
        }
  
      db.query(sqlSales, async (err, resultSales) => {
        if (err) {
          return reject('Error fetching sales data:', err);
        }
  
        if (resultSales.length === 0) {
          return resolve([]);
        }
  
        try {
          const salesWithAmounts = await Promise.all(
            resultSales.map((sale) => {
              return new Promise((resolve, reject) => {
                const sqlStuffSold = `
                  SELECT
                    SUM(quantity * price_actual) as total
                  FROM
                    stuff_sold
                  WHERE
                    sale_id = ?
                `;
  
                db.query(sqlStuffSold, [sale.id], (err, resultStuffSold) => {
                  if (err) {
                    reject(err);
                  } else {
                    sale.total = resultStuffSold[0].total || 0;
                    resolve(sale);
                    // resolve([sale.date, total + " €", sale.id]);
                  }
                });
              });
            })
          );
  
          resolve(salesWithAmounts);
        } catch (error) {
          reject(error);
        }
      });
    });
  };
  

app.post('/sales', (req, res)=>{
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
});

app.get('/sales/:id', (req, res)=>{
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
});

app.put('/sales/:id', (req, res)=>{
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
});

// ** MERCH ORDERS **

app.get('/stuff', (req, res)=>{
    const sql = "SELECT * FROM stuff";
    db.query(sql, (err, result)=>{
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
        return res.json(result);
    });
});

app.get('/stuff-types', (req, res)=>{
    const sql = `
    SELECT stuff_types.id, stuff.name, stuff_types.type 
    FROM stuff_types 
    JOIN stuff on stuff_types.stuff_id = stuff.id
    order by stuff_id`;
    db.query(sql, (err, result)=>{
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
        const formattedResults = result.map((row) => {
            return {
              name: row.name + " - " + row.type,
              id: row.id,
            };
        });
        console.log('Data fetched successfully:', result);
        return res.json(formattedResults);
    });
});

app.get('/orders', (req, res)=>{
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
});

app.post('/orders', (req, res)=>{
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

        // let parsedDetails = parseJSON(details);
        // console.log(parsedDetails);

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
});

app.get('/orders/:id', (req, res)=>{
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
});

app.put('/orders/:id', (req, res)=>{
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
              row.amount + " €",
              row.date.toLocaleDateString('en-GB').replace(/\//g, '.'),
              row.id
            ];
        });

        db.query(sql2, (err2, result2) => {
            if (err2) return res.json(err2);
            const rows2 = result2.map((row) => {
                return [
                  row.name,
                  row.amount + " €",
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


function parseJSON(jsonString) {
    let parsedJSON;
    try {
        parsedJSON = JSON.parse(jsonString);
    } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        return res.status(400).json({ error: "Invalid JSON format" });
    }

    // Validate
    if (!Array.isArray(parsedJSON)) {
        return res.status(400).json({ error: "'jsonString' must be an array" });
    }
    return parsedJSON;
}
  

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


