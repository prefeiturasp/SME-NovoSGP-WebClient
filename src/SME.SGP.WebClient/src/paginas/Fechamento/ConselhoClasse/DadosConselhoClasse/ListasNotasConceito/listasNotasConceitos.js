import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '~/componentes';
import {
  setConselhoClasseEmEdicao,
  setDadosIniciaisListasNotasConceitos,
  setDadosListasNotasConceitos,
  setPodeEditarNota,
} from '~/redux/modulos/conselhoClasse/actions';
import { erros } from '~/servicos/alertas';
import ServicoConselhoClasse from '~/servicos/Paginas/ConselhoClasse/ServicoConselhoClasse';
import ListasCarregar from './listasCarregar';
import { valorNuloOuVazio } from '~/utils/funcoes/gerais';
import situacaoMatriculaAluno from '~/dtos/situacaoMatriculaAluno';

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
    conselhoClasseAlunoId,
  } = dadosPrincipaisConselhoClasse;

  const [exibir, setExibir] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [dadosArredondamento, setDadosArredondamento] = useState();

  const pegueInicioPeriodoFechamento = () => {
    if (fechamentoPeriodoInicioFim) {
      const { periodoFechamentoInicio } = fechamentoPeriodoInicioFim;

      if (periodoFechamentoInicio) return moment(periodoFechamentoInicio);
    }

    return null;
  };

  const alunoDentroDoPeriodoDoBimestreOuFechamento = () => {
    const dataSituacao = moment(dadosAlunoObjectCard.dataSituacao);
    const dataInicioBimestre = moment(bimestreAtual.dataInicio);
    const dataInicioPeriodoFechamento = pegueInicioPeriodoFechamento();

    const alunoDentroDoBimestre = dataSituacao.isAfter(dataInicioBimestre);

    const alunoDentroDoFechamento =
      dataInicioPeriodoFechamento &&
      dataSituacao.isAfter(dataInicioPeriodoFechamento);

    return alunoDentroDoBimestre || alunoDentroDoFechamento;
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
    let notasFechamentosPreenchidas = true;

    dados.notasConceitos.forEach(notasConceitos =>
      notasConceitos.componentesCurriculares.forEach(
        componentesCurriculares => {
          if (
            bimestreSelecionado?.valor === 'final' &&
            componentesCurriculares?.notaPosConselho &&
            valorNuloOuVazio(componentesCurriculares?.notaPosConselho?.nota)
          ) {
            notasFechamentosPreenchidas = false;
          } else {
            componentesCurriculares.notasFechamentos.forEach(
              notasFechamentos => {
                if (valorNuloOuVazio(notasFechamentos.notaConceito)) {
                  notasFechamentosPreenchidas = false;
                }
              }
            );
          }
        }
      )
    );
    dados.notasConceitos.forEach(notasConceitos =>
      notasConceitos.componenteRegencia?.componentesCurriculares.forEach(cc => {
        if (
          bimestreSelecionado?.valor === 'final' &&
          cc?.notaPosConselho &&
          valorNuloOuVazio(cc?.notaPosConselho?.nota)
        ) {
          notasFechamentosPreenchidas = false;
        } else {
          cc.notasFechamentos.forEach(nf => {
            if (valorNuloOuVazio(nf.notaConceito)) {
              notasFechamentosPreenchidas = false;
            }
          });
        }
      })
    );
    let validarDataSituacao = false;
    if (dadosAlunoObjectCard?.situacaoCodigo) {
      switch (dadosAlunoObjectCard?.situacaoCodigo) {
        case situacaoMatriculaAluno.Ativo:
        case situacaoMatriculaAluno.PendenteRematricula:
        case situacaoMatriculaAluno.Rematriculado:
        case situacaoMatriculaAluno.SemContinuidade:
          validarDataSituacao = false;
          break;
        default:
          validarDataSituacao = true;
          break;
      }
    }

    let alunoDentroDoPeriodoDoBimestre = true;
    if (validarDataSituacao) {
      alunoDentroDoPeriodoDoBimestre = alunoDentroDoPeriodoDoBimestreOuFechamento();
    }
    const periodoAbertoOuEmFechamento = estaNoPeriodoOuFechamento();

    let emEdicao = false;
    if (
      !conselhoClasseAlunoId &&
      notasFechamentosPreenchidas &&
      alunoDentroDoPeriodoDoBimestre &&
      periodoAbertoOuEmFechamento
    ) {
      emEdicao = true;
    }
    dispatch(setConselhoClasseEmEdicao(emEdicao));
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

    if (resultado?.data) {
      const dadosCarregar = _.cloneDeep(resultado.data.notasConceitos);
      dispatch(setDadosIniciaisListasNotasConceitos([...dadosCarregar]));
      dispatch(setDadosListasNotasConceitos(resultado.data.notasConceitos));
      dispatch(setPodeEditarNota(resultado.data.podeEditarNota));
      setDadosArredondamento(resultado.data?.dadosArredondamento);
      setExibir(true);
      if (bimestreSelecionado?.valor) habilitaConselhoClasse(resultado.data);
    } else {
      setExibir(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          dadosArredondamento={dadosArredondamento}
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
