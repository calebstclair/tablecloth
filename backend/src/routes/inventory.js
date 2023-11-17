// inventory.js

// This file defines routes related to inventory operations.

const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// other routes related to inventory operations
router.get('/inventory', inventoryController.getInventory);

// Exporting the router to be used in server.js.
module.exports = router;