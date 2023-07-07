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
}

export default new ServicoRelatorioPAP();
