import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Base } from '~/componentes';
import InputSelectReadOnly from '~/componentes-sgp/camposSomenteLeitura/InputSelectReadOnly';
import SelectComponent from '~/componentes/select';

const ContainerConceitoFinal = styled.div`
  ${props =>
    props?.abaixoDaMedia
      ? `.ant-select-selection--single {
    border: solid 2px ${Base.Vermelho} !important;
    border-radius: 4px;
  }`
      : ''};
`;

const ListaoCampoConceito = props => {
  const {
    dadosConceito,
    idCampo,
    desabilitar,
    listaTiposConceitos,
    onChangeNotaConceito,
    ehFechamento,
    styleContainer,
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

  const estaAbaixoDaMedia = valorAtual => {
    if (!ehFechamento) return false;

    const tipoConceito = listaTiposConceitos?.find(
      item => String(item?.id) === String(valorAtual)
    );

    return tipoConceito && !tipoConceito.aprovado;
  };

  const styleCampo = {};

  if (estaAbaixoDaMedia(conceitoValorAtual)) {
    styleCampo.border = `solid 2px ${Base.Vermelho}`;
    styleCampo.borderRadius = '4px';
  }

  const montarCampo = () => (
    <div
      style={{ ...styleContainer }}
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

  return ehFechamento ? (
    <ContainerConceitoFinal
      abaixoDaMedia={estaAbaixoDaMedia(conceitoValorAtual)}
    >
      <Tooltip
        placement="top"
        title={estaAbaixoDaMedia(conceitoValorAtual) ? 'Abaixo da Média' : ''}
      >
        {montarCampo()}
      </Tooltip>
    </ContainerConceitoFinal>
  ) : (
    montarCampo()
  );
};

ListaoCampoConceito.propTypes = {
  idCampo: PropTypes.oneOf([PropTypes.any]),
  dadosConceito: PropTypes.oneOf([PropTypes.any]),
  onChangeNotaConceito: PropTypes.func,
  desabilitar: PropTypes.bool,
  listaTiposConceitos: PropTypes.oneOf([PropTypes.array]),
  ehFechamento: PropTypes.bool,
  styleContainer: PropTypes.oneOf([PropTypes.any]),
};

ListaoCampoConceito.defaultProps = {
  idCampo: 'campo-conceito-listao',
  dadosConceito: {},
  onChangeNotaConceito: () => {},
  desabilitar: false,
  listaTiposConceitos: [],
  ehFechamento: false,
  styleContainer: {},
};

export default ListaoCampoConceito;
