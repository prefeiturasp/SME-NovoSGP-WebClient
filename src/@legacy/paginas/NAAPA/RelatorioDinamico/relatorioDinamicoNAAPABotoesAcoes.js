import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';
import { MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO, URL_HOME } from '~/constantes';
import { erros, sucesso } from '~/servicos';

import ServicoRelatorioEncaminhamentoNAAPA from '@/@legacy/servicos/Paginas/Relatorios/NAAPA/ServicoRelatorioEncaminhamentoNAAPA';
import { HttpStatusCode } from 'axios';
import { useContext } from 'react';
import RelatorioDinamicoNAAPAContext from './relatorioDinamicoNAAPAContext';

const RelatorioDinamicoNAAPABotoesAcoes = props => {
  const navigate = useNavigate();

  const {
    form,
    initialValues,
    desabilitarGerar,
    setGerandoRelatorio,
    setDesabilitarGerar,
  } = props;

  const { dataSource } = useContext(RelatorioDinamicoNAAPAContext);

  const onClickGerar = () => {
    // const valuesClone = _.cloneDeep(values);

    const ids = dataSource?.map(item => item?.id);

    setGerandoRelatorio(true);

    const params = {
      // TODO
      // dreCodigo: valuesClone?.dreCodigo,
      // ueCodigo: valuesClone?.ueCodigo,
      ids,
    };

    ServicoRelatorioEncaminhamentoNAAPA.gerar(params)
      .then(retorno => {
        if (retorno?.status === HttpStatusCode.Ok) {
          sucesso(MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO);
          setDesabilitarGerar(true);
        }
      })
      .catch(e => erros(e))
      .finally(() => setGerandoRelatorio(false));
  };

  const validaAntesDoSubmit = () => {
    const arrayCampos = Object.keys(initialValues);
    arrayCampos.forEach(campo => {
      form.setFieldTouched(campo, true, true);
    });

    form.validateForm().then(() => {
      if (form.isValid || Object.keys(form.errors).length === 0) {
        onClickGerar(form?.values);
      }
    });
  };

  const onClickVoltar = () => navigate(URL_HOME);

  const onClickCancelar = () => {
    setDesabilitarGerar(false);
    form.setFieldValue('modoEdicao', false);
    form.resetForm();
  };

  return (
    <BotoesAcaoRelatorio
      modoEdicao={!!form?.values?.modoEdicao}
      onClickCancelar={onClickCancelar}
      onClickVoltar={() => onClickVoltar()}
      desabilitarBtnGerar={desabilitarGerar}
      onClickGerar={() => validaAntesDoSubmit(form)}
    />
  );
};

RelatorioDinamicoNAAPABotoesAcoes.propTypes = {
  form: PropTypes.oneOfType([PropTypes.any]),
  initialValues: PropTypes.oneOfType([PropTypes.any]),
  desabilitarGerar: PropTypes.bool,
  setGerandoRelatorio: PropTypes.oneOfType([PropTypes.any]),
  setDesabilitarGerar: PropTypes.oneOfType([PropTypes.any]),
};

RelatorioDinamicoNAAPABotoesAcoes.defaultProps = {
  form: null,
  initialValues: {},
  desabilitarGerar: false,
  setGerandoRelatorio: () => false,
  setDesabilitarGerar: () => false,
};

export default RelatorioDinamicoNAAPABotoesAcoes;
