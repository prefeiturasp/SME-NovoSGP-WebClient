import PropTypes from 'prop-types';
import _ from 'lodash';
import React from 'react';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';
import {
  CRIANCAS_ESTUDANTES_SELECIONADOS,
  MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO,
  URL_HOME,
} from '~/constantes';
import { ServicoRelatorioFrequencia, erro, erros, sucesso } from '~/servicos';
import { useNavigate } from 'react-router-dom';

const RelatorioControleFrequenciaMensalBotoesAcoes = props => {
  const navigate = useNavigate();

  const {
    form,
    initialValues,
    desabilitarGerar,
    setGerandoRelatorio,
    setDesabilitarGerar,
  } = props;

  const onClickGerar = values => {
    const valuesClone = _.cloneDeep(values);

    if (
      valuesClone?.criancasEstudantes === CRIANCAS_ESTUDANTES_SELECIONADOS &&
      !valuesClone?.codigosEstudantes?.length
    ) {
      erro('Obrigatório a seleção de pelo menos um(a) Criança/Estudante');
      return;
    }
    setGerandoRelatorio(true);

    const params = {
      exibirHistorico: !!valuesClone?.consideraHistorico,
      anoLetivo: valuesClone?.anoLetivo,
      codigoDre: valuesClone?.dreCodigo,
      codigoUe: valuesClone?.ueCodigo,
      modalidade: valuesClone?.modalidade,
      codigoTurma: valuesClone?.turmaCodigo,
      mesesReferencias: valuesClone?.mesesReferencias,
      tipoFormatoRelatorio: valuesClone?.tipoFormatoRelatorio,
    };

    if (valuesClone?.semestre) {
      params.semestre = valuesClone.semestre;
    }

    if (valuesClone?.codigosEstudantes?.length) {
      params.alunosCodigo = valuesClone.codigosEstudantes;
    } else {
      params.alunosCodigo = [];
    }

    ServicoRelatorioFrequencia.gerarControleFrequenciaMensal(params)
      .then(retorno => {
        if (retorno?.status === 200) {
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

RelatorioControleFrequenciaMensalBotoesAcoes.propTypes = {
  form: PropTypes.oneOfType([PropTypes.any]),
  initialValues: PropTypes.oneOfType([PropTypes.any]),
  desabilitarGerar: PropTypes.bool,
  setGerandoRelatorio: PropTypes.oneOfType([PropTypes.any]),
  setDesabilitarGerar: PropTypes.oneOfType([PropTypes.any]),
};

RelatorioControleFrequenciaMensalBotoesAcoes.defaultProps = {
  form: null,
  initialValues: {},
  desabilitarGerar: false,
  setGerandoRelatorio: () => false,
  setDesabilitarGerar: () => false,
};

export default RelatorioControleFrequenciaMensalBotoesAcoes;
