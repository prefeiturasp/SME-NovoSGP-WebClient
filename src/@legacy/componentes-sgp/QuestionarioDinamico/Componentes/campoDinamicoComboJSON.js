import { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import SelectComponent from '~/componentes/select';
import QuestionarioDinamicoFuncoes from '../Funcoes/QuestionarioDinamicoFuncoes';
import ColunaDimensionavel from './ColunaDimensionavel/colunaDimensionavel';

export const CampoDinamicoComboJSON = props => {
  const {
    questaoAtual,
    form,
    label,
    desabilitado,
    onChange,
    prefixId,
    multiple,
  } = props;

  const id = QuestionarioDinamicoFuncoes.gerarId(prefixId, questaoAtual);

  const valoresFormulario = questaoAtual?.resposta?.[0]?.texto;

  let lista = [];
  if (valoresFormulario) {
    if (multiple) {
      const listParse = JSON.parse(cloneDeep(valoresFormulario));
      if (listParse?.length) {
        lista = listParse.map(item => ({
          label: item?.value,
          value: item?.index,
        }));
      }
    } else {
      const itemParse = JSON.parse(cloneDeep(valoresFormulario));
      if (itemParse?.index) {
        lista = [
          {
            label: itemParse?.value,
            value: itemParse?.index,
          },
        ];
      }
    }
  }

  return (
    <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
      {label}
      <SelectComponent
        id={id}
        form={form}
        labelInValue
        lista={lista}
        valueText="label"
        valueOption="value"
        multiple={multiple}
        name={String(questaoAtual.id)}
        placeholder={questaoAtual?.placeHolder}
        disabled={desabilitado || questaoAtual.somenteLeitura}
        onChange={valorAtualSelecionado => {
          onChange(valorAtualSelecionado);
        }}
      />
    </ColunaDimensionavel>
  );
};

CampoDinamicoComboJSON.propTypes = {
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
  form: PropTypes.oneOfType([PropTypes.any]),
  label: PropTypes.oneOfType([PropTypes.any]),
  prefixId: PropTypes.string,
  desabilitado: PropTypes.bool,
  onChange: PropTypes.oneOfType([PropTypes.any]),
  multiple: PropTypes.bool,
};

CampoDinamicoComboJSON.defaultProps = {
  questaoAtual: null,
  form: null,
  label: '',
  prefixId: '',
  desabilitado: false,
  onChange: () => {},
  multiple: false,
};
