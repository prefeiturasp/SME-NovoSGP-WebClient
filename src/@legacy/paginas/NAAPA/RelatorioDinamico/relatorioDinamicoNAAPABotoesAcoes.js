import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';
import { URL_HOME } from '~/constantes';

import { useContext } from 'react';
import RelatorioDinamicoNAAPAContext from './relatorioDinamicoNAAPAContext';

const RelatorioDinamicoNAAPABotoesAcoes = ({ form }) => {
  const navigate = useNavigate();

  const { setDataSource, setListaSecoesParaDesabilitar } = useContext(
    RelatorioDinamicoNAAPAContext
  );

  const onClickVoltar = () => navigate(URL_HOME);

  const onClickCancelar = () => {
    form.setFieldValue('modoEdicao', false);
    form.resetForm();
    setDataSource([]);
    setListaSecoesParaDesabilitar([]);
  };

  return (
    <BotoesAcaoRelatorio
      modoEdicao={!!form?.values?.modoEdicao}
      onClickCancelar={onClickCancelar}
      onClickVoltar={() => onClickVoltar()}
      exibirBotaoImpressao={false}
    />
  );
};

RelatorioDinamicoNAAPABotoesAcoes.propTypes = {
  form: PropTypes.oneOfType([PropTypes.any]),
};

RelatorioDinamicoNAAPABotoesAcoes.defaultProps = {
  form: null,
};

export default RelatorioDinamicoNAAPABotoesAcoes;
