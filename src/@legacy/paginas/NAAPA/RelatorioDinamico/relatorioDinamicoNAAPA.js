import { ModalidadeDTO } from '@/@legacy/dtos';
import { Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { Card, Loader } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import RelatorioDinamicoNAAPABotoesAcoes from './relatorioDinamicoNAAPABotoesAcoes';
import RelatorioDinamicoNAAPAForm from './relatorioDinamicoNAAPAForm';
import RelatorioDinamicoNAAPAContextProvider from './relatorioDinamicoNAAPAContextProvider';

const RelatorioDinamicoNAAPA = () => {
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
    modalidade: undefined,
    listaModalidades: [],
    semestre: undefined,
    listaSemestres: [],
    anosEscolaresCodigos: undefined,
    listaAnosEscolares: [],
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
    anosEscolaresCodigos: Yup.string().required(textoCampoObrigatorio),
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
            <RelatorioDinamicoNAAPAContextProvider>
              <Cabecalho pagina="Relatório Dinâmico">
                <RelatorioDinamicoNAAPABotoesAcoes
                  form={form}
                  initialValues={initialValues}
                  desabilitarGerar={desabilitarGerar}
                  setGerandoRelatorio={setGerandoRelatorio}
                  setDesabilitarGerar={setDesabilitarGerar}
                />
              </Cabecalho>

              <Card padding="24px 24px">
                <RelatorioDinamicoNAAPAForm
                  form={form}
                  onChangeCampos={() => onChangeCampos()}
                />
              </Card>
            </RelatorioDinamicoNAAPAContextProvider>
          )}
        </Formik>
      ) : (
        <></>
      )}
    </Loader>
  );
};

export default RelatorioDinamicoNAAPA;
