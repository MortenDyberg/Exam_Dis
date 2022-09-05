const express = require('express');
const router = express.Router();
const controllers = require('../controllers/clientControllers.js');

router.get('/', controllers.getClients);

router.post('/', controllers.postClient);

router.get('/:id', controllers.getClient);

router.put('/:id', controllers.putClient);

router.delete('/:id', controllers.deleteClient);


module.exports = router;