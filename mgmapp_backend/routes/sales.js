const express = require('express');
const router = express.Router();

const { getSales, postSale, getSale, putSale } = require('../controllers/salesController');

router.route('/')
    .get(getSales)
    .post(postSale);
    
router.route('/:id')
    .get(getSale)
    .put(putSale);

module.exports = router;