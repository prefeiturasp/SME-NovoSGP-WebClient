import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Loader, SelectAutocomplete } from '~/componentes';
import { erros, ServicoCalendarios } from '~/servicos';
import FechaReabCadastroContext from '../fechaReabCadastroContext';

const TipoCalendarioReabertura = ({ form, onChangeCampos }) => {
  const {
    setListaTipoCalendarioEscolar,
    listaTipoCalendarioEscolar,
    setCalendarioSelecionado,
    calendarioSelecionado,
    setListaUes,
    emEdicao,
  } = useContext(FechaReabCadastroContext);

  const [carregandoCalendarios, setCarregandoCalendarios] = useState(false);

  const selecionaTipoCalendario = descricao => {
    const calendario = listaTipoCalendarioEscolar?.find(
      t => t?.descricao === descricao
    );

    if (calendario) {
      setCalendarioSelecionado(calendario);

      setListaUes([]);
      form.setFieldValue('ueCodigo', '');
    } else {
      setCalendarioSelecionado({ descricao });
    }
    onChangeCampos();
  };

  const obterTiposCalendarios = useCallback(async descricao => {
    setCarregandoCalendarios(true);

    const resposta = await ServicoCalendarios.obterTiposCalendarioAutoComplete(
      descricao
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoCalendarios(false));

    if (resposta?.data) {
      setListaTipoCalendarioEscolar(resposta.data);
    } else {
      setListaTipoCalendarioEscolar([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = descricao => {
    if (descricao.length > 2 || descricao.length === 0) {
      obterTiposCalendarios(descricao);
    }
    onChangeCampos();
  };

  useEffect(() => {
    obterTiposCalendarios();
  }, [obterTiposCalendarios]);

  return (
    <Loader loading={carregandoCalendarios} tip="">
      <SelectAutocomplete
        label="Calendário"
        showList
        isHandleSearch
        placeholder="Selecione o calendário"
        className="ant-col-md-24"
        id="select-tipo-calendario"
        lista={listaTipoCalendarioEscolar || []}
        valueField="id"
        textField="descricao"
        onSelect={valor => selecionaTipoCalendario(valor)}
        onChange={valor => selecionaTipoCalendario(valor)}
        handleSearch={handleSearch}
        value={calendarioSelecionado?.descricao || ''}
        temErro={emEdicao && !calendarioSelecionado?.id}
        mensagemErro="Campo obrigatório"
      />
    </Loader>
  );
};

TipoCalendarioReabertura.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
};

TipoCalendarioReabertura.defaultProps = {
  form: null,
  onChangeCampos: () => null,
};

export default TipoCalendarioReabertura;
