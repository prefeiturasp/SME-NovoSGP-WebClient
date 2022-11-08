import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';
import { SGP_SELECT_ANO_LETIVO } from '~/componentes-sgp/filtro/idsCampos';
import { erros } from '~/servicos';
import { ordenarDescPor } from '~/utils';

const AnoLetivoOcorrencia = ({
  form,
  onChangeCampos,
  ocorrenciaId,
  desabilitar,
}) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaAnosLetivos, setListaAnosLetivos] = useState([]);

  const { consideraHistorico } = form.values;

  const nomeCampo = 'anoLetivo';

  const obterAnosLetivos = useCallback(async () => {
    setExibirLoader(true);
    const resposta = await FiltroHelper.obterAnosLetivos({
      consideraHistorico,
    })
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.length) {
      const anosOrdenados = ordenarDescPor(resposta, 'valor');

      if (anosOrdenados?.length) {
        const { valor } = anosOrdenados[0];

        form.setFieldValue(nomeCampo, valor);
        if (!ocorrenciaId) {
          form.initialValues[nomeCampo] = valor;
        }
      }
      setListaAnosLetivos(anosOrdenados);
    } else {
      form.setFieldValue(nomeCampo, undefined);
      setListaAnosLetivos([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consideraHistorico]);

  useEffect(() => {
    obterAnosLetivos();
  }, [consideraHistorico, obterAnosLetivos]);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        id={SGP_SELECT_ANO_LETIVO}
        label="Ano Letivo"
        lista={listaAnosLetivos}
        valueOption="valor"
        valueText="desc"
        disabled={desabilitar}
        placeholder="Ano letivo"
        showSearch
        name={nomeCampo}
        form={form}
        labelRequired
        onChange={() => {
          onChangeCampos();
          form.setFieldValue('dreCodigo', undefined);
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

AnoLetivoOcorrencia.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  desabilitar: PropTypes.bool,
  ocorrenciaId: PropTypes.string,
};

AnoLetivoOcorrencia.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  desabilitar: false,
  ocorrenciaId: '',
};

export default AnoLetivoOcorrencia;
