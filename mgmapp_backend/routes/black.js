const express = require('express');
const router = express.Router();

const { getBlackRows, getBlackStatus, getBlackChart, createBlackRecord, getABlackFlow, deleteBlackFlow, updateBlackFlowAndDebt } = require('../controllers/blackController');

router.get('/', getBlackRows);
router.get('/status', getBlackStatus);
router.get('/chart', getBlackChart);
router.post('/flow', createBlackRecord);
router.get('/flow/:id', getABlackFlow);
router.put('/flow/:id', updateBlackFlowAndDebt);
router.delete('/flow/:id', deleteBlackFlow)

module.exports = router;