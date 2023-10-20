import { ROUTES } from '@/core/enum/routes';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Card, momentSchema } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import ListaInformesBotoesAcoes from './listaInformesBotoesAcoes';
import ListaInformesFiltros from './listaInformesFiltros';
import { verificaSomenteConsulta } from '@/@legacy/servicos';

const ListaInformes = () => {
  const usuario = useSelector(state => state.usuario);
  const { permissoes } = usuario;
  const podeIncluir = !!permissoes?.[ROUTES.INFORMES]?.podeIncluir;

  const [somenteConsulta, setSomenteConsulta] = useState(false);

  const textoCampoObrigatorio = 'Campo obrigatório';

  const anoAtual = window.moment().format('YYYY');

  const inicial = {
    modoEdicao: false,
    consideraHistorico: false,
    anoLetivo: anoAtual,
    dreCodigo: undefined,
    listaDres: [],
    ueCodigo: undefined,
    listaUes: [],
    titulo: '',
    dataInicio: '',
    dataFim: '',
  };

  const [initialValues] = useState(inicial);

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(permissoes?.[ROUTES.INFORMES]);
    setSomenteConsulta(soConsulta);
  }, [permissoes]);

  const validacoes = Yup.object({
    dreCodigo: Yup.string().required(textoCampoObrigatorio),
    ueCodigo: Yup.string().required(textoCampoObrigatorio),
    dataInicio: momentSchema
      .dataMenorQue(
        'dataInicio',
        'dataFim',
        'Data início deve ser menor que a data fim'
      )
      .test(
        'validarObrigatoriedadePeriodoInicioFim',
        textoCampoObrigatorio,
        function validar() {
          const { dataInicio, dataFim } = this.parent;

          let ehValido = true;
          if (!dataInicio && dataFim) {
            ehValido = false;
          }
          return ehValido;
        }
      ),
    dataFim: momentSchema
      .dataMenorQue(
        'dataInicio',
        'dataFim',
        'Data fim deve ser maior que a data início'
      )
      .test(
        'validarObrigatoriedadePeriodoInicioFim',
        textoCampoObrigatorio,
        function validar() {
          const { dataInicio, dataFim } = this.parent;

          let ehValido = true;
          if (dataInicio && !dataFim) {
            ehValido = false;
          }
          return ehValido;
        }
      ),
  });

  return (
    <>
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
              <Cabecalho pagina="Informes">
                <ListaInformesBotoesAcoes
                  podeIncluir={podeIncluir}
                  somenteConsulta={somenteConsulta}
                />
              </Cabecalho>

              <Card padding="24px 24px">
                <ListaInformesFiltros form={form} />
              </Card>
            </>
          )}
        </Formik>
      ) : (
        <></>
      )}
    </>
  );
};

export default ListaInformes;
