const express = require('express');
const router = express.Router();

const { getEvents, getEventTypes, postEvent, getEvent, getEventIDs, putEvent } = require('../controllers/eventController');

// ** EVENTS **

router.get('/', getEvents);
router.post('/', postEvent);

router.get('/types', getEventTypes);

router.get('/:id', getEvent);
router.put('/:id', putEvent);

router.get('/ids/:id', getEventIDs);


module.exports = router;