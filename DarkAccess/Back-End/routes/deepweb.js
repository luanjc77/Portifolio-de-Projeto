const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/access", async (req, res) => {
  const { username, password, ip, userId } = req.body;

  if (!username || !password || !ip)
    return res.status(400).json({ success: false, message: "Campos faltando" });

  const VPN_USER = process.env.VPN_USER;
  const VPN_PASS = process.env.VPN_PASS;
  const VPN_IP = process.env.VPN_IP;

  if (username !== VPN_USER || password !== VPN_PASS || ip !== VPN_IP)
    return res.status(401).json({ success: false, message: "Credenciais inválidas." });

  try {
    await db.query(`
      UPDATE usuarios SET deepweb_access = 'S'
      WHERE id = $1
    `, [userId]);

    res.json({ success: true, message: "Acesso às Profundezas liberado!" });

  } catch (err) {
    console.error("Erro deepweb:", err);
    res.status(500).json({ success: false, message: "Erro no servidor." });
  }
});

module.exports = router;
