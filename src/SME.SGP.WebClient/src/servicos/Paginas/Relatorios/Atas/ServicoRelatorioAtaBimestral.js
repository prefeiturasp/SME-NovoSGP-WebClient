import api from '~/servicos/api';

const urlPadrao = 'v1/relatorios';
class ServicoRelatorioAtaBimestral {
  gerar = dados => {
    return api.post(`${urlPadrao}/atas-bimestrais`, dados);
  };

  obterModalidades = (anoLetivo, ue) => {
    return api.get(`/v1/ues/${ue}/modalidades?ano=${anoLetivo}`);
  };
}

export default new ServicoRelatorioAtaBimestral();
