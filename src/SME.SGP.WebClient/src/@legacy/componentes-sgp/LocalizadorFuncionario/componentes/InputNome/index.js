import { AutoComplete, Input } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Loader from '~/componentes/loader';
import { InputNomeEstilo } from './styles';

const InputNome = props => {
  const {
    id,
    dataSource,
    onSelect,
    onChange,
    funcionarioSelecionado,
    desabilitado,
    regexIgnore,
    placeholder,
    exibirLoader,
  } = props;

  const [sugestoes, setSugestoes] = useState([]);
  const [valor, setValor] = useState('');

  const onChangeValor = selecionado => {
    if (
      regexIgnore &&
      regexIgnore !== '' &&
      selecionado &&
      selecionado !== ''
    ) {
      selecionado = selecionado.replace(regexIgnore, '');
    }
    setValor(selecionado);
  };

  useEffect(() => {
    setSugestoes(dataSource);
  }, [dataSource]);

  useEffect(() => {
    setValor(funcionarioSelecionado?.nomeServidor);
  }, [funcionarioSelecionado]);

  const options =
    sugestoes &&
    sugestoes.map(item => (
      <AutoComplete.Option
        key={item.codigoRF}
        value={item.nomeServidor}
        usuarioId={item.usuarioId}
      >
        {item.nomeServidor}
      </AutoComplete.Option>
    ));

  return (
    <Loader loading={exibirLoader}>
      <InputNomeEstilo>
        <AutoComplete
          onChange={valorSelecionado => {
            if (!exibirLoader) {
              onChangeValor(valorSelecionado);
            }
          }}
          onSearch={busca => {
            if (!exibirLoader) {
              onChange(busca);
            }
          }}
          onSelect={(value, option) => {
            if (!exibirLoader) {
              onSelect(option);
            }
          }}
          dataSource={options}
          value={valor}
          disabled={desabilitado}
          allowClear
        >
          <Input
            id={id}
            placeholder={placeholder !== '' ? placeholder : 'Digite o nome'}
            prefix={<i className="fa fa-search fa-lg" />}
            disabled={desabilitado}
            allowClear
          />
        </AutoComplete>
      </InputNomeEstilo>
    </Loader>
  );
};

InputNome.propTypes = {
  id: PropTypes.string,
  dataSource: PropTypes.oneOfType([PropTypes.array]),
  funcionarioSelecionado: PropTypes.oneOfType([PropTypes.any]),
  onSelect: PropTypes.func,
  onChange: PropTypes.func,
  desabilitado: PropTypes.bool,
  regexIgnore: PropTypes.objectOf(PropTypes.any),
  placeholder: PropTypes.string,
  exibirLoader: PropTypes.bool,
};

InputNome.defaultProps = {
  id: '',
  dataSource: [],
  funcionarioSelecionado: {},
  onSelect: {},
  onChange: {},
  desabilitado: false,
  regexIgnore: '',
  placeholder: '',
  exibirLoader: false,
};

export default InputNome;
