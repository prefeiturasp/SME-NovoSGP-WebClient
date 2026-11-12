import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import shortid from 'shortid';
import styled from 'styled-components';
import Button from '~/componentes/button';
import { Base, Colors } from '~/componentes/colors';
import { URL_LOGIN } from '~/constantes/url';
import { store } from '@/core/redux';
import { limparDadosFiltro } from '~/redux/modulos/filtro/actions';
import { LimparSessao } from '~/redux/modulos/sessao/actions';
import {
  DeslogarSessaoExpirou,
  salvarLoginRevalidado,
} from '~/redux/modulos/usuario/actions';
import { erros } from '~/servicos/alertas';
import api from '~/servicos/api';
import { tempoAvisoExpiracaoSessaoMinutos } from '~/servicos/variaveis';

import ContadorExpiracao from './contadorExpiracao';
import { useNavigate } from 'react-router-dom';

const MILISSEGUNDOS_POR_MINUTO = 60 * 1000;
const MINUTOS_POR_HORA = 60;
const tempoAvisoExpiracaoSessaoEmMilissegundos =
  tempoAvisoExpiracaoSessaoMinutos * MILISSEGUNDOS_POR_MINUTO;

const Container = styled.div`
  margin-right: 10px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: -49px !important;
  padding-top: 6px;

  .desc-tempo-expiracao-sessao {
    width: 295px;
    flex-shrink: 0;
    height: 47px;
    font-family: Roboto;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 0.1px;
    color: #b40c02;
    margin-top: 6px;
  }
`;

const CaixaTempoExpiracao = styled.div`
  z-index: 2000;
  display: grid;
  grid-template-columns: 30px max-content 40px;
  width: max-content;
  min-width: 138px;
  height: 47px;
  border-radius: 3px;
  background-color: ${Base.CinzaDesabilitado};

  .tempo-restante {
    margin-top: 10px;
    font-size: 21.2px;
    font-weight: bold;
    color: #42474a;
    white-space: nowrap;
  }

  .botao-refresh {
    i {
      margin-left: 5px;
    }

    margin-top: 5px;
  }

  .icone-tempo {
    font-size: 21px;
    color: white;
    margin-top: 13px;
    margin-left: 6px;
  }
`;

const TempoExpiracaoSessao = () => {
  const navigate = useNavigate();
  const dataHoraExpiracao = useSelector(e => e.usuario.dataHoraExpiracao);

  const [mostraTempoExpiracao, setMostraTempoExpiracao] = useState(false);
  const [tempoParaExpirar, setTempoParaExpirar] = useState({
    expiraEm: '',
    diferenca: '',
  });
  const [tempoParaExibir, setTempoParaExibir] = useState({
    horas: 0,
    minutos: 0,
  });
  const [botaoDesabilitado, setBotaoDesabilitado] = useState(false);

  const calcularTempoExpiracao = useCallback(() => {
    const diferenca = +new Date(dataHoraExpiracao) - +new Date();
    if (diferenca > 0) {
      const tempoParaExibir =
        diferenca > tempoAvisoExpiracaoSessaoEmMilissegundos
          ? diferenca - tempoAvisoExpiracaoSessaoEmMilissegundos
          : 1;
      setTempoParaExpirar({
        expiraNaData: dataHoraExpiracao,
        tempoParaExibir,
        jaExpirou: diferenca < 1,
      });
    }
  }, [dataHoraExpiracao]);

  const deslogarDoUsuario = useCallback(() => {
    store.dispatch(limparDadosFiltro());
    store.dispatch(DeslogarSessaoExpirou());
    store.dispatch(LimparSessao());
    navigate(URL_LOGIN);
  }, [navigate]);

  useEffect(() => {
    if (dataHoraExpiracao) {
      calcularTempoExpiracao();
    }
  }, [calcularTempoExpiracao, dataHoraExpiracao]);

  useEffect(() => {
    if (tempoParaExpirar && tempoParaExpirar.expiraNaData) {
      if (tempoParaExpirar.tempoParaExibir > 0) {
        const timeOutExpiracao = setTimeout(() => {
          setMostraTempoExpiracao(true);
        }, tempoParaExpirar.tempoParaExibir);
        return () => clearTimeout(timeOutExpiracao);
      }
      if (tempoParaExpirar.jaExpirou) {
        deslogarDoUsuario();
      }
    }
    setMostraTempoExpiracao(false);
    return undefined;
  }, [tempoParaExpirar]);

  const obterTempoParaExpirar = useCallback(() => {
    const diferenca = +new Date(dataHoraExpiracao) - +new Date();
    const minutosTotais = Math.max(
      Math.ceil(diferenca / MILISSEGUNDOS_POR_MINUTO),
      0
    );

    return {
      horas: Math.floor(minutosTotais / MINUTOS_POR_HORA),
      minutos: minutosTotais % MINUTOS_POR_HORA,
    };
  }, [dataHoraExpiracao]);

  useEffect(() => {
    if (!mostraTempoExpiracao) {
      return undefined;
    }

    const atualizarTempoParaExpirar = () => {
      setTempoParaExibir(obterTempoParaExpirar());
    };

    atualizarTempoParaExpirar();
    const intervaloAtualizacao = setInterval(atualizarTempoParaExpirar, 1000);

    return () => clearInterval(intervaloAtualizacao);
  }, [mostraTempoExpiracao, obterTempoParaExpirar]);

  const montarMensagemTempoExpiracao = ({ horas, minutos }) => {
    if (horas > 0) {
      const mensagemHoras = `${horas} ${horas === 1 ? 'hora' : 'horas'}`;
      const mensagemMinutos =
        minutos > 0
          ? ` e ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`
          : '';

      return mensagemHoras + mensagemMinutos;
    }

    return `${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
  };

  const revalidarAutenticacao = async () => {
    setBotaoDesabilitado(true);

    const autenticado = await api
      .post('v1/autenticacao/revalidar')
      .catch(e => erros(e))
      .finally(() => setBotaoDesabilitado(false));

    setMostraTempoExpiracao(false);

    if (autenticado && autenticado.data && autenticado.data.token) {
      store.dispatch(
        salvarLoginRevalidado({
          token: autenticado.data.token,
          dataHoraExpiracao: autenticado.data.dataHoraExpiracao,
        })
      );
    }
  };

  return (
    <>
      {mostraTempoExpiracao ? (
        <Container>
          <div className="desc-tempo-expiracao-sessao">
            Sua sessão irá expirar em{' '}
            {montarMensagemTempoExpiracao(tempoParaExibir)}. Renove sua sessão
            aqui para não perder nenhum dado imputado.
          </div>
          <CaixaTempoExpiracao>
            <i className="far fa-clock icone-tempo" />
            <span className="tempo-restante">
              <ContadorExpiracao
                dataHoraExpiracao={dataHoraExpiracao}
                deslogarDoUsuario={deslogarDoUsuario}
              />
            </span>
            <Button
              id={shortid.generate()}
              icon="sync-alt"
              color={Colors.Azul}
              border
              className="botao-refresh"
              onClick={revalidarAutenticacao}
              disabled={botaoDesabilitado}
            />
          </CaixaTempoExpiracao>
        </Container>
      ) : (
        ''
      )}
    </>
  );
};

export default TempoExpiracaoSessao;
