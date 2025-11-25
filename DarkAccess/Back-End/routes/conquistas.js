const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const q = await db.query(`
      SELECT c.codigo, c.nome
      FROM conquistas_usuario cu
      JOIN conquistas c ON c.id = cu.conquista_id
      WHERE cu.usuario_id = $1
    `, [id]);

    res.json({ success: true, conquistas: q.rows });
  } catch (err) {
    console.error("Erro conquistas:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
