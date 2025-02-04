const db = require("../db");

const getTraffic = (req, res)=> {
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
};

const postTraffic = (req, res) => {
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
};

const getOneTraffic = (req, res) => {
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
};

const putTraffic = (req, res) => {
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
};

module.exports = { getTraffic, postTraffic, getOneTraffic, putTraffic };