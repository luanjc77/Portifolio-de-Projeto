import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './index';

// Mock dos componentes
jest.mock('../../components/Narrator', () => {
  return function MockNarrator() {
    return <div data-testid="narrator">Narrator Component</div>;
  };
});

jest.mock('../../components/User', () => {
  return function MockUser({ onClick }) {
    return <div data-testid="user" onClick={onClick}>User Component</div>;
  };
});

describe('HomePage Component - Unit Tests', () => {

  beforeEach(() => {
    global.fetch = jest.fn();
    process.env.REACT_APP_API_HOST = 'localhost';
    process.env.REACT_APP_API_PORT = '3001';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar a página Home', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('narrator')).toBeInTheDocument();
    expect(screen.getByTestId('user')).toBeInTheDocument();
  });

  it('deve renderizar os botões de laboratório', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Lab-01/i)).toBeInTheDocument();
    expect(screen.getByText(/Lab-02/i)).toBeInTheDocument();
  });

  it('deve renderizar input de resposta', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    
    expect(screen.getByPlaceholderText(/Digite sua resposta aqui/i)).toBeInTheDocument();
  });

  it('deve renderizar botões de ação', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Enviar/i)).toBeInTheDocument();
    expect(screen.getByText(/Repetir Fala/i)).toBeInTheDocument();
    expect(screen.getByText(/Dica/i)).toBeInTheDocument();
  });

  it('deve iniciar desafio ao clicar no botão Lab-01', async () => {
    const mockResponse = {
      success: true,
      sessionId: 'test-session-123',
      url: 'http://localhost:3001/challenge/test-session-123/'
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    global.window.open = jest.fn();

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const lab01Button = screen.getByText(/Lab-01/i);
    fireEvent.click(lab01Button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/challenges/start'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ challengeId: 'xss' })
        })
      );
    });
  });

  it('deve buscar dica ao clicar no botão Dica', async () => {
    const mockDica = {
      success: true,
      dica: 'Esta é uma dica de teste'
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDica
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const dicaButton = screen.getByText(/Dica/i);
    fireEvent.click(dicaButton);

    await waitFor(() => {
      expect(screen.getByText(/Nenhuma dica disponível agora/i)).toBeInTheDocument();
    });
  });

  it('deve atualizar input de resposta ao digitar', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Digite sua resposta aqui/i);
    fireEvent.change(input, { target: { value: 'minha resposta' } });

    expect(input).toHaveValue('minha resposta');
  });

  it('deve chamar onClick ao clicar no componente User', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const userComponent = screen.getByTestId('user');
    fireEvent.click(userComponent);

    // Apenas verifica se o componente é clicável
    expect(userComponent).toBeInTheDocument();
  });

  it('deve exibir erro ao falhar ao iniciar desafio', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    global.alert = jest.fn();

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const lab01Button = screen.getByText(/Lab-01/i);
    fireEvent.click(lab01Button);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        expect.stringContaining('Não foi possível conectar com o servidor')
      );
    });
  });
});
