import { SGP_SELECT_TIPO_OCORRENCIA } from '@/@legacy/constantes/ids/select';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { ServicoOcorrencias, erros } from '~/servicos';

const TipoOcorrencia = ({ form, onChange, multiple, name }) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [lista, setLista] = useState([]);

  const obterTipos = useCallback(async () => {
    setExibirLoader(true);

    const resposta = await ServicoOcorrencias.buscarTiposOcorrencias()
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      setLista(resposta.data);
    } else {
      setLista([]);
      form.setFieldValue(name, undefined);
    }
  }, []);

  useEffect(() => {
    obterTipos();
  }, []);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        name={name}
        form={form}
        valueOption="id"
        valueText="descricao"
        lista={lista}
        label="Tipo de ocorrência"
        id={SGP_SELECT_TIPO_OCORRENCIA}
        placeholder="Tipo de ocorrência"
        disabled={lista?.length === 1}
        setValueOnlyOnChange
        multiple={multiple}
        onChange={newValue => {
          form.setFieldValue('modoEdicao', true);

          form.setFieldValue(name, newValue);
          form.setFieldTouched(name, true, true);
          onChange(newValue);
        }}
      />
    </Loader>
  );
};

TipoOcorrencia.propTypes = {
  onChange: PropTypes.func,
  form: PropTypes.oneOfType([PropTypes.any]),
  multiple: PropTypes.bool,
  name: PropTypes.string,
};

TipoOcorrencia.defaultProps = {
  form: null,
  onChange: () => null,
  multiple: true,
  name: 'ocorrenciaTipoIds',
};

export default TipoOcorrencia;
