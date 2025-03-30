const express = require('express');
const router = express.Router();

const { getLocations, getMileageRates, getSociety, updateMileageRates, updateLocations, updateSociety } = require('../controllers/dataController');

router.get('/locations', getLocations);
router.get('/mileage-rates', getMileageRates);
router.get('/society/:id', getSociety);

router.put('/mileage-rates', updateMileageRates);
router.put('/locations', updateLocations);
router.put('/society/:id', updateSociety);

module.exports = router;