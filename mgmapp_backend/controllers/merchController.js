const db = require('../db');
const parseJSON = require('../services/misc').parseJSON;

exports.getStuffTypes = (req, res)=>{
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
};

exports.getMerch = (req, res) => {
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
};

exports.postMerch = (req, res) => {
    try {
      // Use req.body to get other form data
        const { name, details } = req.body;
        let imagePath = null;

        console.log(req.body);
        
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
};

exports.getMerchItem = (req, res) => {
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
};


exports.putMerch = (req, res)=>{
    const id = req.params.id;
    var {name, details} = req.body;
    console.log(req.body);
    console.log(id);

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
};