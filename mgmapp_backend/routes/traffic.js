const express = require('express');
const router = express.Router();

const { getTrafficRows, postTraffic, getOneTraffic, putTraffic, getTrafficChart } = require('../controllers/trafficController');

router.get('/chart', getTrafficChart);

router.get('/', getTrafficRows);
router.post('/', postTraffic);

router.get('/:id', getOneTraffic);
router.put('/:id', putTraffic);


module.exports = router;