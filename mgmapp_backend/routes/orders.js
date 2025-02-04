const express = require('express');
const router = express.Router();

const { getOrders, postOrders, getOrder, putOrder } = require('../controllers/ordersController');

router.get('/', getOrders);
router.post('/', postOrders);

router.get('/:id', getOrder);
router.put('/:id', putOrder);

module.exports = router;