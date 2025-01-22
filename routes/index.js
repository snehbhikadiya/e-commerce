// routes/index.js
const express = require('express');
const router = express.Router();
const auth = require('./auth');
const dashboard = require('./dashboard');
const admin = require('./admin');

router.use('/', auth);
router.use('/', dashboard);
router.use('/', admin);

module.exports = router;
