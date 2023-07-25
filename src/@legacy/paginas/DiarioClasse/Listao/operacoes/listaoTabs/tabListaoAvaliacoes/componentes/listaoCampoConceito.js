import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Base } from '~/componentes';
import InputSelectReadOnly from '~/componentes-sgp/camposSomenteLeitura/InputSelectReadOnly';
import LabelAusenteCellTable from '~/componentes-sgp/inputs/nota/labelAusenteCellTable';
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

  styleContainer.padding = styleContainer.padding || '7px 8px 2px';

  const montarCampo = () => (
    <>
      <div
        style={{ ...styleContainer }}
        onFocus={() => validarExibir(true)}
        onMouseEnter={() => validarExibir(true)}
      >
        {!desabilitar && exibir ? (
          <div>
            <SelectComponent
              key={idCampo}
              id={idCampo}
              name={idCampo}
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
            />
          </div>
        ) : (
          <InputSelectReadOnly
            name={idCampo}
            key={idCampo}
            id={idCampo}
            value={obterDescConceito(conceitoValorAtual)}
            disabled={desabilitar}
            placeholder="Conceito"
            height="45px"
          />
        )}
      </div>
      {dadosConceito?.ausente ? <LabelAusenteCellTable /> : <></>}
    </>
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
  idCampo: PropTypes.oneOfType([PropTypes.any]),
  dadosConceito: PropTypes.oneOfType([PropTypes.any]),
  onChangeNotaConceito: PropTypes.func,
  desabilitar: PropTypes.bool,
  listaTiposConceitos: PropTypes.oneOfType([PropTypes.any]),
  ehFechamento: PropTypes.bool,
  styleContainer: PropTypes.oneOfType([PropTypes.any]),
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
