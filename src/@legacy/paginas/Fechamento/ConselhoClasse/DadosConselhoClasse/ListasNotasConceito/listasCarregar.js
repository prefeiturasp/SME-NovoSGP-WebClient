import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import shortid from 'shortid';
import ListaBimestre from './ListaBimestre/listaBimestre';
import ListaFinal from './ListaFinal/listaFinal';
import { Base } from '~/componentes';
import { removerArrayAninhados } from '~/utils';

const ListasCarregar = props => {
  const {
    ehFinal,
    tipoNota,
    listaTiposConceitos,
    mediaAprovacao,
    alunoDesabilitado,
    dadosArredondamento,
  } = props;

  const dadosListasNotasConceitos = useSelector(
    store => store.conselhoClasse.dadosListasNotasConceitos
  );

  const cores = [
    Base.VerdeBorda,
    Base.LaranjaAlerta,
    Base.AzulCalendario,
    Base.Roxo,
    Base.Verde,
    '#A7CDE0',
    '#2279AF',
    Base.Vermelho,
    Base.RosaCalendario,
    Base.Laranja,
  ];

  const coresRegencia = [
    Base.Bordo,
    '#B1DF94',
    '#31A041',
    '#FC999C',
    '#E31426',
    '#FDBE7B',
    '#CAB2D4',
    '#6B3E93',
    '#FEFEA6',
    '#B15732',
  ];

  const validaExibirLista = () => {
    let componentesAgrupados = [];

    if (dadosListasNotasConceitos?.length) {
      const componentes = dadosListasNotasConceitos?.map(
        item => item?.componentesCurriculares
      );
      componentesAgrupados = removerArrayAninhados(componentes);
    }

    if (ehFinal) {
      return dadosListasNotasConceitos.map((item, index) => (
        <ListaFinal
          key={shortid.generate()}
          dadosLista={item}
          tipoNota={tipoNota}
          listaTiposConceitos={listaTiposConceitos}
          mediaAprovacao={mediaAprovacao}
          alunoDesabilitado={alunoDesabilitado}
          corBarraLateral={cores[index] || ''}
          corRegenciaBarraLateral={coresRegencia[index] || ''}
          dadosArredondamento={dadosArredondamento}
          componentesAgrupados={componentesAgrupados}
        />
      ));
    }

    return dadosListasNotasConceitos.map((item, index) => (
      <ListaBimestre
        key={shortid.generate()}
        dadosLista={item}
        tipoNota={tipoNota}
        listaTiposConceitos={listaTiposConceitos}
        mediaAprovacao={mediaAprovacao}
        alunoDesabilitado={alunoDesabilitado}
        corBarraLateral={cores[index] || ''}
        corRegenciaBarraLateral={coresRegencia[index] || ''}
        dadosArredondamento={dadosArredondamento}
        componentesAgrupados={componentesAgrupados}
      />
    ));
  };

  return <>{validaExibirLista()}</>;
};

ListasCarregar.propTypes = {
  ehFinal: PropTypes.bool,
  tipoNota: PropTypes.oneOfType([PropTypes.any]),
  listaTiposConceitos: PropTypes.oneOfType([PropTypes.array]),
  mediaAprovacao: PropTypes.number,
  alunoDesabilitado: PropTypes.bool,
  dadosArredondamento: PropTypes.oneOfType([PropTypes.any]),
};

ListasCarregar.defaultProps = {
  ehFinal: false,
  tipoNota: 0,
  listaTiposConceitos: [],
  mediaAprovacao: 5,
  alunoDesabilitado: false,
  dadosArredondamento: null,
};

export default ListasCarregar;
