const { performQuery } = require("../services/genericActions");

const getSizeSales = async (req, res) => {
    try {
        const sql = `
            SELECT 
                st.type as type,
                SUM(ss.quantity) as quantity
            FROM stuff_sold as ss
                JOIN stuff_types st ON st.id = ss.stufftype_id
            WHERE type='S' OR type='M' OR type='L' OR type='XL' OR type='XXL'
            GROUP BY type
        `;
        const result = await performQuery(sql);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getMZZFunds = async (req, res) => {
    try {
        const sql = `
            SELECT
                DATE_FORMAT(date, '%Y') as year,
                COALESCE(SUM(amount), 0) as funds
            FROM
                black_traffic
            WHERE name="zelišča" OR name="zelisca" OR name="zelenjava" OR name="zelenje" 
            GROUP BY year
        `;
        const result = await performQuery(sql);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getSalesProfitByYear = async (req, res) => {
    try {
        const sql = `
            SELECT
                DATE_FORMAT(date, '%Y') as year,
                SUM(quantity * price_actual) as profit
            FROM sales
                JOIN stuff_sold ON sales.id = stuff_sold.sale_id
            GROUP BY year
        `;
        const result = await performQuery(sql);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getMileages = async (req, res) => {
    try {
        const sql = `
            SELECT
                DATE_FORMAT(events.date, '%Y') as year,
                COALESCE(SUM(mileage), 0) AS totalKm
            FROM trips
                JOIN events on trips.event_id = events.id
            GROUP BY year
        `;
        console.log(sql);
        const result = await performQuery(sql);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getMonthlyBalances = async (req, res)=> {
    try {
        const trafficBalances = await getMonthlyBalance('traffic', req.params.year);
        const blackTrafficBalances = await getMonthlyBalance('black_traffic', req.params.year);
        return res.json({
            traffic: trafficBalances,
            black_traffic: blackTrafficBalances
        });
    } catch (error) {
        console.error('Error fetching data from database:', error);
        return res.status(500).json({ error: 'Failed to fetch data from the database' });
    }
}

const getYearlyTrafficStats = async (req, res) => {
    try {
        const trafficStats = await getEitherTrafficStats('traffic');
        const blackTrafficStats = await getEitherTrafficStats('black_traffic');
        return res.json({
            traffic: trafficStats,
            black_traffic: blackTrafficStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getYears = async (req, res) => {
    try {
        const sql = "SELECT DISTINCT DATE_FORMAT(date, '%Y') as year FROM events ORDER BY year DESC";
        const years = await performQuery(sql);
        const result = years.map((year) => {
            return {
                id: year.year,
                name: year.year
            };
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getYearlyEventStats = async (req, res) => {
    try {
        const sqlCount = `
            SELECT
                COUNT(events.id) as total,
                event_types.name as type
            FROM events
                JOIN event_types ON events.type_id = event_types.id
            WHERE DATE_FORMAT(events.date, '%Y') = '${req.params.year}'
            GROUP BY event_types.name
        `;
        const count = await performQuery(sqlCount);
        const sqlHours = `
            SELECT
                SUM(events.duration) as total,
                event_types.name as type
            FROM events
                JOIN event_types ON events.type_id = event_types.id
            WHERE DATE_FORMAT(events.date, '%Y') = '${req.params.year}'
            GROUP BY event_types.name
        `;
        const hours = await performQuery(sqlHours);
        res.status(200).json({
            typeCount: count.length > 0 ? count : {total: 0, type: 'Ni dogodkov'},
            typeHours: hours.length > 0 ? hours : {total: 0, type: 'Ni dogodkov'}
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getYears, getYearlyTrafficStats, getYearlyEventStats, getMonthlyBalances, getMileages, getSalesProfitByYear, getMZZFunds, getSizeSales };

const getEitherTrafficStats = async (tableName) => {
    try {
        const sqlTemplate = `
            SELECT
                DATE_FORMAT(date, '%Y') as year,
                ROUND(SUM(CASE WHEN direction = 0 THEN amount ELSE 0 END)[DIVISION]) AS inflow,
                ROUND(SUM(CASE WHEN direction = 1 THEN amount ELSE 0 END)[DIVISION]) * (-1) AS outflow
            FROM [TABLE_NAME]
            GROUP BY year
        `;
        var sql = sqlTemplate.replace(/\[TABLE_NAME\]/g, tableName);
        if (tableName === 'traffic') {
            sql = sql.replace(/\[DIVISION\]/g," / 100, 2");
        } else {
            sql = sql.replace(/\[DIVISION\]/g,"");
        }
        const result = await performQuery(sql);
        return result;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

async function getMonthlyBalance(tableName, year) {
    const validTables = ['traffic', 'black_traffic'];
    if (!validTables.includes(tableName)) {
        throw new Error('Invalid table name. Must be "traffic" or "black_traffic".');
    }

    try {
        const sqlTemplate = `
            WITH all_months AS (
                SELECT DATE_FORMAT(CONCAT(?, '-01-01'), '%Y-%m') AS month
                UNION SELECT DATE_FORMAT(CONCAT(?, '-02-01'), '%Y-%m')
                UNION SELECT DATE_FORMAT(CONCAT(?, '-03-01'), '%Y-%m')
                UNION SELECT DATE_FORMAT(CONCAT(?, '-04-01'), '%Y-%m')
                UNION SELECT DATE_FORMAT(CONCAT(?, '-05-01'), '%Y-%m')
                UNION SELECT DATE_FORMAT(CONCAT(?, '-06-01'), '%Y-%m')
                UNION SELECT DATE_FORMAT(CONCAT(?, '-07-01'), '%Y-%m')
                UNION SELECT DATE_FORMAT(CONCAT(?, '-08-01'), '%Y-%m')
                UNION SELECT DATE_FORMAT(CONCAT(?, '-09-01'), '%Y-%m')
                UNION SELECT DATE_FORMAT(CONCAT(?, '-10-01'), '%Y-%m')
                UNION SELECT DATE_FORMAT(CONCAT(?, '-11-01'), '%Y-%m')
                UNION SELECT DATE_FORMAT(CONCAT(?, '-12-01'), '%Y-%m')
            ),
            initial_balance AS (
                SELECT 
                    ROUND(COALESCE(SUM(CASE WHEN direction = 0 THEN amount ELSE 0 END) - SUM(CASE WHEN direction = 1 THEN amount ELSE 0 END), 0)[DIVISION]) AS initial_balance
                FROM [TABLE_NAME]
                WHERE date < CONCAT(?, '-01-01')
            ),
            monthly_transactions AS (
                SELECT 
                    DATE_FORMAT(date, '%Y-%m') AS month,
                    ROUND(COALESCE(SUM(CASE WHEN direction = 0 THEN amount ELSE 0 END), 0)[DIVISION]) AS total_inflow,
                    ROUND(COALESCE(SUM(CASE WHEN direction = 1 THEN amount ELSE 0 END), 0)[DIVISION]) AS total_outflow,
                    ROUND(COALESCE(SUM(CASE WHEN direction = 0 THEN amount ELSE 0 END) - SUM(CASE WHEN direction = 1 THEN amount ELSE 0 END), 0)[DIVISION]) AS monthly_change
                FROM [TABLE_NAME]
                WHERE YEAR(date) = ?
                GROUP BY DATE_FORMAT(date, '%Y-%m')
            ),
            running_balance AS (
                SELECT 
                    am.month,
                    COALESCE(mt.total_inflow, 0) AS total_inflow,
                    COALESCE(mt.total_outflow, 0) AS total_outflow,
                    COALESCE(mt.monthly_change, 0) AS monthly_change,
                    ib.initial_balance + SUM(COALESCE(mt.monthly_change, 0)) OVER (ORDER BY am.month ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS balance
                FROM all_months am
                CROSS JOIN initial_balance ib
                LEFT JOIN monthly_transactions mt ON am.month = mt.month
            )
            SELECT 
                month,
                total_inflow,
                total_outflow,
                balance
            FROM running_balance
            ORDER BY month;
        `;

        var sql = sqlTemplate.replace(/\[TABLE_NAME\]/g, tableName);
        if (tableName === 'traffic') {
            sql = sql.replace(/\[DIVISION\]/g," / 100, 2");
        } else {
            sql = sql.replace(/\[DIVISION\]/g,"");
        }

        const params = Array(14).fill(year); // 14 placeholders

        const rows = await performQuery(sql, params);
        return rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}