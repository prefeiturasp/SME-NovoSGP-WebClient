import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import DocPlanosTrabalhoBotoesAcoes from './docPlanosTrabalhoBotoesAcoes';
import DocPlanosTrabalhoFiltros from './docPlanosTrabalhoFiltros';
import { RotasDto } from '~/dtos';
import { verificaSomenteConsulta } from '~/servicos';
import DocPlanosTrabalhoListaPaginada from './docPlanosTrabalhoListaPaginada';

const DocPlanosTrabalhoLista = () => {
  const usuario = useSelector(store => store.usuario);
  const somenteConsulta = useSelector(store => store.navegacao)
    ?.somenteConsulta;

  const permissoesTela =
    usuario.permissoes[RotasDto.DOCUMENTOS_PLANOS_TRABALHO];

  useEffect(() => {
    verificaSomenteConsulta(permissoesTela);
  }, [permissoesTela]);

  const inicial = {
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
    turmaCodigo: undefined,
    listaTurmas: [],
    tipoDocumentoId: undefined,
    listaClassificacoes: [],
    classificacaoId: undefined,
  };

  const [initialValues] = useState(inicial);

  const textoCampoObrigatorio = 'Campo obrigatório';

  const validacoes = Yup.object({
    anoLetivo: Yup.string().required(textoCampoObrigatorio),
    dreCodigo: Yup.string().required(textoCampoObrigatorio),
    ueCodigo: Yup.string().required(textoCampoObrigatorio),
  });

  return initialValues ? (
    <Formik
      validateOnBlur
      validateOnChange
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validacoes}
    >
      {form => (
        <>
          <Cabecalho pagina="Upload de documentos e planos de trabalho">
            <DocPlanosTrabalhoBotoesAcoes
              desabilitarNovo={somenteConsulta || !permissoesTela.podeIncluir}
            />
          </Cabecalho>

          <Card padding="24px 24px">
            <DocPlanosTrabalhoFiltros form={form} />
            <DocPlanosTrabalhoListaPaginada form={form} />
          </Card>
        </>
      )}
    </Formik>
  ) : (
    <></>
  );
};

export default DocPlanosTrabalhoLista;
