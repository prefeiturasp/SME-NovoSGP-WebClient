import React, { useContext, useEffect } from 'react';
import { Switch } from 'antd';
import PropTypes from 'prop-types';

import { Label } from '~/componentes';

import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';

const SwitchInformarObjetivosListao = ({
  exibirSwitchEscolhaObjetivos,
  desabilitar,
  checkedExibirEscolhaObjetivos,
  setCheckedExibirEscolhaObjetivos,
  indexPlano,
}) => {
  const { setDadosPlanoAula, dadosPlanoAula } = useContext(ListaoContext);
  const exibirEscolhaObjetivos =
    dadosPlanoAula[indexPlano].checkedExibirEscolhaObjetivos;

  const onChangeSwitch = () => {
    dadosPlanoAula[
      indexPlano
    ].objetivosAprendizagemObrigatorios = !checkedExibirEscolhaObjetivos;
    dadosPlanoAula[
      indexPlano
    ].checkedExibirEscolhaObjetivos = !checkedExibirEscolhaObjetivos;
    setDadosPlanoAula(dadosPlanoAula);
    setCheckedExibirEscolhaObjetivos(!checkedExibirEscolhaObjetivos);
  };

  useEffect(() => {
    if (exibirEscolhaObjetivos) {
      setCheckedExibirEscolhaObjetivos(exibirEscolhaObjetivos);
    }
  }, [exibirEscolhaObjetivos, setCheckedExibirEscolhaObjetivos]);

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
  indexPlano: PropTypes.number,
};

SwitchInformarObjetivosListao.defaultProps = {
  exibirSwitchEscolhaObjetivos: false,
  desabilitar: false,
  checkedExibirEscolhaObjetivos: false,
  setCheckedExibirEscolhaObjetivos: () => {},
  indexPlano: null,
};

export default SwitchInformarObjetivosListao;
