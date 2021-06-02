import api from '~/servicos/api';

const urlPadrao = `/v1/fechamentos/acompanhamentos/turmas`;

class ServicoAcompanhamentoFechamento {
  obterTurmas = params => {
    let url = `${urlPadrao}?anoLetivo=${params.anoLetivo}&dreId=${params.dreId}`;
    url = `${url}&ueId=${params.ueId}&modalidade=${params.modalidadeId}&semestre=${params.semestre}`;
    url = `${url}&bimestre=${params.bimestre}&numeroPagina=${params.numeroPagina}&numeroRegistros=10`;

    if (params.turmasId?.length) {
      url += `&turmasId=${params.turmasId.join('&turmasId=', params.turmasId)}`;
    }

    return api.get(url);
  };

  obterFechamentos = ({ turmaId, bimestre }) => {
    return api.get(`${urlPadrao}/${turmaId}/fechamentos/bimestres/${bimestre}`);
  };

  obterConselhoClasse = ({ turmaId, bimestre }) => {
    return api.get(
      `${urlPadrao}/${turmaId}/conselho-classe/bimestres/${bimestre}`
    );
  };

  obterListaAlunosPorTurma = (turmaId, bimestre) => {
    return api.get(
      `${urlPadrao}/${turmaId}/conselho-classe/bimestres/${bimestre}/alunos`
    );
  };

  obterDetalhamentoComponentesCurricularesAluno = (
    turmaId,
    bimestre,
    alunoCodigo
  ) => {
    return api.get(
      `${urlPadrao}/${turmaId}/conselho-classe/bimestres/${bimestre}/alunos/${alunoCodigo}/componentes-curriculares/detalhamento`
    );
  };

  obterComponentesCurricularesFechamento = () => {
    return Promise.resolve({
      data: [
        {
          descricao: 'Arte',
          professorNome: 'PRISCILA TELLES',
          professorRf: '6944272',
          situacaoFechamentoCodigo: 0,
          situacaoFechamento: 'Não Iniciado',
          professor: 'PRISCILA TELLES (6944272)',
        },
        {
          descricao: 'Ed. Física',
          professorNome: 'MONYA GABRIELLA CASTRO FUNCHAL',
          professorRf: '8017221',
          situacaoFechamentoCodigo: 0,
          situacaoFechamento: 'Não Iniciado',
          professor: 'MONYA GABRIELLA CASTRO FUNCHAL (8017221)',
        },
        {
          descricao: 'Língua Portuguesa',
          professorNome: 'ANA MARIA DE ALBUQUERQUE',
          professorRf: '6903835',
          situacaoFechamentoCodigo: 0,
          situacaoFechamento: 'Não Iniciado',
          professor: 'ANA MARIA DE ALBUQUERQUE (6903835)',
        },
        {
          descricao: 'Matemática',
          professorNome: 'HELIOMARA RODRIGUES LIMIAS',
          professorRf: '8425302',
          situacaoFechamentoCodigo: 0,
          situacaoFechamento: 'Não Iniciado',
          professor: 'HELIOMARA RODRIGUES LIMIAS (8425302)',
        },
        {
          descricao: 'Ciências',
          professorNome: 'RACHEL FREITAS DE ALMEIDA',
          professorRf: '7488076',
          situacaoFechamentoCodigo: 0,
          situacaoFechamento: 'Não Iniciado',
          professor: 'RACHEL FREITAS DE ALMEIDA (7488076)',
        },
        {
          descricao: 'Geografia',
          professorNome: 'CARLOS LUCIANO ALMEIDA',
          professorRf: '7928807',
          situacaoFechamentoCodigo: 3,
          situacaoFechamento: 'Processado com sucesso',
          professor: 'CARLOS LUCIANO ALMEIDA (7928807)',
        },
        {
          descricao: 'História',
          professorNome: 'EBER SOARES COSTA',
          professorRf: '5699436',
          situacaoFechamentoCodigo: 2,
          situacaoFechamento: 'Processado com pendências',
          professor: 'EBER SOARES COSTA (5699436)',
        },
      ],
    });
  };

  obterDetalhamentoPendencias = () => {
    return Promise.resolve({
      data: [
        {
          pendenciaId: 28196,
          fechamentoId: 268,
          bimestre: 1,
          disciplinaId: 6,
          componenteCurricular: 'Ed. Física',
          descricao: 'Aulas sem frequência registrada',
          detalhamento:
            'A aulas de Ed. Física da turma 1A a seguir estão sem frequência:<br>Professor 6759050 - JOAO GABRIEL DE MELLO BRANDAO, dia 04/03/2021.<br>\n',
          situacao: 1,
          situacaoNome: 'Pendente',
          descricaoHtml:
            '<table border="1"><tr><td>Professor</td><td>Data</td></tr><tr><td>6944035 - CRISTINA MARIA QUEIROGA ROCHA PEREIRA</td><td>18/03/2020</td></tr><tr><td>6944035 - CRISTINA MARIA QUEIROGA ROCHA PEREIRA</td><td>18/03/2020</td></tr><tr><td>6944035 - CRISTINA MARIA QUEIROGA ROCHA PEREIRA</td><td>18/03/2020</td></tr></table>',
          detalhamentoFormatado:
            '<table border="1"><tr><td>Professor</td><td>Data</td></tr><tr><td>6944035 - CRISTINA MARIA QUEIROGA ROCHA PEREIRA</td><td>18/03/2020</td></tr><tr><td>6944035 - CRISTINA MARIA QUEIROGA ROCHA PEREIRA</td><td>18/03/2020</td></tr><tr><td>6944035 - CRISTINA MARIA QUEIROGA ROCHA PEREIRA</td><td>18/03/2020</td></tr></table>',
          id: 0,
          alteradoEm: null,
          alteradoPor: null,
          alteradoRF: null,
          criadoEm: '2021-03-19T09:29:40.069065',
          criadoPor: 'JULIO CESAR PONTES BORDIGNON',
          criadoRF: '8461201',
        },
        {
          pendenciaId: 28197,
          fechamentoId: 269,
          bimestre: 1,
          disciplinaId: 6,
          componenteCurricular: 'Ed. Física',
          descricao: 'Aulas sem frequência registrada 2',
          detalhamento:
            'A aulas de Ed. Física da turma 1A a seguir estão sem frequência:<br>Professor 6759050 - JOAO GABRIEL DE MELLO BRANDAO, dia 04/03/2021.<br>\n',
          situacao: 1,
          situacaoNome: 'Pendente',
          descricaoHtml:
            '<table border="1"><tr><td>Professor</td><td>Data</td></tr><tr><td>6944035 - CRISTINA MARIA QUEIROGA ROCHA PEREIRA</td><td>18/03/2020</td></tr><tr><td>6944035 - CRISTINA MARIA QUEIROGA ROCHA PEREIRA</td><td>18/03/2020</td></tr><tr><td>6944035 - CRISTINA MARIA QUEIROGA ROCHA PEREIRA</td><td>18/03/2020</td></tr></table>',
          detalhamentoFormatado:
            '<table border="1"><tr><td>Professor</td><td>Data</td></tr><tr><td>6944035 - CRISTINA MARIA QUEIROGA ROCHA PEREIRA</td><td>18/03/2020</td></tr><tr><td>6944035 - CRISTINA MARIA QUEIROGA ROCHA PEREIRA</td><td>18/03/2020</td></tr><tr><td>6944035 - CRISTINA MARIA QUEIROGA ROCHA PEREIRA</td><td>18/03/2020</td></tr></table>',
          id: 0,
          alteradoEm: null,
          alteradoPor: null,
          alteradoRF: null,
          criadoEm: '2021-03-19T09:29:40.069065',
          criadoPor: 'JULIO CESAR PONTES BORDIGNON',
          criadoRF: '8461201',
        },
      ],
    });
  };
}

export default new ServicoAcompanhamentoFechamento();
