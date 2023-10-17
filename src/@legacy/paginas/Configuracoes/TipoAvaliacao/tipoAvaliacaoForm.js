import { Form, Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import Cabecalho from '~/componentes-sgp/cabecalho';
import RadioGroupButton from '~/componentes/radioGroupButton';
import TextEditor from '~/componentes/textEditor';

import { ROUTES } from '@/core/enum/routes';
import {
  Auditoria,
  ButtonGroup,
  CampoTexto,
  Card,
  Label,
  Loader,
  momentSchema,
} from '~/componentes';
import servicoTipoAvaliaco from '~/servicos/Paginas/TipoAvaliacao';
import { confirmar, erro, erros, sucesso } from '~/servicos/alertas';
import { setBreadcrumbManual } from '~/servicos/breadcrumb-services';

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { validaSeObjetoEhNuloOuVazio } from '~/utils/funcoes/gerais';

const TipoAvaliacaoForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paramsRoute = useParams();

  const idTipoAvaliacao = paramsRoute?.id;

  const listaSituacao = [
    {
      label: 'Ativo',
      value: true,
    },
    {
      label: 'Inativo',
      value: false,
    },
  ];
  const [descricao, setDescricao] = useState('');
  const [podeCancelar, setPodeCancelar] = useState(false);
  const [novoRegistro, setNovoRegistro] = useState(true);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [auditoria, setAuditoria] = useState({});
  const [valoresIniciais, setValoresIniciais] = useState({
    nome: '',
    descricao: '',
    situacao: true,
    possuiAvaliacao: false,
  });

  const [exibirLoader, setExibirLoader] = useState(false);

  const textEditorRef = useRef(null);

  const aoTrocarTextEditor = valor => {
    setDescricao(valor);
    setPodeCancelar(true);
  };

  const permissoesTela = useSelector(store => store.usuario.permissoes);

  const validaFormulario = valores => {
    if (validaSeObjetoEhNuloOuVazio(valores)) return;
    if (!modoEdicao) {
      setModoEdicao(true);
    }
  };
  const onClickExcluir = async form => {
    if (validaSeObjetoEhNuloOuVazio(form.values)) return;
    const confirmado = await confirmar(
      'Atenção',
      'Você tem certeza que deseja excluir este registro?'
    );
    if (confirmado) {
      const excluir = await servicoTipoAvaliaco.deletarTipoAvaliacao([
        form.values.id,
      ]);
      if (excluir && excluir.status === 200) {
        sucesso(`Tipo Avaliação excluido com sucesso!`);
        navigate(ROUTES.TIPO_AVALIACAO);
      } else {
        erro(excluir);
      }
    }
  };

  const onClickCancelar = async form => {
    const confirmou = await confirmar(
      'Atenção',
      'Você não salvou as informações preenchidas.',
      'Deseja realmente cancelar as alterações?'
    );
    if (confirmou) {
      form.resetForm();
      setDescricao(form.values.descricao);
      setModoEdicao(false);
    }
  };
  const onClickVoltar = async () => {
    if (modoEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) {
        navigate(ROUTES.TIPO_AVALIACAO);
      }
    } else {
      navigate(ROUTES.TIPO_AVALIACAO);
    }
  };
  const validaAntesDoSubmit = form => {
    const arrayCampos = Object.keys(valoresIniciais);
    arrayCampos.forEach(campo => {
      form.setFieldTouched(campo, true, true);
    });
    form.validateForm().then(() => {
      if (form.isValid || Object.keys(form.errors).length === 0) {
        form.submitForm(form);
      }
    });
  };

  const onClickBotaoPrincipal = form => {
    form.values.descricao = textEditorRef.current.state.value;
    validaAntesDoSubmit(form);
  };
  const validacoes = () => {
    return Yup.object({
      nome: momentSchema.required('Nome obrigatório'),
      situacao: Yup.bool()
        .typeError('Informar um booleano')
        .required('Campo obrigatório'),
    });
  };

  const onSubmitFormulario = async valores => {
    try {
      let cadastrado;
      if (!idTipoAvaliacao) {
        cadastrado = await servicoTipoAvaliaco.salvarTipoAvaliacao({
          ...valores,
        });
      } else {
        const tipoAvalicao = {
          nome: valores.nome,
          descricao: valores.descricao,
          situacao: valores.situacao,
        };
        cadastrado = await servicoTipoAvaliaco.atualizaTipoAvaliacao(
          idTipoAvaliacao,
          tipoAvalicao
        );
      }

      if (cadastrado && cadastrado.status === 200) {
        sucesso('Tipo de avaliação salvo com sucesso.');
        navigate(ROUTES.TIPO_AVALIACAO);
      }
    } catch (err) {
      if (err) {
        erro(err.response.data.mensagens[0]);
      }
    }
  };

  const buscarPorId = async id => {
    try {
      setExibirLoader(true);
      const registro = await servicoTipoAvaliaco.buscarTipoAvaliacaoPorId(id);
      if (registro && registro.data) {
        setValoresIniciais({
          ...registro.data,
        });

        setDescricao(registro.data.descricao);
        setAuditoria({
          criadoPor: registro.data.criadoPor,
          criadoRf: registro.data.criadoRF > 0 ? registro.data.criadoRF : '',
          criadoEm: registro.data.criadoEm,
          alteradoPor: registro.data.alteradoPor,
          alteradoRf:
            registro.data.alteradoRF > 0 ? registro.data.alteradoRF : '',
          alteradoEm: registro.data.alteradoEm,
        });
        setPodeCancelar(false);
      }
      setExibirLoader(false);
    } catch (err) {
      erros(err);
      setExibirLoader(false);
    }
  };

  useEffect(() => {
    if (idTipoAvaliacao) {
      setNovoRegistro(false);
      setBreadcrumbManual(
        location.pathname,
        'Atribuição',
        ROUTES.TIPO_AVALIACAO
      );
      buscarPorId(idTipoAvaliacao);
    }
  }, [idTipoAvaliacao, location]);

  return (
    <Loader loading={exibirLoader}>
      <Formik
        enableReinitialize
        initialValues={valoresIniciais}
        validationSchema={validacoes}
        onSubmit={valores => onSubmitFormulario(valores)}
        validate={valores => validaFormulario(valores)}
        validateOnBlur
        validateOnChange
      >
        {form => (
          <>
            <Cabecalho pagina="Tipo de Avaliação">
              <ButtonGroup
                form={form}
                permissoesTela={permissoesTela[ROUTES.TIPO_AVALIACAO]}
                novoRegistro={novoRegistro}
                labelBotaoPrincipal={idTipoAvaliacao ? 'Alterar' : 'Cadastrar'}
                onClickBotaoPrincipal={() => onClickBotaoPrincipal(form)}
                onClickCancelar={formulario => onClickCancelar(formulario)}
                onClickVoltar={() => onClickVoltar()}
                onClickExcluir={() => onClickExcluir(form)}
                modoEdicao={modoEdicao || podeCancelar}
              />
            </Cabecalho>
            <Card>
              <Form>
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-8">
                      <CampoTexto
                        form={form}
                        label="Nome da Atividade"
                        name="nome"
                        maxlength={100}
                        placeholder="Digite a descrição da avaliação"
                        type="input"
                        desabilitado={valoresIniciais.possuiAvaliacao}
                        labelRequired
                      />
                    </div>
                    <div className="col-md-4">
                      <RadioGroupButton
                        desabilitado={false}
                        id="situacao"
                        name="situacao"
                        label="Situação"
                        form={form}
                        opcoes={listaSituacao}
                        labelRequired
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <Label text="Descrição" />
                      <TextEditor
                        className="form-control w-100"
                        ref={textEditorRef}
                        id="descricao"
                        alt="Descrição"
                        onBlur={aoTrocarTextEditor}
                        value={descricao}
                        maxlength={500}
                        toolbar={false}
                        disabled={valoresIniciais.possuiAvaliacao}
                      />
                    </div>
                  </div>
                  {auditoria && (
                    <Auditoria
                      criadoEm={auditoria.criadoEm}
                      criadoPor={auditoria.criadoPor}
                      criadoRf={auditoria.criadoRf}
                      alteradoPor={auditoria.alteradoPor}
                      alteradoEm={auditoria.alteradoEm}
                      alteradoRf={auditoria.alteradoRf}
                    />
                  )}
                </div>
              </Form>
            </Card>
          </>
        )}
      </Formik>
    </Loader>
  );
};

export default TipoAvaliacaoForm;
