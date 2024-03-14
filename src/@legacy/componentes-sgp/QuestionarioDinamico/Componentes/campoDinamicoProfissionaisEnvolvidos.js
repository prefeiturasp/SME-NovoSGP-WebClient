import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import SelectComponent from '~/componentes/select';
import ColunaDimensionavel from './ColunaDimensionavel/colunaDimensionavel';
import QuestionarioDinamicoFuncoes from '../Funcoes/QuestionarioDinamicoFuncoes';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';
import { erros } from '~/servicos';

const CampoDinamicoProfissionaisEnvolvidos = props => {
  const {
    questaoAtual,
    form,
    label,
    desabilitado,
    onChange,
    prefixId,
    codigoDre,
  } = props;

  const [lista, setLista] = useState([]);

  const id = QuestionarioDinamicoFuncoes.gerarId(prefixId, questaoAtual);

  const nomeCampo = String(questaoAtual?.id);

  const obterDados = useCallback(async () => {
    const listaProfissionaisAtuais = form?.values?.[questaoAtual.id]?.length
      ? form?.values?.[questaoAtual.id]
      : [];

    const resposta = await ServicoNAAPA.obterProfissionaisEnvolvidosAtendimento(
      codigoDre
    ).catch(e => erros(e));

    if (resposta?.data?.length) {
      const listaAtualizada = resposta.data.map(item => ({
        label: `${item.nomeServidor} (${item.login})`,
        value: item.login,
      }));
      const listaCompleta = [...listaAtualizada, ...listaProfissionaisAtuais];

      const listaSemDuplicados = listaCompleta.filter((item, index, self) => {
        return self.findIndex(i => i?.value === item?.value) === index;
      });

      setLista(listaSemDuplicados);
    } else {
      setLista([]);
    }
  }, [codigoDre]);

  useEffect(() => {
    obterDados();
  }, [obterDados]);

  return (
    <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
      {label}
      <SelectComponent
        multiple
        labelInValue
        setValueOnlyOnChange
        id={id}
        form={form}
        lista={lista}
        valueText="label"
        valueOption="value"
        name={nomeCampo}
        placeholder={
          questaoAtual?.placeHolder || 'Selecione um ou mais profissionais'
        }
        disabled={desabilitado || questaoAtual?.somenteLeitura}
        onChange={valoresSelecionados => {
          let listaMapeada = [];
          if (valoresSelecionados?.length) {
            listaMapeada = valoresSelecionados.map(item => ({
              label: item?.label,
              value: item?.value,
            }));
          }
          form.setFieldValue(nomeCampo, listaMapeada);
          form.setFieldTouched(nomeCampo, true, true);
          onChange(listaMapeada);
        }}
      />
    </ColunaDimensionavel>
  );
};

CampoDinamicoProfissionaisEnvolvidos.propTypes = {
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
  form: PropTypes.oneOfType([PropTypes.any]),
  label: PropTypes.oneOfType([PropTypes.any]),
  prefixId: PropTypes.string,
  desabilitado: PropTypes.bool,
  onChange: PropTypes.oneOfType([PropTypes.any]),
};

CampoDinamicoProfissionaisEnvolvidos.defaultProps = {
  questaoAtual: null,
  form: null,
  label: '',
  prefixId: '',
  desabilitado: false,
  onChange: () => {},
};

export default CampoDinamicoProfissionaisEnvolvidos;
