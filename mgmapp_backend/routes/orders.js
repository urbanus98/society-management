const express = require('express');
const router = express.Router();

const fileUpload = require('../middleware/fileUpload');
const { getOrders, postOrder, getOrder, putOrder } = require('../controllers/ordersController');

router.get('/', getOrders);
router.post('/', fileUpload.single('file'), postOrder);

router.get('/:id', getOrder);
router.put('/:id', fileUpload.single('file'), putOrder);

module.exports = router;