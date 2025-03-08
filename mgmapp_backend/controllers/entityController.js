const db = require("../db");

const getEntities = (req, res)=>{
    const sql = "SELECT * FROM entities";
    db.query(sql, (err, result)=>{
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
        return res.json(result);
    });
};

const getEntitiesRow = (req, res)=>{
    const sql = "SELECT * FROM entities";
    db.query(sql, (err, result)=>{
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
        const rows = result.map((row) => {
            return {
                name: row.name,
                city: row.city,
                id: row.id,
            };
          });
        return res.json(rows);
    });
};

const getEntity = (req, res)=>{
    const id = req.params.id;
    const sql = `SELECT * FROM entities WHERE id = ${id}`;
    db.query(sql, (err, result)=>{
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
        return res.json(result);
    });
};

const postEntity = (req, res)=>{
    var {name, address, postal, city, head, iban, bank, note} = req.body;
    if (iban === '') { iban = null;}
    if (note === '') { note = null;}
    if (bank === '') { bank = null;}
    if (head === '') { head = null;}
    const sql = `INSERT INTO entities (name, address, postal, city, head, iban, bank, note) VALUES ('${name}', '${address}', '${postal}', '${city}', '${head}', '${iban}', '${bank}', '${note}')`;
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
};

const putEntity = (req, res)=>{
    const id = req.params.id;
    var {name, address, postal, city, head, iban, bank, note} = req.body;
    const sql = `UPDATE entities SET name = '${name}', address = '${address}', postal = '${postal}', city = '${city}', head = '${head}', iban = '${iban}', bank = '${bank}', note = '${note}' WHERE id = ${id}`;
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
};

module.exports = { getEntities, getEntitiesRow, getEntity, postEntity, putEntity };