import api from '~/servicos/api';

const urlPadrao = `v1/componentes-curriculares`;

class ServicoComponentesCurriculares {
  obterComponetensCurriculares = (
    codigoUe,
    modalidade,
    anoLetivo,
    anosEscolares,
    turmasPrograma
  ) => {
    const url = `${urlPadrao}/ues/${codigoUe}/modalidades/${modalidade}/anos/${anoLetivo}/anos-escolares?anosEscolares=${anosEscolares.join(
      '&anosEscolares=',
      anosEscolares
    )}&turmasPrograma=${!!turmasPrograma}`;
    return api.get(url);
  };

  obterComponetensCurricularesPorTurma = (codigoUe, turmas) => {
    return api.post(`${urlPadrao}/ues/${codigoUe}/turmas`, turmas);
  };

  obterComponetensCurricularesRegencia = turmaId => {
    return api.get(`${urlPadrao}/turmas/${turmaId}/regencia/componentes`);
  };

  obterComponentesPorListaDeTurmas = turmasId => {
    const url = `v1/professores/disciplinas/turmas`;
    return api.post(url, turmasId);
  };

  obterComponentesPorUeTurmas = (ueId, turmasId) => {
    const url = `v1/componentes-curriculares/ues/${ueId}/turmas`;
    return api.post(url, turmasId);
  };
}

export default new ServicoComponentesCurriculares();
