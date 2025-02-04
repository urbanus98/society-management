const express = require('express');
const router = express.Router();

const fileUpload = require('../middleware/fileUpload'); // Middleware for file uploads
const { getMerch, postMerch, getMerchItem, putMerch, getStuffTypes } = require('../controllers/merchController');

router.get('/types', getStuffTypes);

router.get('/', getMerch);
router.post('/', fileUpload.single('image'), postMerch);

router.get('/:id', getMerchItem);
router.put('/:id', fileUpload.single('image'), putMerch);


module.exports = router;