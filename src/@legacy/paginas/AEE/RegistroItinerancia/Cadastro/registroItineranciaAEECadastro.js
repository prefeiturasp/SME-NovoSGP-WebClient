import { Col, Row } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import shortid from 'shortid';
import {
  Auditoria,
  Base,
  Button,
  CampoData,
  Card,
  Colors,
  JoditEditor,
  Loader,
  MarcadorSituacao,
  PainelCollapse,
  SelectComponent,
} from '~/componentes';
import { Cabecalho, Paginacao } from '~/componentes-sgp';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import UploadArquivos from '~/componentes-sgp/UploadArquivos/uploadArquivos';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_SALVAR,
} from '~/constantes/ids/button';
import { SGP_UPLOAD_REGISTRO_ITINERANCIA } from '~/constantes/ids/upload';
import { RotasDto } from '~/dtos';
import tipoQuestaoDto from '~/dtos/tipoQuestao';
import {
  confirmar,
  erros,
  setBreadcrumbManual,
  setSomenteConsultaManual,
  sucesso,
  verificaSomenteConsulta,
  ServicoCalendarios,
  AbrangenciaServico,
  ServicoFiltroRelatorio,
} from '~/servicos';
import ServicoRegistroItineranciaAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoRegistroItineranciaAEE';
import { ordenarPor } from '~/utils/funcoes/gerais';
import { BotaoCustomizado } from '../registroItinerancia.css';
import {
  CollapseAluno,
  ModalAlunos,
  ModalErrosItinerancia,
  ModalObjetivos,
  TabelaLinhaRemovivel,
} from './componentes';
import { NOME_CAMPO_QUESTAO } from './componentes/ConstantesCamposDinâmicos';

const RegistroItineranciaAEECadastro = ({ match }) => {
  const navigate = useNavigate();

  const [carregandoGeral, setCarregandoGeral] = useState(false);
  const [carregandoQuestoes, setCarregandoQuestoes] = useState(false);
  const [dataVisita, setDataVisita] = useState('');
  const [dataRetornoVerificacao, setDataRetornoVerificacao] = useState('');
  const [modalVisivelObjetivos, setModalVisivelObjetivos] = useState(false);
  const [modalVisivelAlunos, setModalVisivelAlunos] = useState(false);
  const [objetivosSelecionados, setObjetivosSelecionados] = useState([]);
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [objetivosBase, setObjetivosBase] = useState([]);
  const [itineranciaId, setItineranciaId] = useState();
  const [questoesAlunos, setQuestoesAluno] = useState([]);
  const [itineranciaAlteracao, setItineranciaAlteracao] = useState({});
  const [errosValidacao, setErrosValidacao] = useState([]);
  const [modalErrosVisivel, setModalErrosVisivel] = useState(false);
  const [questoesItinerancia, setQuestoesItinerancia] = useState([]);
  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [auditoria, setAuditoria] = useState();
  const [imprimindo, setImprimindo] = useState(false);
  const [carregandoTipos, setCarregandoTipos] = useState(false);
  const [carregandoEventos, setCarregandoEventos] = useState(false);
  const [listaCalendario, setListaCalendario] = useState([]);
  const [tipoCalendarioSelecionado, setTipoCalendarioSelecionado] = useState();
  const [listaEvento, setListaEvento] = useState([]);
  const [eventoId, setEventoId] = useState();

  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);

  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [dreId, setDreId] = useState();
  const [ueId, setUeId] = useState();

  const [arquivosExcluido, setArquivosExcluido] = useState([]);

  const usuario = useSelector(store => store.usuario);
  const permissoesTela =
    usuario.permissoes[RotasDto.RELATORIO_AEE_REGISTRO_ITINERANCIA];

  const permissaoStatus = itineranciaId && !itineranciaAlteracao?.podeEditar;

  const mapearSalvarQuestoesUpload = mapearSomenteUpload => {
    const novoMapQuestoes = _.cloneDeep(questoesItinerancia);

    const questaoUpload = novoMapQuestoes.find(
      questao => questao?.tipoQuestao === tipoQuestaoDto.Upload
    );

    if (arquivosExcluido?.length) {
      arquivosExcluido.forEach(id => {
        const arquivoRespostaOriginal = itineranciaAlteracao.questoes.find(
          r => r?.arquivoId === id
        );

        if (arquivoRespostaOriginal) {
          const respostas = [...questaoUpload.resposta];

          respostas.push({
            id: arquivoRespostaOriginal?.id,
            xhr: arquivoRespostaOriginal.resposta,
            excluido: true,
            questaoId: arquivoRespostaOriginal.questaoId,
            arquivoId: arquivoRespostaOriginal.arquivoId,
          });
          questaoUpload.resposta = respostas;
        }
      });
    }
    let questoesSalvar = [];

    if (!mapearSomenteUpload) {
      questoesSalvar = novoMapQuestoes.filter(
        questao => questao?.tipoQuestao !== tipoQuestaoDto.Upload
      );
    }

    if (questaoUpload?.resposta?.length) {
      questaoUpload.resposta.forEach(resposta => {
        if (questaoUpload?.tipoQuestao === tipoQuestaoDto.Upload) {
          let idResposta = resposta?.id || 0;

          if (!idResposta) {
            idResposta = itineranciaAlteracao?.questoes?.find?.(
              r => r?.resposta === resposta?.xhr
            )?.id;
          }
          const questao = {
            id: idResposta || 0,
            questaoId: questaoUpload.questaoId,
            resposta: resposta?.xhr,
            tipoQuestao: questaoUpload?.tipoQuestao,
            excluido: false,
          };
          if (resposta?.arquivoId) {
            questao.arquivoId = resposta.arquivoId;
            questao.excluido = !!resposta.excluido;
          }
          questoesSalvar.push(questao);
        }
      });
    }
    return questoesSalvar;
  };

  const onClickSalvar = () => {
    const mapearSomenteUpload = !!alunosSelecionados?.length;

    const questoes = mapearSalvarQuestoesUpload(mapearSomenteUpload);

    const itinerancia = {
      id: itineranciaId,
      dataVisita,
      dataRetornoVerificacao: dataRetornoVerificacao || '',
      objetivosVisita: objetivosSelecionados,
      ueId,
      dreId,
      alunos: alunosSelecionados,
      questoes,
      anoLetivo: new Date().getFullYear(),
      eventoId,
    };
    const camposComErro = [];
    if (!dataVisita) {
      camposComErro.push('O campo data da visita é obrigatório');
    }
    if (!itinerancia.objetivosVisita?.length) {
      camposComErro.push(
        'A itinerância precisa ter ao menos um objetivo selecionado'
      );
    }
    if (!itinerancia?.ueId) {
      camposComErro.push(
        'A itinerância precisa ter uma unidade escolar selecionada'
      );
    }
    if (itinerancia.alunos?.length) {
      itinerancia.alunos.forEach(aluno => {
        const questoesAlunoInvalidas = aluno.questoes.filter(
          questao => questao.obrigatorio && !questao.resposta
        );
        if (questoesAlunoInvalidas.length) {
          const camposInvalidos = questoesAlunoInvalidas.map(questao => {
            return ` '${questao.descricao}'`;
          });
          camposComErro.push(
            `O(s) campo(s) ${camposInvalidos} do aluno ${aluno.alunoNome}, são obrigatórios. `
          );
        }
      });
    } else {
      const questoesInvalidas = questoesItinerancia.filter(
        questao => questao.obrigatorio && !questao.resposta
      );
      questoesInvalidas.forEach(questao => {
        camposComErro.push(`O campo ${questao.descricao} é obrigatório. `);
      });
    }
    if (
      dataVisita &&
      dataRetornoVerificacao &&
      dataRetornoVerificacao <= dataVisita
    ) {
      camposComErro.push(
        'A data de retorno/verificação não pode ser menor que a data de visita'
      );
    }
    if (camposComErro.length) {
      setErrosValidacao(camposComErro);
      setModalErrosVisivel(true);
    } else {
      setCarregandoGeral(true);
      ServicoRegistroItineranciaAEE.salvarItinerancia(itinerancia)
        .then(resp => {
          if (resp?.status === 200) {
            sucesso(
              `Registro ${itineranciaId ? 'alterado' : 'salvo'} com sucesso`
            );
            navigate(RotasDto.RELATORIO_AEE_REGISTRO_ITINERANCIA);
          } else {
            setCarregandoGeral(false);
          }
        })
        .catch(e => {
          erros(e);
          setCarregandoGeral(false);
        });
    }
  };

  const onClickVoltar = async () => {
    if (modoEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );
      if (confirmou) onClickSalvar();
      else navigate(RotasDto.RELATORIO_AEE_REGISTRO_ITINERANCIA);
    } else {
      navigate(RotasDto.RELATORIO_AEE_REGISTRO_ITINERANCIA);
    }
  };

  const selecionarAlunos = async alunos => {
    const questoes = questoesItinerancia.filter(q => q.resposta);
    if (!alunosSelecionados?.length && questoes?.length) {
      const resposta = await confirmar(
        'Atenção',
        'Ao selecionar o estudante, o registro será específico por estudante. As informações preenchidas até o momento serão descartadas',
        'Deseja continuar?'
      );
      if (resposta) {
        setAlunosSelecionados(ordenarPor(alunos, 'alunoNome'));
        questoesItinerancia.forEach(questao => {
          questao.resposta = '';
        });
      }
    } else {
      setAlunosSelecionados(ordenarPor(alunos, 'alunoNome'));
    }
  };

  const onChangeDataVisita = data => {
    setDataVisita(data);
    setModoEdicao(true);
  };

  const mudarDataRetorno = data => {
    setDataRetornoVerificacao(data);
    setModoEdicao(true);
  };

  const removerObjetivoSelecionado = valor => {
    const itemLista = objetivosBase.find(
      objetivo =>
        objetivo.itineranciaObjetivoBaseId === valor.itineranciaObjetivoBaseId
    );
    if (itemLista) itemLista.descricao = '';
    setObjetivosSelecionados(estadoAntigo =>
      estadoAntigo
        ? estadoAntigo.filter(
            item =>
              item.itineranciaObjetivoBaseId !== valor.itineranciaObjetivoBaseId
          )
        : []
    );
    setModoEdicao(true);
  };

  useEffect(() => {
    if (match?.params?.id) {
      setBreadcrumbManual(
        match?.url,
        'Alterar',
        RotasDto.RELATORIO_AEE_REGISTRO_ITINERANCIA
      );
      setItineranciaId(match.params.id);
    }
  }, [match]);

  const obterObjetivos = async () => {
    const retorno = await ServicoRegistroItineranciaAEE.obterObjetivos().catch(
      e => erros(e)
    );
    if (retorno?.data) {
      const dadosAlterados = retorno.data.map(item => ({
        ...item,
        key: item.id,
      }));
      setObjetivosBase(dadosAlterados);
    }
  };

  const obterQuestoes = async () => {
    setCarregandoQuestoes(true);
    const result =
      await ServicoRegistroItineranciaAEE.obterQuestoesItinerancia();
    if (result?.status === 200) {
      setQuestoesItinerancia(result?.data?.itineranciaQuestao);
      setQuestoesAluno(result?.data?.itineranciaAlunoQuestao);
      setCarregandoQuestoes(false);
    }
  };

  const resetTela = () => {
    setDataVisita('');
    setDataRetornoVerificacao('');
    setObjetivosSelecionados([]);
    setDreId();
    setListaDres();
    setUeId();
    setListaUes([]);
    setListaModalidades([]);
    questoesItinerancia.forEach(questao => {
      questao.resposta = '';
    });
    setAlunosSelecionados([]);
    setModoEdicao(false);
  };

  const mapearQuestoesUpload = questoes => {
    const questoesMapeadas = questoes.filter(
      questao => questao?.tipoQuestao !== tipoQuestaoDto.Upload
    );

    const questoesUpload = questoes.filter(
      questao => questao?.tipoQuestao === tipoQuestaoDto.Upload
    );

    if (questoesUpload?.length) {
      // Considerando que sempre vai ser uma questão de upload!
      const { questaoId, tipoQuestao, descricao } = questoesUpload[0];

      const respostas = questoesUpload.map(questao => {
        return {
          uid: questao?.resposta,
          xhr: questao?.resposta,
          name: questao?.arquivoNome,
          status: 'done',
          arquivoId: questao?.arquivoId,
        };
      });
      const questoesResposta = respostas.filter(q => !!q?.xhr);

      const questaoUpload = {
        questaoId,
        tipoQuestao,
        descricao,
        resposta: questoesResposta,
      };
      questoesMapeadas.push(questaoUpload);
    }

    return questoesMapeadas;
  };

  const construirItineranciaAlteracao = itinerancia => {
    setDataVisita(window.moment(itinerancia.dataVisita));
    setDataRetornoVerificacao(
      itinerancia.dataRetornoVerificacao
        ? window.moment(itinerancia.dataRetornoVerificacao)
        : ''
    );
    if (itinerancia.objetivosVisita?.length) {
      setObjetivosSelecionados(itinerancia.objetivosVisita);
      itinerancia.objetivosVisita.forEach(objetivo => {
        let objetivoBase = objetivosBase.find(
          o =>
            o.itineranciaObjetivosBaseId === objetivo.itineranciaObjetivosBaseId
        );
        objetivoBase = objetivo;
        objetivoBase.checked = true;
      });
    } else {
      setObjetivosSelecionados([]);
    }

    if (itinerancia?.ueId) {
      setUeId(String(itinerancia.ueId));
    } else if (listaUes?.length > 1) {
      setUeId();
    }

    if (itinerancia?.dreId) {
      setDreId(String(itinerancia.dreId));
    } else if (listaDres?.length > 1) {
      setDreId();
    }

    if (itinerancia.questoes?.length) {
      const questoes = mapearQuestoesUpload(itinerancia.questoes);

      setQuestoesItinerancia(questoes);
    } else {
      setQuestoesItinerancia([]);
    }

    if (itinerancia.alunos?.length) {
      setAlunosSelecionados(itinerancia.alunos);
    } else {
      setAlunosSelecionados([]);
    }

    if (itinerancia.tipoCalendarioId) {
      setTipoCalendarioSelecionado(String(itinerancia.tipoCalendarioId));
    } else if (listaCalendario?.length > 1) {
      setTipoCalendarioSelecionado();
    }

    if (itinerancia.eventoId) {
      setEventoId(String(itinerancia.eventoId));
    } else if (listaEvento?.length > 1) {
      setEventoId();
    }

    setArquivosExcluido([]);
  };

  const perguntarAntesDeCancelar = async () => {
    const resposta = await confirmar(
      'Atenção',
      'Você não salvou as informações preenchidas.',
      'Deseja realmente cancelar as alterações?'
    );
    return resposta;
  };
  const onClickCancelar = async () => {
    if (modoEdicao) {
      const ehParaCancelar = await perguntarAntesDeCancelar();
      if (ehParaCancelar) {
        if (itineranciaId) {
          setCarregandoGeral(true);
          construirItineranciaAlteracao(_.cloneDeep(itineranciaAlteracao));
          setTimeout(() => {
            setCarregandoGeral(false);
          }, 2000);
        } else {
          resetTela();
        }
        setModoEdicao(false);
      }
    }
  };

  useEffect(() => {
    async function obterItinerancia(id) {
      setCarregandoGeral(true);
      const result = await ServicoRegistroItineranciaAEE.obterItineranciaPorId(
        id
      ).catch(e => erros(e));
      if (result?.data && result?.status === 200) {
        const itinerancia = result.data;
        setItineranciaAlteracao(_.cloneDeep(itinerancia));
        construirItineranciaAlteracao(_.cloneDeep(itinerancia));
        setSomenteConsulta(itinerancia.criadoRF !== usuario.rf);
        setSomenteConsultaManual(itinerancia.criadoRF !== usuario.rf);
        setAuditoria(itinerancia.auditoria);
      }
      setCarregandoGeral(false);
    }
    if (itineranciaId) {
      obterItinerancia(itineranciaId);
    } else {
      obterQuestoes();
    }
  }, [itineranciaId]);

  const perguntarAntesDeRemoverAluno = async () => {
    const resposta = await confirmar(
      'Atenção',
      'As informações preenchidas para o aluno serão descartadas',
      'Deseja realmente remover o aluno?'
    );
    return resposta;
  };

  const confirmarRemoverAluno = alunoCodigo => {
    const novosAlunos =
      alunosSelecionados.filter(item => item.alunoCodigo !== alunoCodigo) || [];
    setPaginaAtual(Math.ceil(novosAlunos.length / 10 || 1));
    setAlunosSelecionados(novosAlunos);
    setModoEdicao(true);
  };

  const removerAlunos = async alunoCodigo => {
    const alunoRemover = alunosSelecionados.find(
      aluno => aluno.alunoCodigo === alunoCodigo
    );
    const temQuestoesComResposta = alunoRemover.questoes.filter(
      q => q.resposta
    );
    if (temQuestoesComResposta?.length) {
      const pergunta = await perguntarAntesDeRemoverAluno();
      if (pergunta) {
        confirmarRemoverAluno(alunoCodigo);
      }
    } else {
      confirmarRemoverAluno(alunoCodigo);
    }
  };

  useEffect(() => {
    obterObjetivos();
    setSomenteConsulta(verificaSomenteConsulta(permissoesTela));
  }, [permissoesTela]);

  const desabilitarDataVisita = dataCorrente => {
    return (
      dataCorrente > window.moment() ||
      dataCorrente < window.moment().startOf('year')
    );
  };

  const desabilitarDataRetorno = dataCorrente => {
    return (
      dataCorrente > window.moment().endOf('year') ||
      (dataVisita
        ? dataCorrente <= window.moment(dataVisita).add(1, 'd')
        : dataCorrente < window.moment().startOf('year'))
    );
  };

  const desabilitarCamposPorPermissao = () => {
    return (
      (match?.params?.id
        ? !permissoesTela?.podeAlterar
        : !permissoesTela?.podeIncluir) ||
      somenteConsulta ||
      permissaoStatus
    );
  };

  const setQuestao = (valor, questao) => {
    setModoEdicao(true);
    questao.resposta = valor;
  };

  const gerarRelatorio = () => {
    setImprimindo(true);

    ServicoRegistroItineranciaAEE.gerarRelatorio([match?.params?.id])
      .then(() => {
        sucesso(
          'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
        );
      })
      .finally(setImprimindo(false))
      .catch(e => erros(e));
  };

  const onChangeTipoCalendario = tipo => {
    setEventoId();
    setListaEvento([]);

    if (tipo) {
      setTipoCalendarioSelecionado(tipo);
    } else {
      setTipoCalendarioSelecionado();
    }
    setModoEdicao(true);
  };

  const obterTiposCalendarios = useCallback(async () => {
    setCarregandoTipos(true);
    const anoLetivo = dataVisita.get('year');
    const resposta =
      await ServicoCalendarios.obterTiposCalendarioPorAnoLetivoModalidade(
        anoLetivo,
        listaModalidades?.map(item => item?.valor)?.toString()
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoTipos(false));

    if (resposta?.data?.length) {
      const listaCaledariosAtivos = resposta.data
        .filter(t => !!t.situacao)
        .filter(calendario => calendario.anoLetivo === anoLetivo);

      setListaCalendario(listaCaledariosAtivos);
      if (listaCaledariosAtivos?.length === 1) {
        setTipoCalendarioSelecionado(String(listaCaledariosAtivos[0].id));
      }
    } else {
      setTipoCalendarioSelecionado();
      setListaCalendario([]);
    }
  }, [dataVisita, listaModalidades]);

  useEffect(() => {
    if (dataVisita && ueId && listaModalidades?.length) {
      obterTiposCalendarios();
    } else {
      setListaCalendario([]);
      setTipoCalendarioSelecionado();
    }
  }, [dataVisita, ueId, listaModalidades, obterTiposCalendarios]);

  const obterListaEventos = async (tipoCalendarioId, id, lista) => {
    setCarregandoEventos(true);
    const ueSelecionada = lista?.find(ue => ue?.id === Number(ueId));

    if (ueSelecionada?.codigo) {
      const retorno = await ServicoRegistroItineranciaAEE.obterEventos(
        tipoCalendarioId,
        id,
        ueSelecionada?.codigo
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoEventos(false));

      if (retorno?.data?.length) {
        setListaEvento(retorno.data);
        return;
      }
      setEventoId();
      setListaEvento([]);
    }
  };

  useEffect(() => {
    if (tipoCalendarioSelecionado) {
      obterListaEventos(tipoCalendarioSelecionado, itineranciaId, listaUes);
    } else {
      setEventoId();
      setListaEvento([]);
    }
  }, [tipoCalendarioSelecionado, listaUes, itineranciaId]);

  const selecionaEvento = evento => {
    if (evento) {
      setEventoId(evento);
    } else {
      setEventoId(evento);
    }
    setModoEdicao(true);
  };

  const onChangeDre = valorNovo => {
    if (valorNovo) {
      setDreId(valorNovo);
    } else {
      setDreId();
    }

    setListaUes([]);
    setUeId();
    setListaModalidades([]);

    setModoEdicao(true);
  };

  const onChangeUe = valorNovo => {
    setListaModalidades([]);

    if (dreId && valorNovo) {
      setUeId(valorNovo);
    } else {
      setUeId();
    }
    setModoEdicao(true);
  };

  const obterDres = useCallback(async () => {
    if (dataVisita && moment.isMoment(dataVisita)) {
      const anoLetivo = dataVisita.get('year');
      const anoLetivoAtual = new Date().getFullYear();
      const consideraHistorico = anoLetivo !== anoLetivoAtual;

      setCarregandoDres(true);
      const resposta = await AbrangenciaServico.buscarDres(
        `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoDres(false));

      if (resposta?.data?.length) {
        setListaDres(resposta.data);

        if (resposta.data.length === 1) {
          setDreId(String(resposta.data[0]?.id));
        }
        return;
      }
    }
    setListaDres([]);
    setDreId();
  }, [dataVisita]);

  useEffect(() => {
    if (dataVisita) {
      obterDres();
    } else {
      setListaDres([]);
      setDreId();
    }
  }, [dataVisita, obterDres]);

  const obterUes = useCallback(async () => {
    if (dataVisita && moment.isMoment(dataVisita) && dreId) {
      const anoLetivo = dataVisita.get('year');
      const anoLetivoAtual = new Date().getFullYear();
      const consideraHistorico = anoLetivo !== anoLetivoAtual;

      const dreSelecionada = listaDres?.find(
        item => item?.id === Number(dreId)
      );
      setCarregandoUes(true);
      const resposta = await AbrangenciaServico.buscarUes(
        dreSelecionada?.codigo,
        `v1/abrangencias/${consideraHistorico}/dres/${dreSelecionada?.codigo}/ues?anoLetivo=${anoLetivo}`,
        true
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoUes(false));
      if (resposta?.data?.length) {
        if (resposta.data.length === 1) {
          setUeId(String(resposta.data[0]?.id));
        }

        setListaUes(resposta.data);
        return;
      }
    }

    setUeId();
    setListaUes([]);
    setListaModalidades([]);
  }, [dreId, dataVisita, listaDres]);

  useEffect(() => {
    if (dataVisita && dreId && listaDres?.length) {
      obterUes();
      return;
    }
    if (modoEdicao) {
      setUeId();
      setListaUes([]);
      setListaModalidades([]);
    }
  }, [dataVisita, dreId, listaDres, modoEdicao, obterUes]);

  const obterUeSelecionada = (id, lista) => {
    const ueSelecionada = lista?.find(item => item?.id === Number(id));
    if (ueSelecionada) {
      return ueSelecionada;
    }

    return null;
  };

  const obterModalidades = useCallback(async () => {
    const anoLetivo = dataVisita.get('year');
    const ueSelecionada = obterUeSelecionada(ueId, listaUes);

    const resultado = await ServicoFiltroRelatorio.obterModalidades(
      ueSelecionada?.codigo,
      anoLetivo,
      false
    ).catch(e => erros(e));

    if (resultado?.data?.length) {
      setListaModalidades(resultado.data);
    } else {
      setListaModalidades([]);
    }
  }, [ueId, dataVisita, listaUes]);

  useEffect(() => {
    if (ueId && dataVisita && listaUes?.length) {
      obterModalidades();
    } else {
      setListaModalidades([]);
    }
  }, [ueId, dataVisita, listaUes, obterModalidades]);

  const ueIdEhInfantil = (id, lista) => {
    const ueSelecionada = obterUeSelecionada(id, lista);
    if (ueSelecionada && ueSelecionada?.ehInfantil) {
      return true;
    }

    return false;
  };

  const onRemoveFile = async arquivo => {
    const codigoArquivo = arquivo?.xhr;
    if (arquivo.arquivoId) {
      const questaoUpload = questoesItinerancia.find(
        q => q?.tipoQuestao === tipoQuestaoDto.Upload
      );

      const index = questoesItinerancia.indexOf(questaoUpload);

      let listaDeArquivos = questaoUpload?.resposta?.length
        ? questaoUpload.resposta
        : [];

      if (listaDeArquivos?.length) {
        const novoMap = [...listaDeArquivos];
        const indice = novoMap.findIndex(
          item => arquivo.arquivoId === item.arquivoId
        );
        if (indice !== -1) {
          const listaExcluidos = [...arquivosExcluido];
          listaExcluidos.push(arquivo.arquivoId);
          setArquivosExcluido(listaExcluidos);

          novoMap.splice(indice, 1);
          listaDeArquivos = [...novoMap];
          sucesso(`Arquivo ${arquivo.name} removido com sucesso`);
          questaoUpload.resposta = [...listaDeArquivos];
          questoesItinerancia[index] = questaoUpload;
        }
      }
    } else {
      const resposta = await ServicoRegistroItineranciaAEE.removerArquivo(
        codigoArquivo
      ).catch(e => erros(e));
      if (resposta?.status === 200) {
        sucesso(`Arquivo ${arquivo.name} removido com sucesso`);
      }
    }
    setModoEdicao(true);
  };

  return (
    <Loader loading={carregandoGeral}>
      <Cabecalho pagina="Registro de itinerância">
        <Row gutter={[8, 8]} type="flex">
          <Col>
            <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
          </Col>
          <Col>
            <Button
              id={SGP_BUTTON_CANCELAR}
              label="Cancelar"
              color={Colors.Roxo}
              border
              bold
              onClick={onClickCancelar}
              disabled={!modoEdicao}
            />
          </Col>
          <Col>
            <Button
              id={SGP_BUTTON_SALVAR}
              label={match?.params?.id ? 'Alterar' : 'Salvar'}
              color={Colors.Roxo}
              border
              bold
              onClick={() => onClickSalvar()}
              disabled={somenteConsulta || (match?.params?.id && !modoEdicao)}
            />
          </Col>
        </Row>
      </Cabecalho>

      <Card>
        <div className="col-12">
          {itineranciaId && (
            <div className="row mb-4">
              <div className="col-sm-12 d-flex justify-content-between align-items-center">
                <div className="pr-4">
                  <Loader loading={imprimindo} ignorarTip>
                    <BotaoCustomizado
                      border
                      id="btn-imprimir-relatorio-itinerancia"
                      className="btn-imprimir"
                      icon="print"
                      color={Colors.Azul}
                      width="38px"
                      onClick={() => gerarRelatorio()}
                    />
                  </Loader>
                </div>
                <div>
                  {itineranciaAlteracao?.statusWorkflow && (
                    <MarcadorSituacao corFundo={Colors.Azul}>
                      {itineranciaAlteracao?.statusWorkflow}
                    </MarcadorSituacao>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="row mt-2">
            <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-2">
              <CampoData
                name="dataVisita"
                formatoData="DD/MM/YYYY"
                valor={dataVisita}
                label="Data da visita"
                placeholder="Selecione a data"
                onChange={onChangeDataVisita}
                desabilitarData={desabilitarDataVisita}
                desabilitado={desabilitarCamposPorPermissao()}
                allowClear={false}
              />
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-2">
              <Loader loading={carregandoDres} tip="">
                <SelectComponent
                  id="dre"
                  label="Diretoria Regional de Educação (DRE)"
                  lista={listaDres}
                  valueOption="id"
                  valueText="nome"
                  disabled={
                    listaDres?.length === 1 || desabilitarCamposPorPermissao()
                  }
                  onChange={onChangeDre}
                  valueSelect={dreId}
                  placeholder="Diretoria Regional De Educação (DRE)"
                  showSearch
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-2">
              <Loader loading={carregandoUes} tip="">
                <SelectComponent
                  id="ue"
                  label="Unidade Escolar (UE)"
                  lista={listaUes}
                  valueOption="id"
                  valueText="nome"
                  disabled={
                    listaUes?.length === 1 || desabilitarCamposPorPermissao()
                  }
                  onChange={onChangeUe}
                  valueSelect={ueId}
                  placeholder="Unidade Escolar (UE)"
                  showSearch
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-2">
              <Loader loading={carregandoTipos} tip="">
                <SelectComponent
                  id="tipo-calendario"
                  label="Tipo de Calendário"
                  lista={listaCalendario}
                  valueOption="id"
                  valueText="nome"
                  onChange={onChangeTipoCalendario}
                  valueSelect={tipoCalendarioSelecionado}
                  placeholder="Selecione um calendário"
                  showSearch
                  searchValue={false}
                  disabled={desabilitarCamposPorPermissao()}
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-2">
              <Loader loading={carregandoEventos} tip="">
                <SelectComponent
                  id="evento"
                  label="Evento"
                  lista={listaEvento}
                  valueOption="id"
                  valueText="nome"
                  onChange={selecionaEvento}
                  valueSelect={eventoId}
                  placeholder="Selecione um evento"
                  showSearch
                  searchValue={false}
                  disabled={desabilitarCamposPorPermissao()}
                />
              </Loader>
            </div>
          </div>
          <div className="row mb-4">
            <TabelaLinhaRemovivel
              bordered
              ordenacao
              dataIndex="nome"
              labelTabela="Objetivos da itinerância"
              tituloTabela="Objetivos selecionados"
              labelBotao="Novo objetivo"
              desabilitadoIncluir={
                !permissoesTela?.podeIncluir ||
                somenteConsulta ||
                permissaoStatus
              }
              desabilitadoExcluir={
                !permissoesTela?.podeAlterar ||
                somenteConsulta ||
                permissaoStatus
              }
              pagination={false}
              dadosTabela={objetivosSelecionados}
              removerUsuario={text => removerObjetivoSelecionado(text)}
              botaoAdicionar={() => setModalVisivelObjetivos(true)}
            />
          </div>
          {ueId && (
            <div className="row mb-4">
              <div className="col-12 font-weight-bold mb-2">
                <span style={{ color: Base.CinzaMako }}>
                  {ueIdEhInfantil(ueId, listaUes) ? 'Crianças' : 'Estudantes'}
                </span>
              </div>
              <div className="col-12">
                <Button
                  id={shortid.generate()}
                  label={`Adicionar ${
                    ueIdEhInfantil(ueId, listaUes)
                      ? 'nova criança'
                      : 'novo estudante'
                  }`}
                  color={Colors.Azul}
                  border
                  className="mr-2"
                  onClick={() => setModalVisivelAlunos(true)}
                  icon="user-plus"
                  disabled={desabilitarCamposPorPermissao()}
                />
              </div>
            </div>
          )}
          {alunosSelecionados?.length ? (
            <>
              <div className="row mb-4">
                <div className="col-12">
                  <PainelCollapse accordion onChange={() => {}}>
                    {alunosSelecionados
                      .slice(paginaAtual * 10 - 10, paginaAtual * 10)
                      .map(aluno => (
                        <PainelCollapse.Painel
                          key={`painel-${aluno.alunoCodigo}`}
                          accordion
                          espacoPadrao
                          corBorda={Base.AzulBordaCollapse}
                          temBorda
                          header={aluno.nomeAlunoComTurmaModalidade}
                        >
                          <CollapseAluno
                            key={aluno.alunoCodigo}
                            aluno={aluno}
                            removerAlunos={() =>
                              removerAlunos(aluno.alunoCodigo)
                            }
                            setModoEdicaoItinerancia={setModoEdicao}
                            desabilitar={desabilitarCamposPorPermissao()}
                          />
                        </PainelCollapse.Painel>
                      ))}
                  </PainelCollapse>
                </div>
              </div>

              <div className="row">
                <div className="col-12 d-flex justify-content-center mt-4">
                  <Paginacao
                    numeroRegistros={alunosSelecionados.length}
                    pageSize={10}
                    onChangePaginacao={e => setPaginaAtual(e)}
                  />
                </div>
              </div>
            </>
          ) : carregandoQuestoes || carregandoGeral ? (
            <Loader loading tip="Carregando questões" />
          ) : (
            questoesItinerancia?.map(questao => {
              return questao?.tipoQuestao !== tipoQuestaoDto.Upload ? (
                <div className="row mb-4" key={questao.questaoId}>
                  <div className="col-12">
                    <JoditEditor
                      label={questao.descricao}
                      value={questao.resposta}
                      name={NOME_CAMPO_QUESTAO + questao.questaoId}
                      id={`editor-questao-${questao.questaoId}`}
                      onChange={e => setQuestao(e, questao)}
                      desabilitar={desabilitarCamposPorPermissao()}
                    />
                  </div>
                </div>
              ) : (
                <></>
              );
            })
          )}
          <div className="row mb-4">
            <div className="col-3">
              <CampoData
                name="dataRetornoVerificacao"
                formatoData="DD/MM/YYYY"
                valor={dataRetornoVerificacao}
                label="Data para retorno/verificação"
                placeholder="Selecione a data"
                onChange={mudarDataRetorno}
                desabilitarData={desabilitarDataRetorno}
                desabilitado={desabilitarCamposPorPermissao()}
              />
            </div>
          </div>
          {questoesItinerancia?.map((questao, index) => {
            return questao?.tipoQuestao === tipoQuestaoDto.Upload ? (
              <div className="row mb-4">
                <div className="col-md-12">
                  <UploadArquivos
                    id={SGP_UPLOAD_REGISTRO_ITINERANCIA}
                    desabilitarGeral={desabilitarCamposPorPermissao()}
                    onRemove={onRemoveFile}
                    urlUpload="v1/itinerancias/upload"
                    defaultFileList={
                      questao.resposta?.length ? questao.resposta : []
                    }
                    label={questao?.descricao}
                    onChangeListaArquivos={lista => {
                      if (lista?.length) {
                        const listaComCodigo = lista.filter(l => !!l.xhr);
                        if (lista.length === listaComCodigo.length) {
                          questoesItinerancia[index].resposta = lista;
                          setQuestoesItinerancia([...questoesItinerancia]);
                          setModoEdicao(true);
                        }
                      }
                    }}
                  />
                </div>
              </div>
            ) : (
              <></>
            );
          })}
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
      </Card>

      {modalVisivelObjetivos && (
        <ModalObjetivos
          modalVisivel={modalVisivelObjetivos}
          setModalVisivel={setModalVisivelObjetivos}
          objetivosSelecionados={objetivosSelecionados}
          setObjetivosSelecionados={setObjetivosSelecionados}
          listaObjetivos={objetivosBase}
          setModoEdicaoItinerancia={setModoEdicao}
        />
      )}
      {modalVisivelAlunos && (
        <ModalAlunos
          modalVisivel={modalVisivelAlunos}
          setModalVisivel={setModalVisivelAlunos}
          alunosSelecionados={alunosSelecionados}
          setAlunosSelecionados={selecionarAlunos}
          codigoUe={obterUeSelecionada(ueId, listaUes)?.codigo}
          questoes={questoesAlunos}
          setModoEdicaoItinerancia={setModoEdicao}
          dataVisita={dataVisita}
        />
      )}
      {modalErrosVisivel && (
        <ModalErrosItinerancia
          modalVisivel={modalErrosVisivel}
          setModalVisivel={setModalErrosVisivel}
          erros={errosValidacao}
        />
      )}
    </Loader>
  );
};

RegistroItineranciaAEECadastro.propTypes = {
  match: PropTypes.oneOfType([PropTypes.object]),
};

RegistroItineranciaAEECadastro.defaultProps = {
  match: {},
};

export default RegistroItineranciaAEECadastro;
