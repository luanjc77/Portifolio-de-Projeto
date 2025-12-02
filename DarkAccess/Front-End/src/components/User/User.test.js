import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import User from './index';

describe('User Component - Unit Tests', () => {

  it('deve renderizar componente User', () => {
    const { container } = render(<User />);
    expect(container.firstChild).toHaveClass('wrapper');
  });

  it('deve aplicar estilo de vida corretamente', () => {
    const { container } = render(<User life={75} />);
    const lifeCircle = container.querySelector('[style*="--life"]');
    expect(lifeCircle).toBeInTheDocument();
  });

  it('deve renderizar avatar SVG', () => {
    const { container } = render(<User />);
    const avatar = container.querySelector('svg');
    expect(avatar).toBeInTheDocument();
  });

  it('deve chamar onClick quando clicado', () => {
    const handleClick = jest.fn();
    const { container } = render(<User onClick={handleClick} />);
    
    const wrapper = container.firstChild;
    fireEvent.click(wrapper);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('deve aceitar diferentes valores de life', () => {
    const { container } = render(<User life={30} />);
    const lifeCircle = container.querySelector('[style*="--life"]');
    expect(lifeCircle).toBeInTheDocument();
  });

  it('deve renderizar wrapper com classe correta', () => {
    const { container } = render(<User life={50} />);
    const wrapper = container.querySelector('.wrapper');
    expect(wrapper).toBeInTheDocument();
  });
});
