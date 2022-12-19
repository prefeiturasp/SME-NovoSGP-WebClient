import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { Card, Loader } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import { ModalidadeDTO, RotasDto } from '~/dtos';
import DocPlanosTrabalhoCadastroBotoesAcoes from './docPlanosTrabalhoCadastroBotoesAcoes';
import DocPlanosTrabalhoCadastroForm from './docPlanosTrabalhoCadastroForm';
import { verificaSomenteConsulta } from '~/servicos';

const DocPlanosTrabalhoCadastro = () => {
  const routeMatch = useRouteMatch();

  const usuario = useSelector(store => store.usuario);
  const permissoesTela =
    usuario.permissoes[RotasDto.DOCUMENTOS_PLANOS_TRABALHO];

  const idDocumentosPlanoTrabalho = routeMatch.params?.id;

  const [desabilitarCampos, setDesabilitarCampos] = useState(false);
  const [exibirLoader, setExibirLoader] = useState(false);

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(permissoesTela);
    const desabilitar =
      idDocumentosPlanoTrabalho && idDocumentosPlanoTrabalho > 0
        ? soConsulta || !permissoesTela.podeAlterar
        : soConsulta || !permissoesTela.podeIncluir;
    setDesabilitarCampos(desabilitar);
  }, [permissoesTela, idDocumentosPlanoTrabalho]);

  const inicial = {
    modoEdicao: false,
    consideraHistorico: false,
    anoLetivo: undefined,
    listaAnosLetivos: [],
    dreCodigo: undefined,
    listaDres: [],
    ueCodigo: undefined,
    listaUes: [],
    // modalidade: undefined,
    // listaModalidades: [],
    // semestre: undefined,
    // listaSemestres: [],
    // turmaCodigo: undefined,
    // listaTurmas: [],
    tipoDocumentoId: undefined,
    listaClassificacoes: [],
    classificacaoId: undefined,
    professorRf: '',
    listaArquivos: [],
  };

  const [initialValues] = useState(inicial);

  const textoCampoObrigatorio = 'Campo obrigatório';

  const validacoes = Yup.object({
    anoLetivo: Yup.string().required(textoCampoObrigatorio),
    dreCodigo: Yup.string().required(textoCampoObrigatorio),
    ueCodigo: Yup.string().required(textoCampoObrigatorio),
    tipoDocumentoId: Yup.string().required(textoCampoObrigatorio),
    classificacaoId: Yup.string().required(textoCampoObrigatorio),
    professorRf: Yup.string().required(textoCampoObrigatorio),
    listaArquivos: Yup.string().test(
      'validaListaArquivos',
      'Campo obrigatório',
      function validar() {
        const { listaArquivos } = this.parent;
        if (listaArquivos?.length > 0) {
          return true;
        }
        return false;
      }
    ),
    // modalidade: Yup.string().required(textoCampoObrigatorio),
    // semestre: Yup.string()
    //   .nullable()
    //   .test(
    //     'validaSeEjaSelecionado',
    //     textoCampoObrigatorio,
    //     function validar() {
    //       const { modalidade, semestre } = this.parent;
    //       const temModalidadeEja = Number(modalidade) === ModalidadeDTO.EJA;

    //       let ehValido = true;
    //       if (!temModalidadeEja) {
    //         return ehValido;
    //       }
    //       if (!semestre) {
    //         ehValido = false;
    //       }
    //       return ehValido;
    //     }
    //   ),
    // turmaCodigo: Yup.string().required(textoCampoObrigatorio),
  });

  return (
    <Loader loading={exibirLoader}>
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
              <Cabecalho pagina="Upload de documentos e planos de trabalho">
                <DocPlanosTrabalhoCadastroBotoesAcoes
                  form={form}
                  initialValues={initialValues}
                  exibirLoader={exibirLoader}
                  setExibirLoader={setExibirLoader}
                  idDocumentosPlanoTrabalho={idDocumentosPlanoTrabalho}
                  desabilitarCampos={desabilitarCampos}
                  podeExcluir={permissoesTela?.podeExcluir}
                />
              </Cabecalho>

              <Card padding="24px 24px">
                <DocPlanosTrabalhoCadastroForm
                  form={form}
                  desabilitarCampos={desabilitarCampos}
                  idDocumentosPlanoTrabalho={idDocumentosPlanoTrabalho}
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

export default DocPlanosTrabalhoCadastro;
