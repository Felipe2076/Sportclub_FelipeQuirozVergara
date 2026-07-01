const express = require("express");
const reservationController = require("../controllers/reservation.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRole } = require("../middlewares/role.middleware");

const router = express.Router();

router.get("/", authenticate, authorizeRole(['admin']), reservationController.index);
router.get("/my-reservations", authenticate, authorizeRole(['user']), reservationController.myReservations);
router.post("/", authenticate, authorizeRole(['user']), reservationController.store);
router.patch("/:id/cancel", authenticate, reservationController.cancel);

module.exports = router;
