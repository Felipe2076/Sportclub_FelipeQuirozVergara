const { Router } = require('express');
const roomController = require("../controllers/room.controller");
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeRole } = require('../middlewares/role.middleware');

const router = Router();

router.use(authenticate);
router.use(authorizeRole(['admin']));
router.get("/", roomController.index);
router.get("/:id", roomController.show);
router.post("/", roomController.store);
router.put("/:id", roomController.update);
router.delete("/:id", roomController.destroy);

module.exports = router;