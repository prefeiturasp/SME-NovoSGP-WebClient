import { ROUTES } from '@/core/enum/routes';
import { store } from '@/core/redux';
import { Form, Formik } from 'formik';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { Loader } from '~/componentes';
import Button from '~/componentes/button';
import CampoTexto from '~/componentes/campoTexto';
import { Colors } from '~/componentes/colors';
import ModalConteudoHtml from '~/componentes/modalConteudoHtml';
import SelectComponent from '~/componentes/select';
import DataTable from '~/componentes/table/dataTable';
import { confirmar, erros } from '~/servicos/alertas';
import api from '~/servicos/api';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';

import FiltroHelper from '~/componentes-sgp/filtro/helper';
import { bool } from 'prop-types';

// eslint-disable-next-line react/prop-types
export default function ReiniciarSenha({ perfilSelecionado }) {
  const [linhaSelecionada, setLinhaSelecionada] = useState({});
  const [listaUsuario, setListaUsuario] = useState([]);

  const [listaDres, setListaDres] = useState([]);
  const [dreSelecionada, setDreSelecionada] = useState(undefined);
  const [listaUes, setListaUes] = useState([]);
  const [ueSelecionada, setUeSelecionada] = useState(undefined);
  const [nomeUsuarioSelecionado, setNomeUsuarioSelecionado] = useState('');
  const [rfSelecionado, setRfSelecionado] = useState('');
  const [emailUsuarioSelecionado, setEmailUsuarioSelecionado] = useState('');
  const [exibirModalReiniciarSenha, setExibirModalReiniciarSenha] =
    useState(false);
  const [
    exibirModalMensagemReiniciarSenha,
    setExibirModalMensagemReiniciarSenha,
  ] = useState(false);
  const [mensagemSenhaAlterada, setMensagemSenhaAlterada] = useState('');

  const [semEmailCadastrado, setSemEmailCadastrado] = useState(false);
  const [refForm, setRefForm] = useState();

  const [dreDesabilitada, setDreDesabilitada] = useState(false);
  const [ueDesabilitada, setUeDesabilitada] = useState(false);

  const [carregando, setCarregando] = useState(false);

  const { usuario } = store.getState();

  const [pagina, setPagina] = useState(1);
  const [quantidadeRegistrosPorPagina, setQuantidadeRegistrosPorPagina] =
    useState(10);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [origemFiltro, setOrigemFiltro] = useState('');

  const anoLetivo = useMemo(
    () =>
      (usuario.turmaSelecionada && usuario.turmaSelecionada.anoLetivo) ||
      moment().year(),
    [usuario.turmaSelecionada]
  );

  const consideraHistorico = useMemo(
    () =>
      (usuario.turmaSelecionada &&
        !!usuario.turmaSelecionada.consideraHistorico) ||
      false,
    [usuario.turmaSelecionada]
  );

  const permissoesTela = usuario.permissoes[ROUTES.REINICIAR_SENHA];

  const [validacoes] = useState(
    Yup.object({
      emailUsuario: Yup.string()
        .email('Digite um e-mail válido.')
        .required('E-mail é obrigatório'),
    })
  );

  useEffect(() => {
    const carregarDres = async () => {
      const dres = await api.get(
        `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`
      );
      if (dres.data) {
        const todas = [
          { abreviacao: 'Todas', codigo: 'Todas', nome: 'Todas', id: 0 },
        ];
        const ordenadas = dres.data.sort(FiltroHelper.ordenarLista('nome'));
        setListaDres([...todas, ...ordenadas]);
      } else {
        setListaDres([]);
      }
    };

    carregarDres();
    verificaSomenteConsulta(permissoesTela);
  }, [anoLetivo, consideraHistorico, permissoesTela]);

  useEffect(() => {
    let desabilitada = !listaDres || listaDres.length === 0;

    if (!desabilitada && listaDres.length === 1) {
      setDreSelecionada(String(listaDres[0].codigo));
      desabilitada = true;
    }

    setDreDesabilitada(desabilitada);
  }, [listaDres]);

  useEffect(() => {
    let desabilitada = !listaUes || listaUes.length === 0;

    if (!desabilitada && listaUes.length === 1) {
      setUeSelecionada(String(listaUes[0].codigo));
      desabilitada = true;
    }

    setUeDesabilitada(desabilitada);
  }, [listaUes]);

  const onChangeDre = dre => {
    setDreSelecionada(!dre ? '' : dre);
    setUeSelecionada(undefined);
    setListaUes([]);
    setListaUsuario([]);
  };

  const onChangeUe = ue => {
    setUeSelecionada(ue);
  };

  const onChangeNomeUsuario = nomeUsuario => {
    setNomeUsuarioSelecionado(nomeUsuario.target.value);
  };

  const onChangeRf = rf => {
    setRfSelecionado(rf.target.value);
  };

  const carregarUes = useCallback(
    async dre => {
      const ues = await api.get(
        `/v1/abrangencias/${consideraHistorico}/dres/${dre}/ues?consideraNovasUEs=${true}`
      );
      if (ues.data) {
        setListaUes(ues.data);
      } else {
        const todas = [
          { abreviacao: 'Todas', codigo: 'Todas', nome: 'Todas', id: 0 },
        ];
        setListaUes(todas);
      }
    },
    [consideraHistorico]
  );

  useEffect(() => {
    if (dreSelecionada) {
      carregarUes(dreSelecionada);
    }
  }, [carregarUes, dreSelecionada]);

  useEffect(() => {
    if (
      dreSelecionada === 'Todas' &&
      (nomeUsuarioSelecionado || rfSelecionado || listaUsuario.length > 0)
    ) {
      onChangeFiltrarPaginacao();
    }
  }, [pagina]);

  const filtrarUsuarios = async (resetPagina = false) => {
    if (!dreSelecionada) {
      setListaUsuario([]);
      return;
    }

    
    setCarregando(true);

    try {
      const parametrosPost = {
        codigoDRE: dreSelecionada,
        nomeServidor: nomeUsuarioSelecionado,
        codigoRF: rfSelecionado,
        ...(ueSelecionada?.length > 0 && { codigoUE: ueSelecionada }),
      };

      let lista: any[] = [];

      if (dreSelecionada === 'Todas') {
        const rf = rfSelecionado || '';
        const nome = nomeUsuarioSelecionado || '';

        const queryParams = new URLSearchParams({
          ...(rf && { rf }),
          ...(nome && { nome }),
          pagina: resetPagina ? '1' : pagina.toString(),
          registrosPorPagina: quantidadeRegistrosPorPagina.toString(),
        });

        const { data } = await api.get(
          `v1/usuarios/sme?${queryParams.toString()}`
        );

        if (data?.totalRegistros) {
          setTotalPaginas(data.totalPaginas);
          setTotalRegistros(data.totalRegistros);
        }

        if (Array.isArray(data?.items)) {
          lista = data.items.map(item => ({
            codigoFuncaoAtividade: 0,
            codigoFuncaoExterna: 0,
            codigoRf: item.login,
            estaAfastado: false,
            login: item.login,
            nomeServidor: item.nome,
            podeEditar: false,
            usuarioId: 0,
          }));
        }
      } else {
        const { data } = await api.post(
          'v1/unidades-escolares/funcionarios',
          parametrosPost
        );
        lista = Array.isArray(data) ? data : [];
      }

      setListaUsuario(lista);

    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setListaUsuario([]);
    } finally {
      if (resetPagina) setPagina(1);
      setCarregando(false);
    }
  };

  const onClickFiltrar = async () => {
    await filtrarUsuarios(true);
  };

  const onChangeFiltrarPaginacao = async () => {
    await filtrarUsuarios(false);
  };

  const reiniciarSenha = async linha => {
    const parametros = {
      dreCodigo: dreSelecionada,
      ueCodigo: ueSelecionada,
    };

    let deveAtualizarEmail = false;
    setCarregando(true);
    await api
      .put(`v1/autenticacao/${linha.codigoRf}/reiniciar-senha`, parametros)
      .then(resposta => {
        setExibirModalMensagemReiniciarSenha(true);
        setMensagemSenhaAlterada(resposta.data.mensagem);
      })
      .catch(error => {
        if (error?.response?.data) {
          deveAtualizarEmail = error?.response?.data?.deveAtualizarEmail;
        }
        if (!deveAtualizarEmail) {
          erros(error);
        }
        setCarregando(false);
      });
    if (deveAtualizarEmail) {
      setEmailUsuarioSelecionado('');
      setSemEmailCadastrado(true);
      setExibirModalReiniciarSenha(true);
    } else {
      setSemEmailCadastrado(false);
      onClickFiltrar();
    }
    setCarregando(false);
  };

  const onClickReiniciar = async linha => {
    if (!permissoesTela.podeAlterar) return;

    setLinhaSelecionada(linha);
    const confirmou = await confirmar(
      'Reiniciar Senha',
      '',
      'Deseja realmente reiniciar essa senha?',
      'Reiniciar',
      'Cancelar'
    );
    if (confirmou) {
      reiniciarSenha(linha);
    }
  };

  const colunas = [
    {
      title: 'Nome do usuário',
      dataIndex: 'nomeServidor',
    },
    {
      title: 'Login',
      dataIndex: 'codigoRf',
    },
    {
      title: 'Ação',
      dataIndex: 'acaoReiniciar',
      render: (_, linha) => {
        return (
          <div className="d-flex justify-content-center">
            <Button
              label="Reiniciar"
              color={Colors.Roxo}
              disabled={!permissoesTela.podeAlterar}
              border
              onClick={() => onClickReiniciar(linha)}
            />
          </div>
        );
      },
    },
  ];

  const onCloseModalReiniciarSenha = () => {
    setExibirModalReiniciarSenha(false);
    setExibirModalMensagemReiniciarSenha(false);
    setSemEmailCadastrado(false);
    refForm.resetForm();
  };

  const onConfirmarReiniciarSenha = async form => {
    const parametro = { novoEmail: form.emailUsuario };
    onCloseModalReiniciarSenha();
    setCarregando(true);
    api
      .put(`v1/usuarios/${linhaSelecionada.codigoRf}/email`, parametro)
      .then(() => {
        reiniciarSenha(linhaSelecionada);
        refForm.resetForm();
        setCarregando(false);
      })
      .catch(e => {
        erros(e);
        setCarregando(false);
      });
  };

  const onCancelarReiniciarSenha = () => {
    onCloseModalReiniciarSenha();
  };

  const validaSeTemEmailCadastrado = () => {
    return semEmailCadastrado
      ? `Este usuário não tem e-mail cadastrado, para seguir com
     o processo de reinicio da senha é obrigatório informar um e-mail válido.`
      : null;
  };

  return (
    <Loader loading={carregando}>
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 pb-2">
          <SelectComponent
            name="dre-reiniciar-senha"
            id="dre-reiniciar-senha"
            lista={listaDres}
            disabled={!permissoesTela.podeConsultar || dreDesabilitada}
            valueOption="codigo"
            valueText="nome"
            onChange={onChangeDre}
            valueSelect={dreSelecionada}
            label="Diretoria Regional de Educação (DRE)"
            placeholder="Diretoria Regional de Educação (DRE)"
            showSearch
          />
        </div>
        <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 pb-2">
          <SelectComponent
            name="ues-list"
            id="ues-list"
            lista={listaUes}
            disabled={!permissoesTela.podeConsultar || ueDesabilitada}
            valueOption="codigo"
            valueText="nome"
            onChange={onChangeUe}
            valueSelect={ueSelecionada}
            label="Unidade Escolar (UE)"
            placeholder="Unidade Escolar (UE)"
            showSearch
          />
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 pb-3">
          <CampoTexto
            label="Nome do usuário"
            placeholder="Nome do usuário"
            onChange={onChangeNomeUsuario}
            desabilitado={!permissoesTela.podeConsultar}
            value={nomeUsuarioSelecionado}
          />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-5 pb-3">
          <CampoTexto
            label="Login"
            placeholder="Digite o login"
            onChange={onChangeRf}
            desabilitado={!permissoesTela.podeConsultar}
            value={rfSelecionado}
          />
        </div>
        <div className="col-sm-12 col-md-12 col-lg-2 col-xl-1 pb-3">
          <Button
            label="Filtrar"
            color={Colors.Azul}
            disabled={perfilSelecionado || !dreSelecionada}
            border
            className="text-center d-block mt-4 float-right w-100"
            onClick={() => {
              setOrigemFiltro('botao');
              onClickFiltrar();
            }}
          />
        </div>
      </div>

      {listaUsuario.length > 0 && dreSelecionada !== 'Todas' && (
        <div className="row">
          <div className="col-md-12 pt-4">
            <DataTable
              rowKey="codigoRf"
              columns={colunas}
              dataSource={listaUsuario}
              semHover
            />
          </div>
        </div>
      )}
      {listaUsuario.length > 0 && dreSelecionada === 'Todas' && (
        <div className="row">
          <div className="col-md-12 pt-4">
            <DataTable
              rowKey="codigoRf"
              columns={colunas}
              dataSource={listaUsuario}
              semHover
              pagination={{
                current: pagina,
                pageSize: quantidadeRegistrosPorPagina,
                total: totalRegistros,
                showSizeChanger: false,
                onChange: newPage => {
                  setPagina(newPage);
                },
              }}
            />
          </div>
        </div>
      )}

      <Formik
        ref={refFormik => setRefForm(refFormik)}
        enableReinitialize
        initialValues={{
          emailUsuario: emailUsuarioSelecionado,
        }}
        validationSchema={validacoes}
        onSubmit={values => onConfirmarReiniciarSenha(values)}
        validateOnChange
        validateOnBlur
      >
        {form => (
          <Form>
            <ModalConteudoHtml
              key="reiniciarSenha"
              visivel={exibirModalReiniciarSenha}
              onConfirmacaoPrincipal={() => {
                form.validateForm().then(() => form.handleSubmit(e => e));
              }}
              onConfirmacaoSecundaria={() => onCancelarReiniciarSenha()}
              onClose={onCloseModalReiniciarSenha}
              labelBotaoPrincipal="Cadastrar e reiniciar"
              tituloAtencao={semEmailCadastrado ? 'Atenção' : null}
              perguntaAtencao={validaSeTemEmailCadastrado()}
              labelBotaoSecundario="Cancelar"
              titulo="Reiniciar Senha"
              closable
            >
              <b> Deseja realmente reiniciar essa senha? </b>

              <CampoTexto
                label="E-mail"
                name="emailUsuario"
                form={form}
                maxlength="50"
                labelRequired
              />
            </ModalConteudoHtml>
          </Form>
        )}
      </Formik>
      <ModalConteudoHtml
        key="exibirModalMensagemReiniciarSenha"
        visivel={exibirModalMensagemReiniciarSenha}
        onClose={onCloseModalReiniciarSenha}
        onConfirmacaoPrincipal={onCloseModalReiniciarSenha}
        labelBotaoPrincipal="OK"
        titulo="Senha reiniciada"
        esconderBotaoSecundario
        closable
      >
        <b> {mensagemSenhaAlterada} </b>
      </ModalConteudoHtml>
    </Loader>
  );
}
