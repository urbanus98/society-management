const db = require("../db");
const { updateDebt, insertBlackFlow, updateFlow } = require("../services/blackDebtService");
const { performQuery } = require("../services/genericActions");

const getDebts = async (req, res) => {
    const sqlDebts = `
        SELECT 
            users.name,
            users.id,
            SUM(CASE WHEN black_traffic.direction = 0 THEN debts.amount ELSE 0 END) AS credit,
            SUM(CASE WHEN black_traffic.direction = 1 THEN debts.amount ELSE 0 END) AS debt
        FROM debts
            JOIN black_traffic ON debts.id = black_traffic.debt_id
            JOIN users ON debts.user_id = users.id
        GROUP BY users.name, users.id;
    `;
    resultD = await performQuery(sqlDebts);
    console.log(resultD);
    const sqlTrips = `
        SELECT 
            users.name,
            users.id,
            ROUND(SUM(trips.mileage * mr.rate) / 100) AS tripCosts
        FROM trips
            JOIN mileage_rates mr ON mr.id = trips.rate_id
            JOIN users ON trips.user_id = users.id
        GROUP BY users.name, users.id;
    `;
    resultT = await performQuery(sqlTrips);
    console.log(resultT);
    return res.json(
        [...resultD, ...resultT.filter(t => !resultD.some(d => d.id === t.id))].map((row) => {
            const tripCostEntry = resultT.find((r) => r.id === row.id);
            return {
                name: row.name ?? tripCostEntry.name, // Use tripCostEntry name if not in debts
                credit: row.credit ?? 0, // Default to 0 if not in debts
                debt: row.debt ?? 0, // Default to 0 if not in debts
                tripCosts: tripCostEntry?.tripCosts ?? 0, // Default to 0 if no tripCosts
            };
        })
    );
    
}

const getDebtRows = (req, res) => {
    const sql = `
        SELECT 
            black_traffic.date, debts.id as id, debts.amount, black_traffic.name as flowName, direction, users.name as userName
        FROM debts 
        JOIN black_traffic ON black_traffic.debt_id = debts.id
        JOIN users ON debts.user_id = users.id
        ORDER BY date DESC, id DESC;
    `;

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

const insertPay = async (req, res) => {
    try {
        const { user_id, amount, name, date } = req.body;

        const debtId = await insertDebt(user_id, amount);

        await insertBlackFlow(null, debtId, name, null, 0, date);

        return res.status(201).json({ message: "Data stored successfully" });
    } catch (error) {
        console.error("Error inserting data:", error);
        return res.status(500).json({ error: "Failed to store data in the database" });
    }
};

const insertDeposit = async (req, res) => {
    try {
        const { user_id, amount, name, date } = req.body;

        const debtId = await insertDebt(user_id, amount);

        await insertBlackFlow(null, debtId, name, amount, 0, date);

        return res.status(201).json({ message: "Data stored successfully" });
    } catch (error) {
        console.error("Error inserting data:", error);
        return res.status(500).json({ error: "Failed to store data in the database" });
    }
};

const insertBuy = async (req, res) => {
    try {
        const { user_id, amount, name, date } = req.body;

        const debtId = await insertDebt(user_id, amount);

        await insertBlackFlow(null, debtId, name, null, 1, date);

        return res.status(201).json({ message: "Data stored successfully" });
    } catch (error) {
        console.error("Error inserting data:", error);
        return res.status(500).json({ error: "Failed to store data in the database" });
    }
};

const insertCashout = async (req, res) => {
    try {
        const { user_id, amount, name, date } = req.body;

        const debtId = await insertDebt(user_id, amount);

        await insertBlackFlow(null, debtId, name, amount, 1, date);

        return res.status(201).json({ message: "Data stored successfully" });
    } catch (error) {
        console.error("Error inserting data:", error);
        return res.status(500).json({ error: "Failed to store data in the database" });
    }
}

const getDebt = (req, res) => {
    const id = req.params.id;
    const sql =`
        SELECT
            debts.amount, DATE_FORMAT(date, "%Y-%m-%d") as date, black_traffic.name
        FROM debts
        JOIN black_traffic ON debts.id = black_traffic.debt_id
        WHERE debts.id = ${id}
    `;
    db.query(sql, (err, result)=>{
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).json({ error: 'Failed to fetch data from the database' });
        }
        return res.json(result[0]);
    });
}

const updateDebtAndFlow = async (req, res) => {
    const { amount, name, date } = req.body;
    const debtId = req.params.id;

    await updateDebt(debtId, amount);

    await updateFlow(name, amount, date, debtId);

    return res.status(200).json({ message: 'Data updated successfully' });
}

module.exports = { getDebts, getDebtRows, insertPay, insertDeposit, insertBuy, insertCashout, getDebt, updateDebtAndFlow }; // TODO implement setDebtStatusTo

const insertDebt = async (user_id, amount) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO debts (user_id, amount) VALUES (?, ?)`;

        db.query(sql, [user_id, amount], (err, result) => {
            if (err) {
                console.error("Error inserting into debts table:", err);
                return reject(err);
            }
            console.log("debts inserted successfully:", result);
            resolve(result.insertId);
        });
    });
};