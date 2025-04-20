const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.use('/register', require('./Auth/register'));
router.use('/events', require('./events'));
router.use('/sales', require('./sales'));
router.use('/invoices', require('./invoices'));
router.use('/proforma', require('./proforma'));
router.use('/entities', require('./entities'));
router.use('/merch', require('./merch'));
router.use('/orders', require('./orders'));
router.use('/traffic', require('./traffic'));
router.use('/debts', require('./debts'));
router.use('/black', require('./black'));
router.use('/data', require('./data'));
router.use('/trips', require('./trips'));
router.use('/stats', require('./stats'));
router.use('/users', require('./users'));

router.get('/dummy', (req, res) => {
    return res.json(1);
});

module.exports = router;