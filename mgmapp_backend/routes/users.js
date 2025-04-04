const express = require('express');
const router = express.Router();

const { getUsers, getUser, putUser } = require('../controllers/usersController');

router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', putUser);

module.exports = router;