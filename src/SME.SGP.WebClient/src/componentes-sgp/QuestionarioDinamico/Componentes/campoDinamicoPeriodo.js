import PropTypes from 'prop-types';
import React from 'react';
import { CampoData } from '~/componentes/campoData/campoData';
import { Base } from '~/componentes/colors';
import ColunaDimensionavel from './ColunaDimensionavel/colunaDimensionavel';

const CampoDinamicoPeriodo = props => {
  const { questaoAtual, form, label, desabilitado, onChange, prefixId } = props;

  const idPeriodoInicio = prefixId
    ? `${prefixId}_ORDEM_${questaoAtual?.ordem}_PERIODO_INICIO`
    : `${questaoAtual?.id}.periodoInicio`;

  const idPeriodoFim = prefixId
    ? `${prefixId}_ORDEM_${questaoAtual?.ordem}_PERIODO_FIM`
    : `${questaoAtual?.id}.periodoFim`;

  const obterErroQuestaoAtual = () => {
    return form &&
      form?.touched[questaoAtual?.id] &&
      form?.errors[questaoAtual?.id]
      ? form.errors[questaoAtual?.id]
      : '';
  };

  const obterErroPorCampo = nomeCampo => {
    const nomeErro = obterErroQuestaoAtual();

    let textoErro = '';

    if (nomeErro) {
      const naoTemValorCampo = !form?.values?.[questaoAtual?.id]?.[nomeCampo];

      switch (nomeErro) {
        case 'OBRIGATORIO':
          if (naoTemValorCampo) {
            textoErro = 'Campo obrigatório';
          }
          break;
        case 'PERIODO_INICIO_MAIOR_QUE_FIM':
          if (nomeCampo === 'periodoInicio') {
            textoErro = 'Período inicial deve ser menor que o período final';
          }
          break;

        default:
          break;
      }
    }

    if (textoErro) {
      return <span style={{ color: Base.Vermelho }}>{textoErro}</span>;
    }
    return '';
  };

  return (
    <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
      {label}
      <div className="row">
        <div className="col-md-2">
          <CampoData
            form={form}
            id={idPeriodoInicio}
            placeholder="Início"
            executarOnChangeExterno
            formatoData="DD/MM/YYYY"
            name={`${questaoAtual?.id}.periodoInicio`}
            desabilitado={desabilitado || questaoAtual?.somenteLeitura}
            className={obterErroPorCampo('periodoInicio') ? 'is-invalid' : ''}
            onChange={valorData => {
              form.setFieldTouched(questaoAtual?.id, true);
              form.setFieldValue(
                `${questaoAtual?.id}.periodoInicio`,
                valorData || ''
              );
              onChange();
            }}
          />
          {obterErroPorCampo('periodoInicio')}
        </div>
        <span style={{ marginTop: 5 }}>à</span>
        <div className="col-md-2">
          <CampoData
            form={form}
            id={idPeriodoFim}
            placeholder="Fim"
            executarOnChangeExterno
            formatoData="DD/MM/YYYY"
            desabilitado={desabilitado}
            name={`${questaoAtual?.id}.periodoFim`}
            className={obterErroPorCampo('periodoFim') ? 'is-invalid' : ''}
            onChange={valorData => {
              form.setFieldTouched(questaoAtual?.id, true);
              form.setFieldValue(
                `${questaoAtual?.id}.periodoFim`,
                valorData || ''
              );
              onChange();
            }}
          />
          {obterErroPorCampo('periodoFim')}
        </div>
      </div>
    </ColunaDimensionavel>
  );
};

CampoDinamicoPeriodo.propTypes = {
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
  form: PropTypes.oneOfType([PropTypes.any]),
  label: PropTypes.oneOfType([PropTypes.any]),
  prefixId: PropTypes.string,
  desabilitado: PropTypes.bool,
  onChange: PropTypes.func,
};

CampoDinamicoPeriodo.defaultProps = {
  questaoAtual: null,
  form: null,
  label: '',
  prefixId: '',
  desabilitado: false,
  onChange: () => {},
};

export default CampoDinamicoPeriodo;
