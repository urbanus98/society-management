const express = require('express');
const router = express.Router();

const { getEntities, getEntitiesRow, postEntity, getEntity, putEntity } = require('../controllers/entityController');

router.get('/row', getEntitiesRow);

router.get('/', getEntities);
router.post('/', postEntity);

router.get('/:id', getEntity);
router.put('/:id', putEntity);

module.exports = router;

