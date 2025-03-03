
const { performQuery, performMassUpdate, performMassInsertO } = require("../services/genericActions");

const getLocations = async (req, res) => {
    try {
        const sql = `SELECT * FROM locations`;
        
        const result = await performQuery(sql);
        return res.json(result);
    } catch (error) {
        console.error("Error fetching data from database:", error);
        return res.status(500).json({ error: "Failed to fetch data from the database" });
    }
}

const getMileageRates = async (req, res) => {
    try {
        const sql = `SELECT year, ROUND(rate / 100, 2) as rate FROM mileage_rates ORDER BY year`;
        
        const result = await performQuery(sql);
        return res.json(result);
    } catch (error) {
        console.error("Error fetching data from database:", error);
        return res.status(500).json({ error: "Failed to fetch data from the database" });
    }
}

const updateMileageRates = async (req, res) => {
    try {
        const { details } = req.body;

        const converteDetails = convertRates(details, 'rate');

        const oldData = converteDetails.filter((detail) => detail.id);
        const newData = converteDetails.filter((detail) => !detail.id);
        const sql = `UPDATE mileage_rates SET rate = ?, year = ? WHERE id = ?`;

        await performMassUpdate(sql, oldData, ['rate', 'year', 'id']);
        await performMassInsertO('mileage_rates', newData, ['year', 'rate']);

        return res.json("success");
    } catch (error) {
        console.error("Error updating mileage rate:", error);
        return res.status(500).json({ error: "Failed to update mileage rate" });
    }
}

const updateLocations = async (req, res) => {
    try {
        const { details } = req.body;
        const oldData = details.filter((detail) => detail.id);
        const newData = details.filter((detail) => !detail.id);
        
        const updateSql = `UPDATE locations SET name = ?, distance = ? WHERE id = ?`;
        await performMassUpdate(updateSql, oldData, ['name', 'distance', 'id']);
        await performMassInsertO('locations', newData, ['name', 'distance']);

        return res.json(details);
    }
    catch(error) {
        console.error("Error updating location:", error);
        return res.status(500).json({ error: "Failed to update location" });
    }
}

module.exports = { getLocations, getMileageRates, updateMileageRates, updateLocations };

const convertRates = (details, key) => {
    const updateDetails = details.map((detail) => {
        return { ...detail, [key]: detail[key] * 100 };
    });
    return updateDetails;
}
