class ServicoListao {
  obterTurmasPorModalidade = () =>
    // TODO
    // anoLetivo,
    // consideraHistorico,
    // codigoUe,
    // modalidade
    {
      const mock = [
        {
          valor: 1,
          descricao: 'EF - Fundamental - Artes 1ºAno',
        },
        {
          valor: 2,
          descricao: 'EF - Fundamental - Artes 2ºAno',
        },
        {
          valor: 3,
          descricao: 'EF - Fundamental - Matemática 1ºAno',
        },
      ];

      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ data: mock });
        }, 1000);
      });
    };
}

export default new ServicoListao();
