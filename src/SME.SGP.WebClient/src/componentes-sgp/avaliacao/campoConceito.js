import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import SelectComponent from '~/componentes/select';
import TooltipEstudanteAusente from './tooltipEstudanteAusente';
import TooltipStatusGsa from './tooltipStatusGsa';

const CampoConceito = props => {
  const {
    nota,
    onChangeNotaConceito,
    desabilitarCampo,
    listaTiposConceitos,
  } = props;

  const [conceitoValorAtual, setConceitoValorAtual] = useState();
  const [conceitoAlterado, setConceitoAlterado] = useState(false);

  const validaSeTeveAlteracao = (valorNovo, notaOriginal) => {
    if (notaOriginal) {
      setConceitoAlterado(String(valorNovo) !== String(notaOriginal));
    }
  };

  useEffect(() => {
    setConceitoValorAtual(nota.notaConceito);
    validaSeTeveAlteracao(nota.notaConceito, nota.notaOriginal);
  }, [nota.notaConceito, nota.notaOriginal]);

  const setarValorNovo = valorNovo => {
    setConceitoValorAtual(valorNovo);
    onChangeNotaConceito(valorNovo);
    validaSeTeveAlteracao(nota.notaConceito, nota.notaOriginal);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <SelectComponent
        onChange={valorNovo => setarValorNovo(valorNovo)}
        valueOption="id"
        valueText="valor"
        lista={listaTiposConceitos}
        valueSelect={
          conceitoValorAtual ? String(conceitoValorAtual) : undefined
        }
        showSearch
        placeholder="Conceito"
        className={`select-conceitos ${
          conceitoAlterado ? 'border-registro-alterado' : ''
        }`}
        classNameContainer={nota.ausente ? 'aluno-ausente-conceitos' : ''}
        disabled={desabilitarCampo || !nota.podeEditar}
        searchValue={false}
        style={{ width: '86px' }}
      />
      {nota?.ausente ? <TooltipEstudanteAusente /> : ''}
      {nota?.statusGsa ? <TooltipStatusGsa /> : ''}
    </div>
  );
};

CampoConceito.propTypes = {
  nota: PropTypes.oneOfType([PropTypes.any]),
  onChangeNotaConceito: PropTypes.func,
  desabilitarCampo: PropTypes.bool,
  listaTiposConceitos: PropTypes.oneOfType([PropTypes.any]),
};

CampoConceito.defaultProps = {
  nota: {},
  onChangeNotaConceito: () => {},
  desabilitarCampo: false,
  listaTiposConceitos: [],
};

export default CampoConceito;
