import { ModalidadeDTO } from '@/@legacy/dtos';
import { Formik } from 'formik';
import { useContext } from 'react';
import * as Yup from 'yup';
import { Card, Loader } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import RelatorioDinamicoNAAPABotoesAcoes from './relatorioDinamicoNAAPABotoesAcoes';
import RelatorioDinamicoNAAPAContext from './relatorioDinamicoNAAPAContext';
import RelatorioDinamicoNAAPAForm from './relatorioDinamicoNAAPAForm';

const RelatorioDinamicoNAAPAConteudo = () => {
  const { gerandoRelatorio, initialValues } = useContext(
    RelatorioDinamicoNAAPAContext
  );

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
          const temModalidadeEjaOuCelp =
            Number(modalidade) === ModalidadeEnum.EJA ||
            Number(modalidade) === ModalidadeEnum.CELP;

          let ehValido = true;
          if (!temModalidadeEjaOuCelp) {
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
              <Cabecalho pagina="Relatório Dinâmico">
                <RelatorioDinamicoNAAPABotoesAcoes form={form} />
              </Cabecalho>

              <Card padding="24px 24px">
                <RelatorioDinamicoNAAPAForm form={form} />
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

export default RelatorioDinamicoNAAPAConteudo;
