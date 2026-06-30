const express = require("express");
const coachController = require("../controllers/coach.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRole } = require("../middlewares/role.middleware");

const router = express.Router();

router.get("/my-classes", authenticate, authorizeRole(['coach']), coachController.myClasses);
router.get("/my-schedules", authenticate, authorizeRole(['coach']), coachController.mySchedules);
router.get("/my-rooms", authenticate, authorizeRole(['coach']), coachController.myRooms);
router.get("/dashboard", authenticate, authorizeRole(['coach']), coachController.dashboard);

module.exports = router;