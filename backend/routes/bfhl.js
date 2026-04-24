const express = require('express');
const { handleAnalyze, handleHealthCheck } = require('../controllers/bfhlController');

const router = express.Router();
router.post('/', handleAnalyze);
router.get('/', handleHealthCheck);

module.exports = router;
