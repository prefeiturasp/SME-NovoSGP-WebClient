import React, { useState, useEffect, useCallback } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';
import { Card, Loader } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import { ModalidadeDTO, RotasDto } from '~/dtos';
import DocPlanosTrabalhoCadastroBotoesAcoes from './docPlanosTrabalhoCadastroBotoesAcoes';
import DocPlanosTrabalhoCadastroForm from './docPlanosTrabalhoCadastroForm';
import {
  erros,
  setBreadcrumbManual,
  verificaSomenteConsulta,
} from '~/servicos';
import ServicoDocumentosPlanosTrabalho from '~/servicos/Paginas/Gestao/DocumentosPlanosTrabalho/ServicoDocumentosPlanosTrabalho';

const DocPlanosTrabalhoCadastro = () => {
  const routeMatch = useMatch();

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
    modalidade: undefined,
    listaModalidades: [],
    semestre: undefined,
    listaSemestres: [],
    turmaCodigo: undefined,
    listaTurmas: [],
    codigoComponenteCurricular: undefined,
    listaComponentesCurriculares: [],
    listaTipoDocumento: [],
    tipoDocumentoId: undefined,
    listaClassificacoes: [],
    classificacaoId: undefined,
    professorRf: '',
    listaArquivos: [],
  };

  const [initialValues, setInitialValues] = useState(
    idDocumentosPlanoTrabalho ? null : inicial
  );

  const textoCampoObrigatorio = 'Campo obrigatório';

  const validacaoCampoObrigatorio = (valores, valorCampoAtual) => {
    let ehValido = true;

    const classificacaoId = valores?.classificacaoId;
    const listaClassificacoes = valores?.listaClassificacoes;

    const ehClassificacaoDocumentosTurma =
      ServicoDocumentosPlanosTrabalho.verificaSeEhClassificacaoDocumentosTurma(
        classificacaoId,
        listaClassificacoes
      );

    if (ehClassificacaoDocumentosTurma && !valorCampoAtual) {
      ehValido = false;
    }
    return ehValido;
  };

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
    modalidade: Yup.string()
      .nullable()
      .test(
        'validacaoCampoObrigatorio',
        textoCampoObrigatorio,
        function validar() {
          const { modalidade } = this.parent;
          return validacaoCampoObrigatorio(this.parent, modalidade);
        }
      ),
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
    turmaCodigo: Yup.string()
      .nullable()
      .test(
        'validacaoCampoObrigatorio',
        textoCampoObrigatorio,
        function validar() {
          const { turmaCodigo } = this.parent;
          return validacaoCampoObrigatorio(this.parent, turmaCodigo);
        }
      ),
    codigoComponenteCurricular: Yup.string()
      .nullable()
      .test(
        'validacaoCampoObrigatorio',
        textoCampoObrigatorio,
        function validar() {
          const { codigoComponenteCurricular } = this.parent;
          return validacaoCampoObrigatorio(
            this.parent,
            codigoComponenteCurricular
          );
        }
      ),
  });

  const obterDadosDocumento = useCallback(async () => {
    setExibirLoader(true);

    const resposta = await ServicoDocumentosPlanosTrabalho.obterDocumento(
      idDocumentosPlanoTrabalho
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.status === 200) {
      const anoLetivo = resposta.data?.anoLetivo?.toString();
      const dreCodigo = resposta.data?.dreId?.toString();
      const ueCodigo = resposta.data?.ueId?.toString();
      const modalidade = resposta.data?.modalidade?.toString();
      const semestre = resposta.data?.semestre
        ? resposta.data?.semestre?.toString()
        : null;
      const turmaCodigo = resposta.data?.turmaCodigo?.toString();
      const componenteCurricularId =
        resposta.data?.componenteCurricularId?.toString();
      const dreNome = resposta.data?.dreNome;
      const ueNome = resposta.data?.ueNome;
      const modalidadeNome = resposta.data?.modalidadeNome;
      const turmaNome = resposta.data?.turmaNome;
      const componenteCurricularDescricao =
        resposta.data?.componenteCurricularDescricao;
      const tipoDocumentoId = resposta.data?.tipoDocumentoId?.toString();
      const tipoDocumentoDescricao = resposta.data?.tipoDocumentoDescricao;
      const classificacaoId = resposta.data?.classificacaoId?.toString();
      const classificacaoDescricao = resposta.data?.classificacaoDescricao;

      const valores = {
        id: resposta.data.id,
        anoLetivo,
        dreCodigo,
        ueCodigo,
        tipoDocumentoId,
        listaTipoDocumento: [],
        classificacaoId,
        listaClassificacoes: [],
        modalidade,
        semestre,
        turmaCodigo,
        codigoComponenteCurricular: componenteCurricularId,
        professorRf: resposta.data.professorRf,
        listaArquivos: [],
      };

      if (anoLetivo) {
        valores.listaAnosLetivos = [{ desc: anoLetivo, valor: anoLetivo }];
      }

      if (dreCodigo && dreNome) {
        valores.listaDres = [{ codigo: dreCodigo, nome: dreNome }];
      }

      if (ueCodigo && ueNome) {
        valores.listaUes = [{ codigo: ueCodigo, nome: ueNome }];
      }

      if (tipoDocumentoId && tipoDocumentoDescricao) {
        valores.listaTipoDocumento = [
          { id: tipoDocumentoId, tipoDocumento: tipoDocumentoDescricao },
        ];
      }

      if (classificacaoId && classificacaoDescricao) {
        valores.listaClassificacoes = [
          { id: classificacaoId, classificacao: classificacaoDescricao },
        ];
      }

      if (modalidade && modalidadeNome) {
        valores.listaModalidades = [
          { valor: modalidade, descricao: modalidadeNome },
        ];
      }

      if (semestre) {
        valores.listaSemestres = [{ valor: semestre, desc: semestre }];
      }

      if (turmaCodigo && turmaNome) {
        valores.listaTurmas = [{ codigo: turmaCodigo, nomeFiltro: turmaNome }];
      }

      if (componenteCurricularId && componenteCurricularDescricao) {
        valores.listaComponentesCurriculares = [
          {
            codigoComponenteCurricular: componenteCurricularId,
            nome: componenteCurricularDescricao,
          },
        ];
      }

      let arquivos = resposta.data?.arquivos?.length
        ? resposta.data.arquivos
        : [];

      if (arquivos?.length) {
        arquivos = arquivos.map(arquivo => ({
          uid: arquivo.codigo,
          xhr: arquivo.codigo,
          name: arquivo.nome,
          status: 'done',
          documentoId: resposta.data.id,
        }));
      }

      valores.listaArquivos = arquivos;

      valores.auditoria = {
        alteradoEm: resposta.data?.alteradoEm,
        alteradoPor: resposta.data?.alteradoPor,
        alteradoRf: resposta.data?.alteradoRF,
        criadoEm: resposta.data?.criadoEm,
        criadoPor: resposta.data?.criadoPor,
        criadoRf: resposta.data?.criadoRF,
      };

      setInitialValues(valores);
    }
  }, [idDocumentosPlanoTrabalho]);

  useEffect(() => {
    if (idDocumentosPlanoTrabalho) {
      obterDadosDocumento();
    }
  }, [idDocumentosPlanoTrabalho, obterDadosDocumento]);

  useEffect(() => {
    if (idDocumentosPlanoTrabalho) {
      setBreadcrumbManual(
        routeMatch.url,
        'Upload do arquivo',
        RotasDto.DOCUMENTOS_PLANOS_TRABALHO
      );
    }
  }, [idDocumentosPlanoTrabalho, routeMatch]);

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
                  setExibirLoader={setExibirLoader}
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
