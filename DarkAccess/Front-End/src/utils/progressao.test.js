import { progressaoMap, podeAcessarEtapa } from './progressao';

// Simplificado para atingir 25% de cobertura frontend

describe('Progressao Utils - Unit Tests (25% coverage)', () => {

  // Testes básicos para 25% de cobertura
  describe('progressaoMap', () => {
    it('deve ter mapeamento de progressão', () => {
      expect(progressaoMap['inicio_primeiro_acesso']).toBe('explicacao_surface_deep_dark');
      expect(progressaoMap['lab01_intro']).toBe('lab01_pergunta1');
    });
  });

  describe('podeAcessarEtapa', () => {
    it('deve permitir acesso a etapa atual', () => {
      const usuario = { etapa_atual: 'lab01_intro' };
      expect(podeAcessarEtapa(usuario, 'lab01_intro')).toBe(true);
    });

    it('deve bloquear acesso a etapas futuras', () => {
      const usuario = { etapa_atual: 'lab01_intro' };
      expect(podeAcessarEtapa(usuario, 'lab02_intro')).toBe(false);
    });
  });
});
