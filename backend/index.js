import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { authRouter } from "./auth.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/auth", authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API on port", PORT));
