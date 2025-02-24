const db = require("../db");

const getTraffic = (req, res)=> {
    const sql = `
        SELECT
            traffic.id,
            traffic.name,
            traffic.amount,
            traffic.direction,
            DATE_FORMAT(traffic.date, "%d.%m.%Y") as date
        FROM traffic
        ORDER BY traffic.date DESC, id DESC;
    `;

    db.query(sql, (error, result) => {
        if (error) {
            console.error('Error fetching data from database:', error);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
        console.log('Data fetched successfully:', result);
        return res.json(result.map((traffic) => {
            return {
                date: traffic.date,
                name: traffic.name,
                amount: traffic.amount + " €",
                direction: traffic.direction,
                id: traffic.id,
            }
        }));
    });
};

const postTraffic = async (req, res) => {
    var { name, amount, direction, date } = req.body;

    await insertTraffic(null, null, name, amount, direction, date);

    return res.status(201).json({ message: 'Data stored successfully' });
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

const putTraffic = async (req, res) => {
    const id = req.params.id;
    var { name, amount, direction, date } = req.body;

    await updateTraffic(id, name, amount, direction, date);

    return res.status(200).json({ message: 'Data updated successfully' });
};

const insertTraffic = (invoiceId, orderId, name, amount, direction, date) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO 
                traffic (invoice_id, order_id, name, amount, direction, date) 
            VALUES (${invoiceId}, ${orderId}, '${name}', '${amount}', '${direction}', '${date}')
        `;
        console.log(sql);
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error inserting data into database:', err);
                reject({ error: 'Failed to store data in the database' });
            }
            console.log('Data inserted successfully:', result);
            
            resolve();
        });
    });
}

const updateTraffic = (trafficId, name, amount, direction, date) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE traffic SET name = '${name}', amount = '${amount}', direction = '${direction}', date = '${date}' WHERE id = ${trafficId}`;
        // console.log(sql);
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error updating data in database:', err);
                reject({ error: 'Failed to update data in the database' });
            }
            console.log('Data updated successfully:', result);
            
            resolve();
        });
    });
}

const getTrafficChart = (req, res)=> {
    const sql = `
        WITH RECURSIVE WeekSeries AS (
            SELECT CURDATE() - INTERVAL 25 WEEK AS week_start
            UNION ALL
            SELECT week_start + INTERVAL 1 WEEK FROM WeekSeries WHERE week_start < CURDATE()
        )
        SELECT 
            DATE_FORMAT(ws.week_start, '%Y-%m') AS month_year,
            YEARWEEK(ws.week_start) AS week_number,
            ws.week_start, -- Explicitly include in GROUP BY
            COALESCE(SUM(CASE WHEN tr.direction = 0 THEN tr.amount ELSE 0 END), 0) - 
            COALESCE(SUM(CASE WHEN tr.direction = 1 THEN tr.amount ELSE 0 END), 0) AS weekly_balance,
            (SELECT 
                SUM(CASE WHEN tr2.direction = 0 THEN tr2.amount ELSE 0 END) - 
                SUM(CASE WHEN tr2.direction = 1 THEN tr2.amount ELSE 0 END)
            FROM traffic tr2
            WHERE tr2.date <= ws.week_start) AS cumulative_balance
        FROM WeekSeries ws
        LEFT JOIN traffic tr ON YEARWEEK(tr.date) = YEARWEEK(ws.week_start)
        GROUP BY month_year, week_number, ws.week_start
        ORDER BY ws.week_start;
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
        // console.log(result);
        return res.json(result);
    });
}

module.exports = { getTraffic, postTraffic, getOneTraffic, putTraffic, insertTraffic, updateTraffic, getTrafficChart };