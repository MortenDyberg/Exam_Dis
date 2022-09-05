const express = require('express');
const router = express.Router();
const controllers = require('../controllers/accountControllers.js');

router.get('/', controllers.getAccounts);

router.post('/', controllers.postAccount);

router.get('/:id', controllers.getAccount);

router.put('/transfer', controllers.putTransfer);

router.put('/:id', controllers.putBalance);

router.delete('/:id', controllers.deleteAccount);

router.get('/:id/balance', controllers.getBalance);


module.exports = router;