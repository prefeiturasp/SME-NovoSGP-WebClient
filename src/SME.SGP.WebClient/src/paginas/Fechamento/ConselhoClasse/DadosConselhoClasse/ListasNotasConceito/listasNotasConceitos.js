import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '~/componentes';
import {
  setConselhoClasseEmEdicao,
  setDadosListasNotasConceitos,
  setPodeEditarNota,
} from '~/redux/modulos/conselhoClasse/actions';
import { erros } from '~/servicos/alertas';
import ServicoConselhoClasse from '~/servicos/Paginas/ConselhoClasse/ServicoConselhoClasse';
import ListasCarregar from './listasCarregar';
import { valorNuloOuVazio } from '~/utils/funcoes/gerais';

const ListasNotasConceitos = props => {
  const { bimestreSelecionado } = props;

  const dispatch = useDispatch();

  const fechamentoPeriodoInicioFim = useSelector(
    store => store.conselhoClasse.fechamentoPeriodoInicioFim
  );

  const listaTiposConceitos = useSelector(
    store => store.conselhoClasse.listaTiposConceitos
  );

  const dadosPrincipaisConselhoClasse = useSelector(
    store => store.conselhoClasse.dadosPrincipaisConselhoClasse
  );

  const dadosAlunoObjectCard = useSelector(
    store => store.conselhoClasse.dadosAlunoObjectCard
  );

  const bimestreAtual = useSelector(
    store => store.conselhoClasse.bimestreAtual
  );

  const turmaStore = useSelector(state => state.usuario.turmaSelecionada);

  const dentroPeriodo = useSelector(
    store => store.conselhoClasse.dentroPeriodo
  );

  const {
    fechamentoTurmaId,
    conselhoClasseId,
    alunoCodigo,
    turmaCodigo,
    tipoNota,
    media,
    alunoDesabilitado,
  } = dadosPrincipaisConselhoClasse;

  const [exibir, setExibir] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const pegueInicioPeriodoFechamento = () => {
    if (fechamentoPeriodoInicioFim) {
      const { periodoFechamentoInicio } = fechamentoPeriodoInicioFim;

      if (periodoFechamentoInicio)
        return moment(periodoFechamentoInicio).format('MM-DD-YYYY');
    }

    return null;
  };

  const alunoDentroDoPeriodoDoBimestreOuFechamento = () => {
    const dataSituacao = moment(dadosAlunoObjectCard.dataSituacao).format(
      'MM-DD-YYYY'
    );
    const dataFimBimestre = moment(bimestreAtual.dataFim).format('MM-DD-YYYY');
    const dataInicioPeriodoFechamento = pegueInicioPeriodoFechamento();

    return (
      dataSituacao >= dataFimBimestre ||
      (dataInicioPeriodoFechamento &&
        dataSituacao >= dataInicioPeriodoFechamento)
    );
  };

  const desabilitarEdicaoAluno = () => {
    if (!alunoDesabilitado || alunoDentroDoPeriodoDoBimestreOuFechamento()) {
      return false;
    }

    return true;
  };

  const estaNoPeriodoOuFechamento = () => {
    const hoje = moment().format('MM-DD-YYYY');
    if (fechamentoPeriodoInicioFim) {
      const {
        periodoFechamentoInicio,
        periodoFechamentoFim,
      } = fechamentoPeriodoInicioFim;

      if (periodoFechamentoInicio && periodoFechamentoFim) {
        const inicioF = moment(periodoFechamentoInicio).format('MM-DD-YYYY');
        const finalF = moment(periodoFechamentoFim).format('MM-DD-YYYY');
        const emFechamento = hoje >= inicioF && hoje <= finalF;
        return dentroPeriodo || emFechamento;
      }
    }
    return dentroPeriodo;
  };

  const habilitaConselhoClasse = dados => {
    const { conselhoClasseAlunoId } = dadosPrincipaisConselhoClasse;

    let notasFechamentosPreenchidas = true;
    dados.notasConceitos.map(notasConceitos =>
      notasConceitos.componentesCurriculares.map(componentesCurriculares =>
        componentesCurriculares.notasFechamentos.map(notasFechamentos => {
          if (valorNuloOuVazio(notasFechamentos.notaConceito)) {
            notasFechamentosPreenchidas = false;
          }
          return notasFechamentos;
        })
      )
    );

    const alunoDentroDoPeriodoDoBimestre = alunoDentroDoPeriodoDoBimestreOuFechamento();
    const periodoAbertoOuEmFechamento = estaNoPeriodoOuFechamento();

    if (
      !conselhoClasseAlunoId &&
      notasFechamentosPreenchidas &&
      alunoDentroDoPeriodoDoBimestre &&
      periodoAbertoOuEmFechamento
    ) {
      dispatch(setConselhoClasseEmEdicao(true));
    }
  };

  const habilitaConselhoClassePorNotasPosConselho = dados => {
    let notasPosConselhoPreenchidas = true;
    if (!dados.temConselhoClasseAluno) {
      dados.notasConceitos.map(notasConceitos =>
        notasConceitos.componentesCurriculares.map(componentesCurriculares => {
          if (valorNuloOuVazio(componentesCurriculares.notaPosConselho.nota)) {
            notasPosConselhoPreenchidas = false;
          }
          return componentesCurriculares;
        })
      );
      const periodoAbertoOuEmFechamento = estaNoPeriodoOuFechamento();
      if (notasPosConselhoPreenchidas && periodoAbertoOuEmFechamento) {
        dispatch(setConselhoClasseEmEdicao(true));
      }
    }
  };

  const obterDadosLista = useCallback(async () => {
    setCarregando(true);
    const resultado = await ServicoConselhoClasse.obterNotasConceitosConselhoClasse(
      conselhoClasseId,
      fechamentoTurmaId,
      alunoCodigo,
      turmaCodigo,
      bimestreSelecionado?.valor,
      turmaStore?.consideraHistorico
    )
      .catch(e => erros(e))
      .finally(() => setCarregando(false));

    if (resultado && resultado.data) {
      dispatch(setDadosListasNotasConceitos(resultado.data.notasConceitos));
      dispatch(setPodeEditarNota(resultado.data.podeEditarNota));
      setExibir(true);
      if (bimestreSelecionado?.valor !== 'final')
        habilitaConselhoClasse(resultado.data);
      habilitaConselhoClassePorNotasPosConselho(resultado.data);
    } else {
      setExibir(false);
    }
  }, [
    alunoCodigo,
    conselhoClasseId,
    dispatch,
    fechamentoTurmaId,
    turmaCodigo,
    bimestreSelecionado,
  ]);

  useEffect(() => {
    const bimestre = bimestreSelecionado.valor;

    if (bimestre && turmaCodigo && alunoCodigo) {
      obterDadosLista();
    }
  }, [
    turmaCodigo,
    alunoCodigo,
    bimestreSelecionado.valor,
    fechamentoTurmaId,
    obterDadosLista,
  ]);

  return (
    <Loader
      className={carregando ? 'text-center' : ''}
      loading={carregando}
      tip="Carregando lista(s) notas e conceitos"
    >
      {exibir && bimestreSelecionado.valor ? (
        <ListasCarregar
          ehFinal={bimestreSelecionado.valor === 'final'}
          tipoNota={tipoNota}
          listaTiposConceitos={listaTiposConceitos}
          mediaAprovacao={media}
          alunoDesabilitado={desabilitarEdicaoAluno()}
        />
      ) : (
        ''
      )}
    </Loader>
  );
};

ListasNotasConceitos.propTypes = {
  bimestreSelecionado: PropTypes.oneOfType([PropTypes.object]),
};

ListasNotasConceitos.defaultProps = {
  bimestreSelecionado: {},
};

export default ListasNotasConceitos;
