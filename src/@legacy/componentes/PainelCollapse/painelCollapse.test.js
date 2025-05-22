import React from 'react';
import { render } from '@testing-library/react';
import PainelCollapse from './index';

describe('PainelCollapse', () => {
  it('deve renderizar o componente PainelCollapse com filhos', () => {
    const { getByText } = render(
      <PainelCollapse>
        <div>Conteúdo do painel</div>
      </PainelCollapse>
    );
    expect(getByText('Conteúdo do painel')).toBeInTheDocument();
  });

  it('deve renderizar o ícone com estado ativo (seta para cima)', () => {
    const { container } = render(
      <PainelCollapse
        expandIcon={({ isActive }) => (
          <div>
            <i className={`fa fa-chevron-${isActive ? 'up' : 'down'}`}></i>
          </div>
        )}
      >
        <div>Conteúdo</div>
      </PainelCollapse>
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
