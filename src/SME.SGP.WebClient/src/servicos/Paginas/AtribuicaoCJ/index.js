import api from '~/servicos/api';

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
  buscarModalidades(ue, anoLetivo) {
    return api.get(`/v1/ues/${ue}/modalidades?ano=${anoLetivo}`);
  },
  buscarTurmas(ue, modalidade, anoLetivo, consideraHistorico) {
    return api.get(
      `/v1/ues/${ue}/modalidades/${modalidade}?ano=${anoLetivo}&historico=${consideraHistorico}`
    );
  },
};

export default AtribuicaoCJServico;
