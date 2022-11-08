/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';
import { SGP_SELECT_DRE } from '~/componentes-sgp/filtro/idsCampos';
import { AbrangenciaServico, erros } from '~/servicos';

const DreOcorrencia = props => {
  const {
    form,
    onChangeCampos,
    desabilitar,
    ocorrenciaId,
    setListaDres,
    listaDres,
  } = props;

  const [exibirLoader, setExibirLoader] = useState(false);

  const { consideraHistorico, anoLetivo } = form.values;

  const nomeCampo = 'dreId';

  const obterDres = useCallback(async () => {
    setExibirLoader(true);
    const resposta = await AbrangenciaServico.buscarDres(
      `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      const lista = resposta.data.sort(FiltroHelper.ordenarLista('nome'));

      if (lista?.length === 1) {
        form.setFieldValue(nomeCampo, String(lista[0]?.id));
        if (!ocorrenciaId) {
          form.initialValues[nomeCampo] = String(lista[0]?.id);
        }
      }
      setListaDres(lista);
    } else {
      form.setFieldValue(nomeCampo, undefined);
      setListaDres([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (anoLetivo) {
      obterDres();
    } else {
      form.setFieldValue(nomeCampo, undefined);
      setListaDres([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anoLetivo]);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        id={SGP_SELECT_DRE}
        label="Diretoria Regional de Educação (DRE)"
        lista={listaDres}
        valueOption="id"
        valueText="nome"
        disabled={!anoLetivo || listaDres?.length === 1 || desabilitar}
        placeholder="Diretoria Regional De Educação (DRE)"
        showSearch
        name={nomeCampo}
        form={form}
        labelRequired
        onChange={() => {
          onChangeCampos();
          form.setFieldValue('ueCodigo', undefined);
          form.setFieldValue('modalidade', undefined);
          form.setFieldValue('semestre', undefined);
          form.setFieldValue('turmaId', null);
          form.setFieldValue('dataOcorrencia', '');
          form.setFieldValue('horaOcorrencia', '');
          form.setFieldValue('ocorrenciaTipoId', undefined);
          form.setFieldValue('titulo', '');
          form.setFieldValue('descricao', '');
        }}
      />
    </Loader>
  );
};

export default DreOcorrencia;
