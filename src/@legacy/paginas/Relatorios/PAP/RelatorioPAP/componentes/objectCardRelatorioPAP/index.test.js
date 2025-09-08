import { render } from '@testing-library/react';
import ObjectCardRelatorioPAP from './index';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));
jest.mock('~/componentes/Alunos/Detalhes', () => ({
  __esModule: true,
  default: ({
    dados,
    desabilitarImprimir,
    exibirBotaoImprimir,
    permiteAlterarImagem,
  }) => (
    <div
      data-testid="detalhes-aluno"
      data-dados={JSON.stringify(dados)}
      data-desabilitar-imprimir={desabilitarImprimir ? 'true' : 'false'}
      data-exibir-botao-imprimir={exibirBotaoImprimir ? 'true' : 'false'}
      data-permite-alterar-imagem={permiteAlterarImagem ? 'true' : 'false'}
    />
  ),
}));

import { useSelector } from 'react-redux';

describe('ObjectCardRelatorioPAP', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza DetalhesAluno com os dados do estudante e props corretas', () => {
    useSelector
      .mockImplementationOnce(() => ({ nome: 'Aluno Teste', codigoEOL: 123 }))
      .mockImplementationOnce(() => false);

    const { getByTestId } = render(<ObjectCardRelatorioPAP />);
    const detalhes = getByTestId('detalhes-aluno');
    expect(detalhes).toHaveAttribute(
      'data-dados',
      JSON.stringify({ nome: 'Aluno Teste', codigoEOL: 123 })
    );
    expect(detalhes).toHaveAttribute('data-desabilitar-imprimir', 'true');
    expect(detalhes).toHaveAttribute('data-exibir-botao-imprimir', 'false');
    expect(detalhes).toHaveAttribute('data-permite-alterar-imagem', 'true');
  });

  it('renderiza DetalhesAluno com permiteAlterarImagem false quando desabilitarCamposRelatorioPAP é true', () => {
    useSelector
      .mockImplementationOnce(() => ({ nome: 'Aluno Teste', codigoEOL: 123 }))
      .mockImplementationOnce(() => true);

    const { getByTestId } = render(<ObjectCardRelatorioPAP />);
    const detalhes = getByTestId('detalhes-aluno');
    expect(detalhes).toHaveAttribute('data-permite-alterar-imagem', 'false');
  });
});
