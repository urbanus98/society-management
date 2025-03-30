const express = require('express');
const router = express.Router();

const { getProformaRows, postProforma, getProforma, putProforma } = require('../controllers/proformaController');

router.get('/', getProformaRows);
router.post('/', postProforma);

router.get('/:id', getProforma);
router.put('/:id', putProforma);

module.exports = router;