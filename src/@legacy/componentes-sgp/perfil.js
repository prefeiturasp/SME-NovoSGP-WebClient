import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { limparDadosFiltro } from '~/redux/modulos/filtro/actions';
import { setLoaderGeral } from '~/redux/modulos/loader/actions';
import {
  Deslogar,
  removerTurma,
  salvarDadosLogin,
} from '~/redux/modulos/usuario/actions';
import { erro } from '~/servicos/alertas';
import api from '~/servicos/api';
import { setMenusPermissoes } from '~/servicos/servico-navegacao';

import { Base } from '../componentes/colors';
import { store } from '@/core/redux';
import {
  perfilSelecionado,
  setTrocouPerfil,
} from '../redux/modulos/perfil/actions';
import ServicoDashboard from '~/servicos/Paginas/Dashboard/ServicoDashboard';
import { validarAcaoTela } from '~/utils';
import {
  SGP_MENU_PERFIL_BUTTON_EXPANDIR_RETRAIR_PERFIL,
  SGP_MENU_PERFIL_LISTA_PERFIS,
} from '../constantes/ids/menu';
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown } from 'antd';

const ContainerPerfil = styled(Button)`
  background: #f5f6f8;
  height: 55px;
  min-width: 161px;
  border-radius: 4px;
  display: flex;
  padding: 3px 10px;
`;

const Texto = styled.div`
  font-size: 12px;
  color: #42474a;
`;

const Perfil = () => {
  // eslint-disable-next-line react/prop-types

  const [ocultaPerfis, setarOcultaPerfis] = useState(true);
  const perfilStore = useSelector(e => e.perfil);
  const usuarioStore = useSelector(e => e.usuario);
  const navigate = useNavigate();

  const ItensPerfil = styled.div`
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    height: auto;
    background: ${Base.Branco};
    border: solid ${Base.CinzaDesabilitado} 1px;
    position: absolute;
  `;

  const Item = styled.tr`
    text-align: left;
    width: 100%;
    height: 100%;
    vertical-align: middle !important;

    &:not(:last-child) {
      border-bottom: solid ${Base.CinzaDesabilitado} 1px !important;
    }

    &:hover {
      cursor: pointer;
      background: #e7e6f8;
      font-weight: bold !important;
    }

    td {
      height: 35px;
      font-size: 10px;
      padding-left: 7px;
      width: 145px;
    }

    i {
      font-size: 14px;
      color: #707683;
    }
  `;

  const limparFiltro = () => {
    store.dispatch(limparDadosFiltro());
    store.dispatch(removerTurma());
  };

  const cancelarRequisicoesPendentes = () => {
    api.CancelarRequisicoes('Cancelado pelo usuário');
  };

  const gravarPerfilSelecionado = async perfil => {
    const pararAcao = await validarAcaoTela();
    if (pararAcao) return;

    if (perfil) {
      const perfilNovo = perfilStore.perfis.filter(
        item => item.codigoPerfil === perfil
      );

      if (
        perfilStore?.perfilSelecionado?.codigoPerfil !==
        perfilNovo[0].codigoPerfil
      ) {
        store.dispatch(setLoaderGeral(true));
        api
          .put(`v1/autenticacao/perfis/${perfilNovo[0].codigoPerfil}`)
          .then(resp => {
            const {
              token,
              ehProfessor,
              ehProfessorCj,
              ehProfessorPoa,
              dataHoraExpiracao,
              ehProfessorInfantil,
              ehProfessorCjInfantil,
              ehPerfilProfessor,
            } = resp.data;

            const {
              rf,
              modificarSenha,
              possuiPerfilSmeOuDre,
              possuiPerfilDre,
              possuiPerfilSme,
              menu,
            } = usuarioStore;

            store.dispatch(
              salvarDadosLogin({
                token,
                rf,
                usuario: usuarioStore,
                modificarSenha,
                possuiPerfilSmeOuDre,
                possuiPerfilDre,
                possuiPerfilSme,
                ehProfessorCj,
                ehProfessor,
                menu,
                ehProfessorPoa,
                dataHoraExpiracao,
                ehProfessorInfantil,
                ehProfessorCjInfantil,
                ehPerfilProfessor,
              })
            );

            ServicoDashboard.obterDadosDashboard();

            setMenusPermissoes();
            limparFiltro();
            store.dispatch(perfilSelecionado(perfilNovo[0]));
            store.dispatch(setTrocouPerfil(true));
            setTimeout(() => {
              store.dispatch(setLoaderGeral(false));
            }, 1000);
          })
          .catch(() => {
            erro('Sua sessão expirou');
            setTimeout(() => {
              store.dispatch(Deslogar());
            }, 2000);
          });
        navigate('/');
      } else {
        store.dispatch(perfilSelecionado(perfilNovo[0]));
        store.dispatch(setTrocouPerfil(true));
        limparFiltro();
      }
    } else {
      limparFiltro();
    }
  };

  const onClickPerfil = async e => {
    cancelarRequisicoesPendentes();
    gravarPerfilSelecionado(e.currentTarget.accessKey);
  };

  const onClickBotao = () => {
    if (perfilStore.perfis.length > 1) {
      setarOcultaPerfis(!ocultaPerfis);
    }
  };

  return (
    <div className="position-relative">
      <Dropdown
        placement="bottomRight"
        trigger={['click']}
        disabled={perfilStore.perfis.length <= 1}
        id={SGP_MENU_PERFIL_BUTTON_EXPANDIR_RETRAIR_PERFIL}
        onOpenChange={onClickBotao}
        dropdownRender={() => (
          <ItensPerfil className="list-inline">
            <table id={SGP_MENU_PERFIL_LISTA_PERFIS}>
              <tbody>
                {perfilStore.perfis.map(item => (
                  <Item
                    key={item.codigoPerfil}
                    onClick={onClickPerfil}
                    accessKey={item.codigoPerfil}
                  >
                    <td style={{ width: '20px' }}>
                      <i
                        value={item.codigoPerfil}
                        className="fas fa-user-circle"
                      />
                    </td>
                    <td
                      style={{
                        width: '100%',
                        fontWeight:
                          item.codigoPerfil ===
                          perfilStore?.perfilSelecionado?.codigoPerfil
                            ? 'bold'
                            : 'initial',
                      }}
                    >
                      {item.nomePerfil + (item.sigla ? `(${item.sigla})` : '')}
                    </td>
                  </Item>
                ))}
              </tbody>
            </table>
          </ItensPerfil>
        )}
      >
        <ContainerPerfil>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              marginRight: '7px',
              lineHeight: '16px',
            }}
          >
            <Texto style={{ fontWeight: 700 }}>
              {usuarioStore?.meusDados?.rf
                ? `RF: ${usuarioStore.meusDados.rf}`
                : ''}
              {!usuarioStore?.meusDados?.rf && usuarioStore?.meusDados?.cpf
                ? `CPF: ${usuarioStore?.meusDados?.cpf}`
                : ''}
            </Texto>
            <Texto>{usuarioStore?.meusDados?.nome}</Texto>
            <Texto>
              {perfilStore?.perfilSelecionado?.sigla ||
                perfilStore?.perfilSelecionado?.nomePerfil}
            </Texto>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <i
              className={`fas fa-angle-${ocultaPerfis ? 'up' : 'down'}`}
              style={{ fontSize: 18 }}
            />
          </div>
        </ContainerPerfil>
      </Dropdown>
    </div>
  );
};

export default Perfil;
