import api from '~/servicos/api';
import AbrangenciaServico from '~/servicos/Abrangencia';

const urlPadrao = `v1/calendarios/eventos`;

class ServicoEvento {
  salvar = async (id, evento) => {
    let url = urlPadrao;
    if (id) {
      url = `${url}/${id}`;
    }
    const metodo = id ? 'put' : 'post';
    return api[metodo](url, evento);
  };

  obterPorId = async id => {
    return api.get(`${urlPadrao}/${id}`);
  };

  deletar = async ids => {
    const parametros = { data: ids };
    return api.delete(urlPadrao, parametros);
  };

  listarDres = async () => {
    return api
      .get('v1/abrangencias/false/dres')
      .then(res => {
        return { sucesso: true, conteudo: res.data };
      })
      .catch(() => {
        return {
          sucesso: false,
          erro: 'ocorreu uma falha ao consultar as dres',
        };
      });
  };

  listarUes = async (dre, modalidade) => {
    return AbrangenciaServico.buscarUes(dre, '', false, modalidade)
      .then(res => {
        return { sucesso: true, conteudo: res.data };
      })
      .catch(() => {
        return {
          sucesso: false,
          erro: 'ocorreu uma falha ao consultar as unidades escolares',
        };
      });
  };

  obterBimestres = tipoCalendarioId => {
    // return api.get(`v1/calendarios/tipos/${tipoCalendarioId}/bimestres`);

    return Promise.resolve({
      data: [
        { desc: 'Todos', valor: '-99' },
        { desc: '1º', valor: '1' },
        { desc: '2º', valor: '2' },
        { desc: '3º', valor: '3' },
        { desc: '4º', valor: '4' },
        { desc: 'Final', valor: '0' },
      ],
    });
  };
}

export default new ServicoEvento();
