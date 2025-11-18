import { Button, Input } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Loader from '~/componentes/loader';
import { InputRFEstilo } from './styles';

const InputCodigo = props => {
  const {
    id,
    funcionarioSelecionado,
    onSelect,
    onChange,
    desabilitado,
    exibirLoader,
  } = props;

  const [valor, setValor] = useState('');

  const onSubmitCodigo = codigo => {
    onSelect(codigo);
  };

  const botao = (
    <Button
      onClick={() => onSubmitCodigo(valor)}
      disabled={!valor || desabilitado}
      type="link"
    >
      <i className="fa fa-search fa-lg" />
    </Button>
  );

  const onChangeCodigo = e => {
    if (!exibirLoader) {
      setValor(e.target.value);
      onChange(e.target.value);
    }
  };

  useEffect(() => {
    setValor(funcionarioSelecionado?.codigoRF);
  }, [funcionarioSelecionado]);

  return (
    <Loader loading={exibirLoader}>
      <InputRFEstilo>
        <Input
          id={id}
          value={valor}
          placeholder="Procure pelo RF"
          onChange={onChangeCodigo}
          onPressEnter={e => {
            if (!exibirLoader && e.target.value) {
              onSubmitCodigo(e.target.value);
            }
          }}
          suffix={botao}
          disabled={desabilitado}
          allowClear
        />
      </InputRFEstilo>
    </Loader>
  );
};

InputCodigo.propTypes = {
  id: PropTypes.string,
  funcionarioSelecionado: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.object),
    PropTypes.any,
  ]),
  onSelect: PropTypes.func,
  onChange: PropTypes.func,
  desabilitado: PropTypes.bool,
  exibirLoader: PropTypes.bool,
};

InputCodigo.defaultProps = {
  id: '',
  funcionarioSelecionado: {},
  onSelect: () => {},
  onChange: () => {},
  desabilitado: false,
  exibirLoader: false,
};

export default InputCodigo;
