import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect } from 'react';
import { SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import ListaLocalOcorrencia from '~/constantes/localOcorrencia';
import tipoEvento from '~/dtos/tipoEvento';
import { api } from '~/servicos';
import EventosCadastroContext from '../eventosCadastroContext';

const TipoEventoCadastroEventos = ({ form, onChangeCampos, desabilitar }) => {
  const {
    listaTipoEvento,
    setListaTipoEvento,
    setListaTipoEventoOrigem,
    setDesabilitarLetivo,
    listaTipoEventoOrigem,
  } = useContext(EventosCadastroContext);

  const { dreId, ueId, tipoEventoId } = form.values;

  const nomeCampo = 'tipoEventoId';

  const obterTiposEvento = useCallback(async () => {
    const tiposEvento = await api.get(
      'v1/calendarios/eventos/tipos/listar?ehCadastro=true&numeroRegistros=100'
    );
    if (tiposEvento?.data?.items) {
      setListaTipoEvento([...tiposEvento.data.items]);
      setListaTipoEventoOrigem([...tiposEvento.data.items]);
    } else {
      setListaTipoEvento([]);
      setListaTipoEventoOrigem([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    obterTiposEvento();
  }, [obterTiposEvento]);

  useEffect(() => {
    if (listaTipoEvento?.length === 1 && ueId) {
      form.setFieldValue('tipoEventoId', String(listaTipoEvento[0].id));

      if (listaTipoEvento[0].id === tipoEvento.ItineranciaPAAI) {
        setDesabilitarLetivo(true);
        form.setFieldValue('letivo', 0);
      }
    }
  }, [listaTipoEvento, ueId]);

  const filtraSomenteUE = () =>
    listaTipoEventoOrigem.filter(
      element =>
        element.localOcorrencia === ListaLocalOcorrencia.UE ||
        element.localOcorrencia === ListaLocalOcorrencia.SMEUE ||
        element.localOcorrencia === ListaLocalOcorrencia.TODOS
    );

  const filtraSomenteDRE = () =>
    listaTipoEventoOrigem.filter(
      element =>
        element.localOcorrencia === ListaLocalOcorrencia.DRE ||
        element.localOcorrencia === ListaLocalOcorrencia.TODOS
    );

  const filtraSomenteSME = () =>
    listaTipoEventoOrigem.filter(
      element =>
        element.localOcorrencia === ListaLocalOcorrencia.SME ||
        element.localOcorrencia === ListaLocalOcorrencia.SMEUE ||
        element.localOcorrencia === ListaLocalOcorrencia.TODOS
    );

  const filtraTipoEvento = (dre, ue) => {
    if (ue && ue !== OPCAO_TODOS) return setListaTipoEvento(filtraSomenteUE());
    if (dre && dre !== OPCAO_TODOS)
      return setListaTipoEvento(filtraSomenteDRE());
    return setListaTipoEvento(filtraSomenteSME());
  };

  useEffect(() => {
    if (dreId || ueId) {
      filtraTipoEvento(dreId, ueId);
    }
  }, [dreId, ueId]);

  useEffect(() => {
    if (!tipoEventoId) {
      form.setFieldValue('feriadoId', '');
      form.setFieldValue('bimestre', []);
    }
  }, [tipoEventoId]);

  return (
    <SelectComponent
      form={form}
      name={nomeCampo}
      lista={listaTipoEvento}
      valueOption="id"
      valueText="descricao"
      onChange={onChangeCampos}
      label="Tipo evento"
      placeholder="Selecione um tipo"
      disabled={listaTipoEvento?.length === 1 || desabilitar}
    />
  );
};

TipoEventoCadastroEventos.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  desabilitar: PropTypes.bool,
};

TipoEventoCadastroEventos.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  desabilitar: false,
};

export default TipoEventoCadastroEventos;
