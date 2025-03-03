const express = require('express');
const router = express.Router();

const { getBlack, getBlackStatus, getBlackChart, createBlackRecord, getABlackFlow, updateBlackFlowAndDebt } = require('../controllers/blackController');

router.get('/', getBlack);
router.get('/status', getBlackStatus);
router.get('/chart', getBlackChart);
router.post('/flow', createBlackRecord);
router.get('/flow/:id', getABlackFlow);
router.put('/flow/:id', updateBlackFlowAndDebt);

module.exports = router;