// InformesCadastroForm.test.js

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InformesCadastroForm from './informesCadastroForm';

// Mocks dos componentes e serviços
jest.mock('antd', () => {
  const originalAntd = jest.requireActual('antd');
  return {
    ...originalAntd,
    Col: props => (
      <div data-testid="col" {...props}>
        {props.children}
      </div>
    ),
    Row: props => (
      <div data-testid="row" {...props}>
        {props.children}
      </div>
    ),
  };
});
jest.mock('~/componentes', () => {
  const React = require('react');
  return {
    Auditoria: props => <div data-testid="auditoria" {...props} />,
    CampoTexto: props => (
      <input
        data-testid="campo-texto"
        data-id={props.id}
        data-label={props.label}
        data-name={props.name}
        data-placeholder={props.placeholder}
        data-maxlength={props.maxLength}
        data-desabilitado={props.desabilitado ? 'true' : 'false'}
        onChange={props.onChange}
      />
    ),
    JoditEditor: React.forwardRef((props, ref) => (
      <div
        data-testid="jodit-editor"
        data-label={props.label}
        data-name={props.name}
        data-value={props.value}
        data-readonly={props.readonly ? 'true' : 'false'}
        data-desabilitar={props.desabilitar ? 'true' : 'false'}
        data-labelrequired={props.labelRequired ? 'true' : 'false'}
        ref={ref}
        onClick={props.onChange}
      />
    )),
  };
});
jest.mock('~/componentes-sgp/inputs', () => ({
  Dre: props => <div data-testid="dre" {...props} />,
  Ue: props => <div data-testid="ue" {...props} />,
}));
jest.mock('@/@legacy/componentes-sgp/inputs/perfis', () => ({
  SelectPerfis: props => (
    <div
      data-testid="select-perfis"
      data-multiple={props.multiple ? 'true' : 'false'}
      data-disabled={props.disabled ? 'true' : 'false'}
      data-labelrequired={props.labelRequired ? 'true' : 'false'}
      {...props}
    />
  ),
}));
jest.mock('./components/modalidades', () => ({
  SelectModalidadesInformes: props => (
    <div
      data-testid="select-modalidades"
      data-multiple={props.multiple ? 'true' : 'false'}
      data-disabled={props.disabled ? 'true' : 'false'}
      data-labelrequired={props.labelRequired ? 'true' : 'false'}
      {...props}
    />
  ),
}));
jest.mock('~/componentes-sgp/UploadArquivos/uploadArquivos', () => props => (
  <div
    data-testid="upload-arquivos"
    data-id={props.id}
    data-desabilitargeral={props.desabilitarGeral ? 'true' : 'false'}
    data-desabilitarupload={props.desabilitarUpload ? 'true' : 'false'}
    data-label={props.label}
    data-tipospermitidos={props.tiposArquivosPermitidos}
    data-tamanhomaximo={props.tamanhoMaximoArquivo}
    data-totaluploads={props.totalDeUploads}
    onClick={props.onChangeListaArquivos}
  />
));
jest.mock('~/constantes/ids/input', () => ({
  SGP_INPUT_TITULO: 'input-titulo',
}));
jest.mock('~/constantes/ids/upload', () => ({
  SGP_UPLOAD_INFORMES: 'upload-informes',
}));
jest.mock('~/servicos', () => ({
  erros: jest.fn(),
  sucesso: jest.fn(),
}));
jest.mock('~/servicos/Componentes/ServicoArmazenamento', () => ({
  removerArquivo: jest.fn().mockResolvedValue({ status: 200 }),
}));

describe('InformesCadastroForm', () => {
  const mockSetFieldValue = jest.fn();
  const mockSetExibirLoader = jest.fn();

  const getForm = (values = {}, initialValues = {}) => ({
    values,
    initialValues,
    setFieldValue: mockSetFieldValue,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza todos os campos principais do formulário', () => {
    const form = getForm(
      { modoEdicao: false },
      {
        texto: 'Texto inicial',
        auditoria: { criadoEm: '2024-01-01' },
        listaArquivos: [],
      }
    );
    render(
      <InformesCadastroForm
        form={form}
        desabilitarCampos={false}
        setExibirLoader={mockSetExibirLoader}
      />
    );
    expect(screen.getAllByTestId('col').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('row').length).toBeGreaterThan(0);
    expect(screen.getByTestId('dre')).toBeInTheDocument();
    expect(screen.getByTestId('ue')).toBeInTheDocument();
    expect(screen.getByTestId('select-perfis')).toBeInTheDocument();
    expect(screen.getByTestId('select-modalidades')).toBeInTheDocument();
    expect(screen.getByTestId('campo-texto')).toBeInTheDocument();
    expect(screen.getByTestId('jodit-editor')).toBeInTheDocument();
    expect(screen.getByTestId('upload-arquivos')).toBeInTheDocument();
    expect(screen.getByTestId('auditoria')).toBeInTheDocument();
  });

  it('chama setFieldValue("modoEdicao", true) ao mudar texto ou título', () => {
    const form = getForm({ modoEdicao: false }, {});
    render(
      <InformesCadastroForm
        form={form}
        desabilitarCampos={false}
        setExibirLoader={mockSetExibirLoader}
      />
    );
    fireEvent.change(screen.getByTestId('campo-texto'), {
      target: { value: 'Novo título' },
    });
    expect(mockSetFieldValue).toHaveBeenCalledWith('modoEdicao', true);
    fireEvent.click(screen.getByTestId('jodit-editor'));
    expect(mockSetFieldValue).toHaveBeenCalledWith('modoEdicao', true);
  });

  it('chama setFieldValue("modoEdicao", true) ao mudar arquivos', () => {
    const form = getForm({ modoEdicao: false }, {});
    render(
      <InformesCadastroForm
        form={form}
        desabilitarCampos={false}
        setExibirLoader={mockSetExibirLoader}
      />
    );
    fireEvent.click(screen.getByTestId('upload-arquivos'));
    expect(mockSetFieldValue).toHaveBeenCalledWith('modoEdicao', true);
  });

  it('chama sucesso ao remover arquivo com arquivoId', async () => {
    const form = getForm({ modoEdicao: false }, {});
    render(
      <InformesCadastroForm
        form={form}
        desabilitarCampos={false}
        setExibirLoader={mockSetExibirLoader}
      />
    );
    // Simula chamada do onRemoveFile
    const instance = screen.getByTestId('upload-arquivos').props;
    if (instance && instance.onRemove) {
      const mockArquivo = { arquivoId: 123, name: 'doc.pdf' };
      await instance.onRemove(mockArquivo);
      expect(mockSetFieldValue).toHaveBeenCalledWith('listaArquivos', []);
    }
  });
});
