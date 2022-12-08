import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Auditoria, Card, Loader } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import { ModalidadeDTO } from '~/dtos';
import RelatorioPlanoAEEBotoesAcoes from './relatorioPlanoAEEBotoesAcoes';
import RelatorioPlanoAEEForm from './relatorioPlanoAEEForm';

const RelatorioPlanoAEE = () => {
  const [modoEdicao, setModoEdicao] = useState(false);

  const [gerandoRelatorio, setGerandoRelatorio] = useState(false);
  const [auditoria, setAuditoria] = useState();

  const inicial = {
    exibirHistorico: false,
    anoLetivo: undefined,
    dreCodigo: undefined,
    ueCodigo: undefined,
    modalidade: undefined,
    semestre: undefined,
  };

  const [initialValues, setInitialValues] = useState(inicial);

  const textoCampoObrigatorio = 'Campo obrigatório';

  const validacoes = Yup.object({
    anoLetivo: Yup.string().required(textoCampoObrigatorio),
    dreCodigo: Yup.string().required(textoCampoObrigatorio),
    ueCodigo: Yup.string().required(textoCampoObrigatorio),
    modalidade: Yup.string().required(textoCampoObrigatorio),
    semestre: Yup.string()
      .nullable()
      .test(
        'validaSeEjaSelecionado',
        textoCampoObrigatorio,
        function validar() {
          const { modalidade, semestre } = this.parent;
          const temModalidadeEja = Number(modalidade) === ModalidadeDTO.EJA;

          let ehValido = true;
          if (!temModalidadeEja) {
            return ehValido;
          }
          if (!semestre) {
            ehValido = false;
          }
          return ehValido;
        }
      ),
  });

  const onChangeCampos = () => {
    setModoEdicao(true);
  };

  return (
    <Loader loading={gerandoRelatorio}>
      {initialValues ? (
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validacoes}
          validateOnBlur
          validateOnChange
        >
          {form => (
            <>
              <Cabecalho pagina="Plano">
                <RelatorioPlanoAEEBotoesAcoes
                  form={form}
                  initialValues={initialValues}
                  modoEdicao={modoEdicao}
                  setModoEdicao={setModoEdicao}
                />
              </Cabecalho>

              <Card padding="24px 24px">
                <RelatorioPlanoAEEForm
                  form={form}
                  onChangeCampos={onChangeCampos}
                />

                {auditoria?.criadoEm && (
                  <div className="row">
                    <Auditoria {...auditoria} />
                  </div>
                )}
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

export default RelatorioPlanoAEE;
