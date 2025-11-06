import api from '../api';

class ServicoSondagem {
  obterSondagemEscrita = (dreCodigo, ueCodigo, anoLetivo, bimestre) => {
    const params = new URLSearchParams();
    if (anoLetivo) params.append('AnoLetivo', anoLetivo);
    if (dreCodigo) params.append('CodigoDre', dreCodigo);
    if (ueCodigo) params.append('CodigoUe', ueCodigo);
    if (bimestre) params.append('Bimestre', bimestre);

    const url = `v1/painel-educacional/sondagem-escrita?${params.toString()}`;
    return api.get(url, {
      headers: {
        Accept: 'text/plain',
      },
    });
  };
}

export default new ServicoSondagem();
