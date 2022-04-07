import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Loader } from '~/componentes';
import {
  setAnotacoesAluno,
  setAnotacoesPedagogicas,
  setAuditoriaAnotacaoRecomendacao,
  setConselhoClasseEmEdicao,
  setDentroPeriodo,
  setListaoRecomendacoesAlunoFamilia,
  setRecomendacaoAluno,
  setRecomendacaoFamilia,
  setSituacaoConselhoAluno,
} from '~/redux/modulos/conselhoClasse/actions';
import { erros } from '~/servicos/alertas';
import ServicoConselhoClasse from '~/servicos/Paginas/ConselhoClasse/ServicoConselhoClasse';
import AnotacoesAluno from './AnotacoesAluno/anotacoesAluno';
import AnotacoesPedagogicas from './AnotacoesPedagogicas/anotacoesPedagogicas';
import AuditoriaAnotacaoRecomendacao from './AuditoriaAnotacaoRecomendacao/auditoriaAnotacaoRecomendacao';
import RecomendacaoAlunoFamilia from './RecomendacaoAlunoFamilia/recomendacaoAlunoFamilia';

const AnotacoesRecomendacoes = props => {
  const { codigoTurma, bimestre } = props;
  const dispatch = useDispatch();

  const fechamentoPeriodoInicioFim = useSelector(
    store => store.conselhoClasse.fechamentoPeriodoInicioFim
  );

  const dadosPrincipaisConselhoClasse = useSelector(
    store => store.conselhoClasse.dadosPrincipaisConselhoClasse
  );

  const {
    conselhoClasseId,
    fechamentoTurmaId,
    alunoCodigo,
    alunoDesabilitado,
  } = dadosPrincipaisConselhoClasse;

  const [dadosIniciais, setDadosIniciais] = useState({
    anotacoesPedagogicas: '',
    recomendacaoAluno: '',
    recomendacaoFamilia: '',
    anotacoesAluno: '',
  });

  const turmaStore = useSelector(state => state.usuario.turmaSelecionada);

  const bimestreAtual = useSelector(
    store => store.conselhoClasse.bimestreAtual
  );

  const dadosAlunoObjectCard = useSelector(
    store => store.conselhoClasse.dadosAlunoObjectCard
  );

  const [exibir, setExibir] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const [matriculaAtivaPeriodo, setMatriculaAtivaPeriodo] = useState(true);

  // TODO Validar a necessidade de chamar quando esta alterando um registro ou usar somente quando for carergar dados na tela!
  const onChangeAnotacoesRecomendacoes = useCallback(
    (valor, campo) => {
      const dadosDto = dadosIniciais;
      dadosDto[campo] = valor;
      setDadosIniciais(dadosDto);
    },
    [dadosIniciais]
  );

  const onChangeAnotacoesPedagogicas = useCallback(
    valor => {
      dispatch(setAnotacoesPedagogicas(valor));
      onChangeAnotacoesRecomendacoes(valor, 'anotacoesPedagogicas');
    },
    [dispatch, onChangeAnotacoesRecomendacoes]
  );

  const onChangeRecomendacaoAluno = useCallback(
    valor => {
      dispatch(setRecomendacaoAluno(valor));
      onChangeAnotacoesRecomendacoes(valor, 'recomendacaoAluno');
    },
    [dispatch, onChangeAnotacoesRecomendacoes]
  );

  const onChangeRecomendacaoFamilia = useCallback(
    valor => {
      dispatch(setRecomendacaoFamilia(valor));
      onChangeAnotacoesRecomendacoes(valor, 'recomendacaoFamilia');
    },
    [dispatch, onChangeAnotacoesRecomendacoes]
  );

  const setarAnotacaoAluno = useCallback(
    valor => {
      dispatch(setAnotacoesAluno(valor));
    },
    [dispatch]
  );

  const setarSituacaoConselho = useCallback(
    valor => {
      dispatch(setSituacaoConselhoAluno(valor));
    },
    [dispatch]
  );

  const setarDentroDoPeriodo = useCallback(
    valor => {
      dispatch(setDentroPeriodo(valor));
    },
    [dispatch]
  );

  const setarAuditoria = useCallback(
    dados => {
      const { auditoria } = dados;
      let auditoriaDto = null;
      if (auditoria) {
        auditoriaDto = {
          criadoEm: auditoria.criadoEm,
          criadoPor: auditoria.criadoPor,
          criadoRF: auditoria.criadoRF,
          alteradoEm: auditoria.alteradoEm,
          alteradoPor: auditoria.alteradoPor,
          alteradoRF: auditoria.alteradoRF,
        };
      }
      dispatch(setAuditoriaAnotacaoRecomendacao(auditoriaDto));
    },
    [dispatch]
  );

  const setarListaoRecomendacoes = useCallback(
    valor => {
      dispatch(setListaoRecomendacoesAlunoFamilia(valor));
    },
    [dispatch]
  );

  const pegueInicioPeriodoFechamento = () => {
    if (fechamentoPeriodoInicioFim) {
      const { periodoFechamentoInicio } = fechamentoPeriodoInicioFim;

      if (periodoFechamentoInicio)
        return moment(periodoFechamentoInicio).format('MM-DD-YYYY');
    }

    return null;
  };

  const desabilitarEdicaoAluno = () => {
    const dataSituacao = moment(dadosAlunoObjectCard.dataSituacao).format(
      'MM-DD-YYYY'
    );
    const dataFimBimestre = moment(bimestreAtual.dataFim).format('MM-DD-YYYY');
    const dataInicioPeriodoFechamento = pegueInicioPeriodoFechamento();

    if (
      matriculaAtivaPeriodo &&
      (!alunoDesabilitado ||
        dataSituacao >= dataFimBimestre ||
        (dataInicioPeriodoFechamento &&
          dataSituacao >= dataInicioPeriodoFechamento))
    ) {
      return false;
    }

    return true;
  };

  const obterAnotacoesRecomendacoes = useCallback(async () => {
    setCarregando(true);

    const resposta = await ServicoConselhoClasse.obterAnotacoesRecomendacoes(
      conselhoClasseId,
      fechamentoTurmaId,
      alunoCodigo,
      codigoTurma,
      bimestre.valor,
      turmaStore?.consideraHistorico
    ).catch(e => erros(e));

    if (resposta && resposta.data) {
      const retornoRecomendacoes = await ServicoConselhoClasse.obterListaAnotacoesRecomendacoes().catch(
        e => erros(e)
      );

      if (retornoRecomendacoes?.data) {
        setarListaoRecomendacoes(retornoRecomendacoes.data);
      }

      setMatriculaAtivaPeriodo(resposta.data.matriculaAtiva);

      if (!desabilitarEdicaoAluno()) {
        setarDentroDoPeriodo(!resposta.data.somenteLeitura);
      }

      onChangeAnotacoesPedagogicas(resposta.data.anotacoesPedagogicas);
      onChangeRecomendacaoAluno(resposta.data.recomendacaoAluno);
      onChangeRecomendacaoFamilia(resposta.data.recomendacaoFamilia);
      setarAnotacaoAluno(resposta.data.anotacoesAluno);
      setarSituacaoConselho(resposta.data.situacaoConselho);
      setarAuditoria(resposta.data);
      setExibir(true);
      setCarregando(false);
      return;
    }
    setarAuditoria({});
    setExibir(false);
    setCarregando(false);
  }, [
    alunoCodigo,
    conselhoClasseId,
    fechamentoTurmaId,
    onChangeAnotacoesPedagogicas,
    onChangeRecomendacaoAluno,
    onChangeRecomendacaoFamilia,
    setarAnotacaoAluno,
    setarAuditoria,
    setarDentroDoPeriodo,
    setarSituacaoConselho,
    alunoDesabilitado,
    bimestre,
    matriculaAtivaPeriodo,
  ]);

  useEffect(() => {
    if (alunoCodigo && fechamentoTurmaId) {
      obterAnotacoesRecomendacoes();
    }
  }, [fechamentoTurmaId, alunoCodigo, obterAnotacoesRecomendacoes]);

  const setarConselhoClasseEmEdicao = emEdicao => {
    dispatch(setConselhoClasseEmEdicao(emEdicao));
  };

  return (
    <Loader
      className={carregando ? 'text-center' : ''}
      loading={carregando}
      tip="Carregando recomendações e anotações"
    >
      {exibir ? (
        <>
          <RecomendacaoAlunoFamilia
            alunoDesabilitado={desabilitarEdicaoAluno()}
            onChangeRecomendacaoAluno={valor => {
              onChangeRecomendacaoAluno(valor);
              setarConselhoClasseEmEdicao(true);
            }}
            onChangeRecomendacaoFamilia={valor => {
              onChangeRecomendacaoFamilia(valor);
              setarConselhoClasseEmEdicao(true);
            }}
            dadosIniciais={dadosIniciais}
          />
          <AnotacoesPedagogicas
            alunoDesabilitado={desabilitarEdicaoAluno()}
            onChange={valor => {
              onChangeAnotacoesPedagogicas(valor);
              setarConselhoClasseEmEdicao(true);
            }}
            dadosIniciais={dadosIniciais}
          />
          <AnotacoesAluno />
          <AuditoriaAnotacaoRecomendacao />
        </>
      ) : (
        ''
      )}
    </Loader>
  );
};

AnotacoesRecomendacoes.propTypes = {
  codigoTurma: PropTypes.oneOfType([PropTypes.string]),
  bimestre: PropTypes.oneOfType([PropTypes.any]),
};

AnotacoesRecomendacoes.defaultProps = {
  codigoTurma: '',
  bimestre: 0,
};

export default AnotacoesRecomendacoes;
