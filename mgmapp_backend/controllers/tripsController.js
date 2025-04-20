const { performMassInsert, performMassUpdate, performQuery, performDelete } = require("../services/genericActions");

const getTripRows = async (req, res) => {
    const sql = `
        SELECT 
            locations1.name as origin, 
            locations2.name as destination, 
            locations1.id as oID, 
            locations2.id as dID, 
            trips.mileage,
            users.name as user,
            DATE_FORMAT(events.date, "%d.%m.%Y") as date,
            events.name as event
        FROM trips
            JOIN users ON trips.user_id = users.id
            JOIN events ON trips.event_id = events.id
            JOIN locations AS locations1 ON trips.origin_id = locations1.id
            JOIN locations AS locations2 ON trips.destination_id = locations2.id
        ORDER BY events.date DESC, events.id, users.name
        `;
    const result = await performQuery(sql);
    console.log(result);
    return res.json(result);
}

const postTrips = async (req, res) => {
    try {
        const { details, userId, eventId } = req.body;

        const year = await getEventYear(eventId); // get year from event
        
        var rateId = await getYearRateId(year); // id for year
        if (!rateId) {
            rateId = await createMileageRate(year); // create rate if necessary
        }

        const sql = "INSERT INTO trips (origin_id, destination_id, mileage, user_id, event_id, rate_id) VALUES ?";
        await performMassInsert(sql, details, ['origin', 'destination', 'mileage'], [userId, eventId, rateId]);

        return res.status(201).json({ message: "Poti uspešno vnešene!" });
    } catch (error) {
        console.error("Error inserting data:", error);
        return res.status(500).json({ error: "Napaka pri vnašanju poti!" });
    }
}

const getTrips = async (req, res) => {
    const eventId = req.params.id;
    try {
        const sql = "SELECT * FROM trips WHERE event_id = ?";
        const result = await performQuery(sql, [eventId]);
        return res.json(result);
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Failed to fetch data from the database" });
    }
}

const putTrips = async (req, res) => {
    try {
        const { userId, eventId, details } = req.body;
        console.log(details);
        const oldData = details.filter((detail) => detail.id);
        const newData = details.filter((detail) => !detail.id);
        console.log(oldData);
        console.log(newData);

        // UPDATE EXISTING
        const sqlUpdate = `UPDATE trips SET origin_id = ?, destination_id = ?, mileage = ? WHERE id = ?`;
        await performMassUpdate(sqlUpdate, oldData, ['origin', 'destination', 'mileage', 'id']);

        const year = await getEventYear(eventId); // get year from event
        const rateId = await getYearRateId(year); // id for year

        // FIND EXISTING NOT IN OLD DATA
        const sqlExisting = "SELECT id FROM trips WHERE event_id = ? and user_id = ?";
        const existing = await performQuery(sqlExisting, [eventId, userId]);

        const oldIds = oldData.map((detail) => detail.id);
        const idsToDelete = existing.filter((item) => !oldIds.includes(item.id)).map((item) => item.id); // ids not oin old data

        // INSERT NEW
        const sqlInsert = "INSERT INTO trips (origin_id, destination_id, mileage, user_id, event_id, rate_id) VALUES ?";
        await performMassInsert(sqlInsert, newData, ['origin', 'destination', 'mileage'], [userId, eventId, rateId]);
        
        // DELETE THE REST
        if (idsToDelete.length > 0) {
            const sqlDelete = "DELETE FROM trips WHERE id IN (?)";
            await performDelete(sqlDelete, [idsToDelete]);
        }
        return res.status(200).json({ message: "Poti uspešno posodobljene!" });
    } catch (error) {
        console.error("Error updating data:", error);
        return res.status(500).json({ error: "Napaka pri posodobitvi poti!" });
    }
}

const getTripCostByUser = async (req, res) => {
    try {
        const sql = `
            SELECT 
                SUM((mileage_rates.rate / 100) * trips.mileage) as cost,
                users.name
            FROM trips 
            JOIN mileage_rates ON trips.rate_id = mileage_rates.id
            JOIN users ON trips.user_id = users.id
            GROUP BY users.name
        `;
        const result = await performQuery(sql);
        return res.json(result);
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Failed to fetch data from the database" });
    }
}

module.exports = { getTripRows, postTrips, getTrips, putTrips, getTripCostByUser };

const getEventYear = async (eventId) => {
    const sql = `SELECT DATE_FORMAT(date, "%Y") as year from events where id=${eventId}`;
    const result = await performQuery(sql);
    return result[0].year;
}

const getYearRateId = async (year) => {
    const sql = `SELECT id FROM mileage_rates WHERE year=${year}`;
    const result = await performQuery(sql);
    return result[0] != undefined ? result[0].id : null;
}

const createMileageRate = async (year) => {
    const sqlLastRate = `SELECT rate FROM mileage_rates ORDER BY year DESC LIMIT 1`;
    const lastRateResult = await performQuery(sqlLastRate);
    const lastRate = Number(lastRateResult[0].rate);
    console.log(lastRate);

    const sql = `INSERT INTO mileage_rates (year, rate) VALUES (${year}, ${lastRate})`;
    const result = await performQuery(sql);
    return result.insertId;
}