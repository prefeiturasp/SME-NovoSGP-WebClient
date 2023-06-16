import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setDadosCollapseLocalizarEstudante } from '~/redux/modulos/collapseLocalizarEstudante/actions';
import { setDadosObjectCardEstudante } from '~/redux/modulos/objectCardEstudante/actions';
import {
  setAtualizarDados,
  setExibirLoaderPlanoAEE,
  setPlanoAEEDados,
  setPlanoAEELimparDados,
} from '~/redux/modulos/planoAEE/actions';
import { erros, ServicoCalendarios } from '~/servicos';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';
import MontarDadosTabs from './montarDadosTabs';

const TabCadastroPlano = () => {
  const dispatch = useDispatch();
  const paramsRoute = useParams();

  const planoId = paramsRoute?.id || 0;

  const atualizarDados = useSelector(store => store.planoAEE.atualizarDados);

  const dadosCollapseLocalizarEstudante = useSelector(
    store => store.collapseLocalizarEstudante.dadosCollapseLocalizarEstudante
  );

  const obterPlanoPorId = useCallback(async () => {
    let turmaCodigo = 0;
    let codigoAluno = 0;

    if (!planoId) {
      turmaCodigo = dadosCollapseLocalizarEstudante?.codigoTurma;
      codigoAluno = dadosCollapseLocalizarEstudante?.codigoAluno;
    }

    dispatch(setPlanoAEELimparDados());
    dispatch(setExibirLoaderPlanoAEE(true));
    const resultado = await ServicoPlanoAEE.obterPlanoPorId(
      planoId,
      turmaCodigo,
      codigoAluno
    ).catch(e => erros(e));

    if (resultado?.data) {
      if (resultado?.data?.aluno) {
        const { aluno } = resultado?.data;

        const dadosObjectCard = {
          nome: aluno.nome,
          dataNascimento: aluno.dataNascimento,
          situacao: aluno.situacao,
          dataSituacao: aluno.dataSituacao,
          nomeResponsavel: aluno.nomeResponsavel,
          tipoResponsavel: aluno.tipoResponsavel,
          celularResponsavel: aluno.celularResponsavel,
          dataAtualizacaoContato: aluno.dataAtualizacaoContato,
          codigoEOL: aluno.codigoAluno,
          turma: aluno.turmaEscola,
          ehAtendidoAEE: aluno?.ehAtendidoAEE,
          numeroChamada: aluno.numeroAlunoChamada,
        };

        if (resultado?.data?.turma?.codigo) {
          const retornoFrequencia =
            await ServicoCalendarios.obterFrequenciaAluno(
              aluno.codigoAluno,
              resultado?.data?.turma?.codigo
            ).catch(e => erros(e));
          dadosObjectCard.frequencia = retornoFrequencia?.data || '';
        }
        dispatch(setDadosObjectCardEstudante(dadosObjectCard));
      }

      if (resultado?.data?.turma) {
        const { aluno, turma } = resultado?.data;
        const dadosLocalizarEstudante = {
          anoLetivo: turma.anoLetivo,
          codigoAluno: aluno.codigoAluno,
          codigoTurma: turma.codigo,
          turmaId: turma.id,
          codigoUe: turma?.codigoUE,
        };

        dispatch(setDadosCollapseLocalizarEstudante(dadosLocalizarEstudante));
      }

      dispatch(setPlanoAEEDados(resultado?.data));
    } else {
      dispatch(setPlanoAEELimparDados());
    }
    dispatch(setExibirLoaderPlanoAEE(false));
  }, [planoId, dispatch, dadosCollapseLocalizarEstudante]);

  useEffect(() => {
    if (atualizarDados) {
      obterPlanoPorId();
    }
    dispatch(setAtualizarDados(false));
  }, [atualizarDados, dispatch, obterPlanoPorId]);

  useEffect(() => {
    if (planoId && !dadosCollapseLocalizarEstudante?.codigoAluno) {
      obterPlanoPorId();
    } else if (!planoId && dadosCollapseLocalizarEstudante?.codigoAluno) {
      obterPlanoPorId();
    }
  }, [obterPlanoPorId, planoId, dadosCollapseLocalizarEstudante]);

  return <MontarDadosTabs />;
};

export default TabCadastroPlano;
