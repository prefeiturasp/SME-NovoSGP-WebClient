

  // export const dadosMock = {
  //   escolasEmSituacaoCritica: {
  //     titulo: 'Escolas em situação crítica',
  //     descricao: 'XX escolas com frequência abaixo de 85%',
  //     escolas: [
  //       { nome: 'EMEF Jardim São Paulo', percentual: 83 },
  //       { nome: 'EMEF Itaquera', percentual: 84 },
  //       { nome: 'EMEF Vila Medeiros', percentual: 84 }
  //     ],
  //     cor: '#ffebee' // Rosa claro
  //   },
  //   escolasAtencao: {
  //     titulo: 'Escolas em atenção',
  //     descricao: 'XX escolas com frequência entre 85% e 90%',
  //     escolas: [
  //       { nome: 'EMEF Campo Limpo', percentual: 89 },
  //       { nome: 'EMEF Tremembé', percentual: 88 },
  //       { nome: 'EMEF Pêra Marmelo', percentual: 87 },
  //       { nome: 'EMEF Casa Verde', percentual: 86 },
  //       { nome: 'EMEF Ermelino Matarazzo', percentual: 86 }
  //     ],
  //     cor: '#fff8e1' // Amarelo claro
  //   },
  //   melhoresFrequencias: {
  //     titulo: 'Melhores frequências',
  //     descricao: 'XX escolas com frequência acima de 94%',
  //     escolas: [
  //       { nome: 'EMEF Vila Formosa', percentual: 95 },
  //       { nome: 'EMEF Vila Rubi', percentual: 95 },
  //       { nome: 'EMEF Jardim Ângela', percentual: 94 },
  //       { nome: 'EMEF Alto de Pinheiros', percentual: 94 }
  //     ],
  //     cor: '#e8f5e8' // Verde claro
  //   }
  // };


  export const dadosMock = {
  escolasEmSituacaoCritica: {
    cor: '#ffebee', // Rosa claro
    dados: [
      { ue: 'EMEF JARDIM SÃO BENTO', percentualFrequencia: 72.3 },
      { ue: 'EMEF VILA NOVA CACHAOEIRINHA', percentualFrequencia: 68.9 },
      { ue: 'EMEF PARQUE FERNANDA', percentualFrequencia: 65.4 },
      { ue: 'EMEF JARDIM KERA', percentualFrequencia: 70.1 },
      { ue: 'EMEF CIDADE DUTRA', percentualFrequencia: 67.8 }
    ]
  },
  escolasEmAtencao: {
    cor: '#fff8e1', // Amarelo claro
    dados: [
      { ue: 'EMEF CAMPO LIMPO', percentualFrequencia: 84.2 },
      { ue: 'EMEF VILA ANDRADE', percentualFrequencia: 86.7 },
      { ue: 'EMEF JARDIM ANGELA', percentualFrequencia: 82.9 },
      { ue: 'EMEF CAPAO REDONDO', percentualFrequencia: 87.3 },
      { ue: 'EMEF GRAJAU', percentualFrequencia: 85.6 }
    ]
  },
  escolasRanqueadas: {
    cor: '#e8f5e8', // Verde claro
    dados: [
      { ue: 'CEI DIREI VILA SANTA INES', percentualFrequencia: 100 },
      { ue: 'CEU AT CONPL BUTANTA - ELIZABETH GASPAR TUNALA, PROFA.', percentualFrequencia: 100 },
      { ue: 'ENEF ANORIM LIMA, DES.', percentualFrequencia: 100 },
      { ue: 'ENEF ERNESTO DE MORAES LEME, PROF.', percentualFrequencia: 95.64 },
      { ue: 'EMEF PERITO CRIMINAL', percentualFrequencia: 98.2 },
      { ue: 'EMEF JOAQUIM OSORIO', percentualFrequencia: 97.8 },
      { ue: 'EMEF VILA LEOPOLDINA', percentualFrequencia: 96.5 },
      { ue: 'EMEF ALTO DE PINHEIROS', percentualFrequencia: 99.1 }
    ]
  }
};
