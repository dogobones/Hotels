const router = require('express').Router();
const path = require('path');

const customerController = require(path.join('..','controllers','customerController'));

router.get('/', customerController.list);
router.post('/add', customerController.save);
router.get('/update/:id', customerController.edit);
router.post('/update/:id', customerController.update);
router.get('/delete/:id', customerController.delete);

const dashboardController = require(path.join('..','controllers','dashboardController'));

router.get('/editsite', dashboardController.editsite);
//router.post('/salvarMovimientos', dashboardController.salvarMovimientos);

module.exports = router;
