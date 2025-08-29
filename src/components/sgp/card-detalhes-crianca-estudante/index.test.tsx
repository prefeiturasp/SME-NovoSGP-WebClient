import { render, screen } from '@testing-library/react';
import CardDetalhesCriancaEstudante from './index';
import { TipoTelefone } from '@/core/enum/tipo-telefone-enum';

describe('CardDetalhesCriancaEstudante', () => {
  it('deve exibir loading quando loading for true', () => {
    const { container } = render(<CardDetalhesCriancaEstudante loading={true} />);
    const loadingCard = container.querySelector('.ant-card-loading');
    expect(loadingCard).toBeInTheDocument();
  });

  it('deve renderizar todos os dados corretamente quando loading for false', () => {
    const dados = {
      nome: 'João',
      numeroAlunoChamada: 10,
      dataNascimento: '2020-01-01',
      codigoAluno: '123',
      situacao: 'Ativo',
      dataSituacao: '2020-02-01T10:00:00Z',
      tipoResponsavel: 'Pai',
      nomeResponsavel: 'José',
      celularResponsavel: '11987654321',
      dataAtualizacaoContato: '2021-03-01',
      frequencia: '0.5',
      dadosResponsavelFiliacao: {
        nomeFiliacao1: 'Escola A',
        telefonesFiliacao1: [{ ddd: '11', numero: '987654321' }],
        nomeFiliacao2: 'Escola B',
        telefonesFiliacao2: [{ ddd: '22', numero: '12345678' }],
        endereco: {
          logradouro: 'Rua X',
          nro: '123',
          complemento: 'Apto 1',
          bairro: 'Bairro Y',
          cep: 12345678,
          nomeMunicipio: 'Cidade Z',
          siglaUF: 'SP',
          tipologradouro: 'Rua',
        },
        email: '',
        cpf: '',
      },
      codigoSituacaoMatricula: 1,
      turmaEscola: 'Turma 1',
      codigoTurma: '101',
      ehAtendidoAEE: false,
      ehMatriculadoTurmaPAP: false,
    };

    render(<CardDetalhesCriancaEstudante dados={dados} titulo="Detalhes" loading={false} />);

    expect(screen.getByText('João Nº10')).toBeInTheDocument();
    expect(screen.getByText('Data de nascimento:')).toBeInTheDocument();
    expect(screen.getByText('01/01/2020')).toBeInTheDocument();
    expect(screen.getByText('Código EOL:')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('Situação:')).toBeInTheDocument();
    expect(screen.getByText(/Ativo/)).toBeInTheDocument();

    expect(screen.getByText('Responsável:')).toBeInTheDocument();
    expect(screen.getByText('José')).toBeInTheDocument();
    expect(screen.getByText('(Pai)')).toBeInTheDocument();

    expect(screen.getAllByText('Telefone:')).toHaveLength(3);
    const IPhones = screen.getAllByText('11987654321');
    expect(IPhones).toHaveLength(2);
    expect(screen.getByText(/\(Atualizado - 01\/03\/2021\)/)).toBeInTheDocument();

    expect(screen.getByText(/0\.5%/)).toBeInTheDocument();

    expect(screen.getByText('Nome da filiação 1:')).toBeInTheDocument();
    expect(screen.getByText('Escola A')).toBeInTheDocument();

    expect(screen.getByText('Nome da filiação 2:')).toBeInTheDocument();
    expect(screen.getByText('Escola B')).toBeInTheDocument();
    expect(screen.getByText('2212345678')).toBeInTheDocument();

    expect(screen.getByText('Endereço:')).toBeInTheDocument();
    expect(
      screen.getByText(/Rua X, 123, Apto 1 - Bairro Y - 12345678 - Cidade Z/),
    ).toBeInTheDocument();
  });

  it('renderiza título do card quando prop titulo for fornecida', () => {
    render(<CardDetalhesCriancaEstudante titulo="TesteTitulo" />);
    expect(screen.getByText('TesteTitulo')).toBeInTheDocument();
  });

  it('não renderiza seção de responsável quando nomeResponsavel não for fornecido', () => {
    const dados = {
      nome: 'Ana',
      numeroAlunoChamada: '5',
      dataNascimento: '',
      codigoAluno: '',
      situacao: '',
      dataSituacao: '',
      frequencia: 0,
      dadosResponsavelFiliacao: {},
    } as any;
    render(<CardDetalhesCriancaEstudante dados={dados} loading={false} />);
    expect(screen.queryByText('Responsável:')).not.toBeInTheDocument();
  });

  it('renderiza label de telefone de filiação com tipo de enum quando tipoTelefone é definido', () => {
    const dados = {
      nome: '',
      numeroAlunoChamada: '',
      dataNascimento: '',
      codigoAluno: '',
      situacao: '',
      dataSituacao: '',
      tipoResponsavel: '',
      nomeResponsavel: '',
      celularResponsavel: '',
      dataAtualizacaoContato: '',
      frequencia: '',
      dadosResponsavelFiliacao: {
        nomeFiliacao1: '',
        telefonesFiliacao1: [
          {
            tipoTelefone: TipoTelefone.Residencial,
            ddd: '99',
            numero: '111111111',
          },
        ],
        nomeFiliacao2: '',
        telefonesFiliacao2: [],
        endereco: {},
      },
    } as any;
    render(<CardDetalhesCriancaEstudante dados={dados} loading={false} />);
    expect(screen.getByText('Telefone Residencial:')).toBeInTheDocument();
    expect(screen.getByText('99111111111')).toBeInTheDocument();
  });

  it('deve exibir fallback de dataAtualizacaoContato vazio', () => {
    const dados = {
      nome: 'Ana',
      numeroAlunoChamada: '1',
      dataNascimento: '',
      codigoAluno: '',
      situacao: '',
      dataSituacao: '',
      tipoResponsavel: 'Pai',
      nomeResponsavel: 'Ana',
      celularResponsavel: '000',
      dataAtualizacaoContato: '',
      frequencia: '',
      dadosResponsavelFiliacao: {} as any,
    } as any;
    render(<CardDetalhesCriancaEstudante dados={dados} loading={false} />);
    expect(screen.getByText('(Atualizado - )')).toBeInTheDocument();
  });
});
