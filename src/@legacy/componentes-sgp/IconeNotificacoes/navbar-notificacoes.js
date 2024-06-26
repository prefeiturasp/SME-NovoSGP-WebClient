import {
  HttpTransportType,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import * as moment from 'moment';
import PropTypes from 'prop-types';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import shortid from 'shortid';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import {
  webSocketNotificacaoExcluida,
  webSocketNotificacaoLida,
  webSocketNotificacaoCriada,
  setIniciarNotificacoesSemWebSocket,
} from '~/redux/modulos/notificacoes/actions';
import { erros } from '~/servicos/alertas';
import servicoNotificacao from '~/servicos/Paginas/ServicoNotificacao';
import { obterUrlSignalR } from '~/servicos/variaveis';
import { validarAcaoTela } from '~/utils';
import { Count, Lista, Tr } from './navbar-notificacoes.css';

const NavbarNotificacoes = props => {
  const { Botao, Icone, Texto } = props;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const usuario = useSelector(store => store.usuario);
  const usuarioRf = usuario?.rf;

  const listaRef = useRef();

  const [mostraNotificacoes, setMostraNotificacoes] = useState(false);
  const statusLista = ['', 'Não lida', 'Lida', 'Aceita', 'Recusada'];

  const notificacoes = useSelector(state => state.notificacoes);
  const { iniciarNotificacoesSemWebSocket } = notificacoes;
  const { loaderGeral } = useSelector(state => state.loader);

  const [connection, setConnection] = useState(null);
  const [urlConnection, setUrlConnection] = useState('');

  const obterListaNotificacoes = () => {
    servicoNotificacao.obterUltimasNotificacoesNaoLidas().catch(e => erros(e));
  };

  const conectarSignalR = useCallback(async () => {
    if (urlConnection) {
      const hubConnection = new HubConnectionBuilder()
        .withUrl(`${urlConnection}/notificacao?usuarioRf=${usuarioRf}`, {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: () => 60000,
        })
        .configureLogging(LogLevel.Information)
        .build();

      setConnection(hubConnection);
    } else {
      setConnection(null);
      dispatch(setIniciarNotificacoesSemWebSocket(true));
    }
  }, [urlConnection, usuarioRf]);

  useEffect(() => {
    conectarSignalR();
  }, [urlConnection, conectarSignalR]);

  useEffect(() => {
    if (obterUrlSignalR) {
      setUrlConnection(obterUrlSignalR);
    } else {
      setUrlConnection('');
      dispatch(setIniciarNotificacoesSemWebSocket(true));
    }
  }, []);

  const startConnection = useCallback(async () => {
    if (connection) {
      await connection.stop();
      connection
        .start()
        .then(() => {
          connection.on('NotificacaoCriada', (codigo, data, titulo, id) => {
            const params = {
              codigo,
              data,
              titulo,
              id,
            };
            dispatch(webSocketNotificacaoCriada(params));
          });
          connection.on('NotificacaoLida', (codigo, isAnoAnterior) => {
            const params = {
              codigo,
              isAnoAnterior,
              obterListaNotificacoes,
            };
            dispatch(webSocketNotificacaoLida(params));
          });
          connection.on(
            'NotificacaoExcluida',
            (codigo, status, isAnoAnterior) => {
              const params = {
                codigo,
                status,
                isAnoAnterior,
                obterListaNotificacoes,
              };
              dispatch(webSocketNotificacaoExcluida(params));
            }
          );
          dispatch(setIniciarNotificacoesSemWebSocket(false));
        })
        .catch(async () => {
          dispatch(setIniciarNotificacoesSemWebSocket(true));
          await connection.stop();
          setTimeout(() => {
            startConnection();
          }, 60000);
        });

      connection.onclose(async () => {
        dispatch(setIniciarNotificacoesSemWebSocket(true));
      });
      connection.onreconnecting(() => {
        dispatch(setIniciarNotificacoesSemWebSocket(true));
      });
      connection.onreconnected(() => {
        dispatch(setIniciarNotificacoesSemWebSocket(false));
      });
    }
  }, [connection]);

  useEffect(() => {
    if (connection) startConnection();
    return () => {
      if (connection) connection.stop();
    };
  }, [connection, startConnection]);

  const obterQtdNaoLidas = () => {
    servicoNotificacao
      .obterQuantidadeNotificacoesNaoLidas()
      .catch(e => erros(e));
  };

  useEffect(() => {
    obterQtdNaoLidas();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!loaderGeral) {
        obterQtdNaoLidas();
      }
    }, 60000);

    if (!iniciarNotificacoesSemWebSocket) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [loaderGeral, iniciarNotificacoesSemWebSocket]);

  useLayoutEffect(() => {
    const handleClickFora = event => {
      if (listaRef.current && !listaRef.current.contains(event.target)) {
        setMostraNotificacoes(!mostraNotificacoes);
      }
    };
    if (mostraNotificacoes) document.addEventListener('click', handleClickFora);
    else document.removeEventListener('click', handleClickFora);
  }, [mostraNotificacoes]);

  useEffect(() => {
    if (mostraNotificacoes) {
      if (iniciarNotificacoesSemWebSocket) {
        obterListaNotificacoes();
      } else if (!notificacoes?.notificacoes?.length) {
        obterListaNotificacoes();
      }
    }
  }, [mostraNotificacoes]);

  const onClickBotao = () => {
    setMostraNotificacoes(antigo => !antigo);
  };

  const onClickNotificacao = async codigo => {
    const pararAcao = await validarAcaoTela();
    if (pararAcao) return;

    if (codigo) {
      navigate(`/notificacoes/${codigo}`);
      setMostraNotificacoes(!mostraNotificacoes);
    }
  };

  const onClickVerTudo = async () => {
    const pararAcao = await validarAcaoTela();
    if (pararAcao) return;

    navigate(`/notificacoes`);
    setMostraNotificacoes(!mostraNotificacoes);
  };

  return (
    <div ref={listaRef} className="position-relative">
      <Botao className="text-center stretched-link" onClick={onClickBotao}>
        <Count count={notificacoes.quantidade} overflowCount={99}>
          <Icone className="fa fa-bell fa-lg" />
        </Count>
        <Texto
          className={`d-block mt-1 ${
            mostraNotificacoes &&
            notificacoes.quantidade > 0 &&
            'font-weight-bold'
          }`}
        >
          Notificações
        </Texto>
      </Botao>
      {mostraNotificacoes && notificacoes.notificacoes.length > 0 && (
        <Lista className="container position-absolute rounded border bg-white shadow p-0">
          <table className="table mb-0">
            <tbody>
              {notificacoes.notificacoes.map(notificacao => {
                return (
                  <Tr
                    key={shortid.generate()}
                    status={notificacao.status}
                    onClick={() => onClickNotificacao(notificacao.id)}
                  >
                    <td className="py-1 pl-2 pr-1 text-center align-middle">
                      <i className="fa fa-info-circle" />
                    </td>
                    <th
                      className="py-1 px-1 text-center align-middle"
                      scope="row"
                    >
                      {notificacao.codigo}
                    </th>
                    <td className="py-1 px-1 align-middle w-75">
                      {notificacao.titulo}
                    </td>
                    <td className="py-1 px-1 text-center align-middle status">
                      {statusLista[notificacao.status]}
                    </td>
                    <td className="py-1 px-2 align-middle w-25 text-right">
                      {moment(notificacao.data).format('DD/MM/YYYY HH:mm:ss')}
                    </td>
                  </Tr>
                );
              })}
            </tbody>
          </table>
          <Button
            label="Ver tudo"
            className="btn-block"
            color={Colors.Roxo}
            fontSize="12px"
            customRadius="border-top-right-radius: 0 !important; border-top-left-radius: 0 !important;"
            border
            bold
            onClick={onClickVerTudo}
          />
        </Lista>
      )}
    </div>
  );
};

NavbarNotificacoes.propTypes = {
  Botao: PropTypes.oneOfType([PropTypes.object]).isRequired,
  Icone: PropTypes.oneOfType([PropTypes.object]).isRequired,
  Texto: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default NavbarNotificacoes;
