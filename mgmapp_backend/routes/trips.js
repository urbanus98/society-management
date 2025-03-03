const express = require('express');
const router = express.Router();

const { postTrips, getTrips, getTripRows, putTrips, getTripCostByUser } = require('../controllers/tripsController');

router.get('/costs', getTripCostByUser);
router.get('/', getTripRows);

router.post('/', postTrips);
router.get('/:id', getTrips);
router.put('/:id', putTrips);

module.exports = router;