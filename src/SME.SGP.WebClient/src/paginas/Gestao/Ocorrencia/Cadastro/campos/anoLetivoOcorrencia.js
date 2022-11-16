/* eslint-disable react/prop-types */

import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';
import { SGP_SELECT_ANO_LETIVO } from '~/componentes-sgp/filtro/idsCampos';
import { erros } from '~/servicos';
import { ordenarDescPor } from '~/utils';

const AnoLetivoOcorrencia = ({ form }) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaAnosLetivos, setListaAnosLetivos] = useState([]);

  const nomeCampo = 'anoLetivo';

  const obterAnosLetivos = useCallback(async () => {
    setExibirLoader(true);
    const resposta = await FiltroHelper.obterAnosLetivos({
      consideraHistorico: false,
    })
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.length) {
      const anosOrdenados = ordenarDescPor(resposta, 'valor');

      if (anosOrdenados?.length) {
        const { valor } = anosOrdenados[0];

        form.setFieldValue(nomeCampo, valor);
      }
      setListaAnosLetivos(anosOrdenados);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos]);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        id={SGP_SELECT_ANO_LETIVO}
        label="Ano Letivo"
        lista={listaAnosLetivos}
        valueOption="valor"
        valueText="desc"
        disabled
        placeholder="Ano letivo"
        showSearch
        name={nomeCampo}
        form={form}
        labelRequired
      />
    </Loader>
  );
};

export default AnoLetivoOcorrencia;
