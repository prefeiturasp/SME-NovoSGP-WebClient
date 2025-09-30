import api from '../api';

class ServicoNivelAlfabetizacao {
  obterIndicadoresAlfabetizacaoCritica = (codigoDre, codigoUe, anoLetivo) => {
    const params = new URLSearchParams();

    if (codigoDre && codigoDre !== '-99') params.append('codigoDre', codigoDre);
    if (codigoUe && codigoUe !== '-99') params.append('codigoUe', codigoUe);
    if (anoLetivo) params.append('anoLetivo', anoLetivo);

    const queryString = params.toString();
    const url = queryString
      ? `v1/painel-educacional/indicadores-alfabetizacao-critica?${queryString}`
      : 'v1/painel-educacional/indicadores-alfabetizacao-critica';

    return api.get(url);
  };
}

export default new ServicoNivelAlfabetizacao();
