const express = require("express");
const memberController = require("../controllers/member.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRole } = require("../middlewares/role.middleware");

const router = express.Router();

router.get("/dashboard", authenticate, authorizeRole(['user']), memberController.dashboard);
router.get("/classes", authenticate, authorizeRole(['user']), memberController.classes);
router.get("/classes/:id", authenticate, authorizeRole(['user']), memberController.classDetail);
router.get("/sports", authenticate, authorizeRole(['user']), memberController.sports);
router.get("/rooms", authenticate, authorizeRole(['user']), memberController.rooms);

module.exports = router;
