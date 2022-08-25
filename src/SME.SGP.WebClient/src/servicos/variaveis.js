import axios from 'axios';

const URL = '/../../../configuracoes/variaveis.json';

let promiseObterVariaveis;

const obterVariaveis = () => axios.get(URL).then(resp => resp);

const configVariaveis = async () => {
  if (!promiseObterVariaveis) {
    promiseObterVariaveis = obterVariaveis()
      .then(resposta => {
        promiseObterVariaveis = null;
        return resposta?.data;
      })
      .catch(() => {
        window.location.href = '/erro';
      });
  }

  return promiseObterVariaveis.then(dados => dados);
};

const urlBase = () => configVariaveis().then(response => response?.API_URL);

const obterTrackingID = () =>
  configVariaveis().then(response => response?.TRACKING_ID);

const obterUrlSondagem = () =>
  configVariaveis().then(response => response?.URL_SONDAGEM);

const obterUrlSignalR = () =>
  configVariaveis().then(response => response?.URL_SIGNALR);

export { urlBase, obterTrackingID, obterUrlSondagem, obterUrlSignalR };
