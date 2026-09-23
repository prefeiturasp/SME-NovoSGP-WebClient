import { render, fireEvent } from '@testing-library/react';
import { ImprimirDescricaoOcorrencia } from './index';

jest.mock('~/componentes', () => ({
  RadioGroupButton: props => (
    <div>
      <span>{props.label}</span>
      {props.opcoes.map(opcao => (
        <button
          key={String(opcao.value)}
          type="button"
          onClick={() => props.onChange(opcao.value)}
        >
          {opcao.label}
        </button>
      ))}
    </div>
  ),
}));

describe('ImprimirDescricaoOcorrencia', () => {
  const form = {
    setFieldValue: jest.fn(),
    setFieldTouched: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('renderiza label e opções Sim/Não', () => {
    const { getByText } = render(<ImprimirDescricaoOcorrencia form={form} />);
    expect(getByText('Imprimir descrição da ocorrência')).toBeInTheDocument();
    expect(getByText('Sim')).toBeInTheDocument();
    expect(getByText('Não')).toBeInTheDocument();
  });

  it('atualiza o form ao selecionar', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <ImprimirDescricaoOcorrencia form={form} onChange={onChange} />
    );
    fireEvent.click(getByText('Sim'));
    expect(form.setFieldValue).toHaveBeenCalledWith('modoEdicao', true);
    expect(form.setFieldValue).toHaveBeenCalledWith(
      'imprimirDescricaoOcorrencia',
      true
    );
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
