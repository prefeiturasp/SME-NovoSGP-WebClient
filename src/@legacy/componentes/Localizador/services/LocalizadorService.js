/* eslint-disable lines-between-class-members */
import api from '~/servicos/api';

class LocalizadorService {
  urlProfessores = '/v1/professores';

  constructor() {
    api.interceptors.request.use(config => {
      return {
        ...config,
        headers: {
          ...config.headers,
        },
      };
    });
  }

  buscarAutocomplete({ anoLetivo, dreId, nome, ueId }) {
    return api.get(
      `${this.urlProfessores}/${anoLetivo}/autocomplete/${dreId}`,
      {
        params: {
          nomeProfessor: nome,
          ueId,
        },
      }
    );
  }

  buscarPorRf({
    anoLetivo,
    rf,
    buscarOutrosCargos,
    dreId,
    ueId,
    buscarPorAbrangencia,
    buscarPorTodasDre,
  }) {
    const urlPadrao = `${this.urlProfessores}/${rf}/resumo/${anoLetivo}`;
    const urlPorAbrangencia = `${this.urlProfessores}/rfs/${rf}/anos-letivos/${anoLetivo}/buscar`;
    const url = buscarPorAbrangencia ? urlPorAbrangencia : urlPadrao;
    const outrosCargos = buscarPorAbrangencia ? null : buscarOutrosCargos;

    return api.get(url, {
      params: {
        buscarOutrosCargos: outrosCargos,
        dreId,
        ueId,
        buscarPorTodasDre,
      },
    });
  }

  buscarPessoa({ rf, nome }) {
    api
      .post(this.urlBuscarPessoa, { rf, nome })
      .then(resp => {
        return {
          sucesso: true,
          mensagem: 'Foi encontrado',
          dados: resp.data,
        };
      })
      .catch(err => ({
        sucesso: false,
        erroGeral: `Não foi encontrado! ${err}`,
      }));
  }
}

export default new LocalizadorService();
