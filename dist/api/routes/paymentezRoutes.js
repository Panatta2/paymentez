"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentezController_1 = require("../controllers/paymentezController");
const router = (0, express_1.Router)();
router.get("/process-payment", paymentezController_1.process_payment);
exports.default = router;
