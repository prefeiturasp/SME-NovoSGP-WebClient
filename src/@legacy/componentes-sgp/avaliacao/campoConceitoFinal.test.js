import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CampoConceitoFinal from './campoConceitoFinal';

// Mock do SelectComponent
jest.mock('~/componentes/select', () => ({
  __esModule: true,
  default: ({ id, label, onChange, lista, valueSelect, className }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <select
        data-testid="select-conceito"
        id={id}
        className={className}
        value={valueSelect}
        onChange={e => onChange(e.target.value)}
      >
        {lista.map(item => (
          <option key={item.id} value={item.id}>
            {item.valor}
          </option>
        ))}
      </select>
    </div>
  ),
}));

describe('CampoConceitoFinal', () => {
  const conceitoInicial = {
    notaConceito: '1',
    notaOriginal: '1',
    abaixoDaMedia: false,
    conceitoAlterado: false,
  };

  const listaTiposConceitos = [
    { id: '1', valor: 'Excelente', aprovado: true },
    { id: '2', valor: 'Regular', aprovado: false },
  ];

  const montaNotaConceitoFinal = jest.fn(() => ({ ...conceitoInicial }));
  const onChangeNotaConceitoFinal = jest.fn();
  it('deve renderizar corretamente com valor abaixo da média e alterado', async () => {
    const conceitoAtualizado = {
      notaConceito: '2',
      notaOriginal: '1',
      abaixoDaMedia: true,
      conceitoAlterado: true,
    };

    const montaNotaConceitoFinal = jest.fn(() => ({ ...conceitoAtualizado }));
    const onChangeNotaConceitoFinal = jest.fn();

    render(
      <CampoConceitoFinal
        id="teste-conceito"
        label="Conceito Final"
        listaTiposConceitos={[
          { id: '1', valor: 'Excelente', aprovado: true },
          { id: '2', valor: 'Regular', aprovado: false },
        ]}
        montaNotaConceitoFinal={montaNotaConceitoFinal}
        onChangeNotaConceitoFinal={onChangeNotaConceitoFinal}
        podeEditar={true}
        podeLancarNotaFinal={true}
        desabilitarCampo={false}
      />
    );

    const select = screen.getByTestId('select-conceito');

    // Verifica se já veio com classe border-abaixo-media
    expect(select.className).toMatch(/border-abaixo-media/);
  });
});
