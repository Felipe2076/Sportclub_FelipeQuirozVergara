const express = require("express");
const sportRoomController = require("../controllers/sportRoom.controller");
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRole } = require('../middlewares/role.middleware');

const router = express.Router();

router.use(authenticate);
router.use(authorizeRole(['admin']));

router.get("/", sportRoomController.index);
router.get("/:id", sportRoomController.show);
router.post("/", sportRoomController.store);
router.put("/:id", sportRoomController.update);
router.delete("/:id", sportRoomController.destroy);

module.exports = router;
