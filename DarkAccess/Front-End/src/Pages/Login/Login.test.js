import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Login from './index';

describe('Login Component - Unit Tests', () => {

  beforeEach(() => {
    global.fetch = jest.fn();
    process.env.REACT_APP_API_HOST = 'localhost';
    process.env.REACT_APP_API_PORT = '3001';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o formulário de login', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    
    expect(screen.getByPlaceholderText(/Usuário ou Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
  });

  it('deve atualizar os campos ao digitar', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText(/Usuário ou Email/i);
    const passwordInput = screen.getByPlaceholderText(/Senha/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('password123');
  });

  it('deve fazer login com sucesso', async () => {
    const mockResponse = {
      success: true,
      user: { id: 1, username: 'testuser' }
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText(/Usuário ou Email/i);
    const passwordInput = screen.getByPlaceholderText(/Senha/i);
    const submitButton = screen.getByRole('button', { name: /Entrar/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/login'),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  it('deve exibir erro ao falhar no login', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    global.alert = jest.fn();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText(/Usuário ou Email/i);
    const passwordInput = screen.getByPlaceholderText(/Senha/i);
    const submitButton = screen.getByRole('button', { name: /Entrar/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalled();
    });
  });

  it('deve ter link para página de registro', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const registerLink = screen.getByText(/Cadastre-se/i);
    expect(registerLink).toBeInTheDocument();
  });

  it('deve processar login bem-sucedido', async () => {
    const mockResponse = {
      success: true,
      user: { id: 1, username: 'testuser' }
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText(/Usuário ou Email/i);
    const passwordInput = screen.getByPlaceholderText(/Senha/i);
    const submitButton = screen.getByRole('button', { name: /Entrar/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
