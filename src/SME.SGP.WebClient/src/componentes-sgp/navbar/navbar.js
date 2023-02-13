import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { store } from '~/redux';
import Filtro from '../filtro';
import LogoDoSgp from '~/recursos/LogoDoSgp.svg';
import NavbarNotificacoes from '../IconeNotificacoes/navbar-notificacoes';
import { Nav, Botao, Botoes, Logo, Icone, Texto, Div } from './navbar.css';

import Perfil from '../perfil';
import { Deslogar } from '~/redux/modulos/usuario/actions';
import history from '~/servicos/history';
import { URL_LOGIN, URL_HOME } from '~/constantes/url';
import { limparDadosFiltro } from '~/redux/modulos/filtro/actions';
import { setExibirMensagemSessaoExpirou } from '~/redux/modulos/mensagens/actions';
import { LimparSessao } from '~/redux/modulos/sessao/actions';
import ServicoNotificacao from '~/servicos/Paginas/ServicoNotificacao';
import { erros } from '~/servicos/alertas';
import { TOKEN_EXPIRADO } from '~/constantes';
import { validarAcaoTela, validarNavegacaoTela } from '~/utils';
import Alert from '~/componentes/alert';
import LoginHelper from '~/paginas/Login/loginHelper';
import Loader from '~/componentes/loader';
import { SGP_BUTTON_SAIR } from '../../constantes/ids/button';

const Navbar = () => {
  const retraido = useSelector(state => state.navegacao.retraido);
  const [carregando, setCarregando] = useState(false);

  const dispatch = useDispatch();

  const helper = new LoginHelper(dispatch);

  const onClickSair = async () => {
    const pararAcao = await validarAcaoTela();
    if (pararAcao) return;

    store.dispatch(limparDadosFiltro());
    store.dispatch(Deslogar());
    store.dispatch(LimparSessao());
    store.dispatch(setExibirMensagemSessaoExpirou(false));
    history.push(URL_LOGIN);
  };

  useEffect(() => {
    ServicoNotificacao.obterQuantidadeNotificacoesNaoLidas().catch(e => {
      if (e?.message.indexOf(TOKEN_EXPIRADO) >= 0) return;

      erros(e);
    });
    ServicoNotificacao.obterUltimasNotificacoesNaoLidas().catch(e => {
      if (e?.message.indexOf(TOKEN_EXPIRADO) >= 0) return;
      erros(e);
    });
  }, []);

  const usuarioStore = useSelector(e => e.usuario);

  const clickEncerrar = async () => {
    setCarregando(true);
    const deslogar = true;
    const resposta = await helper.acessar(
      usuarioStore.administradorSuporte,
      false,
      deslogar
    );
    if (resposta?.sucesso) {
      history.push(URL_HOME);
      ServicoNotificacao.obterUltimasNotificacoesNaoLidas().catch(e =>
        erros(e)
      );
      ServicoNotificacao.obterQuantidadeNotificacoesNaoLidas().catch(e =>
        erros(e)
      );
    } else if (resposta.erro) {
      erros(resposta.erro);
    }
    setCarregando(false);
  };
  return (
    <>
      <Loader loading={carregando} className="sticky-top">
        {usuarioStore?.acessoAdmin && (
          <Alert
            alerta={{
              tipo: 'warning',
              id: 'plano-ciclo-selecione-turma',
              mensagem: `Atenção: Você está acessando o sistema via suporte - Usuário ${usuarioStore?.administradorSuporte?.nome} ${usuarioStore?.administradorSuporte?.login}. `,
              mensagemClick: 'ENCERRAR SUPORTE',
              estiloTitulo: { fontSize: '15px' },
              marginBottom: '0px',
            }}
            onClickMessage={clickEncerrar}
          />
        )}
        <Nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm sticky-top py-0">
          <div className="container-fluid h-100">
            <div className="d-flex w-100 h-100 position-relative">
              <div
                className={`${
                  retraido
                    ? 'col-xl-1 col-lg-1 col-md-1 col-sm-4'
                    : 'col-xl-2 col-lg-2 col-md-2 col-sm-4'
                }`}
              >
                <Link
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  to={URL_HOME}
                  onClick={async e => {
                    await validarNavegacaoTela(e, URL_HOME);
                  }}
                >
                  <Logo
                    src={LogoDoSgp}
                    alt="SGP"
                    className="mx-xl-auto mx-lg-auto mt-xl-0 mt-lg-0 mt-md-0 mt-sm-0 d-block"
                  />
                </Link>
              </div>
              <div
                className={`d-flex justify-content-end ${
                  retraido
                    ? 'col-xl-11 col-lg-11 col-md-11'
                    : 'col-xl-10 col-lg-10 col-md-10'
                } col-sm-8`}
              >
                <Botoes className="align-self-xl-center align-self-lg-center align-self-md-center align-self-sm-center mt-xl-0 mt-lg-0 mt-md-0 mt-sm-0">
                  <ul className="list-inline p-0 m-0">
                    <li className="list-inline-item mr-4">
                      <NavbarNotificacoes
                        Botao={Botao}
                        Icone={Icone}
                        Texto={Texto}
                      />
                    </li>
                    <li className="list-inline-item mr-4">
                      <Perfil Botao={Botao} Icone={Icone} Texto={Texto} />
                    </li>
                    <li className="list-inline-item">
                      <Botao
                        className="text-center"
                        onClick={onClickSair}
                        id={SGP_BUTTON_SAIR}
                      >
                        <Icone className="fa fa-power-off fa-lg" />
                        <Texto className="d-block mt-1">Sair</Texto>
                      </Botao>
                    </li>
                  </ul>
                </Botoes>
              </div>
              <Div
                retraido={retraido}
                className="d-flex align-self-xl-center align-self-lg-center align-self-md-center align-self-sm-center w-100 position-absolute mb-sm-2 mb-md-2"
              >
                <Filtro />
              </Div>
            </div>
          </div>
        </Nav>
      </Loader>
    </>
  );
};

export default Navbar;
