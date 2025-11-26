const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");

/*
 * GET /api/auth/user/:id
 * Retorna informações completas do usuário incluindo conquistas
 */
router.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const userQuery = await db.query(
      `SELECT id, username, email, primeiro_acesso, etapa_atual, deepweb_access, vidas
       FROM usuarios WHERE id = $1`,
      [id]
    );

    if (!userQuery.rows.length)
      return res.status(404).json({ success: false, message: "Usuário não encontrado." });

    const user = userQuery.rows[0];

    // Buscar conquistas do usuário
    console.log(`🔍 Buscando conquistas para usuário ${id}...`);
    
    try {
      const conquistasQuery = await db.query(
        `SELECT c.id, c.nome, c.codigo
         FROM conquistas c
         INNER JOIN conquistas_usuario cu ON c.id = cu.conquista_id
         WHERE cu.usuario_id = $1
         ORDER BY c.id DESC`,
        [id]
      );
      
      console.log(`✅ Query executada com sucesso!`);
      console.log(`🏆 Total de conquistas encontradas: ${conquistasQuery.rows.length}`);
      console.log(`📋 Conquistas retornadas:`, conquistasQuery.rows);
      
      user.conquistas = conquistasQuery.rows;
      
    } catch (conquistaErr) {
      console.error(`❌ ERRO ao buscar conquistas para usuário ${id}:`, conquistaErr.message);
      console.error(`Stack:`, conquistaErr.stack);
      user.conquistas = [];
    }

    // Garantir valores padrão
    user.vidas = user.vidas || 3;

    res.json({
      success: true,
      user
    });

  } catch (err) {
    console.error("Erro ao buscar usuário:", err);
    console.error("Stack:", err.stack);
    res.status(500).json({ success: false, message: "Erro no servidor: " + err.message });
  }
});

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
      `INSERT INTO usuarios (username, email, password_hash, primeiro_acesso, etapa_atual)
       VALUES ($1, $2, $3, true, 'inicio_primeiro_acesso')
       RETURNING id, username, primeiro_acesso, etapa_atual`, //ajustar depois
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

    // Atualizar etapa se for retorno de usuário
    if (!user.primeiro_acesso && user.etapa_atual === 'inicio_primeiro_acesso') {
      await db.query(
        `UPDATE usuarios SET etapa_atual = 'inicio_pos_primeiro_acesso' WHERE id = $1`,
        [user.id]
      );
      user.etapa_atual = 'inicio_pos_primeiro_acesso';
    }

    res.json({
      success: true,
      message: "Login efetuado!",
      user: { 
        id: user.id, 
        username: user.username,
        primeiro_acesso: user.primeiro_acesso,
        etapa_atual: user.etapa_atual
      }
    });

  } catch (err) {
    console.error("Erro login:", err);
    res.status(500).json({ success: false, message: "Erro no servidor." });
  }
});

module.exports = router;
