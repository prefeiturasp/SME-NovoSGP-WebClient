import PropTypes from 'prop-types';
import { CampoData } from '~/componentes';
import QuestionarioDinamicoFuncoes from '../Funcoes/QuestionarioDinamicoFuncoes';
import ColunaDimensionavel from './ColunaDimensionavel/colunaDimensionavel';

const CampoDinamicoData = props => {
  const { questaoAtual, form, label, disabled, onChange, prefixId } = props;

  const id = QuestionarioDinamicoFuncoes.gerarId(prefixId, questaoAtual);

  const desabilitarDataFutura = current => {
    if (current) {
      return current >= window.moment();
    }
    return false;
  };

  const desabilitarAnosAnterioresEDataFutura = current => {
    if (current) {
      return (
        current.year() !== window.moment().year() || current >= window.moment()
      );
    }
    return false;
  };

  const opcionais = questaoAtual?.opcionais
    ? JSON.parse(questaoAtual?.opcionais)
    : null;

  const desabilitarDatas = () => {
    if (
      opcionais?.desabilitarDataFutura &&
      opcionais?.desabilitarDataAnosAnteriores
    ) {
      return desabilitarAnosAnterioresEDataFutura;
    }
    if (opcionais?.desabilitarDataFutura) {
      return desabilitarDataFutura;
    }

    return null;
  };

  return (
    <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
      {label}
      <CampoData
        id={id}
        form={form}
        onChange={onChange}
        desabilitado={disabled}
        formatoData="DD/MM/YYYY"
        name={String(questaoAtual?.id)}
        desabilitarData={desabilitarDatas()}
        placeholder={questaoAtual?.placeHolder || 'DD/MM/AAAA'}
      />
    </ColunaDimensionavel>
  );
};

CampoDinamicoData.propTypes = {
  label: PropTypes.oneOfType([PropTypes.any]),
  form: PropTypes.oneOfType([PropTypes.any]),
  prefixId: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
};

CampoDinamicoData.defaultProps = {
  label: '',
  form: null,
  prefixId: '',
  disabled: false,
  onChange: () => {},
  questaoAtual: null,
};

export default CampoDinamicoData;
