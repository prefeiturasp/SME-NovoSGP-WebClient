import React, { useContext } from 'react';
import { Switch } from 'antd';
import PropTypes from 'prop-types';

import { Label } from '~/componentes';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';

const SwitchInformarObjetivosListao = ({ exibirSwitchEscolhaObjetivos }) => {
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
            // disabled={desabilitarCamposPlanoAula || !possuiPlanoAnual}
          />
        </>
      )}
    </>
  );
};

SwitchInformarObjetivosListao.propTypes = {
  exibirSwitchEscolhaObjetivos: PropTypes.bool,
};

SwitchInformarObjetivosListao.defaultProps = {
  exibirSwitchEscolhaObjetivos: false,
};

export default SwitchInformarObjetivosListao;
