const {Router} = require('express');

const router = Router();

const {getEmployees,createEmployee} = require('../controllers/index.controller');

router.get('/employees',getEmployees);
router.post('/employees',createEmployee);

module.exports = router;