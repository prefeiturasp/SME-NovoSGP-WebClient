import api from '~/servicos/api';

const anoAtual = window.moment().format('YYYY');

const AtribuicaoCJServico = {
  buscarLista(params) {
    return api.get(`/v1/atribuicoes/cjs`, { params });
  },
  buscarAtribuicoes(ue, modalidade, turma, professorRf, anoLetivo) {
    return api.get(
      `/v1/atribuicoes/cjs/ues/${ue}/modalidades/${modalidade}/turmas/${turma}/professores` +
        `/${professorRf}?anoLetivo=${anoLetivo}`
    );
  },
  salvarAtribuicoes(data) {
    return api.post(`/v1/atribuicoes/cjs`, data);
  },
  buscarModalidades(ue, anoLetivo = anoAtual) {
    return api.get(`/v1/ues/${ue}/modalidades?ano=${anoLetivo}`);
  },
  buscarTurmas(ue, modalidade, anoLetivo, consideraHistorico) {
    const anoCorrente = anoLetivo || anoAtual;
    return api.get(
      `/v1/ues/${ue}/modalidades/${modalidade}?ano=${anoCorrente}&historico=${consideraHistorico}`
    );
  },
};

export default AtribuicaoCJServico;
