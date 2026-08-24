import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Loader, SelectAutocomplete } from '~/componentes';
import FechaReabCadastroContext from '../fechaReabCadastroContext';

import comDefaultProps from '~/utils/comDefaultProps';
const TipoCalendarioReabertura = ({
  form,
  onChangeCampos,
  obterTiposCalendarios,
  onSelectCalendario,
}) => {
  const {
    listaTipoCalendarioEscolar,
    setCalendarioSelecionado,
    calendarioSelecionado,
    setListaUes,
    emEdicao,
    desabilitarCampos,
    carregandoCalendarios,
  } = useContext(FechaReabCadastroContext);

  const paramsRota = useParams();
  const novoRegistro = !paramsRota?.id;

  const selecionaTipoCalendario = descricao => {
    const calendario = listaTipoCalendarioEscolar?.find(
      t => t?.descricao === descricao
    );

    if (calendario) {
      setCalendarioSelecionado(calendario);

      setListaUes([]);
      form.setFieldValue('ueCodigo', '');
      if (onSelectCalendario) onSelectCalendario(calendario);
    } else {
      setCalendarioSelecionado({ descricao });
    }
    onChangeCampos();
  };

  const handleSearch = descricao => {
    if (descricao.length > 2 || descricao.length === 0) {
      obterTiposCalendarios(descricao);
    }
    onChangeCampos();
  };

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
        disabled={desabilitarCampos || !novoRegistro}
        labelRequired
      />
    </Loader>
  );
};

TipoCalendarioReabertura.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  obterTiposCalendarios: PropTypes.func,
  onSelectCalendario: PropTypes.func,
};

TipoCalendarioReabertura.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  obterTiposCalendarios: () => null,
  onSelectCalendario: () => {},
};

export default comDefaultProps(TipoCalendarioReabertura, TipoCalendarioReabertura.defaultProps);