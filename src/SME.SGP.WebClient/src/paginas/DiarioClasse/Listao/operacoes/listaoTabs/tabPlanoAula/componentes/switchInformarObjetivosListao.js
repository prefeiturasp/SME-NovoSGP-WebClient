import React, { useContext } from 'react';
import { Switch } from 'antd';
import PropTypes from 'prop-types';

import { Label } from '~/componentes';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';

const SwitchInformarObjetivosListao = ({
  exibirSwitchEscolhaObjetivos,
  possuiPlanoAnual,
  desabilitar,
}) => {
  const {
    checkedExibirEscolhaObjetivos,
    setCheckedExibirEscolhaObjetivos,
  } = useContext(ListaoContext);

  const onChangeSwitch = () => {
    setCheckedExibirEscolhaObjetivos(!checkedExibirEscolhaObjetivos);
  };

  return (
    <>
      {exibirSwitchEscolhaObjetivos && (
        <>
          <Label text="Informar Objetivos de Aprendizagem e Desenvolvimento" />
          <Switch
            onChange={() => onChangeSwitch()}
            checked={checkedExibirEscolhaObjetivos}
            size="default"
            className="ml-2 mr-2"
            disabled={desabilitar || !possuiPlanoAnual}
          />
        </>
      )}
    </>
  );
};

SwitchInformarObjetivosListao.propTypes = {
  exibirSwitchEscolhaObjetivos: PropTypes.bool,
  possuiPlanoAnual: PropTypes.bool,
  desabilitar: PropTypes.bool,
};

SwitchInformarObjetivosListao.defaultProps = {
  exibirSwitchEscolhaObjetivos: false,
  possuiPlanoAnual: false,
  desabilitar: false,
};

export default SwitchInformarObjetivosListao;
