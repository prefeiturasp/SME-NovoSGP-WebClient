import React from 'react';
import { Switch } from 'antd';
import PropTypes from 'prop-types';

import { Label } from '~/componentes';

const SwitchInformarObjetivosListao = ({
  exibirSwitchEscolhaObjetivos,
  desabilitar,
  checkedExibirEscolhaObjetivos,
  setCheckedExibirEscolhaObjetivos,
}) => {
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
            disabled={desabilitar}
          />
        </>
      )}
    </>
  );
};

SwitchInformarObjetivosListao.propTypes = {
  exibirSwitchEscolhaObjetivos: PropTypes.bool,
  desabilitar: PropTypes.bool,
  checkedExibirEscolhaObjetivos: PropTypes.bool,
  setCheckedExibirEscolhaObjetivos: PropTypes.func,
};

SwitchInformarObjetivosListao.defaultProps = {
  exibirSwitchEscolhaObjetivos: false,
  desabilitar: false,
  checkedExibirEscolhaObjetivos: false,
  setCheckedExibirEscolhaObjetivos: () => {},
};

export default SwitchInformarObjetivosListao;
