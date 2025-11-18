import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '~/componentes';
import {
  setDadosIniciaisListasNotasConceitos,
  setDadosListasNotasConceitos,
  setPodeEditarNota,
} from '~/redux/modulos/conselhoClasse/actions';
import ServicoConselhoClasse from '~/servicos/Paginas/ConselhoClasse/ServicoConselhoClasse';
import { erros } from '~/servicos/alertas';
import ListasCarregar from './listasCarregar';

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

  const podeEditarNota = useSelector(
    store => store.conselhoClasse.podeEditarNota
  );

  const {
    fechamentoTurmaId,
    conselhoClasseId,
    alunoCodigo,
    turmaCodigo,
    tipoNota,
    media,
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
      dataSituacao.isSameOrAfter(dataInicioPeriodoFechamento);

    return alunoDentroDoBimestre || alunoDentroDoFechamento;
  };

  const desabilitarEdicaoAluno = () => {
    if (podeEditarNota || alunoDentroDoPeriodoDoBimestreOuFechamento()) {
      return false;
    }

    return true;
  };

  const obterDadosLista = useCallback(async () => {
    setCarregando(true);
    const resultado =
      await ServicoConselhoClasse.obterNotasConceitosConselhoClasse(
        conselhoClasseId,
        fechamentoTurmaId,
        alunoCodigo,
        turmaCodigo,
        bimestreSelecionado?.valor,
        !!dadosAlunoObjectCard.desabilitado
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
