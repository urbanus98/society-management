const express = require('express');
const router = express.Router();

const { getDebts, getDebtRows, insertPay, insertDeposit, insertBuy, insertCashout, getDebt, updateDebtAndFlow } = require('../controllers/debtController');

router.get('/', getDebts);
router.get('/rows', getDebtRows);

router.post('/pay', insertPay);
router.post('/deposit', insertDeposit);
router.post('/buy', insertBuy);
router.post('/cashout', insertCashout);

router.get('/:id', getDebt);
router.put('/:id', updateDebtAndFlow);

module.exports = router;

