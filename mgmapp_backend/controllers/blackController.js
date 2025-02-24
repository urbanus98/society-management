const db = require("../db");
const { updateDebt, insertBlackFlow } = require("../services/blackDebtService");

const getBlack = (req, res)=> {
    const sql = `
            SELECT 
                date, black_traffic.amount, black_traffic.name as flowName, black_traffic.id, direction, users.name as userName
            FROM black_traffic 
            LEFT JOIN debts ON black_traffic.debt_id = debts.id
            LEFT JOIN users ON debts.user_id = users.id
            WHERE black_traffic.amount IS NOT NULL 
            ORDER BY date DESC, id DESC;`;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
        const rows = result.map((row) => {
            return {
                date: row.date.toLocaleDateString('en-GB').replace(/\//g, '.'),
                amount: row.amount + " €",
                name: row.flowName,
                user: row.userName,
                id: row.id,
                direction: row.direction
            };
        });
        return res.json(rows);
    });  
}

const getBlackStatus = (req, res) => {
    const sql = `select
        SUM(CASE WHEN black_traffic.direction = 0 THEN black_traffic.amount ELSE 0 END) AS credit,
        SUM(CASE WHEN black_traffic.direction = 1 THEN black_traffic.amount ELSE 0 END) AS debt
        from black_traffic;`;

    db.query(sql, (err, result) => {
        if (err) return res.json(err);
        // console.log(result[0]);
        const resultC = result[0].credit - result[0].debt;
        // console.log(resultC);
        return res.json(resultC);
    });
}

const getBlackChart = (req, res)=> {
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
            COALESCE(SUM(CASE WHEN df.direction = 0 THEN df.amount ELSE 0 END), 0) - 
            COALESCE(SUM(CASE WHEN df.direction = 1 THEN df.amount ELSE 0 END), 0) AS weekly_balance,
            (SELECT 
                SUM(CASE WHEN df2.direction = 0 THEN df2.amount ELSE 0 END) - 
                SUM(CASE WHEN df2.direction = 1 THEN df2.amount ELSE 0 END)
            FROM black_traffic df2
            WHERE df2.date <= ws.week_start) AS cumulative_balance
        FROM WeekSeries ws
        LEFT JOIN black_traffic df ON YEARWEEK(df.date) = YEARWEEK(ws.week_start)
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

const createBlackRecord = async (req, res) => {
    const { name, amount, direction, date } = req.body;
    try {
        await insertBlackFlow(null, null, name, amount, direction, date);

        return res.status(201).json({ message: "Data stored successfully" });
    } catch (error) {
        console.error("Error inserting data:", error);
        return res.status(500).json({ error: "Failed to store data in the database" });
    }
}

const getABlackFlow = (req, res) => {
    const sql = `SELECT
        name, amount, direction, DATE_FORMAT(date, "%Y-%m-%d") as date
        FROM black_traffic WHERE id = ?`;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("Error fetching data from database:", err);
            return res.status(500).json({ error: "Failed to fetch data from the database" });
        }
        return res.json(result[0]);
    });
}

const updateBlackFlowAndDebt = async (req, res) => {
    const { name, amount, date, direction } = req.body;
    const id = req.params.id;

    await updateBlackFlow(name, amount, date, direction, id);

    const debtId = await ifDebt(id);
    if (debtId != null) {
        await updateDebt(debtId, amount);
    }

    return res.status(200).json({ message: 'Data updated successfully' });
}

const updateBlackSaleFlow = (amount, date, id) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE black_traffic SET amount = '${amount}', date = '${date}' WHERE sale_id = ${id}`;

        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error updating data in database:', err);
                return reject(err);
            }
            console.log('Data updated successfully:', result);
            
            resolve();
        });
    });
}

module.exports = { getBlack, getBlackStatus, getBlackChart, createBlackRecord, getABlackFlow, updateBlackFlowAndDebt, updateBlackSaleFlow };

const ifDebt = (blackId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT debt_id from black_traffic where id=${blackId}`;

        db.query(sql, (err, result)=>{
            if (err) {
                console.error('Error fetching data from database:', err);
                return reject(err);
            }
            resolve(result[0].debt_id);
        });
    });
}

const updateBlackFlow = (name, amount, date, direction, id) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE black_traffic SET name = '${name}', amount = ${amount}, date = '${date}', direction = ${direction} WHERE id = ${id};`;
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error updating data in database:', err);
                return reject(err);
            }
            console.log('Data updated successfully:', result);
            
            resolve();
        });
    });
}