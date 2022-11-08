/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_UE } from '~/componentes-sgp/filtro/idsCampos';
import { AbrangenciaServico, erros } from '~/servicos';

const UeOcorrencia = props => {
  const {
    form,
    onChangeCampos,
    desabilitar,
    setListaUes,
    listaUes,
    dreCodigo,
    ocorrenciaId,
  } = props;

  const [exibirLoader, setExibirLoader] = useState(false);

  const { anoLetivo } = form.values;

  const nomeCampo = 'ueId';

  const listaUesEdicao = form?.initialValues?.ueId
    ? [{ id: form?.initialValues?.ueId, nome: form?.initialValues?.ueNome }]
    : [];

  const obterUes = useCallback(async () => {
    setExibirLoader(true);
    const resposta = await AbrangenciaServico.buscarUes(
      dreCodigo,
      `v1/abrangencias/false/dres/${dreCodigo}/ues?anoLetivo=${anoLetivo}`,
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
    if (ocorrenciaId) return;

    if (dreCodigo) {
      obterUes();
    } else {
      form.setFieldValue(nomeCampo, undefined);
      setListaUes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dreCodigo, ocorrenciaId]);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        id={SGP_SELECT_UE}
        label="Unidade Escolar (UE)"
        lista={ocorrenciaId ? listaUesEdicao : listaUes}
        valueOption="id"
        valueText="nome"
        disabled={
          !dreCodigo || listaUes?.length === 1 || desabilitar || !!ocorrenciaId
        }
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
