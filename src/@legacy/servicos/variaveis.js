const urlBase = process.env.REACT_APP_URL_API;
const obterUrlSondagem = process.env.REACT_APP_URL_SONDAGEM;
const obterUrlSignalR = process.env.REACT_APP_URL_SIGNALR;
const obterTrackingID = process.env.REACT_APP_TRACKING_ID || '';
const urlApiCES = process.env.REACT_APP_CES_URL || '';
const tokenCES = process.env.REACT_APP_CES_TOKEN || '';
const tempoAvisoExpiracaoSessaoPadraoMinutos = 10;
const tempoAvisoExpiracaoSessaoConfigurado = Number(
  process.env.REACT_APP_TEMPO_AVISO_EXPIRACAO_SESSAO_MINUTOS ||
    tempoAvisoExpiracaoSessaoPadraoMinutos
);
const tempoAvisoExpiracaoSessaoMinutos =
  Number.isFinite(tempoAvisoExpiracaoSessaoConfigurado) &&
  tempoAvisoExpiracaoSessaoConfigurado > 0
    ? tempoAvisoExpiracaoSessaoConfigurado
    : tempoAvisoExpiracaoSessaoPadraoMinutos;
export {
  urlBase,
  obterUrlSondagem,
  obterUrlSignalR,
  obterTrackingID,
  urlApiCES,
  tokenCES,
  tempoAvisoExpiracaoSessaoMinutos,
};
