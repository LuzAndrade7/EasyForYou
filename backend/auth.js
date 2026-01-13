import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";

export const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

  const hash = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id, name, email",
      [name, email, hash]
    );

    const user = result.rows[0];

    // Crear avatar por defecto (animal 1, nivel 1)
    await pool.query(
      "INSERT INTO avatars (user_id, animal_type, level, xp) VALUES ($1, 1, 1, 0)",
      [user.id]
    );

    res.json({ ok: true, user });
  } catch (e) {
    console.error('Register error:', e);
    if (String(e).includes("duplicate")) return res.status(409).json({ error: "Email already exists" });
    res.status(500).json({ error: "Server error" });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ ok: true, token });
  } catch (e) {
    console.error('Login error:', e.message);
    res.status(500).json({ error: "Server error" });
  }
});
