import api from '../api';

class ServicoFrequencia {
    obterFrequenciaGlobal = (codigoDre, codigoUe) => {
        return api.get(`v1/painel-educacional/frequencia-global/${codigoDre}/${codigoUe}`);
    }

    obterFrequenciaMensal = (codigoDre, codigoUe) => {
        return api.get(`v1/painel-educacional/frequencia-mensal/${codigoDre}/${codigoUe}`);
    }

    obterFrequenciaRanking = (codigoDre, codigoUe) => {
        return api.get(`v1/painel-educacional/frequencia-ranking/${codigoDre}/${codigoUe}`);
    }
}

export default new ServicoFrequencia();