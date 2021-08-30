import api from '~/servicos/api';

const urlPadrao = 'v1/';
class ServicoRelatorioAtaBimestral {
  gerar = dados => {
    console.log('dados', dados);
    return Promise.resolve({ status: 200 });
    // return api.get(urlPadrao, dados);
  };

  obterModalidades = (anoLetivo, ue) => {
    return api.get(`/v1/ues/${ue}/modalidades?ano=${anoLetivo}`);
  };
}

export default new ServicoRelatorioAtaBimestral();
