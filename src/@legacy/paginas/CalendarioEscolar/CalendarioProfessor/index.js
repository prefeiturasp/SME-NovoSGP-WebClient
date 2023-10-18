import { useCallback, useEffect, useReducer, useState } from 'react';

// Redux
import { useDispatch, useSelector } from 'react-redux';

// Componentes
import { Card, Grid, Loader } from '~/componentes';

// Componentes Internos
import DropDownTipoCalendario from './componentes/DropDownTipoCalendario';

// Estilos
import { Linha } from '~/componentes/EstilosGlobais';

// Componentes SGP
import {
  AlertaSelecionarTurma,
  Cabecalho,
  Calendario,
} from '~/componentes-sgp';

// Serviços
import CalendarioProfessorServico from '~/servicos/Paginas/CalendarioProfessor';
import { erro } from '~/servicos/alertas';

// Reducer
import Reducer, { estadoInicial } from './reducer';
import {
  setarCarregandoDia,
  setarCarregandoMes,
  setarEventosDia,
  setarEventosMes,
} from './reducer/actions';

// DTOs
import { ROUTES } from '@/core/enum/routes';
import { useNavigate } from 'react-router-dom';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { selecionaDia } from '~/redux/modulos/calendarioProfessor/actions';

function CalendarioProfessor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { turmaSelecionada, permissoes } = useSelector(
    estado => estado.usuario
  );

  const permissaoTela = permissoes[ROUTES.CALENDARIO_PROFESSOR];

  const [estado, disparar] = useReducer(Reducer, estadoInicial);
  const [tipoCalendarioId, setTipoCalendarioId] = useState(undefined);

  const onClickMesHandler = useCallback(
    mes => {
      async function buscarEventosMes() {
        try {
          disparar(setarCarregandoMes(true));
          const { data, status } =
            await CalendarioProfessorServico.buscarEventosAulasMes({
              numeroMes: mes.numeroMes,
              dre: turmaSelecionada.dre,
              anoLetivo: turmaSelecionada.anoLetivo,
              tipoCalendarioId,
              turma: turmaSelecionada.turma,
              ue: turmaSelecionada.unidadeEscolar,
            });

          if (data && status === 200) {
            disparar(setarCarregandoMes(false));
            disparar(
              setarEventosMes({
                ...mes,
                dias: data,
              })
            );
          } else if (status === 204) {
            disparar(setarCarregandoMes(false));
          }
        } catch (error) {
          disparar(setarCarregandoMes(false));
          erro('Não foi possível buscar dados do mês.');
        }
      }
      buscarEventosMes();
    },
    [
      tipoCalendarioId,
      turmaSelecionada.anoLetivo,
      turmaSelecionada.dre,
      turmaSelecionada.turma,
      turmaSelecionada.unidadeEscolar,
    ]
  );

  const onClickDiaHandler = useCallback(
    (dia, fechando) => {
      dispatch(selecionaDia(dia));
      if (fechando) return;
      async function buscarEventosDias() {
        try {
          disparar(setarCarregandoDia(true));
          const { data, status } =
            await CalendarioProfessorServico.buscarEventosAulasDia({
              dia: dia.getDate(),
              numeroMes: dia.getMonth() + 1,
              tipoCalendarioId,
              dre: turmaSelecionada.dre,
              dreId: turmaSelecionada.dreId,
              ue: turmaSelecionada.unidadeEscolar,
              turma: turmaSelecionada.turma,
              anoLetivo: turmaSelecionada.anoLetivo,
            });

          if (data && status === 200) {
            disparar(setarCarregandoDia(false));
            const mes = {
              estaAberto: false,
              eventos: 0,
              nome: '',
              numeroMes: dia.getMonth() + 1,
            };
            disparar(
              setarEventosMes({
                ...mes,
                dias: data.eventosAulasMes,
              })
            );

            disparar(
              setarEventosDia({
                diaSelecionado: dia,
                dados: data,
              })
            );
          } else if (status === 204) {
            disparar(setarCarregandoDia(false));
          }
        } catch (error) {
          disparar(setarCarregandoDia(false));
          erro('Não foi possível buscar dados do dia.');
        }
      }
      buscarEventosDias();
    },

    [
      tipoCalendarioId,
      turmaSelecionada.anoLetivo,
      turmaSelecionada.dre,
      turmaSelecionada.turma,
      turmaSelecionada.unidadeEscolar,
    ]
  );

  const onChangeTipoCalendarioIdHandler = useCallback(valor => {
    setTipoCalendarioId(valor);
  }, []);

  useEffect(() => {
    if (Object.keys(turmaSelecionada).length === 0) {
      setTipoCalendarioId(undefined);
    }
  }, [turmaSelecionada]);

  return (
    <>
      <AlertaSelecionarTurma />
      <Loader loading={false}>
        <Cabecalho pagina="Calendário do professor">
          <BotaoVoltarPadrao
            onClick={() => {
              navigate('/');
            }}
          />
        </Cabecalho>
        <Card>
          <Grid cols={4} className="m-0">
            <DropDownTipoCalendario
              turmaSelecionada={turmaSelecionada.turma}
              onChange={valor => onChangeTipoCalendarioIdHandler(valor)}
              valor={tipoCalendarioId}
            />
          </Grid>
          <Grid cols={12}>
            <Linha className="pt-2">
              <Calendario
                eventos={estado.eventos}
                onClickMes={mes => onClickMesHandler(mes)}
                onClickDia={(dia, fechando) => onClickDiaHandler(dia, fechando)}
                carregandoCalendario={estado.carregandoCalendario}
                carregandoMes={estado.carregandoMes}
                carregandoDia={estado.carregandoDia}
                permissaoTela={permissaoTela}
                tipoCalendarioId={tipoCalendarioId}
                turmaSelecionada={turmaSelecionada}
              />
            </Linha>
          </Grid>
        </Card>
      </Loader>
    </>
  );
}

CalendarioProfessor.propTypes = {};

CalendarioProfessor.defaultProps = {};

export default CalendarioProfessor;
