import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import shortid from 'shortid';
import { Base } from '~/componentes/colors';
import Loader from '~/componentes/loader';
import { OPCAO_TODOS } from '~/constantes';
import { store } from '~/redux';
import { selecionaDia } from '~/redux/modulos/calendarioEscolar/actions';
import api from '~/servicos/api';
import DataInicioFim from '../Calendario/componentes/MesCompleto/componentes/Dias/componentes/DiaCompleto/componentes/DataInicioFim';
import {
  ContainerDetalhesIcon,
  DiaCompletoWrapper,
  Linha,
  LinhaEvento,
} from '../Calendario/componentes/MesCompleto/componentes/Dias/componentes/DiaCompleto/styles';
import { TipoEvento } from '../calendarioProfessor/Semana.css';

const SemEvento = () => {
  return (
    <div
      className="d-flex w-100 h-100 justify-content-center d-flex align-items-center fade show"
      style={{ fontSize: 25, color: Base.CinzaBotao }}
    >
      Sem eventos neste dia
    </div>
  );
};

const DiaCompleto = props => {
  const { dias, mesAtual, filtros } = props;
  const {
    tipoCalendarioSelecionado,
    eventoSme,
    dreSelecionada,
    unidadeEscolarSelecionada,
    anoLetivo,
  } = filtros;
  const [eventosDia, setEventosDia] = useState([]);

  const diaSelecionado = useSelector(
    state => state.calendarioEscolar.diaSelecionado
  );

  let estaAberto = false;

  for (let i = 0; i < dias.length; i += 1)
    if (dias[i] === diaSelecionado) estaAberto = true;

  const [carregandoDia, setCarregandoDia] = useState(false);

  useEffect(() => {
    let estado = true;
    if (estado) {
      if (diaSelecionado && estaAberto) {
        setEventosDia([]);
        if (tipoCalendarioSelecionado) {
          setCarregandoDia(true);
          api
            .get(
              `v1/calendarios/eventos/meses/${mesAtual}/dias/${diaSelecionado.getDate()}?EhEventoSme=${eventoSme}&idTipoCalendario=${tipoCalendarioSelecionado}&anoLetivo=${anoLetivo}
              ${
                dreSelecionada && dreSelecionada !== OPCAO_TODOS
                  ? `&DreId=${dreSelecionada}`
                  : ''
              }${
                unidadeEscolarSelecionada &&
                unidadeEscolarSelecionada !== OPCAO_TODOS
                  ? `&UeId=${unidadeEscolarSelecionada}`
                  : ''
              }`
            )
            .then(resposta => {
              if (resposta.data) setEventosDia(resposta.data);
              else setEventosDia([]);
              setCarregandoDia(false);
            })
            .catch(() => {
              setEventosDia([]);
              setCarregandoDia(false);
            });
        } else setEventosDia([]);
      } else setEventosDia([]);
    }
    return () => {
      estado = false;
    };

  }, [
    diaSelecionado,
    dreSelecionada,
    estaAberto,
    eventoSme,
    mesAtual,
    tipoCalendarioSelecionado,
    unidadeEscolarSelecionada,
  ]);

  useEffect(() => {

    estaAberto = false;
    store.dispatch(selecionaDia(undefined));
  }, [filtros]);

  return (
    <DiaCompletoWrapper className={`${estaAberto && `visivel`}`}>
      {estaAberto && (
        <Loader
          loading={carregandoDia}
          tip="Carregando eventos..."
          className={carregandoDia ? 'text-center' : ''}
          style={{ width: 'inherit' }}
        >
          {eventosDia && eventosDia.length > 0 ? (
            <>
              {eventosDia.map(evento => {
                return (
                  <Linha key={shortid.generate()}>
                    <LinhaEvento
                      className="evento"
                      style={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div className="labelEventoAula ml-2 ">
                        <TipoEvento
                          cor={Base.AzulEventoCalendario}
                          className="mb-2"
                        >
                          {evento.tipoEvento || ''}
                        </TipoEvento>
                      </div>
                      <div className="tituloEventoAula">
                        <div className="detalhesEvento">{evento.nome}</div>
                        <div className="detalhesEvento">
                          <DataInicioFim dadosAula={evento} />
                        </div>
                        {evento.dreNome ? (
                          <div className="detalhesEvento">
                            <span>
                              DRE: <strong>{evento.dreNome}</strong>
                            </span>
                          </div>
                        ) : (
                          ''
                        )}
                        {evento.ueNome ? (
                          <div className="detalhesEvento">
                            <span>
                              UE: <strong>{evento.ueNome}</strong>
                            </span>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </LinhaEvento>
                    {evento.descricao ? (
                      <ContainerDetalhesIcon>
                        <Tooltip title={evento.descricao}>
                          <i className="fas fa-info-circle" />
                          Detalhes
                        </Tooltip>
                      </ContainerDetalhesIcon>
                    ) : (
                      ''
                    )}
                  </Linha>
                );
              })}
            </>
          ) : !carregandoDia ? (
            <SemEvento />
          ) : (
            ''
          )}
        </Loader>
      )}
    </DiaCompletoWrapper>
  );
};

DiaCompleto.propTypes = {
  dias: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  mesAtual: PropTypes.number,
  filtros: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

DiaCompleto.defaultProps = {
  dias: [],
  mesAtual: 0,
  filtros: {},
};

export default DiaCompleto;
