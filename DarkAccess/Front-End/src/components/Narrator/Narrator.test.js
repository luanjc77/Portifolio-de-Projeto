import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Narrator from './index';

describe('Narrator Component - Unit Tests', () => {
  
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o componente Narrator', () => {
    render(<Narrator messages={['Olá explorador']} />);
    expect(screen.getByText(/Olá explorador/i)).toBeInTheDocument();
  });

  it('deve exibir mensagem com efeito de digitação', async () => {
    render(<Narrator messages={['Teste']} />);
    await waitFor(() => {
      expect(screen.getByText(/Teste/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('deve buscar fala do narrador quando etapa é fornecida', async () => {
    const mockFala = {
      texto: 'Bem-vindo ao DarkAccess',
      etapa: 'inicio_primeiro_acesso'
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, fala: mockFala })
    });

    const onFalaReady = jest.fn();
    render(<Narrator etapa="inicio_primeiro_acesso" onFalaReady={onFalaReady} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/narrador/fala/inicio_primeiro_acesso')
      );
    });
  });

  it('deve reagir ao repeatTrigger', () => {
    const { rerender } = render(<Narrator messages={['Mensagem inicial']} repeatTrigger={0} />);
    
    rerender(<Narrator messages={['Mensagem inicial']} repeatTrigger={1} />);
    
    expect(screen.getByText(/Mensagem inicial/i)).toBeInTheDocument();
  });

  it('deve tratar erro ao buscar fala', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    render(<Narrator etapa="inicio_primeiro_acesso" />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
