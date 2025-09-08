import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TurmasDropDown from './index';

jest.mock('~/componentes', () => ({
  SelectComponent: jest.fn(({ lista, onChange, ...props }) => {
    const {
      allowClear,
      showSearch,
      valueOption,
      valueText,
      valueSelect,
      ...rest
    } = props;
    const handleChange = e => {
      const value = e.target.value;
      onChange && onChange(value);
    };

    return (
      <select data-testid="SelectComponent" {...rest} onChange={handleChange}>
        {lista?.map((item, idx) => (
          <option key={idx} value={item.valor}>
            {item.desc}
          </option>
        ))}
        <option value="999">Simulação 999</option>
      </select>
    );
  }),
}));

jest.mock('~/servicos/Abrangencia', () => ({
  buscarTurmas: jest.fn(),
}));

import AbrangenciaServico from '~/servicos/Abrangencia';

describe('TurmasDropDown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza com dados fornecidos via prop', () => {
    const dados = [
      { desc: 'Turma 1', valor: '1', nomeFiltro: 'Turma 1' },
      { desc: 'Turma 2', valor: '2', nomeFiltro: 'Turma 2' },
    ];
    render(
      <TurmasDropDown onChange={jest.fn()} dados={dados} label="Turmas" />
    );
    expect(screen.getByTestId('SelectComponent')).toBeInTheDocument();
    expect(screen.getByText('Turma 1')).toBeInTheDocument();
    expect(screen.getByText('Turma 2')).toBeInTheDocument();
  });

  it('busca turmas quando ueId e modalidadeId são fornecidos e dados não', async () => {
    AbrangenciaServico.buscarTurmas.mockResolvedValue({
      data: [{ nome: 'Turma X', codigo: '10', nomeFiltro: 'Turma X' }],
    });
    render(<TurmasDropDown onChange={jest.fn()} ueId="1" modalidadeId="2" />);
    await waitFor(() => {
      expect(AbrangenciaServico.buscarTurmas).toHaveBeenCalledWith('1', '2');
      expect(screen.getByText('Turma X')).toBeInTheDocument();
    });
  });

  it('chama onChangeTurma ao selecionar uma turma', () => {
    const dados = [
      { desc: 'Turma 1', valor: '1', nomeFiltro: 'Turma 1' },
      { desc: 'Turma 2', valor: '2', nomeFiltro: 'Turma 2' },
    ];
    const onChange = jest.fn();
    render(<TurmasDropDown onChange={onChange} dados={dados} label="Turmas" />);
    fireEvent.change(screen.getByTestId('SelectComponent'), {
      target: { value: '2' },
    });
    expect(onChange).toHaveBeenCalledWith('2', 'Turma 2');
  });

  it('desabilita select quando listaTurmas.length === 0 e form existe', () => {
    const form = { setFieldValue: jest.fn() };
    render(<TurmasDropDown onChange={jest.fn()} form={form} dados={[]} />);
    expect(screen.getByTestId('SelectComponent')).toBeDisabled();
  });

  it('desabilita select quando listaTurmas.length === 1 e form existe', () => {
    const form = { setFieldValue: jest.fn() };
    const dados = [
      { desc: 'Turma Única', valor: '99', nomeFiltro: 'Turma Única' },
    ];
    render(<TurmasDropDown onChange={jest.fn()} form={form} dados={dados} />);
    expect(screen.getByTestId('SelectComponent')).toBeDisabled();
  });

  it('seta valor automaticamente e chama onChange quando só há uma turma e form existe', () => {
    const setFieldValue = jest.fn();
    const onChange = jest.fn();
    const dados = [
      { desc: 'Turma Única', valor: '99', nomeFiltro: 'Turma Única' },
    ];
    render(
      <TurmasDropDown
        onChange={onChange}
        form={{ setFieldValue }}
        dados={dados}
      />
    );
    expect(setFieldValue).toHaveBeenCalledWith('turmaId', '99');
    expect(onChange).toHaveBeenCalledWith('99', 'Turma Única');
  });

  it('renderiza com placeholder e props padrão', () => {
    render(<TurmasDropDown />);
    expect(screen.getByTestId('SelectComponent')).toBeInTheDocument();
  });

  it('renderiza select vazio quando não há dados, ueId ou modalidadeId', () => {
    render(<TurmasDropDown onChange={jest.fn()} />);
    expect(screen.getByTestId('SelectComponent').children.length).toBe(1);
  });

  it('não tenta setar valor se form não existe, mesmo com uma turma', () => {
    const dados = [
      { desc: 'Turma Única', valor: '99', nomeFiltro: 'Turma Única' },
    ];
    expect(() => {
      render(<TurmasDropDown onChange={jest.fn()} form={null} dados={dados} />);
    }).not.toThrow();
  });

  it('renderiza select vazio quando dados é array vazio', () => {
    render(<TurmasDropDown onChange={jest.fn()} dados={[]} />);
    expect(screen.getByTestId('SelectComponent').children.length).toBe(1);
  });

  it('mantém listaTurmas vazia quando ueId, modalidadeId e dados não são fornecidos', () => {
    render(<TurmasDropDown onChange={jest.fn()} />);
    expect(screen.getByTestId('SelectComponent').children.length).toBe(1);
  });

  it('chama onChange com nomeTurma vazio quando turma não encontrada', () => {
    const onChange = jest.fn();

    const dados = [{ desc: 'Turma A', valor: '1', nomeFiltro: 'Turma A' }];

    render(<TurmasDropDown onChange={onChange} dados={dados} />);

    fireEvent.change(screen.getByTestId('SelectComponent'), {
      target: { value: '999' },
    });

    expect(onChange).toHaveBeenCalledWith('999', '');
  });

  it('define listaTurmas como vazio quando dados é null', () => {
    render(<TurmasDropDown onChange={jest.fn()} dados={null} />);
    expect(screen.getByTestId('SelectComponent').children.length).toBe(1);
  });

  it('não altera listaTurmas quando serviço retorna data null', async () => {
    AbrangenciaServico.buscarTurmas.mockResolvedValue({
      data: null,
    });

    render(<TurmasDropDown onChange={jest.fn()} ueId="1" modalidadeId="2" />);

    await waitFor(() => {
      expect(AbrangenciaServico.buscarTurmas).toHaveBeenCalledWith('1', '2');
    });

    const options = screen
      .getByTestId('SelectComponent')
      .querySelectorAll('option');
    expect(options.length).toBe(1);
    expect(options[0].value).toBe('999');
  });
});
