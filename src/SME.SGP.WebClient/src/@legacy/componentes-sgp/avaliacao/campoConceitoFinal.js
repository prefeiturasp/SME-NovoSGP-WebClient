/* eslint-disable react/prop-types */
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import SelectComponent from '~/componentes/select';

const CampoConceitoFinal = props => {
  const {
    id,
    montaNotaConceitoFinal,
    onChangeNotaConceitoFinal,
    desabilitarCampo,
    podeEditar,
    listaTiposConceitos,
    label,
    podeLancarNotaFinal,
  } = props;

  const [conceitoValorAtual, setConceitoValorAtual] = useState();
  const [notaConceitoBimestre, setNotaConceitoBimestre] = useState();

  const validaSeTeveAlteracao = useCallback(
    notaConceito => {
      if (notaConceitoBimestre.notaOriginal) {
        notaConceitoBimestre.conceitoAlterado =
          String(notaConceito) !== String(notaConceitoBimestre.notaOriginal);
      }
    },
    [notaConceitoBimestre]
  );

  const validaSeEstaAbaixoDaMedia = useCallback(
    valorAtual => {
      const tipoConceito = listaTiposConceitos.find(
        item => String(item.id) === String(valorAtual)
      );

      if (tipoConceito && !tipoConceito.aprovado) {
        notaConceitoBimestre.abaixoDaMedia = true;
      } else {
        notaConceitoBimestre.abaixoDaMedia = false;
      }
    },
    [listaTiposConceitos, notaConceitoBimestre]
  );

  useEffect(() => {
    setNotaConceitoBimestre(montaNotaConceitoFinal());
  }, [montaNotaConceitoFinal]);

  useEffect(() => {
    if (notaConceitoBimestre) {
      validaSeEstaAbaixoDaMedia(notaConceitoBimestre.notaConceito);
      validaSeTeveAlteracao(notaConceitoBimestre.notaConceito);
      setConceitoValorAtual(notaConceitoBimestre.notaConceito);
    }
  }, [notaConceitoBimestre, validaSeTeveAlteracao, validaSeEstaAbaixoDaMedia]);

  const setarValorNovo = valorNovo => {
    if (!desabilitarCampo && podeEditar) {
      validaSeEstaAbaixoDaMedia(valorNovo);
      validaSeTeveAlteracao(valorNovo);
      onChangeNotaConceitoFinal(notaConceitoBimestre, valorNovo);
      setConceitoValorAtual(valorNovo);
    }
  };

  const campo = () => {
    return (
      <div>
        <SelectComponent
          id={id}
          label={label || ''}
          onChange={valorNovo => setarValorNovo(valorNovo)}
          valueOption="id"
          valueText="valor"
          lista={listaTiposConceitos}
          valueSelect={
            conceitoValorAtual ? String(conceitoValorAtual) : undefined
          }
          showSearch
          className={`tamanho-conceito-final ${
            notaConceitoBimestre && notaConceitoBimestre.abaixoDaMedia
              ? 'border-abaixo-media'
              : notaConceitoBimestre && notaConceitoBimestre.conceitoAlterado
              ? 'border-registro-alterado'
              : ''
          } `}
          disabled={desabilitarCampo || !podeEditar || !podeLancarNotaFinal}
          searchValue={false}
        />
      </div>
    );
  };

  return (
    <>
      {notaConceitoBimestre?.abaixoDaMedia ? (
        <Tooltip placement="left" title="Abaixo da Média">
          {campo()}
        </Tooltip>
      ) : (
        campo()
      )}
    </>
  );
};

CampoConceitoFinal.defaultProps = {
  id: PropTypes.string,
  onChangeNotaConceitoFinal: PropTypes.func,
  montaNotaConceitoFinal: PropTypes.func,
};

CampoConceitoFinal.propTypes = {
  id: '',
  onChangeNotaConceitoFinal: () => {},
  montaNotaConceitoFinal: () => {},
};

export default CampoConceitoFinal;
