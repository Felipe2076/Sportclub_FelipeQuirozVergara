const express = require("express");
const classScheduleController = require("../controllers/classSchedule.controller");
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRole } = require('../middlewares/role.middleware');

const router = express.Router();

router.use(authenticate);
router.use(authorizeRole(['admin']));

router.get("/", classScheduleController.index);
router.get("/:id", classScheduleController.show);
router.post("/", classScheduleController.store);
router.put("/:id", classScheduleController.update);
router.delete("/:id", classScheduleController.destroy);

module.exports = router;
