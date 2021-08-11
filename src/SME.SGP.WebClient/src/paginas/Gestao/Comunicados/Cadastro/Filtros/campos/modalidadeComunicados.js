import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { ServicoFiltroRelatorio } from '~/servicos';
import { onchangeMultiSelect } from '~/utils';

const ModalidadeComunicados = ({ form, onChangeCampos, desabilitar }) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaModalidades, setListaModalidades] = useState([]);

  const { codigoUe, modalidades } = form.values;

  const nomeCampo = 'modalidades';

  const obterModalidades = useCallback(async () => {
    setExibirLoader(true);
    const resposta = await ServicoFiltroRelatorio.obterModalidadesPorAbrangencia(
      codigoUe,
      true
    ).finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      const lista = resposta.data;

      if (lista?.length === 1) {
        const { valor } = lista[0];
        form.setFieldValue(nomeCampo, [valor]);
      } else {
        lista.unshift({
          descricao: 'Todas',
          valor: [OPCAO_TODOS],
        });
      }
      setListaModalidades(lista);
    } else {
      form.setFieldValue(nomeCampo, []);
      setListaModalidades([]);
    }
  }, [codigoUe]);

  useEffect(() => {
    if (codigoUe) {
      obterModalidades();
    } else {
      form.setFieldValue(nomeCampo, []);
      setListaModalidades([]);
    }
  }, [codigoUe, obterModalidades]);

  const onChangeModalidade = novosValores => {
    form.setFieldValue(nomeCampo, novosValores || []);
    form.setFieldTouched(nomeCampo, true, true);
  };

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        id="modalidades"
        label="Modalidade"
        lista={listaModalidades}
        valueOption="valor"
        valueText="descricao"
        disabled={!codigoUe || listaModalidades?.length === 1 || desabilitar}
        placeholder="Modalidade"
        multiple
        name={nomeCampo}
        form={form}
        setValueOnlyOnChange
        onChange={valores => {
          onchangeMultiSelect(valores, modalidades, onChangeModalidade);
          onChangeCampos();
          form.setFieldValue('semestre', undefined);
          form.setFieldValue('anoEscolar', []);
        }}
      />
    </Loader>
  );
};

ModalidadeComunicados.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  desabilitar: PropTypes.bool,
};

ModalidadeComunicados.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  desabilitar: false,
};

export default ModalidadeComunicados;
