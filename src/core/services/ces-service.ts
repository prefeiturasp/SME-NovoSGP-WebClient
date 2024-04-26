import { InternalAxiosRequestConfig } from 'axios';
import { api } from '~/servicos';
import { tokenCES, urlApiCES } from '~/servicos/variaveis';

const CES_URL = urlApiCES;
const CES_TOKEN = tokenCES;

// Serviço destinado a API de pesquisas https://ces.sme.prefeitura.sp.gov.br

api.interceptors.request.use(
  async (config) => {
    const persistJson = localStorage.getItem('persist:sme-sgp');
    if (persistJson) {
      const dados = JSON.parse(persistJson);
      const usuario = JSON.parse(dados.usuario);
      const rf = usuario.rf;
      try {
        // Verifica se há um usuário logado e evita chamadas recursivas
        if (rf && config.url && !config.url.toString().includes(CES_URL)) {
          await buscarPesquisa(`${config.baseURL}/${config.url}`, JSON.parse(rf), config);
        }
      } catch (error) {
        //
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

function abrirPesquisa(url: string) {
  window.open(
    url,
    '_blank',
    'toolbar=no, location=no, directories=no,status=no, menubar=no, scrollbars=yes, resizable=yes, copyhistory=yes, width=600, height=700',
  );
}

async function buscarPesquisa(
  endpoint: any,
  identificacaoUsuario: string,
  options: InternalAxiosRequestConfig<any>,
) {
  if (!CES_URL) return;
  const url = `${CES_URL}/pesquisas/?identificacao_usuario=${identificacaoUsuario}&metodo_recurso_acao=${options.method?.toUpperCase()}&recurso_acao=${endpoint}`;
  const headers = {
    method: 'GET',
    headers: {
      Authorization: `Token ${CES_TOKEN}`,
    },
  };

  try {
    const response = await fetch(url, headers);
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    if (data.url) {
      abrirPesquisa(data.url);
    }
  } catch (error) {
    //
  }
}

export async function criarUsuarioCES(identificacao: string) {
  if (!CES_URL) return;
  const url = `${CES_URL}/usuarios/`;

  const headers = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${CES_TOKEN}`,
    },
    body: JSON.stringify({
      identificacao,
    }),
  };

  try {
    const response = await fetch(url, headers);
    await response.json();
  } catch (error) {
    //
  }
}
