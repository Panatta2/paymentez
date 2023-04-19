import { Router } from "express";
import { process_payment } from "../controllers/paymentezController";

const router = Router();

router.get("/process-payment", process_payment);

export default router;
