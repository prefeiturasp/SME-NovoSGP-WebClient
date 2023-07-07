// import api from '~/servicos/api';

// const URL_PADRAO = 'v1/relatorios/pap';

class ServicoRelatorioPAP {
  obterPeriodos = turmaCodigo => {
    console.log('Consultando períodos da turma:', turmaCodigo);
    const mock = [
      {
        configuracaoPeriodicaRelatorioPAPId: 1,
        periodoRelatorioPAPId: 1,
        tipoConfiguracaoPeriodicaRelatorioPAP: 'TIPO 1',
        periodoRelatorioPAP: 1,
        descricaoPeriodo: 'Semestre 1',
      },
      {
        configuracaoPeriodicaRelatorioPAPId: 2,
        periodoRelatorioPAPId: 2,
        tipoConfiguracaoPeriodicaRelatorioPAP: 'TIPO 2',
        periodoRelatorioPAP: 2,
        descricaoPeriodo: 'Semestre 2',
      },
    ];

    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ data: mock, status: 200 });
      }, 2000);
    });

    // TODO Endpoint ainda não existe!
    // return api.get(`${URL_PADRAO}/periodos/${turmaCodigo}`);
  };

  obterDadosSecoes = () =>
    // turmaCodigo,
    // alunoCodigo,
    // periodoRelatorioPAPId,
    // idConfig
    {
      // TODO - DTO vai ser diferente e o ednpoint pode mudar, alinhar com back

      const mock = [
        {
          nome: 'Frequência na turma de PAP',
          id: 1,
          questionarioId: 1,
        },
        {
          nome: 'Dificuldades apresentadas',
          id: 2,
          questionarioId: 2,
        },
        {
          nome: 'Avanços na aprendizagem durante o bimestre',
          id: 3,
          questionarioId: 3,
        },
        {
          nome: 'Observações',
          id: 4,
          questionarioId: 4,
        },
      ];

      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ data: mock, status: 200 });
        }, 2000);
      });

      // TODO Endpoint ainda não existe!
      // const url = `${URL_PADRAO}/turmas/${turmaCodigo}/alunos/${alunoCodigo}/periodos/${periodoRelatorioPAPId}/secoes-configuracao`
      // return api.get(url);
    };

  obterQuestionario = () => {
    // TODO Endpoint ainda não existe!
    const mock = [
      {
        id: 1,
        ordem: 1,
        nome: 'Frequência',
        observacao: '',
        obrigatorio: false,
        somenteLeitura: false,
        tipoQuestao: 21,
        opcionais: '',
        opcaoResposta: [],
        resposta: [
          {
            id: 123123,
            texto:
              '[{"qtdAulas":9, "qtdAusencias":2,"qtdPresencaRemoto":2,"qtdCompensacoes":4,"percentualFrequencia":60}]',
          },
        ],
        dimensao: 12,
        tamanho: null,
        mascara: null,
        placeHolder: null,
        nomeComponente: 'nomeComponente',
      },
    ];
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ data: mock, status: 200 });
      }, 2000);
    });
  };
}

export default new ServicoRelatorioPAP();
