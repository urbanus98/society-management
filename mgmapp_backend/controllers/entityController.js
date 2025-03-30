const db = require("../db");

const getEntities = (req, res)=>{
    const sql = `
        SELECT 
            id, 
            name as name
            -- short as name
        FROM entities where id > 1 ORDER BY name`;
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
    const sql = `
        SELECT 
            entities.name,
            entities.short,
            entities.address,
            entities.postal,
            entities.city,
            entities.tin,
            entities.note,
            society_info.bank,
            society_info.iban,
            society_info.head,
            society_info.registry
        FROM entities
        LEFT JOIN society_info ON entities.id = society_info.entity_id
        WHERE entities.id = ${id}
    `;
    db.query(sql, (err, result)=>{
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
        return res.json(result[0]);
    });
};

const postEntity = (req, res)=>{
    var {name, short, address, postal, city, tin, note} = req.body;
    const sql = `INSERT INTO entities (name, short, address, postal, city, tin, note) VALUES ("${name}", '${short}', '${address}', '${postal}', '${city}', '${tin}', '${note}')`;
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
    var {name, short, address, postal, city, tin, note} = req.body;
    const sql = `UPDATE entities SET name = "${name}", short = '${short}', address = '${address}', postal = '${postal}', city = '${city}', tin = '${tin}', note = '${note}' WHERE id = ${id}`;
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