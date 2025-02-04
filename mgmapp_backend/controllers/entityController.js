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
            return [
              row.name,
              row.place,
              row.id,
            ];
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
};

const putEntity = (req, res)=>{
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
};

module.exports = { getEntities, getEntitiesRow, getEntity, postEntity, putEntity };