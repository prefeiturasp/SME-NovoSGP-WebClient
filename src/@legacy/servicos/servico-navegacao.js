import { ROUTES } from '@/core/enum/routes';
import { store } from '@/core/redux';
import { FiltroHelper } from '~/componentes-sgp';
import modalidade from '~/dtos/modalidade';
import tipoPermissao from '~/dtos/tipoPermissao';
import { setSomenteConsulta } from '~/redux/modulos/navegacao/actions';
import {
  setListaUrlAjudaDoSistema,
  setMenu,
  setPermissoes,
} from '~/redux/modulos/usuario/actions';
import api from '~/servicos/api';
import { obterModalidadeFiltroPrincipal } from './Validacoes/validacoesInfatil';

const setMenusPermissoes = async () => {
  const permissoes = {};
  const menus = [];

  const setPermissao = (item, perm) => {
    perm[item.url] = {
      podeAlterar: item.podeAlterar,
      podeConsultar: item.podeConsultar,
      podeExcluir: item.podeExcluir,
      podeIncluir: item.podeIncluir,
    };
  };

  const listaUrlAjudaDoSistema = [];

  return api
    .get('v1/menus')
    .then(resp => {
      resp.data.forEach(item => {
        const subMenu = {
          codigo: item.codigo,
          descricao: item.descricao,
          ehMenu: item.ehMenu,
          icone: item.icone,
          quantidadeMenus: item.quantidadeMenus,
          url: item.url,
          menus: [],
        };
        if (item.menus && item.menus.length > 0) {
          item.menus.forEach(itemMenu => {
            const menu = {
              codigo: itemMenu.codigo,
              descricao: itemMenu.descricao,
              url: itemMenu.url,
              ajudaDoSistema: itemMenu?.ajudaDoSistema,
              subMenus: [],
            };
            if (itemMenu?.ajudaDoSistema) {
              listaUrlAjudaDoSistema.push({
                url: itemMenu?.ajudaDoSistema,
                rota: itemMenu.url,
              });
            }
            if (subMenu.menus) {
              subMenu.menus.push(menu);
              if (itemMenu.url) {
                setPermissao(itemMenu, permissoes);
              }
            }
            if (itemMenu.subMenus && itemMenu.subMenus.length > 0) {
              const subMenusOrdenados = itemMenu.subMenus.sort(
                FiltroHelper.ordenarLista('ordem')
              );
              subMenusOrdenados.forEach(subItem => {
                menu.subMenus.push({
                  codigo: subItem.codigo,
                  descricao: subItem.descricao,
                  url: subItem.url,
                  ajudaDoSistema: subItem?.ajudaDoSistema,
                  subMenus: [],
                });
                if (subItem?.ajudaDoSistema) {
                  listaUrlAjudaDoSistema.push({
                    url: subItem?.ajudaDoSistema,
                    rota: subItem?.url,
                  });
                }
                setPermissao(subItem, permissoes);
              });
            }
          });
        }
        menus.push(subMenu);
      });

      if (listaUrlAjudaDoSistema?.length) {
        store.dispatch(setListaUrlAjudaDoSistema(listaUrlAjudaDoSistema));
      } else {
        store.dispatch(setListaUrlAjudaDoSistema([]));
      }
      store.dispatch(setMenu(menus));
      store.dispatch(setPermissoes(permissoes));

      return true;
    })
    .catch(() => false)
    .finally(() => true);
};

const getObjetoStorageUsuario = objeto => {
  const persistSmeSgp = localStorage.getItem('persist:sme-sgp');
  const usuario =
    persistSmeSgp && persistSmeSgp.includes('usuario')
      ? JSON.parse(persistSmeSgp).usuario
      : null;
  const resultado = usuario ? JSON.parse(usuario)[objeto] : null;
  return resultado;
};

const verificaSomenteConsulta = (permissoes, naoSetarResultadoNoStore) => {
  if (
    permissoes &&
    permissoes[tipoPermissao.podeConsultar] &&
    !permissoes[tipoPermissao.podeAlterar] &&
    !permissoes[tipoPermissao.podeIncluir] &&
    !permissoes[tipoPermissao.podeExcluir]
  ) {
    if (naoSetarResultadoNoStore) {
      store.dispatch(setSomenteConsulta(false));
    } else {
      store.dispatch(setSomenteConsulta(true));
    }
    return true;
  }
  store.dispatch(setSomenteConsulta(false));
  return false;
};

const setSomenteConsultaManual = valor => {
  store.dispatch(setSomenteConsulta(valor));
};

const obterDescricaoNomeMenu = (
  url,
  modalidadesFiltroPrincipal,
  turmaSelecionada,
  descricao
) => {
  const urls = {
    [ROUTES.FREQUENCIA_PLANO_AULA]: {
      [String(modalidade.INFANTIL)]: 'Frequência',
      [String(modalidade.EJA)]: 'Frequência/Plano Aula',
      [String(modalidade.FUNDAMENTAL)]: 'Frequência/Plano Aula',
      [String(modalidade.ENSINO_MEDIO)]: 'Frequência/Plano Aula',
    },
    [ROUTES.PLANO_ANUAL]: {
      [String(modalidade.INFANTIL)]: 'Plano Anual',
      [String(modalidade.EJA)]: 'Plano Semestral',
      [String(modalidade.FUNDAMENTAL)]: 'Plano Anual',
      [String(modalidade.ENSINO_MEDIO)]: 'Plano Anual',
    },
    [ROUTES.PLANO_CICLO]: {
      [String(modalidade.INFANTIL)]: 'Plano de Ciclo',
      [String(modalidade.EJA)]: 'Plano de Etapa',
      [String(modalidade.FUNDAMENTAL)]: 'Plano de Ciclo',
      [String(modalidade.ENSINO_MEDIO)]: 'Plano de Ciclo',
    },
  };
  const rota = urls[url];
  if (rota) {
    const modalidadeAtual = obterModalidadeFiltroPrincipal(
      modalidadesFiltroPrincipal,
      turmaSelecionada
    );

    return rota[modalidadeAtual];
  }

  return descricao;
};

const obterAjudaDoSistemaURL = () => {
  const state = store.getState();

  const { usuario, navegacao } = state;
  const { listaUrlAjudaDoSistema } = usuario;
  const { rotaAtiva } = navegacao;

  let urlAjuda = '';
  if (listaUrlAjudaDoSistema?.length && rotaAtiva) {
    const dadosUrlAjuda = listaUrlAjudaDoSistema.find(
      l => !!rotaAtiva?.includes(l?.rota)
    );
    if (dadosUrlAjuda && rotaAtiva?.startsWith?.(dadosUrlAjuda?.rota)) {
      urlAjuda = dadosUrlAjuda.url;
    }
  }

  return urlAjuda;
};

export {
  getObjetoStorageUsuario,
  obterAjudaDoSistemaURL,
  obterDescricaoNomeMenu,
  setMenusPermissoes,
  setSomenteConsultaManual,
  verificaSomenteConsulta,
};
