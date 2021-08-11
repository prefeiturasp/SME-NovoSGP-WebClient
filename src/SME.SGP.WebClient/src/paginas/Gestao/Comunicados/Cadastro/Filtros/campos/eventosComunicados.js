import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { erros } from '~/servicos';
import ServicoComunicadoEvento from '~/servicos/Paginas/AcompanhamentoEscolar/ComunicadoEvento/ServicoComunicadoEvento';

const EventosComunicados = ({ form, onChangeCampos, desabilitar }) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaEventos, setListaEventos] = useState([]);

  const {
    anoLetivo,
    codigoDre,
    codigoUe,
    modalidades,
    tipoCalendarioId,
  } = form.values;

  const nomeCampo = 'eventoId';

  const obterEventos = useCallback(async () => {
    setExibirLoader(true);
    const retorno = await ServicoComunicadoEvento.listarPor({
      tipoCalendario: tipoCalendarioId,
      anoLetivo,
      codigoDre,
      codigoUe,
      modalidades,
    })
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.data?.length) {
      const lista = retorno.data;

      setListaEventos(lista);

      if (lista.length === 1) {
        const { id } = lista[0];
        form.setFieldValue(nomeCampo, id);
      }
    } else {
      setListaEventos([]);
      form.setFieldValue(nomeCampo, undefined);
    }
  }, [anoLetivo, codigoDre, codigoUe, modalidades, tipoCalendarioId]);

  useEffect(() => {
    if (tipoCalendarioId && codigoUe && modalidades?.length) {
      obterEventos();
    } else {
      setListaEventos([]);
      form.setFieldValue(nomeCampo, undefined);
    }
  }, [tipoCalendarioId, codigoUe, modalidades, obterEventos]);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        id="evento"
        label="Evento"
        lista={listaEventos}
        valueOption="id"
        valueText="nome"
        placeholder="Selecione um evento"
        searchValue={false}
        disabled={
          !tipoCalendarioId ||
          desabilitar ||
          !modalidades?.length ||
          listaEventos?.length === 1
        }
        showSearch
        name={nomeCampo}
        form={form}
        onChange={() => {
          onChangeCampos();
        }}
      />
    </Loader>
  );
};

EventosComunicados.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  desabilitar: PropTypes.bool,
};

EventosComunicados.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  desabilitar: false,
};

export default EventosComunicados;
