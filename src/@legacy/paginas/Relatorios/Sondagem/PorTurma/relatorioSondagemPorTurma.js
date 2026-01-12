import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Card, Loader } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import RelatorioSondagemPorTurmaBotoesAcoes from './relatorioSondagemPorTurmaBotoesAcoes';
import RelatorioSondagemPorTurmaForm from './relatorioSondagemPorTurmaForm';

const RelatorioSondagemPorTurma = () => {
  const [gerandoRelatorio, setGerandoRelatorio] = useState(false);
  const [desabilitarGerar, setDesabilitarGerar] = useState(false);

  const inicial = {
    modoEdicao: false,
    consideraHistorico: false,
    anoLetivo: undefined,
    dreCodigo: undefined,
    listaDres: [],
    ueCodigo: undefined,
    listaUes: [],
    tipoSondagem: undefined,
    periodoSondagem: undefined,
    apresentarTurmasUesDresSemLancamento: true,
  };

  const [initialValues] = useState(inicial);

  const textoCampoObrigatorio = 'Campo obrigatório';

  const validacoes = Yup.object({
    anoLetivo: Yup.string().required(textoCampoObrigatorio),
    dreCodigo: Yup.string().required(textoCampoObrigatorio),
    ueCodigo: Yup.string().required(textoCampoObrigatorio),
    tipoSondagem: Yup.string().required(textoCampoObrigatorio),
    periodoSondagem: Yup.string().required(textoCampoObrigatorio),
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
              <Cabecalho pagina="Sondagem por turma">
                <RelatorioSondagemPorTurmaBotoesAcoes
                  form={form}
                  initialValues={initialValues}
                  desabilitarGerar={desabilitarGerar}
                  setGerandoRelatorio={setGerandoRelatorio}
                  setDesabilitarGerar={setDesabilitarGerar}
                />
              </Cabecalho>

              <Card padding="24px 24px">
                <RelatorioSondagemPorTurmaForm
                  form={form}
                  onChangeCampos={() => onChangeCampos()}
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

export default RelatorioSondagemPorTurma;
