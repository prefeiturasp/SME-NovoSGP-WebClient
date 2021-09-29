import { Col, Row } from 'antd';
import { Form, Formik } from 'formik';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import shortid from 'shortid';
import * as Yup from 'yup';
import {
  Auditoria,
  Button,
  CampoData,
  CampoTexto,
  Colors,
  ModalConteudoHtml,
  momentSchema,
  RadioGroupButton,
  SelectComponent,
} from '~/componentes';
import ListaLocalOcorrencia from '~/constantes/localOcorrencia';
import { RotasDto } from '~/dtos';
import entidadeStatusDto from '~/dtos/entidadeStatusDto';
import eventoLetivo from '~/dtos/eventoLetivo';
import eventoTipoData from '~/dtos/eventoTipoData';
import tipoEvento from '~/dtos/tipoEvento';
import {
  api,
  confirmar,
  erros,
  history,
  ServicoCalendarios,
  ServicoEvento,
  sucesso,
} from '~/servicos';
import { parseScreenObject } from '~/utils/parsers/eventRecurrence';
import ModalRecorrencia from '../components/ModalRecorrencia';
import { ListaCopiarEventos } from '../eventos.css';
import BimestreCadastroEventos from './campos/bimestreCadastroEventos';
import CalendarioCadastroEventos from './campos/calendarioCadastroEventos';
import DreCadastroEventos from './campos/dreCadastroEventos';
import TipoEventoCadastroEventos from './campos/tipoEventoCadastroEventos';
import UeCadastroEventos from './campos/ueCadastroEventos';
import EventosCadastroContext from './eventosCadastroContext';

const EventosCadastroForm = () => {
  const {
    valoresIniciaisPadrao,
    setRefFormEventos,
    refFormEventos,
    setEmEdicao,
    emEdicao,
    desabilitarCampos,
    setListaUes,
    podeAlterarEvento,
    executaResetarTela,
    setExecutaResetarTela,
    setListaCalendarios,
    listaCalendarios,
    eventoTipoFeriadoSelecionado,
    setEventoTipoLocalOcorrenciaSMESelecionado,
    eventoTipoLocalOcorrenciaSMESelecionado,
    listaTipoEvento,
    setEventoTipoFeriadoSelecionado,
    listaFeriados,
    setListaFeriados,
    desabilitarOpcaoLetivo,
    setDesabilitarOpcaoLetivo,
    tipoDataUnico,
    setTipoDataUnico,
    setListaTipoEvento,
    listaTipoEventoOrigem,
    showModalRecorrencia,
    setShowModalRecorrencia,
    recorrencia,
    setRecorrencia,
    desabilitarLetivo,
    listaCalendarioEscolar,
    setListaCalendarioEscolar,
    listaCalendarioParaCopiarInicial,
    setListaCalendarioParaCopiarInicial,
    listaCalendarioParaCopiar,
    setListaCalendarioParaCopiar,
    exibirModalCopiarEvento,
    setExibirModalCopiarEvento,
    exibirModalRetornoCopiarEvento,
    setExibirModalRetornoCopiarEvento,
    listaMensagensCopiarEvento,
    setListaMensagensCopiarEvento,
    auditoriaEventos,
    setExibirLoaderSalvar,
    aguardandoAprovacao,
    setAguardandoAprovacao,
    setPodeAlterarEvento,
    setPodeAlterarExcluir,
    setAuditoriaEventos,
    somenteConsulta,
    setDesabilitarCampos,
  } = useContext(EventosCadastroContext);

  const usuarioStore = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuarioStore;

  const permissoesTela = usuarioStore.permissoes[RotasDto.EVENTOS];

  const paramsRota = useParams();

  const eventoId = paramsRota?.id;
  const tipoCalendarioId = paramsRota?.tipoCalendarioId;

  const [valoresIniciais, setValoresIniciais] = useState(
    eventoId ? null : valoresIniciaisPadrao
  );

  const [validacoes, setValidacoes] = useState({});

  useEffect(() => {
    const desabilitar = eventoId
      ? somenteConsulta || !permissoesTela.podeIncluir
      : somenteConsulta || !permissoesTela.podeAlterar;

    if (aguardandoAprovacao) {
      setDesabilitarCampos(aguardandoAprovacao);
      return;
    }
    setDesabilitarCampos(desabilitar);
  }, [
    somenteConsulta,
    eventoId,
    permissoesTela,
    podeAlterarEvento,
    aguardandoAprovacao,
  ]);

  const opcoesLetivo = [
    { label: 'Sim', value: 1 },
    { label: 'Não', value: 2 },
  ];

  const onChangeCampos = () => {
    if (!emEdicao) {
      setEmEdicao(true);
    }
  };

  const montarTipoCalendarioPorId = async (id, form) => {
    const resposta = await ServicoCalendarios.obterTipoCalendarioPorId(
      id
    ).catch(e => erros(e));
    const tipoCalendario = resposta?.data;
    if (tipoCalendario) {
      tipoCalendario.id = String(tipoCalendario.id);
      tipoCalendario.descricaoTipoCalendario = `${tipoCalendario.anoLetivo} - ${tipoCalendario.nome} - ${tipoCalendario.descricaoPeriodo}`;
      form.initialValues.tipoCalendarioId = tipoCalendario.id;
      form.setFieldValue('tipoCalendarioId', tipoCalendario.id);
      setListaCalendarios([{ ...tipoCalendario }]);
    } else {
      setListaCalendarios([]);
    }
  };

  const obterFeriados = async () => {
    const resposta = await ServicoCalendarios.obterFeriados().catch(e =>
      erros(e)
    );

    if (resposta?.data?.length) {
      setListaFeriados(resposta.data);
    } else {
      setListaFeriados([]);
    }
  };

  const onChangeTipoEvento = (evento, form) => {
    if (evento) {
      const tipoEventoSelecionado = listaTipoEvento.find(
        item => item.id.toString() === evento.toString()
      );
      if (
        tipoEventoSelecionado &&
        String(tipoEventoSelecionado.descricao).toUpperCase() === 'FERIADO'
      ) {
        setEventoTipoFeriadoSelecionado(true);
        obterFeriados();
      } else {
        setEventoTipoFeriadoSelecionado(false);
        if (form) {
          form.setFieldValue('feriadoId', '');
        }
      }
      let valorLetivo = 1;
      let valorEvento = false;
      let valorOpcaoLetivo = false;
      let tipoUnico = false;
      if (
        tipoEventoSelecionado &&
        tipoEventoSelecionado.tipoData === eventoTipoData.Unico
      ) {
        tipoUnico = true;
        if (form) {
          form.setFieldValue('dataFim', '');
        }
      } else if (
        tipoEventoSelecionado &&
        tipoEventoSelecionado.tipoData === eventoTipoData.InicioFim
      ) {
        tipoUnico = false;
      }

      if (form && tipoEventoSelecionado && tipoEventoSelecionado.letivo) {
        if (tipoEventoSelecionado.letivo === eventoLetivo.Opcional) {
          valorOpcaoLetivo = false;
        } else {
          valorOpcaoLetivo = true;
          valorLetivo = tipoEventoSelecionado.letivo;
        }
      }

      if (tipoEventoSelecionado?.id === tipoEvento.LiberacaoBoletim) {
        valorEvento = true;
        valorOpcaoLetivo = true;
        tipoUnico = true;
      }
      if (form) {
        form.setFieldValue('letivo', valorLetivo);
      }

      setEventoTipoLocalOcorrenciaSMESelecionado(valorEvento);
      setDesabilitarOpcaoLetivo(valorOpcaoLetivo);
      setTipoDataUnico(tipoUnico);
    } else {
      setEventoTipoFeriadoSelecionado(false);
    }
  };

  const filtraSomenteUE = () =>
    listaTipoEventoOrigem.filter(
      element =>
        element.localOcorrencia === ListaLocalOcorrencia.UE ||
        element.localOcorrencia === ListaLocalOcorrencia.SMEUE ||
        element.localOcorrencia === ListaLocalOcorrencia.TODOS
    );

  const filtraSomenteDRE = () =>
    listaTipoEventoOrigem.filter(
      element =>
        element.localOcorrencia === ListaLocalOcorrencia.DRE ||
        element.localOcorrencia === ListaLocalOcorrencia.TODOS
    );

  const filtraSomenteSME = () =>
    listaTipoEventoOrigem.filter(
      element =>
        element.localOcorrencia === ListaLocalOcorrencia.SME ||
        element.localOcorrencia === ListaLocalOcorrencia.SMEUE ||
        element.localOcorrencia === ListaLocalOcorrencia.TODOS
    );

  const filtraTipoEvento = (dre, ue) => {
    if (ue) return setListaTipoEvento(filtraSomenteUE());
    if (dre) return setListaTipoEvento(filtraSomenteDRE());
    return setListaTipoEvento(filtraSomenteSME());
  };

  const onChangeDre = (dre, form) => {
    setListaUes([]);
    form.setFieldValue('ueId', undefined);
    onChangeTipoEvento(undefined);
    form.setFieldValue('tipoEventoId', undefined);
    setEventoTipoLocalOcorrenciaSMESelecionado(false);

    filtraTipoEvento(dre);
    onChangeCampos();
  };

  const resetarTela = () => {
    const initialValues = { ...refFormEventos.initialValues };
    refFormEventos.resetForm({});
    refFormEventos.resetForm(initialValues);
    setEmEdicao(false);
    onChangeTipoEvento(refFormEventos.initialValues.tipoEventoId);
  };

  useEffect(() => {
    if (executaResetarTela) {
      resetarTela();
      setExecutaResetarTela(false);
    }
  }, [executaResetarTela]);

  const onChangeUe = (ue, form) => {
    filtraTipoEvento(form.values.dreId, ue);

    onChangeCampos();
  };

  const desabilitarData = current => {
    if (current) {
      return (
        current < window.moment().startOf('year') ||
        current > window.moment().endOf('year')
      );
    }
    return false;
  };

  const onClickRecorrencia = () => {
    setShowModalRecorrencia(true);
  };

  const onSaveRecorrencia = recurrence => {
    setRecorrencia(parseScreenObject(recurrence));
  };

  const onCloseRecorrencia = () => {
    setShowModalRecorrencia(false);
  };

  useEffect(() => {
    if (recorrencia) {
      onCloseRecorrencia();
    }
  }, [recorrencia]);

  const onClickCopiarEvento = async () => {
    const anoAtual = window.moment().format('YYYY');
    const tiposCalendario = await api
      .get(
        usuarioStore && turmaSelecionada?.anoLetivo
          ? `v1/calendarios/tipos/anos/letivos/${turmaSelecionada.anoLetivo}`
          : `v1/calendarios/tipos/anos/letivos/${anoAtual}`
      )
      .catch(e => erros(e));

    if (tiposCalendario?.data?.length) {
      tiposCalendario.data.forEach(item => {
        item.id = String(item.id);
        item.descricaoTipoCalendario = `${item.anoLetivo} - ${item.nome} - ${item.descricaoPeriodo}`;
      });
      const listaSemCalendarioAtual = tiposCalendario.data.filter(
        item => item.id !== listaCalendarios[0].id
      );
      setListaCalendarioEscolar(listaSemCalendarioAtual);
    } else {
      setListaCalendarioEscolar([]);
    }

    setListaCalendarioParaCopiarInicial(listaCalendarioParaCopiar);
    setExibirModalCopiarEvento(true);
  };

  const onCloseCopiarConteudo = () => {
    setExibirModalCopiarEvento(false);
  };

  const onConfirmarCopiarEvento = () => {
    onCloseCopiarConteudo();
  };

  const onCancelarCopiarEvento = () => {
    setListaCalendarioParaCopiar(listaCalendarioParaCopiarInicial);
    onCloseCopiarConteudo();
  };

  const onChangeCopiarEvento = eventos => {
    setListaCalendarioParaCopiar(eventos);
  };

  const urlTelaListagemEventos = () => {
    if (tipoCalendarioId) {
      return `/calendario-escolar/eventos/${tipoCalendarioId}`;
    }
    return '/calendario-escolar/eventos';
  };

  const onCloseRetornoCopiarEvento = () => {
    setExibirModalRetornoCopiarEvento(false);
    history.push(urlTelaListagemEventos());
  };

  const exibirModalAtualizarEventos = async values => {
    const dataAlterada =
      valoresIniciais.id && values.dataInicio !== valoresIniciais.dataInicio;

    if (eventoId > 0 && !dataAlterada && valoresIniciais.recorrenciaEventos) {
      return confirmar(
        'Atualizar série',
        '',
        'Deseja também atualizar os eventos futuros pertencentes a mesma série que este?',
        'Atualizar',
        'Cancelar'
      );
    }
    return false;
  };

  const exibirModalConfirmaData = response => {
    return confirmar('Confirmar data', '', response.mensagens[0], 'Sim', 'Não');
  };

  const onClickCadastrar = async valores => {
    setExibirLoaderSalvar(true);

    const valoresForm = { ...valores };

    valoresForm.dataInicio = new Date(
      valoresForm.dataInicio.year(),
      valoresForm.dataInicio.month(),
      valoresForm.dataInicio.date()
    );

    if (tipoDataUnico) valoresForm.dataFim = valoresForm.dataInicio;
    else
      valoresForm.dataFim = new Date(
        valoresForm.dataFim.year(),
        valoresForm.dataFim.month(),
        valoresForm.dataFim.date()
      );

    const tiposCalendarioParaCopiar = listaCalendarioParaCopiar.map(id => {
      const calendario = listaCalendarioEscolar.find(e => e.id === id);
      return {
        tipoCalendarioId: calendario.id,
        nomeCalendario: calendario.descricaoTipoCalendario,
      };
    });

    /**
     * @description Metodo a ser disparado quando receber a mensagem do servidor
     */
    const sucessoAoSalvar = (resposta, rec) => {
      if (tiposCalendarioParaCopiar?.length > 0) {
        setListaMensagensCopiarEvento(resposta.data);
        setExibirModalRetornoCopiarEvento(true);
      } else {
        if (!rec) {
          sucesso(resposta.data[0].mensagem);
        } else {
          sucesso(
            `Evento ${
              eventoId ? 'alterado' : 'cadastrado'
            } com sucesso. Serão cadastrados eventos recorrentes, em breve você receberá uma notificação com o resultado do processamento.`
          );
        }
        history.push(urlTelaListagemEventos());
      }
    };

    let payload = {};
    let cadastrado = {};
    try {
      payload = {
        ...valoresForm,
        recorrenciaEventos: recorrencia ? { ...recorrencia } : null,
        tiposCalendarioParaCopiar,
      };

      const atualizarEventosFuturos = await exibirModalAtualizarEventos(
        payload
      );
      if (atualizarEventosFuturos) {
        payload = {
          ...payload,
          AlterarARecorrenciaCompleta: true,
        };
      }

      cadastrado = await ServicoEvento.salvar(eventoId || 0, payload);
      if (cadastrado && cadastrado.status === 200) {
        sucessoAoSalvar(cadastrado, recorrencia);
      }
    } catch (e) {
      if (e && e.response && e.response.status === 602) {
        const confirmaData = await exibirModalConfirmaData(e.response.data);
        if (confirmaData) {
          const request = await ServicoEvento.salvar(eventoId || 0, {
            ...payload,
            DataConfirmada: true,
          });
          if (request) {
            sucessoAoSalvar(request, recorrencia);
          }
        }
        return false;
      }
      erros(e);
    }

    setExibirLoaderSalvar(false);

    return true;
  };

  const montarExibicaoEventosCopiar = () => {
    return listaCalendarioParaCopiar.map(id => {
      const calendario = listaCalendarioEscolar.find(e => e.id === id);
      if (calendario && calendario.descricaoTipoCalendario) {
        return (
          <div
            className="font-weight-bold"
            key={`calendario-${shortid.generate()}`}
          >
            {`${calendario.descricaoTipoCalendario}`}
          </div>
        );
      }
      return '';
    });
  };

  const montaValidacoes = useCallback(() => {
    const val = {
      dataInicio: momentSchema.required('Data obrigatória'),
      nome: Yup.string().required('Nome obrigatório'),
      tipoCalendarioId: Yup.string().required('Calendário obrigatório'),
      tipoEventoId: Yup.string().required('Tipo obrigatório'),
      descricao: Yup.string().test(
        'validaDescricaoObrigatoria',
        'Descrição obrigatória',
        function validar() {
          const { tipoEventoId, descricao } = this.parent;
          if (
            !descricao &&
            (String(tipoEventoId) === String(tipoEvento.ReuniaoPedagogica) ||
              String(tipoEventoId) === String(tipoEvento.ReuniaoAPM) ||
              String(tipoEventoId) === String(tipoEvento.ReuniaoConselhoEscola))
          ) {
            return false;
          }
          return true;
        }
      ),
    };

    if (usuarioStore.possuiPerfilDre) {
      val.dreId = Yup.string().required('DRE obrigatória');
    }

    if (!usuarioStore.possuiPerfilSmeOuDre) {
      val.dreId = Yup.string().required('DRE obrigatória');
      val.ueId = Yup.string().required('UE obrigatória');
    }

    if (eventoTipoFeriadoSelecionado) {
      val.feriadoId = Yup.string().required('Feriado obrigatório');
    }

    if (!tipoDataUnico) {
      val.dataFim = Yup.string().required('Data obrigatória');
    }

    setValidacoes(Yup.object(val));
  }, [
    eventoTipoFeriadoSelecionado,
    tipoDataUnico,
    usuarioStore.possuiPerfilDre,
    usuarioStore.possuiPerfilSmeOuDre,
  ]);

  useEffect(() => {
    montaValidacoes();
  }, [eventoTipoFeriadoSelecionado, montaValidacoes, tipoDataUnico]);

  const validaSeValorInvalido = valor => {
    const validacoesObjeto =
      !valor ||
      (typeof valor === 'object' && Object.entries(valor).length === 0);

    return (
      !valor ||
      valor === '' ||
      valor === null ||
      valor === 'null' ||
      valor === undefined ||
      validacoesObjeto
    );
  };

  const verificarAlteracaoLetivoEdicao = (listaTipos, idTipoEvento) => {
    if (!listaTipos) return;

    const tipoEdicao = listaTipos.find(lista => lista.id === idTipoEvento);

    if (!tipoEdicao) return;

    const tipoEventoOpcional = tipoEdicao.letivo === eventoLetivo.Opcional;

    setDesabilitarOpcaoLetivo(!tipoEventoOpcional);
  };

  const consultaPorId = async id => {
    const evento = await ServicoEvento.obterPorId(id).catch(e => erros(e));

    if (evento && evento.data) {
      if (evento.data.status == entidadeStatusDto.AguardandoAprovacao) {
        setAguardandoAprovacao(true);
      } else {
        setAguardandoAprovacao(false);
      }
      setPodeAlterarEvento(evento.data.podeAlterar);

      setPodeAlterarExcluir(
        usuarioStore.possuiPerfilSme === true ||
          (usuarioStore.possuiPerfilDre === true && evento.data.dreId) ||
          evento.data.criadoRF === usuarioStore.rf ||
          evento.data.podeAlterarExcluirPorPerfilAbrangencia === true
      );

      let bimestreParaSetar = [];
      if (evento.data.bimestre) {
        const bimesresConvertidos = evento.data.bimestre.map(item =>
          String(item)
        );
        bimestreParaSetar = bimesresConvertidos;
      }

      setValoresIniciais({
        dataFim: evento.data.dataFim ? window.moment(evento.data.dataFim) : '',
        dataInicio: window.moment(evento.data.dataInicio),
        descricao: evento.data.descricao,
        dreId: !validaSeValorInvalido(evento.data.dreId)
          ? String(evento.data.dreId)
          : undefined,
        feriadoId: !validaSeValorInvalido(evento.data.feriadoId)
          ? String(evento.data.feriadoId)
          : undefined,
        letivo: evento.data.letivo,
        nome: evento.data.nome,
        tipoCalendarioId: !validaSeValorInvalido(evento.data.tipoCalendarioId)
          ? String(evento.data.tipoCalendarioId)
          : undefined,
        tipoEventoId: !validaSeValorInvalido(evento.data.tipoEventoId)
          ? String(evento.data.tipoEventoId)
          : undefined,
        ueId: !validaSeValorInvalido(evento.data.ueId)
          ? String(evento.data.ueId)
          : undefined,
        id: evento.data.id,
        recorrenciaEventos: evento.data.recorrenciaEventos,
        podeAlterar: evento.data.podeAlterar,
        bimestre: bimestreParaSetar,
      });
      setAuditoriaEventos({
        criadoPor: evento.data.criadoPor,
        criadoRf: evento.data.criadoRF > 0 ? evento.data.criadoRF : '',
        criadoEm: evento.data.criadoEm,
        alteradoPor: evento.data.alteradoPor,
        alteradoRf: evento.data.alteradoRF > 0 ? evento.data.alteradoRF : '',
        alteradoEm: evento.data.alteradoEm,
      });

      verificarAlteracaoLetivoEdicao(listaTipoEvento, evento.data.tipoEventoId);

      onChangeTipoEvento(evento.data.tipoEventoId);
    }
  };

  useEffect(() => {
    if (eventoId) {
      consultaPorId(eventoId);
    }
  }, [eventoId]);

  return (
    <>
      <ModalRecorrencia
        onCloseRecorrencia={onCloseRecorrencia}
        onSaveRecorrencia={onSaveRecorrencia}
        show={showModalRecorrencia}
        initialValues={{
          dataInicio: refFormEventos?.state?.values?.dataInicio,
        }}
      />

      <ModalConteudoHtml
        key="copiarEvento"
        visivel={exibirModalCopiarEvento}
        onConfirmacaoPrincipal={onConfirmarCopiarEvento}
        onConfirmacaoSecundaria={onCancelarCopiarEvento}
        onClose={onCloseCopiarConteudo}
        labelBotaoPrincipal="Selecionar"
        labelBotaoSecundario="Cancelar"
        titulo="Copiar evento"
        closable={false}
        fecharAoClicarFora={false}
        fecharAoClicarEsc={false}
      >
        <SelectComponent
          id="copiar-evento-select"
          lista={listaCalendarioEscolar}
          valueOption="id"
          valueText="descricaoTipoCalendario"
          onChange={onChangeCopiarEvento}
          valueSelect={listaCalendarioParaCopiar}
          multiple
          placeholder="Selecione 1 ou mais tipos de calendários"
        />
      </ModalConteudoHtml>

      <ModalConteudoHtml
        key="retornoCopiarEvento"
        visivel={exibirModalRetornoCopiarEvento}
        onConfirmacaoSecundaria={onCloseRetornoCopiarEvento}
        onClose={onCloseRetornoCopiarEvento}
        labelBotaoSecundario="Ok"
        titulo="Cadastro de evento"
        closable={false}
        fecharAoClicarFora={false}
        fecharAoClicarEsc={false}
        esconderBotaoPrincipal
      >
        {listaMensagensCopiarEvento.map(item => (
          <p key={shortid.generate()}>
            {item.sucesso ? (
              <strong>
                <i className="fas fa-check text-success mr-2" />
                {item.mensagem}
              </strong>
            ) : (
              <strong className="text-danger">
                <i className="fas fa-times mr-3" />
                {item.mensagem}
              </strong>
            )}
          </p>
        ))}
      </ModalConteudoHtml>

      {valoresIniciais ? (
        <>
          <Formik
            ref={f => setRefFormEventos(f)}
            enableReinitialize
            initialValues={valoresIniciais}
            validationSchema={validacoes}
            onSubmit={valores => onClickCadastrar(valores)}
            validateOnChange
            validateOnBlur
          >
            {form => (
              <Form>
                <Col span={24}>
                  <Row gutter={[16, 16]}>
                    <Col sm={24} md={12} xl={8}>
                      <CalendarioCadastroEventos
                        form={form}
                        eventoId={eventoId}
                        tipoCalendarioIdRota={tipoCalendarioId}
                        montarTipoCalendarioPorId={montarTipoCalendarioPorId}
                      />
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col md={24} xl={12}>
                      <DreCadastroEventos
                        form={form}
                        onChangeCampos={dre => {
                          onChangeDre(dre, form);
                        }}
                        desabilitar={desabilitarCampos || !podeAlterarEvento}
                        eventoId={eventoId}
                      />
                    </Col>
                    <Col md={24} xl={12}>
                      <UeCadastroEventos
                        form={form}
                        onChangeCampos={ue => {
                          onChangeUe(ue, form);
                        }}
                        desabilitar={desabilitarCampos || !podeAlterarEvento}
                        eventoId={eventoId}
                        tipoCalendarioId={tipoCalendarioId}
                      />
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]}>
                    <Col sm={24} md={12}>
                      <CampoTexto
                        form={form}
                        label="Nome do evento"
                        placeholder="Nome do evento"
                        onChange={onChangeCampos}
                        name="nome"
                        desabilitado={desabilitarCampos}
                      />
                    </Col>
                    <Col
                      sm={24}
                      md={
                        eventoTipoFeriadoSelecionado ||
                        eventoTipoLocalOcorrenciaSMESelecionado
                          ? 6
                          : 12
                      }
                    >
                      <TipoEventoCadastroEventos
                        form={form}
                        onChangeCampos={tipo => {
                          onChangeTipoEvento(tipo, form);
                          onChangeCampos();
                        }}
                        desabilitar={desabilitarCampos || !podeAlterarEvento}
                      />
                    </Col>
                    {eventoTipoFeriadoSelecionado ? (
                      <Col sm={24} md={6}>
                        <SelectComponent
                          form={form}
                          label="Nome feriado"
                          name="feriadoId"
                          lista={listaFeriados}
                          valueOption="id"
                          valueText="nome"
                          onChange={onChangeCampos}
                          placeholder="Selecione o feriado"
                          disabled={desabilitarCampos || !podeAlterarEvento}
                        />
                      </Col>
                    ) : (
                      ''
                    )}
                    {eventoTipoLocalOcorrenciaSMESelecionado && (
                      <Col sm={24} md={6}>
                        <BimestreCadastroEventos
                          form={form}
                          onChangeCampos={onChangeCampos}
                          tipoCalendarioId={tipoCalendarioId}
                        />
                      </Col>
                    )}
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col sm={24} md={12} lg={6}>
                      <CampoData
                        form={form}
                        label={
                          tipoDataUnico
                            ? 'Data do evento'
                            : 'Data início do evento'
                        }
                        placeholder="Data início do evento"
                        formatoData="DD/MM/YYYY"
                        name="dataInicio"
                        onChange={onChangeCampos}
                        desabilitarData={desabilitarData}
                        desabilitado={desabilitarCampos || !podeAlterarEvento}
                      />
                    </Col>
                    {!tipoDataUnico ? (
                      <Col sm={24} md={12} lg={6}>
                        <CampoData
                          form={form}
                          label="Data fim do evento"
                          placeholder="Data fim do evento"
                          formatoData="DD/MM/YYYY"
                          name="dataFim"
                          onChange={onChangeCampos}
                          desabilitado={desabilitarCampos || !podeAlterarEvento}
                        />
                      </Col>
                    ) : (
                      ''
                    )}
                    <Col sm={24} md={5} lg={4}>
                      <Button
                        id="btn-repetir"
                        label="Repetir"
                        icon="fas fa-retweet"
                        color={Colors.Azul}
                        border
                        className="mt-4"
                        onClick={onClickRecorrencia}
                        disabled={
                          desabilitarCampos ||
                          !form.values.dataInicio ||
                          !!valoresIniciais.id ||
                          !podeAlterarEvento
                        }
                      />
                      {!!recorrencia && recorrencia.dataInicio && (
                        <small>Existe recorrência cadastrada</small>
                      )}
                    </Col>

                    {!desabilitarLetivo && (
                      <Col sm={24} md={4}>
                        <RadioGroupButton
                          label="Letivo"
                          form={form}
                          opcoes={opcoesLetivo}
                          name="letivo"
                          valorInicial
                          onChange={onChangeCampos}
                          desabilitado={
                            desabilitarCampos ||
                            desabilitarOpcaoLetivo ||
                            !podeAlterarEvento
                          }
                        />
                      </Col>
                    )}
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col sm={24}>
                      <CampoTexto
                        form={form}
                        label="Descrição"
                        placeholder="Descrição"
                        onChange={onChangeCampos}
                        name="descricao"
                        type="textarea"
                        desabilitado={desabilitarCampos || !podeAlterarEvento}
                      />
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col sm={24}>
                      {/* <div className="row"> */}
                      <Button
                        id="btn-copiar-evento"
                        label="Copiar Evento"
                        icon="fas fa-share"
                        color={Colors.Azul}
                        border
                        className="mt-4 mr-3"
                        onClick={onClickCopiarEvento}
                        disabled={desabilitarCampos || !podeAlterarEvento}
                      />
                      {listaCalendarioParaCopiar &&
                      listaCalendarioParaCopiar.length ? (
                        <ListaCopiarEventos>
                          <div className="mb-1">
                            Evento será copiado para os calendários:
                          </div>
                          {montarExibicaoEventosCopiar()}
                        </ListaCopiarEventos>
                      ) : (
                        ''
                      )}
                      {/* </div> */}
                    </Col>
                  </Row>
                </Col>
              </Form>
            )}
          </Formik>
          {auditoriaEventos?.criadoEm ? (
            <Auditoria
              criadoEm={auditoriaEventos.criadoEm}
              criadoPor={auditoriaEventos.criadoPor}
              criadoRf={auditoriaEventos.criadoRf}
              alteradoPor={auditoriaEventos.alteradoPor}
              alteradoEm={auditoriaEventos.alteradoEm}
              alteradoRf={auditoriaEventos.alteradoRf}
            />
          ) : (
            ''
          )}
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default EventosCadastroForm;
