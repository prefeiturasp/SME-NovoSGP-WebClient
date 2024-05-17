import { ROUTES } from '@/core/enum/routes';
import { obterInformePorId } from '@/core/services/informes-service';
import { HttpStatusCode } from 'axios';
import { Formik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Card, Loader } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import {
  erros,
  setBreadcrumbManual,
  verificaSomenteConsulta,
} from '~/servicos';
import InformesCadastroBotoesAcoes from './informesCadastroBotoesAcoes';
import InformesCadastroForm from './informesCadastroForm';

const InformesCadastro = () => {
  const location = useLocation();
  const paramsRoute = useParams();

  const usuario = useSelector(store => store.usuario);
  const permissoesTela = usuario.permissoes[ROUTES.INFORMES];

  const anoAtual = window.moment().format('YYYY');

  const id = paramsRoute?.id;

  const [desabilitarCampos, setDesabilitarCampos] = useState(false);
  const [exibirLoader, setExibirLoader] = useState(false);

  useEffect(() => {
    if (id) {
      setDesabilitarCampos(true);
      return;
    }

    const soConsulta = verificaSomenteConsulta(permissoesTela);
    const desabilitar = soConsulta || !permissoesTela?.podeIncluir;

    setDesabilitarCampos(!!desabilitar);
  }, [permissoesTela, id]);

  const inicial = {
    modoEdicao: false,
    consideraHistorico: false,
    anoLetivo: anoAtual,
    listaAnosLetivos: [],
    dreCodigo: undefined,
    listaDres: [],
    ueCodigo: undefined,
    listaUes: [],
    perfis: undefined,
    titulo: '',
    texto: '',
    listaArquivos: [],
  };

  const [initialValues, setInitialValues] = useState(id ? null : inicial);

  const textoCampoObrigatorio = 'Campo obrigatório';

  const validacoes = Yup.object({
    dreCodigo: Yup.string().required(textoCampoObrigatorio),
    ueCodigo: Yup.string().required(textoCampoObrigatorio),
    perfis: Yup.string().required(textoCampoObrigatorio),
    titulo: Yup.string().required(textoCampoObrigatorio),
    texto: Yup.string().required(textoCampoObrigatorio),
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
  });

  const obterDados = useCallback(async () => {
    setExibirLoader(true);

    const resposta = await obterInformePorId(id)
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.status === HttpStatusCode.Ok) {
      const dreNome = resposta.data?.dreNome;
      const ueNome = resposta.data?.ueNome;
      const perfis = resposta.data?.perfis;

      const valores = {
        id: resposta.data.id,
        titulo: resposta.data.titulo,
        texto: resposta.data.texto,
        dreCodigo: dreNome,
        ueCodigo: ueNome,
        listaArquivos: [],
      };

      if (dreNome) {
        valores.listaDres = [{ codigo: dreNome, nome: dreNome }];
      }

      if (ueNome) {
        valores.listaUes = [{ codigo: dreNome, nome: ueNome }];
      }

      if (perfis?.length) {
        valores.perfis = perfis.map(perfil => String(perfil.id));
        valores.listaPerfis = perfis;
      }

      let arquivosExistente = resposta?.data?.anexos?.length
        ? resposta.data.anexos
        : [];

      if (arquivosExistente?.length) {
        arquivosExistente = arquivosExistente.map(arquivo => ({
          uid: arquivo.codigo,
          xhr: arquivo.codigo,
          name: arquivo.nome,
          status: 'done',
          documentoId: resposta.data.id,
        }));
      }
      valores.listaArquivos = arquivosExistente;
      valores.auditoria = {
        ...resposta?.data?.auditoria,
        alteradoRf: resposta.data?.alteradoRF,
        criadoRf: resposta.data?.criadoRF,
      };

      setInitialValues({ ...valores });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      obterDados();
    }
  }, [id, obterDados]);

  useEffect(() => {
    if (id) {
      setBreadcrumbManual(location.pathname, 'Edição', ROUTES.INFORMES);
    }
  }, [id, location]);

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
              <Cabecalho pagina="Informes">
                <InformesCadastroBotoesAcoes
                  form={form}
                  initialValues={initialValues}
                  exibirLoader={exibirLoader}
                  setExibirLoader={setExibirLoader}
                  desabilitarCampos={desabilitarCampos}
                  podeExcluir={permissoesTela?.podeExcluir}
                />
              </Cabecalho>

              <Card padding="24px 24px">
                <InformesCadastroForm
                  form={form}
                  desabilitarCampos={desabilitarCampos}
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

export default InformesCadastro;
