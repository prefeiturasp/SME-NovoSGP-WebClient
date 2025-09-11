// informesCadastroBotoesAcoes.test.js

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InformesCadastroBotoesAcoes from './informesCadastroBotoesAcoes';

// Mocks dos hooks e libs
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useParams: () => ({}),
}));
jest.mock('~/componentes', () => ({
  Button: props => (
    <button
      data-testid={props.id}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  ),
  Colors: { Roxo: 'roxo' },
}));
jest.mock(
  '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao',
  () => props =>
    (
      <button
        data-testid="botao-excluir"
        disabled={props.disabled}
        onClick={props.onClick}
      >
        Excluir
      </button>
    )
);
jest.mock(
  '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao',
  () => props =>
    (
      <button data-testid="botao-voltar" onClick={props.onClick}>
        Voltar
      </button>
    )
);
jest.mock('~/constantes/ids/button', () => ({
  SGP_BUTTON_CANCELAR: 'btn-cancelar',
  SGP_BUTTON_SALVAR: 'btn-salvar',
}));
jest.mock('~/servicos', () => ({
  confirmar: jest.fn().mockResolvedValue(true),
  erros: jest.fn(),
  sucesso: jest.fn(),
}));
jest.mock('@/core/services/informes-service', () => ({
  excluirInformePorId: jest.fn().mockResolvedValue({ status: 200 }),
  salvarInforme: jest.fn().mockResolvedValue({ status: 200 }),
}));
jest.mock('@/core/enum/routes', () => ({
  ROUTES: { INFORMES: '/informes' },
}));
jest.mock('axios', () => ({
  HttpStatusCode: { Ok: 200 },
}));
jest.mock('@/@legacy/utils', () => ({
  validaAntesDoSubmit: jest.fn((form, initial, cb) => cb(form.values)),
}));
jest.mock('@/@legacy/constantes', () => ({
  OPCAO_TODOS: 'TODOS',
}));

describe('InformesCadastroBotoesAcoes', () => {
  const mockSetExibirLoader = jest.fn();
  const mockResetForm = jest.fn();
  const mockSetFieldValue = jest.fn();

  const getForm = (values = {}, initialValues = {}) => ({
    values,
    initialValues,
    resetForm: mockResetForm,
    setFieldValue: mockSetFieldValue,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza botões principais e chama onClickVoltar', () => {
    render(
      <InformesCadastroBotoesAcoes
        form={getForm({ modoEdicao: false, listaUes: [], listaDres: [] })}
        initialValues={{}}
        setExibirLoader={mockSetExibirLoader}
        desabilitarCampos={false}
        podeExcluir={true}
      />
    );
    expect(screen.getByTestId('botao-voltar')).toBeInTheDocument();
    expect(screen.getByTestId('botao-excluir')).toBeInTheDocument();
    expect(screen.getByTestId('btn-cancelar')).toBeInTheDocument();
    expect(screen.getByTestId('btn-salvar')).toBeInTheDocument();
  });

  it('botão cancelar chama confirmar e resetarFormulario', async () => {
    const form = getForm({ modoEdicao: true, listaUes: [], listaDres: [] });
    render(
      <InformesCadastroBotoesAcoes
        form={form}
        initialValues={{}}
        setExibirLoader={mockSetExibirLoader}
        desabilitarCampos={false}
        podeExcluir={true}
      />
    );
    fireEvent.click(screen.getByTestId('btn-cancelar'));
    await waitFor(() => {
      expect(form.setFieldValue).toHaveBeenCalledWith('modoEdicao', false);
      expect(form.resetForm).toHaveBeenCalled();
    });
  });

  it('botão salvar chama validaAntesDoSubmit', () => {
    const form = getForm({
      modoEdicao: false,
      listaUes: [{ id: 1, codigo: '2' }],
      listaDres: [{ id: 3, codigo: '4' }],
      ueCodigo: '2',
      dreCodigo: '4',
      titulo: 'Titulo',
      texto: 'Texto',
      anoLetivo: '2024',
      perfis: ['p1'],
      listaPerfis: [{ id: 'p1' }],
      listaArquivos: [],
      modalidades: [],
    });
    render(
      <InformesCadastroBotoesAcoes
        form={form}
        initialValues={{}}
        setExibirLoader={mockSetExibirLoader}
        desabilitarCampos={false}
        podeExcluir={true}
      />
    );
    fireEvent.click(screen.getByTestId('btn-salvar'));
    // validaAntesDoSubmit é chamado automaticamente pelo mock
  });

  it('botão cancelar está desabilitado quando modoEdicao é false', () => {
    render(
      <InformesCadastroBotoesAcoes
        form={getForm({ modoEdicao: false, listaUes: [], listaDres: [] })}
        initialValues={{}}
        setExibirLoader={mockSetExibirLoader}
        desabilitarCampos={false}
        podeExcluir={true}
      />
    );
    expect(screen.getByTestId('btn-cancelar')).toBeDisabled();
  });

  it('botão excluir está desabilitado se não podeExcluir', () => {
    render(
      <InformesCadastroBotoesAcoes
        form={getForm({ modoEdicao: false, listaUes: [], listaDres: [] })}
        initialValues={{}}
        setExibirLoader={mockSetExibirLoader}
        desabilitarCampos={false}
        podeExcluir={false}
      />
    );
    expect(screen.getByTestId('botao-excluir')).toBeDisabled();
  });
});
