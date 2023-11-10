import PropTypes from 'prop-types';
import React, { useContext, useEffect } from 'react';
import { SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import ListaLocalOcorrencia from '~/constantes/localOcorrencia';
import tipoEvento from '~/dtos/tipoEvento';
import EventosCadastroContext from '../eventosCadastroContext';

const TipoEventoCadastroEventos = ({ form, onChangeCampos, desabilitar }) => {
  const {
    listaTipoEvento,
    setListaTipoEvento,
    setDesabilitarLetivo,
    listaTipoEventoOrigem,
  } = useContext(EventosCadastroContext);

  const { dreId, ueId, tipoEventoId } = form.values;

  const nomeCampo = 'tipoEventoId';

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

  const escolherFiltro = (dre, ue) => {
    const ehTodasDre = dre === OPCAO_TODOS;
    const ehTodasUe = ue === OPCAO_TODOS;
    const eventosSME = ehTodasDre && ehTodasUe;
    const eventosDRE = !ehTodasDre && ehTodasUe;
    const eventosUE = !ehTodasDre && !ehTodasUe;

    if (eventosSME) return filtraSomenteSME();
    if (eventosUE) return filtraSomenteUE();
    if (eventosDRE) return filtraSomenteDRE();
    return [];
  };

  const filtraTipoEvento = (dre, ue) => {
    const eventosFiltrados = escolherFiltro(dre, ue);
    setListaTipoEvento(eventosFiltrados);
  };

  useEffect(() => {
    if (dreId && ueId && listaTipoEventoOrigem) {
      filtraTipoEvento(dreId, ueId);
    }
  }, [dreId, ueId, listaTipoEventoOrigem]);

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
      labelRequired
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
