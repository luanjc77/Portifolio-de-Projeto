const express = require("express");
const router = express.Router();
const db = require("../db");

/*
 * GET /api/narrador/fala/:etapa
 * Retorna a fala correta baseada na etapa e progresso do usuário
 * Query params: userId, tela (opcional)
 */
router.get("/fala/:etapa", async (req, res) => {
  const { etapa } = req.params;
  const userId = req.query.userId;
  const telaAtual = req.query.tela; // Nova validação de tela

  try {
    // Sempre usa a etapa enviada (não busca do banco)
    // O frontend já envia a etapa_atual correta
    const chaveEvento = etapa;

    // Buscar fala por chave_evento, com validação opcional de tela
    let query = `
      SELECT fala, resposta_correta, tela_permitida 
      FROM falas_narrador
      WHERE chave_evento = $1
    `;
    
    const params = [chaveEvento];

    // Se tela foi informada, validar
    if (telaAtual) {
      query += ` AND (tela_permitida IS NULL OR tela_permitida = $2)`;
      params.push(telaAtual);
    }

    query += ` ORDER BY ordem`;

    const q = await db.query(query, params);

    if (!q.rows.length) {
      if (telaAtual) {
        console.log(`⚠️ Nenhuma fala encontrada para etapa "${chaveEvento}" na tela "${telaAtual}"`);
        return res.json({
          success: false,
          message: `Esta fala não está disponível na tela atual (${telaAtual})`,
          fala: { etapa: chaveEvento, fala: "" }
        });
      }
      
      return res.json({
        success: true,
        fala: { etapa: chaveEvento, fala: "Nenhuma fala configurada para esta etapa." }
      });
    }

    // Filtrar valores null/undefined e concatenar falas
    const fala = q.rows
      .map(f => f.fala)
      .filter(f => f != null && f !== undefined && f !== 'null' && f.trim() !== '')
      .join("\n\n")
      .trim(); // Remove espaços extras no início/fim

    const telaPermitida = q.rows[0].tela_permitida;
    console.log(`📖 Fala carregada para ${chaveEvento} (tela: ${telaPermitida || 'todas'}):`, fala.substring(0, 50) + '...');

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

      // Mapear etapa → código de conquista e próxima etapa
      const conquistasPorEtapa = {
        'lab01_pergunta1': 'lab01_concluido',
        'lab02_pergunta1': 'lab02_concluido'
      };

      const proximaEtapaPorLab = {
        'lab02_pergunta1': 'antes_acesso_profundezas'
      };

      const conquistaCodigo = conquistasPorEtapa[etapa] || fala.conquista_codigo;
      const proximaEtapa = proximaEtapaPorLab[etapa];

      // Dar conquista
      if (conquistaCodigo) {
        const c = await db.query(`
          SELECT id FROM conquistas WHERE codigo = $1
        `, [conquistaCodigo]);

        if (c.rows.length) {
          await db.query(`
            INSERT INTO conquistas_usuario (usuario_id, conquista_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
          `, [usuario_id, c.rows[0].id]);
          
          console.log(`✅ Conquista ${conquistaCodigo} dada ao usuário ${usuario_id}`);
        } else {
          console.log(`⚠️ Conquista ${conquistaCodigo} não encontrada no banco`);
        }
      }

      // Atualizar etapa do usuário se definida
      if (proximaEtapa) {
        await db.query(`
          UPDATE usuarios
          SET etapa_atual = $1
          WHERE id = $2
        `, [proximaEtapa, usuario_id]);
        
        console.log(`✅ Etapa atualizada para ${proximaEtapa} - usuário ${usuario_id}`);
      }

      // Buscar vidas atuais do usuário
      const vidasQuery = await db.query(`
        SELECT vidas FROM usuarios WHERE id = $1
      `, [usuario_id]);
      
      const vidasAtuais = vidasQuery.rows[0]?.vidas || 100;

      return res.json({
        success: true,
        correta: true,
        mensagem: "Resposta correta!",
        nova_etapa: proximaEtapa || null,
        vidas: vidasAtuais
      });
    }

    // ERRADA → perde 10 de vida
    const updateVida = await db.query(`
      UPDATE usuarios
      SET vidas = GREATEST(COALESCE(vidas, 100) - 10, 0)
      WHERE id = $1
      RETURNING vidas
    `, [usuario_id]);

    const vidasRestantes = updateVida.rows[0]?.vidas || 0;
    console.log(`❌ Resposta errada! Usuário ${usuario_id} perdeu 10 de vida. Vidas restantes: ${vidasRestantes}`);

    return res.json({
      success: true,
      correta: false,
      mensagem: "Resposta incorreta. Você perdeu 10 de vida.",
      vidas: vidasRestantes
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
  const { usuario_id } = req.query;

  try {
    const q = await db.query(`
      SELECT dica FROM dicas_narrador
      WHERE etapa = $1 LIMIT 1
    `, [etapa]);

    if (!q.rows.length)
      return res.json({ success: false, dica: "Nenhuma dica disponível." });

    // Incrementar dicas_usadas se usuario_id foi fornecido
    if (usuario_id) {
      await db.query(`
        UPDATE usuarios 
        SET dicas_usadas = COALESCE(dicas_usadas, 0) + 1
        WHERE id = $1
      `, [usuario_id]);
    }

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
