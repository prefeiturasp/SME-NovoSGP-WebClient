import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Card, Loader } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import { ModalidadeDTO } from '~/dtos';
import RelatorioPlanoAEEBotoesAcoes from './relatorioPlanoAEEBotoesAcoes';
import RelatorioPlanoAEEForm from './relatorioPlanoAEEForm';

const RelatorioPlanoAEE = () => {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [gerandoRelatorio, setGerandoRelatorio] = useState(false);
  const [desabilitarGerar, setDesabilitarGerar] = useState(false);

  const inicial = {
    consideraHistorico: false,
    anoLetivo: undefined,
    dreCodigo: undefined,
    ueCodigo: undefined,
    modalidade: undefined,
    semestre: undefined,
    codigosTurma: undefined,
    situacao: undefined,
    exibirEncerrados: false,
    codigosResponsavel: undefined,
    codigosPAAIResponsavel: undefined,
  };

  const [initialValues] = useState(inicial);

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
    codigosTurma: Yup.string().required(textoCampoObrigatorio),
  });

  const onChangeCampos = () => {
    setModoEdicao(true);
    setDesabilitarGerar(false);
  };

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
              <Cabecalho pagina="Plano">
                <RelatorioPlanoAEEBotoesAcoes
                  form={form}
                  modoEdicao={modoEdicao}
                  initialValues={initialValues}
                  setModoEdicao={setModoEdicao}
                  desabilitarGerar={desabilitarGerar}
                  setGerandoRelatorio={setGerandoRelatorio}
                  setDesabilitarGerar={setDesabilitarGerar}
                />
              </Cabecalho>

              <Card padding="24px 24px">
                <RelatorioPlanoAEEForm
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

export default RelatorioPlanoAEE;
