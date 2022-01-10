import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import InputSelectReadOnly from '~/componentes-sgp/camposSomenteLeitura/InputSelectReadOnly';
import SelectComponent from '~/componentes/select';

const ListaoCampoConceito = props => {
  const {
    dadosConceito,
    idCampo,
    desabilitar,
    listaTiposConceitos,
    onChangeNotaConceito,
  } = props;

  const [exibir, setExibir] = useState(false);
  const [conceitoValorAtual, setConceitoValorAtual] = useState();

  useEffect(() => {
    setConceitoValorAtual(dadosConceito.notaConceito);
  }, [dadosConceito.notaConceito]);

  const setarValorNovo = valorNovo => {
    setConceitoValorAtual(valorNovo);
    onChangeNotaConceito(valorNovo);
  };

  const validarExibir = valor => {
    if (!desabilitar) {
      setExibir(valor);
    }
  };

  const obterDescConceito = desc => {
    if (desc) {
      const descConceito = listaTiposConceitos?.find(
        item => Number(item.id) === Number(conceitoValorAtual)
      );
      if (descConceito?.valor) {
        return descConceito?.valor;
      }
    }

    return desc;
  };

  return (
    <div
      style={{ paddingRight: 15, paddingLeft: 15 }}
      onFocus={() => validarExibir(true)}
      onMouseEnter={() => validarExibir(true)}
      onMouseLeave={() => validarExibir(false)}
    >
      {!desabilitar && exibir ? (
        <div>
          <SelectComponent
            key={idCampo}
            id={idCampo}
            onChange={valorNovo => {
              setarValorNovo(valorNovo);
            }}
            valueOption="id"
            valueText="valor"
            lista={listaTiposConceitos || []}
            valueSelect={
              conceitoValorAtual ? String(conceitoValorAtual) : undefined
            }
            showSearch
            placeholder="Conceito"
            disabled={desabilitar}
            searchValue={false}
          />
        </div>
      ) : (
        <InputSelectReadOnly
          key={idCampo}
          id={idCampo}
          value={obterDescConceito(conceitoValorAtual)}
          disabled={desabilitar}
          placeholder="Conceito"
        />
      )}
    </div>
  );
};

ListaoCampoConceito.defaultProps = {
  idCampo: PropTypes.oneOf(PropTypes.any),
  dadosConceito: PropTypes.oneOf(PropTypes.any),
  onChangeNotaConceito: PropTypes.func,
  desabilitar: PropTypes.bool,
  listaTiposConceitos: PropTypes.oneOf(PropTypes.array),
};

ListaoCampoConceito.propTypes = {
  idCampo: 'campo-conceito-listao',
  dadosConceito: {},
  onChangeNotaConceito: () => {},
  desabilitar: false,
  listaTiposConceitos: [],
};

export default ListaoCampoConceito;
