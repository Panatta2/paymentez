import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import paymentezRoutes from "./api/routes/paymentezRoutes";

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use("/api", paymentezRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
