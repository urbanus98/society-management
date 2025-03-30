
const { performQuery, performMassUpdate, performMassInsertO, performUpdate } = require("../services/genericActions");

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
        const sql = `SELECT id, year, ROUND(rate / 100, 2) as rate FROM mileage_rates ORDER BY year`;
        
        const result = await performQuery(sql);
        return res.json(result);
    } catch (error) {
        console.error("Error fetching data from database:", error);
        return res.status(500).json({ error: "Failed to fetch data from the database" });
    }
}

const getSociety = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `SELECT * FROM society_info where id = ${id}`;
        
        const result = await performQuery(sql);
        return res.json(result[0]);
    } catch (error) {
        console.error("Error fetching data from database:", error);
        return res.status(500).json({ error: "Failed to fetch data from the database" });
    }
}

const updateMileageRates = async (req, res) => {
    try {
        const { details } = req.body;

        const converteDetails = convertRatesToCents(details, 'rate');
        const oldData = converteDetails.filter((detail) => detail.id);
        const newData = converteDetails.filter((detail) => !detail.id);

        const sql = `UPDATE mileage_rates SET rate = ?, year = ? WHERE id = ?`;

        await performMassUpdate(sql, oldData, ['rate', 'year', 'id']);
        await performMassInsertO('mileage_rates', newData, ['year', 'rate']);

        return res.status(200).json({ message: "Kilometrine so bile uspešno posodobljene!" });
    } catch (error) {
        console.error("Error updating mileage rate:", error);
        return res.status(500).json({ error: "Napaka pri posodobitvi kilomtrin!" });
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

        return res.status(200).json({ message: "Lokacije so bile uspešno posodobljene!" });
    }
    catch(error) {
        console.error("Error updating location:", error);
        return res.status(500).json({ error: "Napaka pri posodobitvi lokacij!" });
    }
}

const updateSociety = async (req, res) => {
    try {
        const { bank, iban, head, registry } = req.body;

        const updateSql = `UPDATE society_info SET bank = ?, iban = ?, head = ?, registry = ? WHERE id = ?`;
        await performUpdate(updateSql, [bank, iban, head, registry, 1]);

        return res.status(200).json({ message: "Podatki o društvu so bili uspešno posodobljeni!" });
    }
    catch(error) {
        console.error("Error updating society:", error);
        return res.status(500).json({ error: "Napaka pri posodobitvi podatkov o društvu!" });
    }
}

module.exports = { getLocations, getMileageRates, getSociety, updateMileageRates, updateLocations, updateSociety };

const convertRatesToCents = (details, key) => {
    const updateDetails = details.map((detail) => {
        return { ...detail, [key]: detail[key] * 100 };
    });
    return updateDetails;
}
