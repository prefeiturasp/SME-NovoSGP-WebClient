/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_UE } from '~/componentes-sgp/filtro/idsCampos';
import { AbrangenciaServico, erros } from '~/servicos';

const UeOcorrencia = ({
  form,
  onChangeCampos,
  desabilitar,
  setListaUes,
  listaUes,
  dreCodigo,
}) => {
  const [exibirLoader, setExibirLoader] = useState(false);

  const { consideraHistorico, anoLetivo } = form.values;

  const nomeCampo = 'ueId';

  const obterUes = useCallback(async () => {
    setExibirLoader(true);
    const resposta = await AbrangenciaServico.buscarUes(
      dreCodigo,
      `v1/abrangencias/${consideraHistorico}/dres/${dreCodigo}/ues?anoLetivo=${anoLetivo}`,
      true
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      const lista = resposta.data;

      if (lista?.length === 1) {
        form.setFieldValue(nomeCampo, String(lista[0]?.id));
      }

      setListaUes(lista);
    } else {
      form.initialValues[nomeCampo] = undefined;
      setListaUes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anoLetivo, dreCodigo]);

  useEffect(() => {
    if (dreCodigo) {
      obterUes();
    } else {
      form.setFieldValue(nomeCampo, undefined);
      setListaUes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dreCodigo]);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        id={SGP_SELECT_UE}
        label="Unidade Escolar (UE)"
        lista={listaUes}
        valueOption="id"
        valueText="nome"
        disabled={!dreCodigo || listaUes?.length === 1 || desabilitar}
        placeholder="Unidade Escolar (UE)"
        showSearch
        name={nomeCampo}
        form={form}
        labelRequired
        onChange={() => {
          onChangeCampos();
          form.setFieldValue('modalidade', undefined);
          form.setFieldValue('semestre', undefined);
          form.setFieldValue('turmaId', null);
        }}
      />
    </Loader>
  );
};

export default UeOcorrencia;
