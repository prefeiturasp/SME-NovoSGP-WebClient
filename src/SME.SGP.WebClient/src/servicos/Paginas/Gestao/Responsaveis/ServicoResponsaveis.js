import api from '~/servicos/api';

const URL_PADRAO = 'v1/supervisores';

class ServicoResponsaveis {
  obterTipoReponsavel = (exibirTodos = true) => {
    // TODO - MOCK
    const lista = [
      { codigo: 1, descricao: 'Supervisor Escolar' },
      { codigo: 2, descricao: 'PAAI' },
      { codigo: 3, descricao: 'Psicólogo Escolar' },
      { codigo: 4, descricao: 'Psicopedagogo' },
      { codigo: 5, descricao: 'Assistente Social' },
    ];
    return new Promise(resolve => resolve({ data: lista }));
  };

  salvarAtribuicao = dados => api.post(`${URL_PADRAO}/atribuir-ue`, dados);

  obterResponsaveis = (dre, tipoResponsavelAtribuicao) =>
    api.get(
      `${URL_PADRAO}/dre/${dre}?tipoResponsavelAtribuicao=${tipoResponsavelAtribuicao}`
    );

  obterUesSemAtribuicao = dre => api.get(`v1/dres/${dre}/ues/sem-atribuicao`);

  obterUesAtribuidas = (responsavel, dre) =>
    api.get(`${URL_PADRAO}/${responsavel}/dre/${dre}`);
}

export default new ServicoResponsaveis();
