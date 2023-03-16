import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Card, Loader } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import RelatorioEncaminhamentoNAAPABotoesAcoes from './relatorioEncaminhamentoNAAPABotoesAcoes';
import RelatorioEncaminhamentoNAAPAForm from './relatorioEncaminhamentoNAAPAForm';

const RelatorioEncaminhamentonNAAPA = () => {
  const [gerandoRelatorio, setGerandoRelatorio] = useState(false);
  const [desabilitarGerar, setDesabilitarGerar] = useState(false);

  const anoAtual = window.moment().format('YYYY');

  const inicial = {
    modoEdicao: false,
    consideraHistorico: false,
    anoLetivo: anoAtual,
    dreCodigo: undefined,
    listaDres: [],
    ueCodigo: undefined,
    listaUes: [],
    situacaoIds: [],
    exibirEncerrados: false,
    portaEntradaIds: [],
    fluxoAlertaIds: [],
  };

  const [initialValues] = useState(inicial);

  const textoCampoObrigatorio = 'Campo obrigatório';

  const validacoes = Yup.object({
    dreCodigo: Yup.string().required(textoCampoObrigatorio),
    ueCodigo: Yup.string().required(textoCampoObrigatorio),
  });

  const onChangeCampos = () => setDesabilitarGerar(false);

  return (
    <Loader loading={gerandoRelatorio}>
      {initialValues ? (
        <Formik
          validateOnBlur
          validateOnChange
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validacoes}
        >
          {form => (
            <>
              <Cabecalho pagina="Encaminhamento NAAPA">
                <RelatorioEncaminhamentoNAAPABotoesAcoes
                  form={form}
                  initialValues={initialValues}
                  desabilitarGerar={desabilitarGerar}
                  setGerandoRelatorio={setGerandoRelatorio}
                  setDesabilitarGerar={setDesabilitarGerar}
                />
              </Cabecalho>

              <Card padding="24px 24px">
                <RelatorioEncaminhamentoNAAPAForm
                  form={form}
                  onChangeCampos={onChangeCampos}
                />
              </Card>
            </>
          )}
        </Formik>
      ) : (
        <></>
      )}
    </Loader>
  );
};

export default RelatorioEncaminhamentonNAAPA;
