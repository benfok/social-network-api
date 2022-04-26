const router = require('express').Router();
const { exists } = require('../models/User');
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

router.use((req, res) => res.send(`This route doesn't exist. Please double check the URL`)); // handle any erroneous routes

module.exports = router;