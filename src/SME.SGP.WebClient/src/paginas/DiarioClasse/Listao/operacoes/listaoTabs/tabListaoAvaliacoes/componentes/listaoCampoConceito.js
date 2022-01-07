import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import SelectComponent from '~/componentes/select';

const ListaoCampoConceito = props => {
  const {
    nota,
    onChangeNotaConceito,
    desabilitarCampo,
    listaTiposConceitos,
  } = props;

  const [conceitoValorAtual, setConceitoValorAtual] = useState();

  useEffect(() => {
    setConceitoValorAtual(nota.notaConceito);
  }, [nota.notaConceito, nota.notaOriginal]);

  const setarValorNovo = valorNovo => {
    setConceitoValorAtual(valorNovo);
    onChangeNotaConceito(valorNovo);
  };

  return (
    <div style={{ paddingRight: 15, paddingLeft: 15 }}>
      <SelectComponent
        classNameContainer="d-flex"
        onChange={valorNovo => setarValorNovo(valorNovo)}
        valueOption="id"
        valueText="valor"
        lista={listaTiposConceitos}
        valueSelect={
          conceitoValorAtual ? String(conceitoValorAtual) : undefined
        }
        showSearch
        placeholder="Conceito"
        disabled={desabilitarCampo}
        searchValue={false}
      />
    </div>
  );
};

ListaoCampoConceito.defaultProps = {
  nota: PropTypes.oneOf(PropTypes.any),
  onChangeNotaConceito: PropTypes.func,
  desabilitarCampo: PropTypes.bool,
  listaTiposConceitos: PropTypes.oneOf(PropTypes.array),
};

ListaoCampoConceito.propTypes = {
  nota: {},
  onChangeNotaConceito: () => {},
  desabilitarCampo: false,
  listaTiposConceitos: [],
};

export default ListaoCampoConceito;
