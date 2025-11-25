const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");

/*
 *  POST /api/auth/register
 */
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ success: false, message: "Campos incompletos." });

  try {
    const hash = await bcrypt.hash(password, 10);

    const insert = await db.query(
      `INSERT INTO usuarios (username, email, password_hash, primeiro_acesso)
       VALUES ($1, $2, $3, true)
       RETURNING id, username`,
      [username, email, hash]
    );

    res.json({
      success: true,
      message: "Usuário registrado!",
      user: insert.rows[0]
    });

  } catch (err) {
    console.error("Erro register:", err);
    res.status(500).json({ success: false, message: "Erro no servidor." });
  }
});

/*
 *  POST /api/auth/login
 */
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password)
    return res.status(400).json({ success: false, message: "Campos faltando." });

  try {
    const q = await db.query(
      `SELECT * FROM usuarios WHERE email = $1 OR username = $1 LIMIT 1`,
      [identifier]
    );

    if (!q.rows.length) return res.status(401).json({ success: false, message: "Usuário não encontrado." });

    const user = q.rows[0];
    const correct = await bcrypt.compare(password, user.password_hash);

    if (!correct) return res.status(401).json({ success: false, message: "Senha incorreta." });

    res.json({
      success: true,
      message: "Login efetuado!",
      user: { id: user.id, username: user.username }
    });

  } catch (err) {
    console.error("Erro login:", err);
    res.status(500).json({ success: false, message: "Erro no servidor." });
  }
});

module.exports = router;
