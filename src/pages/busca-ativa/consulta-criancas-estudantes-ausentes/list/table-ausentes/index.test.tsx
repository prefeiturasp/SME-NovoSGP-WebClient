import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AlunosAusentesDto } from '@/core/dto/AlunosAusentesDto';
import { AbrangenciaTurmaRetornoDto } from '@/core/dto/AbrangenciaTurmaRetorno';
import { ROUTES } from '@/core/enum/routes';
import consultaCriancasEstudantesAusentesService from '@/core/services/consulta-criancas-estudantes-ausentes-service';
import { ApiResult } from '@/core/services/api';
import TableCriancasEstudantesAusentes from './index';

jest.mock('@/core/services/consulta-criancas-estudantes-ausentes-service');

jest.mock('@/@legacy/utils', () => ({
  formatarFrequencia: jest.fn((value) => `${value}%`),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockUseWatch = jest.fn();
const mockGetFieldsValue = jest.fn();
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  Form: {
    ...jest.requireActual('antd').Form,
    useWatch: (...args: any[]) => mockUseWatch(...args),
    useFormInstance: jest.fn(() => ({
      getFieldsValue: mockGetFieldsValue,
    })),
  },
}));

const mockConsultaCriancasEstudantesAusentesService =
  consultaCriancasEstudantesAusentesService as jest.Mocked<
    typeof consultaCriancasEstudantesAusentesService
  >;

const mockAlunosAusentes: AlunosAusentesDto[] = [
  {
    numeroChamada: 1,
    nome: 'João Silva Santos',
    codigoEol: '123456789',
    frequenciaGlobal: '85.5',
    diasSeguidosComAusencia: 3,
  },
  {
    numeroChamada: 2,
    nome: 'Maria Oliveira Costa',
    codigoEol: '987654321',
    frequenciaGlobal: '72.0',
    diasSeguidosComAusencia: 5,
  },
];

const mockAbrangenciaTurma: AbrangenciaTurmaRetornoDto = {
  id: 123,
  codigo: 'TURMA01',
  nomeFiltro: '1º Ano A - Ensino Fundamental',
  label: '1º Ano A - Ensino Fundamental',
  value: 'TURMA01',
};

const mockFormValues = {
  anoLetivo: 2024,
  ausencias: 3,
  ue: { value: 'UE123', label: 'Escola Teste', id: 456 },
  dre: { value: 'DRE123', label: 'DRE Teste', id: 789 },
  semestre: { value: 1, label: '1º Semestre' },
  modalidade: { value: 'EF', label: 'Ensino Fundamental' },
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

describe('TableCriancasEstudantesAusentes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();

    mockUseWatch.mockImplementation((fieldName: string) => {
      switch (fieldName) {
        case 'anoLetivo':
          return mockFormValues.anoLetivo;
        case 'ausencias':
          return mockFormValues.ausencias;
        case 'ue':
          return mockFormValues.ue;
        default:
          return undefined;
      }
    });

    mockGetFieldsValue.mockReturnValue(mockFormValues);
  });

  afterEach(() => {
    cleanup();
  });

  it('deve renderizar a tabela vazia quando não há dados', async () => {
    const mockResponse: ApiResult<AlunosAusentesDto[]> = {
      sucesso: true,
      dados: [],
      mensagens: [],
    };
    mockConsultaCriancasEstudantesAusentesService.obterTurmasAlunosAusentes.mockResolvedValue(
      mockResponse,
    );

    render(
      <TestWrapper>
        <TableCriancasEstudantesAusentes abrangenciaTurmaRetorno={mockAbrangenciaTurma} />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Sem dados')).toBeInTheDocument();
    });
  });

  it('deve renderizar os dados dos alunos na tabela', async () => {
    const mockResponse: ApiResult<AlunosAusentesDto[]> = {
      sucesso: true,
      dados: mockAlunosAusentes,
      mensagens: [],
    };
    mockConsultaCriancasEstudantesAusentesService.obterTurmasAlunosAusentes.mockResolvedValue(
      mockResponse,
    );

    render(
      <TestWrapper>
        <TableCriancasEstudantesAusentes abrangenciaTurmaRetorno={mockAbrangenciaTurma} />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('João Silva Santos')).toBeInTheDocument();
        expect(screen.getByText('Maria Oliveira Costa')).toBeInTheDocument();
        expect(screen.getByText('123456789')).toBeInTheDocument();
        expect(screen.getByText('987654321')).toBeInTheDocument();
        expect(screen.getByText('85.5%')).toBeInTheDocument();
        expect(screen.getByText('72.0%')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('deve renderizar os cabeçalhos da tabela corretamente', () => {
    render(
      <TestWrapper>
        <TableCriancasEstudantesAusentes abrangenciaTurmaRetorno={mockAbrangenciaTurma} />
      </TestWrapper>,
    );

    expect(screen.getByText('Nº da chamada')).toBeInTheDocument();
    expect(screen.getByText('Nome completo')).toBeInTheDocument();
    expect(screen.getByText('Código EOL')).toBeInTheDocument();
    expect(screen.getByText('Frequência global')).toBeInTheDocument();
    expect(screen.getByText('Dias seguidos com ausência')).toBeInTheDocument();
  });
  it('deve exibir loading durante a busca de dados', async () => {
    let resolvePromise: (() => void) | undefined;
    const pendingPromise = new Promise<ApiResult<AlunosAusentesDto[]>>((resolve) => {
      resolvePromise = () =>
        resolve({
          sucesso: true,
          dados: [],
          mensagens: [],
        });
    });

    mockConsultaCriancasEstudantesAusentesService.obterTurmasAlunosAusentes.mockReturnValue(
      pendingPromise,
    );

    render(
      <TestWrapper>
        <TableCriancasEstudantesAusentes abrangenciaTurmaRetorno={mockAbrangenciaTurma} />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(
        mockConsultaCriancasEstudantesAusentesService.obterTurmasAlunosAusentes,
      ).toHaveBeenCalled();
    });

    if (resolvePromise) {
      resolvePromise();
    }
    await waitFor(() => expect(screen.getByText('Sem dados')).toBeInTheDocument());
  });

  it('deve chamar o serviço com os parâmetros corretos', async () => {
    const mockResponse: ApiResult<AlunosAusentesDto[]> = {
      sucesso: true,
      dados: mockAlunosAusentes,
      mensagens: [],
    };
    mockConsultaCriancasEstudantesAusentesService.obterTurmasAlunosAusentes.mockResolvedValue(
      mockResponse,
    );

    render(
      <TestWrapper>
        <TableCriancasEstudantesAusentes abrangenciaTurmaRetorno={mockAbrangenciaTurma} />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(
          mockConsultaCriancasEstudantesAusentesService.obterTurmasAlunosAusentes,
        ).toHaveBeenCalledWith({
          anoLetivo: 2024,
          ausencias: 3,
          codigoTurma: 'TURMA01',
          codigoUe: 'UE123',
        });
      },
      { timeout: 3000 },
    );
  });

  it('deve navegar para a página de histórico ao clicar em uma linha', async () => {
    const mockResponse: ApiResult<AlunosAusentesDto[]> = {
      sucesso: true,
      dados: mockAlunosAusentes,
      mensagens: [],
    };
    mockConsultaCriancasEstudantesAusentesService.obterTurmasAlunosAusentes.mockResolvedValue(
      mockResponse,
    );

    render(
      <TestWrapper>
        <TableCriancasEstudantesAusentes abrangenciaTurmaRetorno={mockAbrangenciaTurma} />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('João Silva Santos')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    const primeiraLinha = screen.getByText('João Silva Santos').closest('tr');
    if (primeiraLinha) {
      fireEvent.click(primeiraLinha);
    }

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.BUSCA_ATIVA_HISTORICO_REGISTRO_ACOES, {
      replace: true,
      state: expect.objectContaining({
        dreId: 789,
        dreNome: 'DRE Teste',
        dreCodigo: 'DRE123',
        ueId: 456,
        ueNome: 'Escola Teste',
        ueCodigo: 'UE123',
        turmaId: 123,
        turmaNome: '1º Ano A - Ensino Fundamental',
        turmaCodigo: 'TURMA01',
        semestre: 1,
        modalidade: 'EF',
        anoLetivo: 2024,
        aluno: {
          codigoAluno: '123456789',
          nome: 'João Silva Santos',
        },
        dadosFiltros: expect.objectContaining(mockFormValues),
      }),
    });
  });

  it('não deve chamar o serviço quando parâmetros obrigatórios estão ausentes', () => {
    mockUseWatch.mockImplementation((fieldName: string) => {
      switch (fieldName) {
        case 'anoLetivo':
          return null;
        case 'ausencias':
          return null;
        case 'ue':
          return null;
        default:
          return undefined;
      }
    });

    mockGetFieldsValue.mockReturnValue({
      anoLetivo: null,
      ausencias: null,
      ue: null,
    });

    render(
      <TestWrapper>
        <TableCriancasEstudantesAusentes abrangenciaTurmaRetorno={mockAbrangenciaTurma} />
      </TestWrapper>,
    );

    expect(
      mockConsultaCriancasEstudantesAusentesService.obterTurmasAlunosAusentes,
    ).not.toHaveBeenCalled();
  });

  it('deve limpar os dados quando resposta não é bem-sucedida', async () => {
    const mockResponse: ApiResult<AlunosAusentesDto[]> = {
      sucesso: false,
      dados: [],
      mensagens: ['Erro ao buscar dados'],
    };
    mockConsultaCriancasEstudantesAusentesService.obterTurmasAlunosAusentes.mockResolvedValue(
      mockResponse,
    );

    render(
      <TestWrapper>
        <TableCriancasEstudantesAusentes abrangenciaTurmaRetorno={mockAbrangenciaTurma} />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Sem dados')).toBeInTheDocument();
    });
  });

  it('deve tratar o caso quando não há código de turma', () => {
    const abrangenciaSemCodigo: AbrangenciaTurmaRetornoDto = {
      id: 123,
      codigo: undefined,
      nomeFiltro: '1º Ano A - Ensino Fundamental',
      label: '1º Ano A - Ensino Fundamental',
      value: 'TURMA01',
    };

    render(
      <TestWrapper>
        <TableCriancasEstudantesAusentes abrangenciaTurmaRetorno={abrangenciaSemCodigo} />
      </TestWrapper>,
    );

    expect(
      mockConsultaCriancasEstudantesAusentesService.obterTurmasAlunosAusentes,
    ).not.toHaveBeenCalled();
  });

  it('deve usar valores padrão quando dados estão ausentes no onClick', async () => {
    const mockResponse: ApiResult<AlunosAusentesDto[]> = {
      sucesso: true,
      dados: [
        {
          numeroChamada: 1,
          nome: '',
          codigoEol: '',
          frequenciaGlobal: '85.5',
          diasSeguidosComAusencia: 3,
        },
      ],
      mensagens: [],
    };
    mockConsultaCriancasEstudantesAusentesService.obterTurmasAlunosAusentes.mockResolvedValue(
      mockResponse,
    );

    const formValuesVazios = {
      anoLetivo: 2024,
      ausencias: 3,
      ue: { value: 'UE123' },
    };

    mockUseWatch.mockImplementation((fieldName: string) => {
      switch (fieldName) {
        case 'anoLetivo':
          return formValuesVazios.anoLetivo;
        case 'ausencias':
          return formValuesVazios.ausencias;
        case 'ue':
          return formValuesVazios.ue;
        default:
          return undefined;
      }
    });

    mockGetFieldsValue.mockReturnValue(formValuesVazios);

    render(
      <TestWrapper>
        <TableCriancasEstudantesAusentes abrangenciaTurmaRetorno={mockAbrangenciaTurma} />
      </TestWrapper>,
    );

    await waitFor(() => {
      const linha = document.querySelector('tbody tr:not(.ant-table-placeholder)');
      expect(linha).toBeInTheDocument();
    });

    const linha = document.querySelector('tbody tr:not(.ant-table-placeholder)');
    if (linha) {
      fireEvent.click(linha);
    }

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.BUSCA_ATIVA_HISTORICO_REGISTRO_ACOES, {
      replace: true,
      state: expect.objectContaining({
        semestre: '',
        aluno: {
          codigoAluno: '',
          nome: '',
        },
      }),
    });
  });
});
