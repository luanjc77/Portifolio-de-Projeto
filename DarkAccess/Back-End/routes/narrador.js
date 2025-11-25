const express = require("express");
const router = express.Router();
const db = require("../db");

/*
 * GET /api/narrador/fala/:etapa
 * Retorna a fala correta baseada na etapa e progresso do usuário
 */
router.get("/fala/:etapa", async (req, res) => {
  const { etapa } = req.params;
  const userId = req.query.userId;

  try {
    // Sempre usa a etapa enviada (não busca do banco)
    // O frontend já envia a etapa_atual correta
    const chaveEvento = etapa;

    // Buscar fala por chave_evento
    const q = await db.query(`
      SELECT fala, resposta_correta FROM falas_narrador
      WHERE chave_evento = $1
      ORDER BY ordem
    `, [chaveEvento]);

    if (!q.rows.length) {
      return res.json({
        success: true,
        fala: { etapa: chaveEvento, fala: "Nenhuma fala configurada para esta etapa." }
      });
    }

    const fala = q.rows.map(f => f.fala).join("\n\n");

    res.json({
      success: true,
      fala: {
        etapa: chaveEvento,
        fala,
        resposta_correta: q.rows[0].resposta_correta || null
      }
    });

  } catch (err) {
    console.error("Erro narrador GET:", err);
    res.status(500).json({ success: false, message: "Erro no servidor." });
  }
});

/*
 * POST /api/narrador/resposta
 */
router.post("/resposta", async (req, res) => {
  const { etapa, resposta, usuario_id } = req.body;

  if (!etapa || !usuario_id)
    return res.status(400).json({ success: false, message: "Parâmetros inválidos" });

  try {
    const q = await db.query(`
      SELECT resposta_correta, conquista_codigo
      FROM falas_narrador
      WHERE chave_evento = $1
      ORDER BY ordem LIMIT 1
    `, [etapa]);

    if (!q.rows.length)
      return res.status(404).json({ success: false, message: "Etapa não encontrada." });

    const fala = q.rows[0];

    // CORRETA
    if (fala.resposta_correta?.toLowerCase() === resposta.toLowerCase()) {

      // Dar conquista
      if (fala.conquista_codigo) {
        const c = await db.query(`
          SELECT id FROM conquistas WHERE codigo = $1
        `, [fala.conquista_codigo]);

        if (c.rows.length) {
          await db.query(`
            INSERT INTO conquistas_usuario (usuario_id, conquista_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
          `, [usuario_id, c.rows[0].id]);
        }
      }

      return res.json({
        success: true,
        correta: true,
        mensagem: "Resposta correta!"
      });
    }

    // ERRADA → perde vida
    await db.query(`
      UPDATE usuarios
      SET vidas = GREATEST(COALESCE(vidas, 3) - 1, 0)
      WHERE id = $1
    `, [usuario_id]);

    return res.json({
      success: true,
      correta: false,
      mensagem: "Resposta incorreta. Você perdeu uma vida."
    });

  } catch (err) {
    console.error("Erro POST resposta:", err);
    res.status(500).json({ success: false, message: "Erro no servidor." });
  }
});

/*
 * GET /api/narrador/dica/:etapa
 */
router.get("/dica/:etapa", async (req, res) => {
  const { etapa } = req.params;

  try {
    const q = await db.query(`
      SELECT dica FROM dicas_narrador
      WHERE etapa = $1 LIMIT 1
    `, [etapa]);

    if (!q.rows.length)
      return res.json({ success: false, dica: "Nenhuma dica disponível." });

    res.json({ success: true, dica: q.rows[0].dica });

  } catch (err) {
    console.error("Erro GET dica:", err);
    res.status(500).json({ success: false, dica: "Erro no servidor." });
  }
});

/*
 * PUT /api/narrador/etapa
 * Atualiza a etapa_atual do usuário
 */
router.put("/etapa", async (req, res) => {
  const { usuario_id, nova_etapa } = req.body;

  if (!usuario_id || !nova_etapa)
    return res.status(400).json({ success: false, message: "Parâmetros inválidos" });

  try {
    await db.query(`
      UPDATE usuarios
      SET etapa_atual = $1, primeiro_acesso = false
      WHERE id = $2
    `, [nova_etapa, usuario_id]);

    res.json({ success: true, message: "Etapa atualizada com sucesso." });

  } catch (err) {
    console.error("Erro ao atualizar etapa:", err);
    res.status(500).json({ success: false, message: "Erro no servidor." });
  }
});

module.exports = router;
