import { ROUTES } from '@/core/enum/routes';
import { Col, Row } from 'antd';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Loader } from '~/componentes';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Button from '~/componentes/button';
import CampoTexto from '~/componentes/campoTexto';
import Card from '~/componentes/card';
import * as cores from '~/componentes/colors';
import LinhaTempo from '~/componentes/linhaTempo/linhaTempo';
import {
  SGP_BUTTON_ACEITAR,
  SGP_BUTTON_LIDA,
  SGP_BUTTON_RECUSAR,
} from '~/constantes/ids/button';
import notificacaoCategoria from '~/dtos/notificacaoCategoria';
import notificacaoStatus from '~/dtos/notificacaoStatus';
import servicoNotificacao from '~/servicos/Paginas/ServicoNotificacao';
import { aviso, confirmar, erro, erros, sucesso } from '~/servicos/alertas';
import api from '~/servicos/api';
import { setBreadcrumbManual } from '~/servicos/breadcrumb-services';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';
import { EstiloDetalhe } from './detalheNotificacao.css';
import EstiloLinhaTempo from './linhaTempo.css';

const urlTelaNotificacoes = '/notificacoes';

const DetalheNotificacao = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paramsRoute = useParams();

  const idNotificacao = paramsRoute?.id || 0;

  const [listaDeStatus, setListaDeStatus] = useState([]);
  const [carregandoTela, setCarregandoTela] = useState(false);
  const [aprovar, setAprovar] = useState(false);

  const titulosNiveis = [
    '',
    'Aguardando aceite',
    'Aceita',
    'Recusada',
    'Sem status',
    '',
    'Substituído',
  ];

  const usuario = useSelector(state => state.usuario);
  const permissoesTela = usuario.permissoes[ROUTES.NOTIFICACOES];

  const [validacoes, setValidacoes] = useState(
    Yup.object({
      observacao: Yup.string().notRequired(),
    })
  );

  const [notificacao, setNotificacao] = useState({
    alteradoEm: '',
    alteradoPor: null,
    criadoEm: '',
    criadoPor: '',
    id: 0,
    mensagem: '',
    mostrarBotaoMarcarComoLido: false,
    mostrarBotoesDeAprovacao: false,
    situacao: '',
    tipo: '',
    titulo: '',
  });

  const buscaNotificacao = async id => {
    try {
      setCarregandoTela(true);
      const { data, status } = await api.get(`v1/notificacoes/${id}`);
      if (data && status === 200) {
        setNotificacao(data);
        setCarregandoTela(false);
      }
    } catch (listaErros) {
      setCarregandoTela(false);
      erros(listaErros);
    }
  };

  useEffect(() => {
    setBreadcrumbManual(location.pathname, 'Detalhes', '/notificacoes');
    verificaSomenteConsulta(permissoesTela);
  }, [location]);

  useEffect(() => {
    if (idNotificacao) {
      buscaNotificacao(idNotificacao);
    }
  }, [idNotificacao]);

  const anoAtual = window.moment().format('YYYY');

  useEffect(() => {
    const buscaLinhaTempo = async () => {
      try {
        setCarregandoTela(true);
        const { data, status } = await api.get(
          `v1/workflows/aprovacoes/notificacoes/${idNotificacao}/linha-tempo`
        );
        if (data && status === 200) {
          setListaDeStatus(
            data.map(item => ({
              titulo: titulosNiveis[item.statusId],
              status: item.statusId,
              timestamp: item.alteracaoData,
              rf: item.alteracaoUsuarioRf,
              nome: item.alteracaoUsuario,
            }))
          );
          setCarregandoTela(false);
        }
      } catch (listaErros) {
        setCarregandoTela(false);
        erros(listaErros);
      }
    };

    if (
      notificacao &&
      notificacao.categoriaId === notificacaoCategoria.Workflow_Aprovacao
    ) {
      buscaLinhaTempo();
    }
    if (notificacao.categoriaId === notificacaoCategoria.Aviso) {
      if (usuario.rf.length > 0)
        servicoNotificacao.validarBuscaNotificacoesPorAnoRf(
          anoAtual,
          usuario.rf
        );
    }
  }, [notificacao]);

  const marcarComoLida = async () => {
    try {
      setCarregandoTela(true);
      const idsNotificacoes = [idNotificacao];
      const { data, status } = await servicoNotificacao.marcarComoLidaNot(
        idsNotificacoes
      );
      if (data && status === 200) {
        data.forEach(resultado => {
          if (resultado.sucesso) {
            sucesso(resultado.mensagem);
          } else {
            erro(resultado.mensagem);
          }
        });

        navigate(urlTelaNotificacoes);
        if (usuario.rf.length > 0)
          servicoNotificacao.validarBuscaNotificacoesPorAnoRf(
            anoAtual,
            usuario.rf
          );

        setCarregandoTela(false);
      }
    } catch (error) {
      setCarregandoTela(false);
      erro('Não foi possível marcar notificação como lida!');
    }
  };

  const excluir = async () => {
    const confirmado = await confirmar(
      'Atenção',
      'Você tem certeza que deseja excluir esta notificação?'
    );
    if (confirmado) {
      try {
        setCarregandoTela(true);
        const idsNotificacoes = [idNotificacao];
        const { data, status } = await servicoNotificacao.excluirNot(
          idsNotificacoes
        );
        if (data && status === 200) {
          data.forEach(resultado => {
            if (resultado.sucesso) {
              sucesso(resultado.mensagem);
            } else {
              erro(resultado.mensagem);
            }
          });

          navigate(urlTelaNotificacoes);
          if (usuario.rf.length > 0) {
            servicoNotificacao.validarBuscaNotificacoesPorAnoRf(
              anoAtual,
              usuario.rf
            );
          }

          setCarregandoTela(false);
        }
      } catch (error) {
        setCarregandoTela(false);
        erro('Não foi possível excluir a notificação!');
      }
    }
  };

  const enviarAprovacao = async form => {
    const confirmado = await confirmar(
      'Atenção',
      `Você tem certeza que deseja "${
        aprovar ? 'Aceitar' : 'Recusar'
      }" esta notificação?`
    );
    if (confirmado) {
      try {
        setCarregandoTela(true);
        const parametros = { ...form, aprova: aprovar };
        const { data, status } = await servicoNotificacao.enviarAprovacaoNot(
          idNotificacao,
          parametros
        );
        const msgSucesso = `Notificação ${
          aprovar ? `Aceita` : `Recusada`
        } com sucesso.`;
        if ((data !== null || data !== undefined) && status === 200) {
          if (data.mensagens) {
            aviso(data.mensagens[0]);
          } else sucesso(msgSucesso);
          setCarregandoTela(false);
          navigate(urlTelaNotificacoes);
        }
      } catch (listaErros) {
        setCarregandoTela(false);
        erros(listaErros);
      }
    }
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          observacao: notificacao.observacao || '',
        }}
        validationSchema={validacoes}
        onSubmit={values => enviarAprovacao(values)}
        validateOnChange
        validateOnBlur
      >
        {form => (
          <Form>
            <Loader loading={carregandoTela} tip="Carregando...">
              <Cabecalho pagina="Notificações">
                <Row gutter={[8, 8]} type="flex">
                  <Col>
                    <BotaoVoltarPadrao
                      onClick={() => navigate(urlTelaNotificacoes)}
                    />
                  </Col>
                  <Col>
                    <Button
                      id={SGP_BUTTON_ACEITAR}
                      label="Aceitar"
                      color={cores.Colors.Roxo}
                      disabled={
                        !notificacao.mostrarBotoesDeAprovacao ||
                        !permissoesTela.podeAlterar
                      }
                      border={!notificacao.mostrarBotoesDeAprovacao}
                      type="button"
                      onClick={async e => {
                        setValidacoes(
                          Yup.object().shape({
                            observacao: Yup.string().notRequired(),
                          })
                        );
                        setAprovar(true);
                        if (usuario.rf.length > 0)
                          servicoNotificacao.validarBuscaNotificacoesPorAnoRf(
                            anoAtual,
                            usuario.rf
                          );
                        form.validateForm().then(() => form.handleSubmit(e));
                      }}
                    />
                  </Col>
                  <Col>
                    <Button
                      id={SGP_BUTTON_RECUSAR}
                      label="Recusar"
                      color={cores.Colors.Roxo}
                      border
                      disabled={
                        !notificacao.mostrarBotoesDeAprovacao ||
                        !permissoesTela.podeAlterar
                      }
                      type="button"
                      onClick={async e => {
                        setValidacoes(
                          Yup.object({
                            observacao: Yup.string()
                              .required('Observação obrigatória')
                              .max(
                                100,
                                'A observação deverá conter no máximo 100 caracteres'
                              ),
                          })
                        );
                        setAprovar(false);
                        form.validateForm().then(() => form.handleSubmit(e));
                      }}
                    />
                  </Col>
                  <Col>
                    <Button
                      id={SGP_BUTTON_LIDA}
                      label="Marcar como lida"
                      color={cores.Colors.Azul}
                      border
                      disabled={
                        !notificacao.mostrarBotaoMarcarComoLido ||
                        !permissoesTela.podeAlterar
                      }
                      onClick={marcarComoLida}
                    />
                  </Col>
                  <Col>
                    <BotaoExcluirPadrao
                      disabled={
                        !notificacao.mostrarBotaoRemover ||
                        !permissoesTela.podeExcluir
                      }
                      onClick={excluir}
                    />
                  </Col>
                </Row>
              </Cabecalho>
              <Card addRow={false}>
                <EstiloDetalhe>
                  <div className="col-xs-12 col-md-12 col-lg-12">
                    <div className="row mg-bottom">
                      <div className="col-xs-12 col-md-12 col-lg-2 bg-id">
                        <div className="row">
                          <div className="col-xs-12 col-md-12 col-lg-12 text-center">
                            CÓDIGO
                          </div>
                          <div className="id-notificacao col-xs-12 col-md-12 col-lg-12 text-center">
                            {notificacao.codigo}
                          </div>
                        </div>
                      </div>
                      <div className="col-xs-12 col-md-12 col-lg-10">
                        <div className="row">
                          <div className="col-xs-12 col-md-12 col-lg-12">
                            <div className="notificacao-horario">
                              {`Notificação automática ${notificacao.criadoEm.substr(
                                0,
                                10
                              )}`}
                            </div>
                          </div>
                          <div className="col-xs-12 col-md-12 col-lg-12">
                            <div className="row">
                              <div className="col-xs-12 col-md-12 col-lg-4 titulo-coluna">
                                Tipo{' '}
                                <div className="conteudo-coluna">
                                  {notificacao.tipo}
                                </div>
                              </div>
                              <div className="col-xs-12 col-md-12 col-lg-6 titulo-coluna">
                                Título
                                <div className="conteudo-coluna">
                                  {notificacao.titulo}
                                </div>
                              </div>
                              <div className="col-xs-12 col-md-12 col-lg-2 titulo-coluna">
                                Situação
                                <div
                                  className={`conteudo-coluna ${
                                    notificacao.statusId ===
                                    notificacaoStatus.Pendente
                                      ? 'texto-vermelho-negrito'
                                      : ''
                                  }`}
                                >
                                  {notificacao.statusId ===
                                  notificacaoStatus.Pendente
                                    ? 'Não Lida'
                                    : notificacao.situacao}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="mt-hr" />
                  <div className="row">
                    <div className="col-xs-12 col-md-12 col-lg-12 mensagem">
                      MENSAGEM:{' '}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: notificacao.mensagem,
                        }}
                      />
                    </div>
                  </div>
                  {notificacao.categoriaId ===
                    notificacaoCategoria.Workflow_Aprovacao && (
                    <div className="row">
                      <div className="col-xs-12 col-md-12 col-lg-12 obs">
                        <label>Observações</label>
                        <CampoTexto
                          name="observacao"
                          type="textarea"
                          form={form}
                          maxlength="100"
                          desabilitado={
                            !notificacao.mostrarBotoesDeAprovacao ||
                            !permissoesTela.podeAlterar
                          }
                        />
                      </div>
                    </div>
                  )}
                </EstiloDetalhe>
                {notificacao.categoriaId ===
                  notificacaoCategoria.Workflow_Aprovacao && (
                  <EstiloLinhaTempo>
                    <div className="col-xs-12 col-md-12 col-lg-12">
                      <div className="row">
                        <div className="col-xs-12 col-md-12 col-lg-12">
                          <p>SITUAÇÃO DA NOTIFICAÇÃO</p>
                        </div>
                        <div className="col-xs-12 col-md-12 col-lg-12">
                          <LinhaTempo listaDeStatus={listaDeStatus} />
                        </div>
                      </div>
                    </div>
                  </EstiloLinhaTempo>
                )}
              </Card>
            </Loader>
          </Form>
        )}
      </Formik>
    </>
  );
};
export default DetalheNotificacao;
