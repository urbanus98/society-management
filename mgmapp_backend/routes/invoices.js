const express = require('express');
const router = express.Router();

const { getInvoices, postInvoice, getInvoice, putInvoice } = require('../controllers/invoiceController');

// router.get('/rows', getInvoices);

router.get('/', getInvoices);
router.post('/', postInvoice);

router.get('/:id', getInvoice);
router.put('/:id', putInvoice);

module.exports = router;