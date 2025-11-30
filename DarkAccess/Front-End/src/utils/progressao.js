// Mapeamento de progressão das etapas do narrador
export const progressaoMap = {
  'inicio_primeiro_acesso': 'explicacao_surface_deep_dark',
  'explicacao_surface_deep_dark': 'lab01_intro',
  'lab01_intro': 'lab01_pergunta1',
  'lab01_pergunta1': 'lab02_intro',
  'lab02_intro': 'lab02_pergunta1',
  'lab02_pergunta1': 'antes_acesso_profundezas',
  'antes_acesso_profundezas': 'phishing_armadilha_aurora',
};

/**
 * Atualiza a etapa do usuário no backend
 * @param {string} usuario_id - ID do usuário
 * @param {string} nova_etapa - Nova etapa a ser definida
 * @returns {Promise<boolean>} - True se sucesso
 */
export async function atualizarEtapa(usuario_id, nova_etapa) {
  if (!usuario_id || !nova_etapa) return false;

  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;
  const API_URL = `http://${API_HOST}:${API_PORT}`;

  try {
    const response = await fetch(`${API_URL}/api/narrador/etapa`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_id, nova_etapa }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Erro ao atualizar etapa:", error);
    return false;
  }
}

/**
 * Avança para a próxima etapa baseado na etapa atual
 * @param {object} usuario - Objeto do usuário
 * @returns {Promise<string|null>} - Nova etapa ou null
 */
export async function avancarEtapa(usuario) {
  if (!usuario?.id || !usuario?.etapa_atual) {
    return null;
  }

  const proximaEtapa = progressaoMap[usuario.etapa_atual];
  
  if (!proximaEtapa) {
    return null;
  }

  const sucesso = await atualizarEtapa(usuario.id, proximaEtapa);
  
  if (sucesso) {
    // Atualizar localStorage
    const userAtualizado = { ...usuario, etapa_atual: proximaEtapa, primeiro_acesso: false };
    localStorage.setItem('user', JSON.stringify(userAtualizado));
    return proximaEtapa;
  }

  return null;
}

/**
 * Verifica se o usuário pode acessar uma etapa específica
 * @param {object} usuario - Objeto do usuário
 * @param {string} etapaDesejada - Etapa que deseja acessar
 * @returns {boolean} - True se pode acessar
 */
export function podeAcessarEtapa(usuario, etapaDesejada) {
  if (!usuario?.etapa_atual) return false;

  // Lista de etapas em ordem
  const ordemEtapas = [
    'inicio_primeiro_acesso',
    'inicio_pos_primeiro_acesso',
    'explicacao_surface_deep_dark',
    'lab01_intro',
    'lab01_pergunta1',
    'lab02_intro',
    'lab02_pergunta1',
    'antes_acesso_profundezas',
    'phishing_armadilha_aurora',
  ];

  const indexAtual = ordemEtapas.indexOf(usuario.etapa_atual);
  const indexDesejado = ordemEtapas.indexOf(etapaDesejada);

  // Pode acessar se já passou por essa etapa ou está nela
  return indexAtual >= indexDesejado;
}
