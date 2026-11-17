import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import authRouteur from "./Routes/Auth.js";
import categoryRouter from "./Routes/Category.js";
import productRouter from "./Routes/Products.js";

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRouteur);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serveur lancé avec succès sur le port ${PORT}`);
});
