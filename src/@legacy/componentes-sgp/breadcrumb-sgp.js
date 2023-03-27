import React, { useEffect, useState } from 'react';
import { Breadcrumb } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Base } from '../componentes/colors';
import { store } from '@/core/redux';
import { rotaAtiva } from '../redux/modulos/navegacao/actions';
import { obterDescricaoNomeMenu } from '~/servicos/servico-navegacao';
import RotasDto from '~/dtos/rotasDto';
import { validarNavegacaoTela } from '~/utils';
import _ from 'lodash';

const BreadcrumbBody = styled.div`
  height: 24px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  font-size: 12px;
  a,
  a:hover {
    color: ${Base.Roxo};
  }
  a:hover {
    text-decoration: underline;
  }
  .icone-seta {
    margin-right: 0px;
    margin-left: 10px;
    color: ${Base.Roxo};
  }

  ol {
    align-items: center;
  }
`;
const BreadcrumbSgp = () => {
  const navigate = useNavigate();

  const NavegacaoStore = useSelector(
    storeNavegacao => storeNavegacao.navegacao
  );

  const UsuarioStrore = useSelector(storeUsuario => storeUsuario.usuario);
  const modalidadesFiltroPrincipal = useSelector(
    state => state.filtro.modalidades
  );

  const rotas = _.cloneDeep(NavegacaoStore.rotas);

  const [itens, setItens] = useState([]);

  const rotaAtual = window.location.pathname;
  const itemRotaAtual = rotas.get(rotaAtual);

  const rotaDinamica = localStorage.getItem('rota-dinamica');
  const itemRotaDinamica = rotaDinamica ? JSON.parse(rotaDinamica) : null;

  const verificaTrocaNomesBreadcrumb = () => {
    if (rotas?.length) {
      const rotaPlanoCiclo = rotas.get(RotasDto.PLANO_CICLO);
      if (rotaPlanoCiclo) {
        rotaPlanoCiclo.breadcrumbName = obterDescricaoNomeMenu(
          RotasDto.PLANO_CICLO,
          modalidadesFiltroPrincipal,
          UsuarioStrore.turmaSelecionada
        );
      }

      const rotaPlanoAnual = rotas.get(RotasDto.PLANO_ANUAL);
      if (rotaPlanoAnual) {
        rotaPlanoAnual.breadcrumbName = obterDescricaoNomeMenu(
          RotasDto.PLANO_ANUAL,
          modalidadesFiltroPrincipal,
          UsuarioStrore.turmaSelecionada
        );
      }

      const rotaFrequencia = rotas.get(RotasDto.FREQUENCIA_PLANO_AULA);
      if (rotaFrequencia) {
        rotaFrequencia.breadcrumbName = obterDescricaoNomeMenu(
          RotasDto.FREQUENCIA_PLANO_AULA,
          modalidadesFiltroPrincipal,
          UsuarioStrore.turmaSelecionada
        );
      }
    }
  };

  useEffect(() => {
    carregaBreadcrumbs();
  }, [rotaAtual]);

  useEffect(() => {
    carregaBreadcrumbs();
  }, [NavegacaoStore.rotaAtiva]);

  useEffect(() => {
    carregaBreadcrumbs();
  }, [UsuarioStrore.turmaSelecionada]);

  window.onbeforeunload = () => {
    depoisDeCarregar();
  };

  const depoisDeCarregar = () => {
    localStorage.setItem('rota-atual', window.location.pathname);
    store.dispatch(rotaAtiva(window.location.pathname));
  };

  const carregaBreadcrumbs = () => {
    verificaTrocaNomesBreadcrumb();

    if (itemRotaAtual) {
      setItensBreadcrumb(itemRotaAtual);
    } else if (rotaDinamica && itemRotaDinamica.path === rotaAtual) {
      setItensBreadcrumb(itemRotaDinamica);
    } else {
      const itemHome = rotas.get('/');
      setItensBreadcrumb(itemHome);
    }
  };

  const setItensBreadcrumb = item => {
    const newItens = [];
    if (!item?.breadcrumbName && item?.parent) {
      item = rotas.get(item.parent);
    }
    carregaBreadcrumbsExtra(item, newItens);
    newItens.push(
      criarItemBreadcrumb(
        item?.breadcrumbName,
        rotaAtual,
        true,
        true,
        item?.icone,
        item?.dicaIcone
      )
    );
    setItens(newItens);
  };

  const carregaBreadcrumbsExtra = (item, newItens) => {
    const itemParent = rotas.get(item?.parent);
    if (itemParent && itemParent?.parent) {
      carregaBreadcrumbsExtra(itemParent, newItens);
    }

    if (itemParent) {
      newItens.push(
        criarItemBreadcrumb(
          itemParent?.breadcrumbName,
          item?.parent,
          false,
          false,
          itemParent?.icone,
          itemParent?.dicaIcone
        )
      );
    }

    if (item?.menu && item?.menu?.length) {
      item.menu.forEach((menu, i) => {
        newItens.push(
          criarItemBreadcrumb(
            menu,
            `${item.path}-menu${i}`,
            true,
            false,
            item.icone,
            item.dicaIcone
          )
        );
      });
    }
  };

  const criarItemBreadcrumb = (
    breadcrumbName,
    path,
    ehEstatico,
    ehRotaAtual,
    icone,
    dicaIcone
  ) => {
    return { breadcrumbName, path, ehEstatico, ehRotaAtual, icone, dicaIcone };
  };

  return (
    <BreadcrumbBody>
      {itens?.length &&
        itens.map(item => {
          return (
            <Breadcrumb key={item.path}>
              <Link
                hidden={item.ehEstatico}
                to={item.path}
                onClick={async e => {
                  const pararAcao = await validarNavegacaoTela(e, item.path);
                  if (!pararAcao) navigate(item.path);
                }}
              >
                <i className={item.icone} title={item.breadcrumbName} />
                <span hidden={item.path === '/'} style={{ marginLeft: 8 }}>
                  {item.breadcrumbName}
                </span>
                <span
                  hidden={item.path !== '/' && item.icone !== 'fas fa-home'}
                  style={{ marginLeft: 8 }}
                >
                  {item.breadcrumbName}
                </span>
              </Link>
              <i
                hidden={!item.ehEstatico}
                className={item.icone}
                title={item.dicaIcone}
              />
              <span hidden={!item.ehEstatico} style={{ marginLeft: 8 }}>
                {item.breadcrumbName}
              </span>
              <i
                hidden={item.ehRotaAtual}
                style={{ color: Base.Roxo }}
                className="fas fa-chevron-circle-right icone-seta"
              />
            </Breadcrumb>
          );
        })}
    </BreadcrumbBody>
  );
};

export default BreadcrumbSgp;
