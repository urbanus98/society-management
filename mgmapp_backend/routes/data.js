const express = require('express');
const router = express.Router();

const { getLocations, getMileageRates, updateMileageRates, updateLocations } = require('../controllers/dataController');

router.get('/locations', getLocations);
router.get('/mileage-rates', getMileageRates);

router.put('/mileage-rates', updateMileageRates);
router.put('/locations', updateLocations);

module.exports = router;