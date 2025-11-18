import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Card, Loader, momentSchema } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import RelatorioOcorrenciasBotoesAcoes from './relatorioOcorrenciasBotoesAcoes';
import RelatorioOcorrenciasForm from './relatorioOcorrenciasForm';
import moment from 'moment';

const RelatorioOcorrencias = () => {
  const [gerandoRelatorio, setGerandoRelatorio] = useState(false);
  const [desabilitarGerar, setDesabilitarGerar] = useState(false);

  const inicial = {
    modoEdicao: false,
    consideraHistorico: false,
    anoLetivo: undefined,
    listaAnosLetivos: [],
    dreCodigo: undefined,
    listaDres: [],
    ueCodigo: undefined,
    listaUes: [],
    modalidade: undefined,
    listaModalidades: [],
    semestre: undefined,
    listaSemestres: [],
    codigosTurma: undefined,
    listaTurmas: [],
    dataInicio: null,
    dataFim: null,
    ocorrenciaTipoIds: undefined,
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
    codigosTurma: Yup.string().required(textoCampoObrigatorio),
    dataFim: momentSchema
      .required(textoCampoObrigatorio)
      .test(
        'validaDataMaiorQueEnvio',
        'Data fim deve ser maior que a data início',
        function validar() {
          const { dataInicio } = this.parent;
          const { dataFim } = this.parent;
          if (dataInicio && dataFim && moment(dataFim) < moment(dataInicio)) {
            return false;
          }

          return true;
        }
      ),
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
              <Cabecalho pagina="Ocorrências">
                <RelatorioOcorrenciasBotoesAcoes
                  form={form}
                  initialValues={initialValues}
                  desabilitarGerar={desabilitarGerar}
                  setGerandoRelatorio={setGerandoRelatorio}
                  setDesabilitarGerar={setDesabilitarGerar}
                />
              </Cabecalho>

              <Card padding="24px 24px">
                <RelatorioOcorrenciasForm
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

export default RelatorioOcorrencias;
