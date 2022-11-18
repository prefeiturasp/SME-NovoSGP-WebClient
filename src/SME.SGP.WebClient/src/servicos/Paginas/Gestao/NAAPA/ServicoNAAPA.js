class ServicoNAAPA {
  buscarSituacoes = () => {
    const mock = [
      {
        descricao: 'SITUAÇÃO 01',
        id: 1,
      },
      { descricao: 'SITUAÇÃO 02', id: 2 },
    ];
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ data: mock });
      }, 2000);
    });
  };

  buscarPrioridades = () => {
    const mock = [
      {
        descricao: 'PRIORIDADE 01',
        id: 1,
      },
      { descricao: 'PRIORIDADE 02', id: 2 },
    ];
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ data: mock });
      }, 2000);
    });
  };
}

export default new ServicoNAAPA();
