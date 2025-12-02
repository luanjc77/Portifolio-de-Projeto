import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Register from './index';

describe('Register Component - Unit Tests', () => {

  beforeEach(() => {
    global.fetch = jest.fn();
    process.env.REACT_APP_API_HOST = 'localhost';
    process.env.REACT_APP_API_PORT = '3001';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o formulário de registro', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    
    expect(screen.getByPlaceholderText(/Nome de usuário/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Senha/i)).toBeInTheDocument();
  });

  it('deve atualizar os campos ao digitar', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText(/Nome de usuário/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Senha/i);

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput).toHaveValue('newuser');
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('deve fazer registro com sucesso', async () => {
    const mockResponse = {
      success: true,
      user: { id: 1, username: 'newuser' }
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    global.alert = jest.fn();

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText(/Nome de usuário/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Senha/i);
    const submitButton = screen.getByRole('button', { name: /Cadastrar/i });

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/register'),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  it('deve ter link para página de login', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const loginLink = screen.getByText(/Já tem uma conta/i);
    expect(loginLink).toBeInTheDocument();
  });
});
