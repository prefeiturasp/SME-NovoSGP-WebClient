import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Card, Loader } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import RelatorioControleFrequenciaMensalBotoesAcoes from './relatorioControleFrequenciaMensalBotoesAcoes';
import RelatorioControleFrequenciaMensalForm from './relatorioControleFrequenciaMensalForm';
import { OPCAO_TODOS } from '@/@legacy/constantes';
import { ModalidadeDTO } from '@/@legacy/dtos';
import { TIPO_FORMATO_RELATORIO } from '@/core/enum/tipo-formato-relatorio';

const RelatorioControleFrequenciaMensal = () => {
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
    turmaCodigo: undefined,
    listaTurmas: [],
    criancasEstudantes: OPCAO_TODOS,
    mesesReferencias: undefined,
    tipoFormatoRelatorio: TIPO_FORMATO_RELATORIO.XLSX.toString(),
    codigosEstudantes: undefined,
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
    turmaCodigo: Yup.string().required(textoCampoObrigatorio),
    criancasEstudantes: Yup.string().required(textoCampoObrigatorio),
    mesesReferencias: Yup.string().required(textoCampoObrigatorio),
    tipoFormatoRelatorio: Yup.string().required(textoCampoObrigatorio),
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
              <Cabecalho pagina="Controle de frequência mensal">
                <RelatorioControleFrequenciaMensalBotoesAcoes
                  form={form}
                  initialValues={initialValues}
                  desabilitarGerar={desabilitarGerar}
                  setGerandoRelatorio={setGerandoRelatorio}
                  setDesabilitarGerar={setDesabilitarGerar}
                />
              </Cabecalho>

              <Card padding="24px 24px">
                <RelatorioControleFrequenciaMensalForm
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

export default RelatorioControleFrequenciaMensal;
