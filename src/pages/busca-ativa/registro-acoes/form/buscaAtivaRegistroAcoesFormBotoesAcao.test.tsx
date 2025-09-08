import { render, screen } from '@testing-library/react';
import { Form } from 'antd';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import BuscaAtivaRegistroAcoesFormBotoesAcao from './buscaAtivaRegistroAcoesFormBotoesAcao';

jest.mock('~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao', () => (props: any) => (
  <button onClick={props.onClick}>Mocked Voltar</button>
));
jest.mock('~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao', () => (props: any) => (
  <button onClick={props.onClick} disabled={props.disabled}>
    Mocked Excluir
  </button>
));
jest.mock('@/components/lib/button/primary', () => (props: any) => (
  <button onClick={props.onClick} disabled={props.disabled}>
    {props.children}
  </button>
));
jest.mock('@/components/lib/button/secundary', () => (props: any) => (
  <button onClick={props.onClick} disabled={props.disabled}>
    {props.children}
  </button>
));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: undefined }),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/path', state: {} }),
  };
});
jest.mock('@/core/services/busca-ativa-service', () => ({
  excluirRegistroAcao: jest.fn().mockResolvedValue({ sucesso: true }),
  salvarAtualizarRegistroAcao: jest.fn().mockResolvedValue({ sucesso: true }),
  obterRegistroAcao: jest.fn(),
  obterSecoesDeRegistroAcao: jest.fn(),
}));
jest.mock('~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes', () => ({
  limparDadosOriginaisQuestionarioDinamico: jest.fn(),
  mapearQuestionarios: jest.fn().mockResolvedValue({ formsValidos: true, secoes: [] }),
}));
jest.mock('~/servicos', () => ({
  confirmar: jest.fn().mockResolvedValue(false),
  sucesso: jest.fn(),
  verificaSomenteConsulta: jest.fn(() => false),
  setBreadcrumbManual: jest.fn(),
}));

const mockStore = configureStore([]);

describe('BuscaAtivaRegistroAcoesFormBotoesAcao', () => {
  it('mostra Voltar, Cancelar e Salvar botões', () => {
    const store = mockStore({
      questionarioDinamico: {
        questionarioDinamicoEmEdicao: true,
      },
      buscaAtivaRegistroAcoes: {
        desabilitarCamposBuscaAtivaRegistroAcoes: false,
        dadosSecoesBuscaAtivaRegistroAcoes: [],
      },
    });

    const Wrapper = () => {
      const [form] = Form.useForm();
      return (
        <Provider store={store}>
          <BrowserRouter>
            <Form form={form}>
              <BuscaAtivaRegistroAcoesFormBotoesAcao
                rotaPai="/voltar"
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                obterSecoes={() => {}}
                permissoesTela={{
                  podeConsultar: true,
                  podeAlterar: true,
                  podeExcluir: true,
                  podeIncluir: true,
                }}
              />
            </Form>
          </BrowserRouter>
        </Provider>
      );
    };

    render(<Wrapper />);

    expect(screen.getByText('Mocked Voltar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });
});
