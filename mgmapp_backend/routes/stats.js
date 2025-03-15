const express = require('express');
const router = express.Router();

const { getYearlyEventStats, getYears, getSizeSales, getYearlyTrafficStats, getMonthlyBalances, getMileages, getSalesProfitByYear, getMZZFunds } = require('../controllers/statsController');

router.get('/years', getYears);
router.get('/mileage', getMileages);
router.get('/traffic', getYearlyTrafficStats);
router.get('/sales-profit', getSalesProfitByYear);
router.get('/sizes', getSizeSales)
router.get('/mzz', getMZZFunds)

router.get('/:year/monthly-balances', getMonthlyBalances);
router.get('/:year/event', getYearlyEventStats);


module.exports = router;