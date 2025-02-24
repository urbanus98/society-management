const express = require('express');
const router = express.Router();

const { getSalesRows, postSale, getSale, putSale } = require('../controllers/salesController');

router.route('/')
    .get(getSalesRows)
    .post(postSale);
    
router.route('/:id')
    .get(getSale)
    .put(putSale);

module.exports = router;