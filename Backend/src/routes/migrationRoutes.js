const express = require("express");
const router = express.Router();

const {
  getMigrationTables,
  fetchMigrationRows,
} = require("../controllers/migrationController");

const { authenticateAdmin } = require("../middlewares/authenticateAdmin");

router.get("/tables", getMigrationTables);
router.get("/fetch/:tableKey", fetchMigrationRows);

module.exports = router;