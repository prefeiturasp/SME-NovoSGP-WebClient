import { Tabs } from 'antd';
import { Form, Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Colors, Grid, Loader, ModalConteudoHtml } from '~/componentes';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import Avaliacao from '~/componentes-sgp/avaliacao/avaliacao';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Alert from '~/componentes/alert';
import Button from '~/componentes/button';
import Card from '~/componentes/card';
import JoditEditor from '~/componentes/jodit-editor/joditEditor';
import Row from '~/componentes/row';
import SelectComponent from '~/componentes/select';
import { ContainerTabsCard } from '~/componentes/tabs/tabs.css';
import { URL_HOME } from '~/constantes/url';
import notasConceitos from '~/dtos/notasConceitos';
import RotasDto from '~/dtos/rotasDto';
import {
  setExpandirLinha,
  setModoEdicaoGeral,
  setModoEdicaoGeralNotaFinal,
} from '~/redux/modulos/notasConceitos/actions';
import { confirmar, erros, sucesso } from '~/servicos/alertas';
import api from '~/servicos/api';
import history from '~/servicos/history';
import ServicoPeriodoFechamento from '~/servicos/Paginas/Calendario/ServicoPeriodoFechamento';
import ServicoNotaConceito from '~/servicos/Paginas/DiarioClasse/ServicoNotaConceito';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';
import ServicoNotas from '~/servicos/ServicoNotas';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import BotoesAcoessNotasConceitos from './botoesAcoes';
import { Container, ContainerAuditoria } from './notas.css';

const { TabPane } = Tabs;

// eslint-disable-next-line react/prop-types
const Notas = ({ match }) => {
  const usuario = useSelector(store => store.usuario);
  const dispatch = useDispatch();

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );
  const { ehProfessorCj } = usuario;

  const permissoesTela = usuario.permissoes[RotasDto.FREQUENCIA_PLANO_AULA];

  const [tituloNotasConceitos, setTituloNotasConceitos] = useState('');
  const [listaDisciplinas, setListaDisciplinas] = useState([]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState(undefined);
  const [desabilitarDisciplina, setDesabilitarDisciplina] = useState(false);
  const [notaTipo, setNotaTipo] = useState();
  const [carregandoListaBimestres, setCarregandoListaBimestres] = useState(
    false
  );
  const [auditoriaInfo, setAuditoriaInfo] = useState({
    auditoriaAlterado: '',
    auditoriaInserido: '',
    auditoriaBimestreInserido: '',
    auditoriaBimestreAlterado: '',
  });
  const [bimestreCorrente, setBimestreCorrente] = useState(0);
  const [primeiroBimestre, setPrimeiroBimestre] = useState([]);
  const [segundoBimestre, setSegundoBimestre] = useState([]);
  const [terceiroBimestre, setTerceiroBimestre] = useState([]);
  const [quartoBimestre, setQuartoBimestre] = useState([]);

  const [desabilitarCampos, setDesabilitarCampos] = useState(false);
  const [ehRegencia, setEhRegencia] = useState(false);
  const [percentualMinimoAprovados, setPercentualMinimoAprovados] = useState(0);
  const [exibeModalJustificativa, setExibeModalJustificativa] = useState(false);
  const [refForm, setRefForm] = useState({});
  const [carregandoGeral, setCarregandoGeral] = useState(false);
  const [dadosBimestreAtual, setDadosBimestreAtual] = useState();

  const [validacoes] = useState(
    Yup.object({
      descricao: Yup.string()
        .required('Justificativa obrigatória')
        .max(1000, 'limite de 1000 caracteres'),
    })
  );

  // Usado somente no Modal de Justificativa!
  const [proximoBimestre, setProximoBimestre] = useState(bimestreCorrente);
  const [clicouNoBotaoSalvar, setClicouNoBotaoSalvar] = useState(false);
  const [clicouNoBotaoVoltar, setClicouNoBotaoVoltar] = useState(false);

  const [podeLancaNota, setPodeLancaNota] = useState(true);

  const [showMsgPeriodoFechamento, setShowMsgPeriodoFechamento] = useState(
    false
  );

  const valoresIniciais = { descricao: '' };

  const validaSeDesabilitaCampos = useCallback(
    async bimestre => {
      const naoSetarSomenteConsultaNoStore = ehTurmaInfantil(
        modalidadesFiltroPrincipal,
        usuario.turmaSelecionada
      );
      const somenteConsulta = verificaSomenteConsulta(
        permissoesTela,
        naoSetarSomenteConsultaNoStore
      );
      const desabilitar =
        somenteConsulta ||
        !permissoesTela.podeAlterar ||
        !permissoesTela.podeIncluir;

      let dentroDoPeriodo = true;
      if (!desabilitar && bimestre && usuario.turmaSelecionada.turma) {
        const retorno = await ServicoPeriodoFechamento.verificarSePodeAlterarNoPeriodo(
          usuario.turmaSelecionada.turma,
          bimestre
        ).catch(e => {
          erros(e);
        });
        if (retorno?.status === 200) {
          dentroDoPeriodo = retorno.data;
        }
      }

      if (desabilitar) {
        setDesabilitarCampos(desabilitar);
        setShowMsgPeriodoFechamento(false);
        return;
      }

      if (!dentroDoPeriodo) {
        setDesabilitarCampos(true);
        setShowMsgPeriodoFechamento(true);
      } else {
        setDesabilitarCampos(desabilitar);
        setShowMsgPeriodoFechamento(false);
      }
    },
    [usuario.turmaSelecionada, permissoesTela, modalidadesFiltroPrincipal]
  );

  const resetarBimestres = () => {
    primeiroBimestre.alunos = [];
    primeiroBimestre.avaliacoes = [];
    setPrimeiroBimestre(primeiroBimestre);
    segundoBimestre.alunos = [];
    segundoBimestre.avaliacoes = [];
    setSegundoBimestre(segundoBimestre);
    terceiroBimestre.alunos = [];
    terceiroBimestre.avaliacoes = [];
    setTerceiroBimestre(terceiroBimestre);
    quartoBimestre.alunos = [];
    quartoBimestre.avaliacoes = [];
    setQuartoBimestre(quartoBimestre);
  };

  const resetarTela = useCallback(() => {
    setDisciplinaSelecionada(undefined);
    setBimestreCorrente(0);
    setNotaTipo(0);
    setAuditoriaInfo({
      auditoriaAlterado: '',
      auditoriaInserido: '',
      auditoriaBimestreInserido: '',
      auditoriaBimestreAlterado: '',
    });
    resetarBimestres();
    dispatch(setModoEdicaoGeral(false));
    dispatch(setModoEdicaoGeralNotaFinal(false));
    dispatch(setExpandirLinha([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    resetarTela();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario.turmaSelecionada]);

  const obterListaConceitos = async periodoFim => {
    const lista = await api
      .get(`v1/avaliacoes/notas/conceitos?data=${periodoFim}`)
      .catch(e => erros(e));

    if (lista && lista.data && lista.data.length) {
      const novaLista = lista.data.map(item => {
        item.id = String(item.id);
        return item;
      });
      return novaLista;
    }
    return [];
  };

  const obterPeriodos = useCallback(async () => {
    const params = {
      anoLetivo: usuario.turmaSelecionada.anoLetivo,
      modalidade: usuario.turmaSelecionada.modalidade,
      semestre: usuario.turmaSelecionada.periodo,
    };
    const dados = await ServicoNotas.obterPeriodos({ params }).catch(e =>
      erros(e)
    );
    const resultado = dados ? dados.data : [];
    if (
      resultado.percentualAlunosInsuficientes &&
      resultado.percentualAlunosInsuficientes > 0
    ) {
      setPercentualMinimoAprovados(resultado.percentualAlunosInsuficientes);
    }
    if (resultado.length) {
      resultado.forEach(periodo => {
        const bimestreAtualizado = { ...periodo };
        bimestreAtualizado.numero = periodo.bimestre;
        bimestreAtualizado.descricao = `${periodo.bimestre}º bimestre`;

        switch (Number(periodo.bimestre)) {
          case 1:
            setPrimeiroBimestre(bimestreAtualizado);
            break;
          case 2:
            setSegundoBimestre(bimestreAtualizado);
            break;
          case 3:
            setTerceiroBimestre(bimestreAtualizado);
            break;
          case 4:
            setQuartoBimestre(bimestreAtualizado);
            break;

          default:
            break;
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario.turmaSelecionada]);

  const obterBimestres = useCallback(
    async (disciplinaId, dadosBimestre) => {
      const params = {
        anoLetivo: usuario.turmaSelecionada.anoLetivo,
        bimestre: dadosBimestre.numero,
        disciplinaCodigo: disciplinaId,
        modalidade: usuario.turmaSelecionada.modalidade,
        turmaCodigo: usuario.turmaSelecionada.turma,
        turmaId: usuario.turmaSelecionada.id,
        turmaHistorico: usuario.turmaSelecionada.consideraHistorico,
        semestre: usuario.turmaSelecionada.periodo,
        periodoInicioTicks: dadosBimestre.periodoInicioTicks,
        periodoFimTicks: dadosBimestre.periodoFimTicks,
        periodoEscolarId: dadosBimestre.periodoEscolarId,
      };
      const dados = await ServicoNotas.obterNotas({ params }).catch(e =>
        erros(e)
      );

      const resultado = dados ? dados.data : [];
      if (
        resultado.percentualAlunosInsuficientes &&
        resultado.percentualAlunosInsuficientes > 0
      ) {
        setPercentualMinimoAprovados(resultado.percentualAlunosInsuficientes);
      }
      return resultado;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      usuario.turmaSelecionada.anoLetivo,
      usuario.turmaSelecionada.modalidade,
      usuario.turmaSelecionada.turma,
    ]
  );

  const validaPeriodoFechamento = dados => {
    const temDados =
      dados.bimestres &&
      dados.bimestres.find(
        bimestre => bimestre.alunos && bimestre.alunos.length
      );
    if (temDados) {
      validaSeDesabilitaCampos(dados.bimestreAtual);
    } else {
      setShowMsgPeriodoFechamento(false);
    }
  };

  // Só é chamado quando: Seta, remove ou troca a disciplina e quando cancelar a edição;
  const obterDadosBimestres = useCallback(
    async (disciplinaId, dadosBimestre) => {
      if (disciplinaId > 0) {
        setCarregandoListaBimestres(true);
        const dados = await obterBimestres(disciplinaId, dadosBimestre);
        validaPeriodoFechamento(dados);
        if (dados && dados.bimestres && dados.bimestres.length) {
          dados.bimestres.forEach(async item => {
            item.alunos.forEach(aluno => {
              aluno.notasAvaliacoes.forEach(nota => {
                const notaOriginal = nota.notaConceito;
                /* eslint-disable */
                nota.notaOriginal = notaOriginal;
                /* eslint-enable */
              });
              aluno.notasBimestre.forEach(nota => {
                const notaOriginal = nota.notaConceito;
                /* eslint-disable */
                nota.notaOriginal = notaOriginal;
                /* eslint-enable */
              });
            });

            setNotaTipo(dados.notaTipo);

            let listaTiposConceitos = [];
            if (
              Number(notasConceitos.Conceitos) === Number(dados.notaTipo) ||
              !(Number(notasConceitos.Notas) === notaTipo)
            ) {
              listaTiposConceitos = await obterListaConceitos(item.periodoFim);
            }

            const bimestreAtualizado = {
              fechamentoTurmaId: item.fechamentoTurmaId,
              descricao: item.descricao,
              numero: item.numero,
              alunos: [...item.alunos],
              avaliacoes: [...item.avaliacoes],
              periodoInicio: item.periodoInicio,
              periodoFim: item.periodoFim,
              mediaAprovacaoBimestre: dados.mediaAprovacaoBimestre,
              listaTiposConceitos,
              observacoes: item.observacoes,
              podeLancarNotaFinal: item.podeLancarNotaFinal,
              periodoInicioTicks: dadosBimestre.periodoInicioTicks,
              periodoFimTicks: dadosBimestre.periodoFimTicks,
              periodoEscolarId: dadosBimestre.periodoEscolarId,
            };

            switch (Number(item.numero)) {
              case 1:
                setPrimeiroBimestre(bimestreAtualizado);
                break;
              case 2:
                setSegundoBimestre(bimestreAtualizado);
                break;
              case 3:
                setTerceiroBimestre(bimestreAtualizado);
                break;
              case 4:
                setQuartoBimestre(bimestreAtualizado);
                break;

              default:
                break;
            }
          });

          setAuditoriaInfo({
            auditoriaAlterado: dados.auditoriaAlterado,
            auditoriaInserido: dados.auditoriaInserido,
            auditoriaBimestreAlterado: dados.auditoriaBimestreAlterado,
            auditoriaBimestreInserido: dados.auditoriaBimestreInserido,
          });
        } else {
          setAuditoriaInfo({
            auditoriaAlterado: '',
            auditoriaInserido: '',
            auditoriaBimestreAlterado: '',
            auditoriaBimestreInserido: '',
          });
        }
        setTimeout(() => {
          setCarregandoListaBimestres(false);
        }, 700);
      } else {
        resetarTela();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [obterBimestres, resetarTela]
  );

  const obterDisciplinas = useCallback(async () => {
    setCarregandoGeral(true);
    const url = `v1/professores/turmas/${usuario.turmaSelecionada.turma}/disciplinas`;
    const disciplinas = await api.get(url).then(res => {
      if (res.data) setDesabilitarDisciplina(false);

      return res;
    });
    setCarregandoGeral(false);

    setListaDisciplinas(disciplinas.data);
    if (disciplinas.data && disciplinas.data.length === 1) {
      const disciplina = disciplinas.data[0];
      setPodeLancaNota(disciplina.lancaNota);
      setEhRegencia(disciplina.regencia);
      setDisciplinaSelecionada(String(disciplina.codigoComponenteCurricular));
      setDesabilitarDisciplina(true);
    }
    if (match?.params?.disciplinaId && match?.params?.bimestre) {
      setDisciplinaSelecionada(String(match?.params.disciplinaId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario.turmaSelecionada.turma]);

  const obterTituloTela = useCallback(async () => {
    if (usuario && usuario.turmaSelecionada && usuario.turmaSelecionada.turma) {
      const tipoNotaTurmaSelecionada = await ServicoNotaConceito.obterTipoNota(
        usuario.turmaSelecionada.turma,
        usuario.turmaSelecionada.anoLetivo,
        usuario.turmaSelecionada.consideraHistorico
      );
      if (
        Number(notasConceitos.Conceitos) ===
        Number(tipoNotaTurmaSelecionada.data)
      ) {
        return 'Lançamento de Conceitos';
      }
      return 'Lançamento de Notas';
    }
    return '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario.turmaSelecionada.anoLetivo, usuario.turmaSelecionada.turma]);

  useEffect(() => {
    obterTituloTela().then(titulo => {
      setTituloNotasConceitos(titulo);
    });
  }, [obterTituloTela]);

  useEffect(() => {
    if (
      !ehTurmaInfantil(modalidadesFiltroPrincipal, usuario.turmaSelecionada) &&
      usuario?.turmaSelecionada?.turma
    ) {
      obterDisciplinas();
      dispatch(setModoEdicaoGeral(false));
      dispatch(setModoEdicaoGeralNotaFinal(false));
      dispatch(setExpandirLinha([]));
    } else {
      setListaDisciplinas([]);
      setDesabilitarDisciplina(false);
      resetarTela();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obterDisciplinas, usuario.turmaSelecionada.turma]);

  useEffect(() => {
    if (usuario?.turmaSelecionada?.turma && disciplinaSelecionada) {
      obterPeriodos();
    } else {
      resetarTela();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disciplinaSelecionada, usuario.turmaSelecionada]);

  const pergutarParaSalvar = () => {
    return confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );
  };

  const irParaHome = () => {
    history.push(URL_HOME);
  };

  const montarBimestreParaSalvar = bimestreParaMontar => {
    const valorParaSalvar = [];
    bimestreParaMontar.alunos.forEach(aluno => {
      aluno.notasAvaliacoes.forEach(nota => {
        if (nota.modoEdicao) {
          const avaliacaoNota = bimestreParaMontar.avaliacoes.find(
            a => a.id === nota.atividadeAvaliativaId
          );
          if (
            window.moment(avaliacaoNota.data) > window.moment(new Date()) &&
            !nota.notaConceito
          )
            return;
          valorParaSalvar.push({
            alunoId: aluno.id,
            atividadeAvaliativaId: nota.atividadeAvaliativaId,
            conceito:
              notaTipo === notasConceitos.Conceitos ? nota.notaConceito : null,
            nota: notaTipo === notasConceitos.Notas ? nota.notaConceito : null,
          });
        }
      });
    });
    return valorParaSalvar;
  };

  const salvarNotasAvaliacoes = async (
    resolve,
    reject,
    salvarNotasAvaliacao
  ) => {
    const valoresBimestresSalvar = [];

    if (!salvarNotasAvaliacao) {
      return;
    }

    if (primeiroBimestre.modoEdicao) {
      valoresBimestresSalvar.push(
        ...montarBimestreParaSalvar(primeiroBimestre)
      );
    }
    if (segundoBimestre.modoEdicao) {
      valoresBimestresSalvar.push(...montarBimestreParaSalvar(segundoBimestre));
    }
    if (terceiroBimestre.modoEdicao) {
      valoresBimestresSalvar.push(
        ...montarBimestreParaSalvar(terceiroBimestre)
      );
    }
    if (quartoBimestre.modoEdicao) {
      valoresBimestresSalvar.push(...montarBimestreParaSalvar(quartoBimestre));
    }
    setCarregandoGeral(true);
    try {
      const paramsQueryString = {
        anoLetivo: usuario.turmaSelecionada.anoLetivo,
        bimestre: dadosBimestreAtual.numero,
        disciplinaCodigo: disciplinaSelecionada,
        modalidade: usuario.turmaSelecionada.modalidade,
        turmaCodigo: usuario.turmaSelecionada.turma,
        turmaId: usuario.turmaSelecionada.id,
        turmaHistorico: usuario.turmaSelecionada.consideraHistorico,
        semestre: usuario.turmaSelecionada.periodo,
        periodoInicioTicks: dadosBimestreAtual.periodoInicioTicks,
        periodoFimTicks: dadosBimestreAtual.periodoFimTicks,
        periodoEscolarId: dadosBimestreAtual.periodoEscolarId,
      };

      if (valoresBimestresSalvar.length > 0) {
        const salvouNotas = await api.post(
          `v1/avaliacoes/notas`,
          {
            turmaId: usuario.turmaSelecionada.turma,
            disciplinaId: disciplinaSelecionada,
            notasConceitos: valoresBimestresSalvar,
          },
          { params: paramsQueryString }
        );
        setCarregandoGeral(false);
        if (salvouNotas && salvouNotas.status === 200) {
          sucesso('Suas informações foram salvas com sucesso.');
          dispatch(setModoEdicaoGeral(false));
          dispatch(setModoEdicaoGeralNotaFinal(false));
          dispatch(setExpandirLinha([]));
          setAuditoriaInfo({
            auditoriaAlterado: salvouNotas?.data?.auditoriaAlterado,
            auditoriaInserido: salvouNotas?.data?.auditoriaInserido,
            auditoriaBimestreAlterado:
              salvouNotas?.data?.auditoriaBimestreAlterado,
            auditoriaBimestreInserido:
              salvouNotas?.data?.auditoriaBimestreInserido,
          });
          resolve(true);
          return;
        }
      }
      resolve(false);
      return;
    } catch (e) {
      erros(e);
      reject(e);
      setCarregandoGeral(false);
    }
  };

  const pergutarParaSalvarNotaFinal = bimestresSemAvaliacaoBimestral => {
    if (
      bimestresSemAvaliacaoBimestral &&
      bimestresSemAvaliacaoBimestral.length
    ) {
      return confirmar(
        'Atenção',
        bimestresSemAvaliacaoBimestral,
        'Deseja continuar mesmo assim com o fechamento do(s) bimestre(s)?'
      );
    }

    return new Promise(resolve => resolve(true));
  };

  const montarBimestreParaSalvarNotaFinal = bimestreParaMontar => {
    const notaConceitoAlunos = [];
    bimestreParaMontar.alunos.forEach(aluno => {
      aluno.notasBimestre.forEach(notaFinal => {
        if (notaFinal.modoEdicao) {
          notaConceitoAlunos.push({
            codigoAluno: aluno.id,
            disciplinaId: notaFinal.disciplinaId || disciplinaSelecionada,
            nota:
              notaTipo === notasConceitos.Notas ? notaFinal.notaConceito : null,
            conceitoId:
              notaTipo === notasConceitos.Conceitos
                ? notaFinal.notaConceito
                : null,
          });
        }
      });
    });
    // TODO REVISAR NA EDICAO E NA ADD E INSERT DE CONCEITOS!!!!
    return {
      id: bimestreParaMontar.fechamentoTurmaId,
      turmaId: usuario.turmaSelecionada.turma,
      bimestre: bimestreParaMontar.numero,
      disciplinaId: disciplinaSelecionada,
      notaConceitoAlunos,
      justificativa: dadosBimestreAtual.justificativa,
    };
  };

  const montaQtdAvaliacaoBimestralPendent = (
    bimestre,
    bimestresSemAvaliacaoBimestral
  ) => {
    if (bimestre.observacoes && bimestre.observacoes.length) {
      bimestre.observacoes.forEach(item => {
        bimestresSemAvaliacaoBimestral.push(item);
      });
    }
  };

  const salvarNotasFinais = async (
    resolve,
    reject,
    salvarNotaFinal,
    salvarNotasAvaliacao
  ) => {
    const valoresBimestresSalvar = [];
    const bimestresSemAvaliacaoBimestral = [];

    if (!salvarNotaFinal) {
      return;
    }

    let dadosBimestreAtualizar = null;

    if (primeiroBimestre.modoEdicao) {
      montaQtdAvaliacaoBimestralPendent(
        primeiroBimestre,
        bimestresSemAvaliacaoBimestral
      );
      valoresBimestresSalvar.push(
        montarBimestreParaSalvarNotaFinal(primeiroBimestre)
      );
      dadosBimestreAtualizar = primeiroBimestre;
    }
    if (segundoBimestre.modoEdicao) {
      montaQtdAvaliacaoBimestralPendent(
        segundoBimestre,
        bimestresSemAvaliacaoBimestral
      );
      valoresBimestresSalvar.push(
        montarBimestreParaSalvarNotaFinal(segundoBimestre)
      );
      dadosBimestreAtualizar = segundoBimestre;
    }
    if (terceiroBimestre.modoEdicao) {
      montaQtdAvaliacaoBimestralPendent(
        terceiroBimestre,
        bimestresSemAvaliacaoBimestral
      );
      valoresBimestresSalvar.push(
        montarBimestreParaSalvarNotaFinal(terceiroBimestre)
      );
      dadosBimestreAtualizar = terceiroBimestre;
    }
    if (quartoBimestre.modoEdicao) {
      montaQtdAvaliacaoBimestralPendent(
        quartoBimestre,
        bimestresSemAvaliacaoBimestral
      );
      valoresBimestresSalvar.push(
        montarBimestreParaSalvarNotaFinal(quartoBimestre)
      );
      dadosBimestreAtualizar = quartoBimestre;
    }

    try {
      const salvarAvaliacaoFinal = await pergutarParaSalvarNotaFinal(
        bimestresSemAvaliacaoBimestral
      );
      if (salvarAvaliacaoFinal) {
        const valoresBimestresSalvarComNotas = valoresBimestresSalvar.filter(
          x => x.notaConceitoAlunos.length > 0
        );

        if (valoresBimestresSalvarComNotas.length < 1) {
          resolve(false);
          return;
        }

        setCarregandoGeral(true);
        await api
          .post(`/v1/fechamentos/turmas`, valoresBimestresSalvarComNotas)
          .then(salvouNotas => {
            setCarregandoGeral(false);
            if (salvouNotas && salvouNotas.status === 200) {
              const auditoriaBimestre = salvouNotas?.data?.[0];
              if (!salvarNotasAvaliacao) {
                sucesso(auditoriaBimestre.mensagemConsistencia);
              }
              dispatch(setModoEdicaoGeral(false));
              dispatch(setModoEdicaoGeralNotaFinal(false));
              dispatch(setExpandirLinha([]));

              if (auditoriaBimestre) {
                const auditoriaBimestreInserido = `Nota final do bimestre inserida por ${
                  auditoriaBimestre?.criadoPor
                }(${auditoriaBimestre?.criadoRF}) em ${window.moment
                  .utc(auditoriaBimestre?.criadoEm)
                  .format('DD/MM/YYYY')}, às ${window.moment
                  .utc(auditoriaBimestre?.criadoEm)
                  .format('HH:mm')}.`;
                let auditoriaBimestreAlterado = '';
                if (auditoriaBimestre?.alteradoPor) {
                  auditoriaBimestreAlterado = `Nota final do bimestre alterada por ${
                    auditoriaBimestre?.alteradoPor
                  }(${auditoriaBimestre?.alteradoRF}) em ${window.moment
                    .utc(auditoriaBimestre?.alteradoEm)
                    .format('DD/MM/YYYY')}, às ${window.moment
                    .utc(auditoriaBimestre?.alteradoEm)
                    .format('HH:mm')}.`;
                }
                setAuditoriaInfo(current => {
                  return {
                    ...current,
                    auditoriaBimestreInserido,
                    auditoriaBimestreAlterado,
                  };
                });
              }
              const fechamentoTurmaId = salvouNotas?.data?.[0]?.id;

              if (
                !dadosBimestreAtualizar?.fechamentoTurmaId &&
                fechamentoTurmaId
              ) {
                dadosBimestreAtualizar.fechamentoTurmaId = fechamentoTurmaId;

                switch (dadosBimestreAtualizar?.numero) {
                  case 1:
                    setPrimeiroBimestre({ ...dadosBimestreAtualizar });
                    break;
                  case 2:
                    setSegundoBimestre({ ...dadosBimestreAtualizar });
                    break;
                  case 3:
                    setTerceiroBimestre({ ...dadosBimestreAtualizar });
                    break;
                  case 4:
                    setQuartoBimestre({ ...dadosBimestreAtualizar });
                    break;
                  default:
                    break;
                }
              }
              return resolve(true);
            }
            return resolve(false);
          })
          .catch(e => {
            erros(e);
            reject(e);
            setCarregandoGeral(false);
          });
        return;
      }
      resolve(false);
      return;
    } catch (er) {
      erros(er);
      reject(er);
    }
  };

  const onSalvarNotas = (salvarNotaFinal, salvarNotasAvaliacao) => {
    return new Promise((resolve, reject) =>
      Promise.all([
        salvarNotasFinais(
          resolve,
          reject,
          salvarNotaFinal,
          salvarNotasAvaliacao
        ),
        salvarNotasAvaliacoes(resolve, reject, salvarNotasAvaliacao),
      ])
    );
  };

  const validaSeEhRegencia = disciplinaId => {
    if (disciplinaId) {
      const disciplina = listaDisciplinas.find(
        item => String(item.codigoComponenteCurricular) === String(disciplinaId)
      );
      if (disciplina) {
        setEhRegencia(!!disciplina.regencia);
      } else {
        setEhRegencia(false);
      }
    }
  };

  const onChangeDisciplinas = async disciplinaId => {
    let lancaNota = true;
    if (disciplinaId) {
      const componenteSelecionado = listaDisciplinas.find(
        item => String(item.codigoComponenteCurricular) === String(disciplinaId)
      );
      if (componenteSelecionado) {
        lancaNota = componenteSelecionado?.lancaNota;
      }
    }
    setPodeLancaNota(lancaNota);

    validaSeEhRegencia(disciplinaId);

    dispatch(setModoEdicaoGeral(false));
    dispatch(setModoEdicaoGeralNotaFinal(false));
    dispatch(setExpandirLinha([]));

    if (ServicoNotaConceito.estaEmModoEdicaoGeral()) {
      const confirmaSalvar = await pergutarParaSalvar();
      if (confirmaSalvar) {
        await onSalvarNotas(false);
        setDisciplinaSelecionada(disciplinaId);
      } else {
        setDisciplinaSelecionada(disciplinaId);
        resetarTela();
      }
    } else {
      resetarTela();
      setDisciplinaSelecionada(disciplinaId);
    }
  };

  const verificaPorcentagemAprovados = () => {
    let bimestreAtual = dadosBimestreAtual;
    let bimestre = {};
    switch (Number(dadosBimestreAtual.bimestre)) {
      case 1:
        bimestre = primeiroBimestre;
        break;
      case 2:
        bimestre = segundoBimestre;
        break;
      case 3:
        bimestre = terceiroBimestre;
        break;
      case 4:
        bimestre = quartoBimestre;
        break;
      default:
        break;
    }

    bimestreAtual = {
      ...dadosBimestreAtual,
      mediaAprovacaoBimestre: bimestre.mediaAprovacaoBimestre,
      modoEdicao: bimestre.modoEdicao,
      listaTiposConceitos: bimestre.listaTiposConceitos
        ? bimestre.listaTiposConceitos
        : [],
    };
    bimestreAtual.alunos = bimestre.alunos;

    setDadosBimestreAtual(bimestreAtual);
    return ServicoNotas.temQuantidadeMinimaAprovada(
      bimestreAtual,
      percentualMinimoAprovados,
      notaTipo
    );
  };

  const bimestreEmModoEdicao = numeroBimestre => {
    switch (Number(numeroBimestre)) {
      case 1:
        return primeiroBimestre.modoEdicao;
      case 2:
        return segundoBimestre.modoEdicao;
      case 3:
        return terceiroBimestre.modoEdicao;
      case 4:
        return quartoBimestre.modoEdicao;
      default:
        return false;
    }
  };

  const getDadosBimestreAtual = (numeroBimestre = bimestreCorrente) => {
    switch (Number(numeroBimestre)) {
      case 1:
        return primeiroBimestre;
      case 2:
        return segundoBimestre;
      case 3:
        return terceiroBimestre;
      case 4:
        return quartoBimestre;
      default:
        return {};
    }
  };

  const confirmarTrocaTab = async numeroBimestre => {
    const dadosBimestre = getDadosBimestreAtual(numeroBimestre);
    if (disciplinaSelecionada) {
      resetarBimestres();
      setNotaTipo(0);
      setAuditoriaInfo({
        auditoriaAlterado: '',
        auditoriaInserido: '',
        auditoriaBimestreInserido: '',
        auditoriaBimestreAlterado: '',
      });
      dispatch(setModoEdicaoGeral(false));
      dispatch(setModoEdicaoGeralNotaFinal(false));
      dispatch(setExpandirLinha([]));

      setBimestreCorrente(numeroBimestre);

      setCarregandoListaBimestres(true);
      const dados = await obterBimestres(disciplinaSelecionada, dadosBimestre);
      validaPeriodoFechamento(dados);
      if (dados && dados.bimestres && dados.bimestres.length) {
        const bimestrePesquisado = dados.bimestres.find(
          item => Number(item.numero) === Number(numeroBimestre)
        );

        bimestrePesquisado.alunos.forEach(aluno => {
          aluno.notasAvaliacoes.forEach(nota => {
            const notaOriginal = nota.notaConceito;
            /* eslint-disable */
            nota.notaOriginal = notaOriginal;
            /* eslint-enable */
          });
          aluno.notasBimestre.forEach(nota => {
            const notaOriginal = nota.notaConceito;
            /* eslint-disable */
            nota.notaOriginal = notaOriginal;
            /* eslint-enable */
          });
        });

        let listaTiposConceitos = [];
        if (Number(notasConceitos.Conceitos) === Number(dados.notaTipo)) {
          listaTiposConceitos = await obterListaConceitos(
            bimestrePesquisado.periodoFim
          );
        }

        setNotaTipo(dados.notaTipo);
        setNotaTipo(dados.notaTipo);

        const bimestreAtualizado = {
          fechamentoTurmaId: bimestrePesquisado.fechamentoTurmaId,
          descricao: bimestrePesquisado.descricao,
          numero: bimestrePesquisado.numero,
          alunos: [...bimestrePesquisado.alunos],
          avaliacoes: [...bimestrePesquisado.avaliacoes],
          periodoInicio: bimestrePesquisado.periodoInicio,
          periodoFim: bimestrePesquisado.periodoFim,
          mediaAprovacaoBimestre: dados.mediaAprovacaoBimestre,
          listaTiposConceitos,
          observacoes: bimestrePesquisado.observacoes,
          podeLancarNotaFinal: bimestrePesquisado.podeLancarNotaFinal,
          justificativa: bimestrePesquisado.justificativa,
          periodoInicioTicks: dadosBimestre.periodoInicioTicks,
          periodoFimTicks: dadosBimestre.periodoFimTicks,
          periodoEscolarId: dadosBimestre.periodoEscolarId,
        };

        switch (Number(numeroBimestre)) {
          case 1:
            setPrimeiroBimestre(bimestreAtualizado);
            break;
          case 2:
            setSegundoBimestre(bimestreAtualizado);
            break;
          case 3:
            setTerceiroBimestre(bimestreAtualizado);
            break;
          case 4:
            setQuartoBimestre(bimestreAtualizado);
            break;
          default:
            break;
        }

        setAuditoriaInfo({
          auditoriaAlterado: dados.auditoriaAlterado,
          auditoriaInserido: dados.auditoriaInserido,
          auditoriaBimestreAlterado: dados.auditoriaBimestreAlterado,
          auditoriaBimestreInserido: dados.auditoriaBimestreInserido,
        });
      } else {
        setAuditoriaInfo({
          auditoriaAlterado: '',
          auditoriaInserido: '',
          auditoriaBimestreAlterado: '',
          auditoriaBimestreInserido: '',
        });
      }
      setCarregandoListaBimestres(false);
    }
  };

  const aposValidarJustificativaAntesDeSalvar = (
    numeroBimestre,
    clicouSalvar,
    clicouVoltar
  ) => {
    if (!clicouSalvar && !clicouVoltar) {
      confirmarTrocaTab(numeroBimestre);
    }
    if (clicouVoltar) {
      irParaHome();
    }
  };

  const validarJustificativaAntesDeSalvar = async (
    numeroBimestre,
    clicouSalvar = false,
    clicouVoltar = false
  ) => {
    setClicouNoBotaoSalvar(clicouSalvar);
    setClicouNoBotaoVoltar(clicouVoltar);
    const estaEmModoEdicaoGeral = ServicoNotaConceito.estaEmModoEdicaoGeral();
    const estaEmModoEdicaoGeralNotaFinal = ServicoNotaConceito.estaEmModoEdicaoGeralNotaFinal();
    const modoEdicao = bimestreEmModoEdicao(numeroBimestre);

    if (estaEmModoEdicaoGeralNotaFinal || estaEmModoEdicaoGeral) {
      let confirmado = true;

      if (!clicouSalvar) {
        confirmado = await pergutarParaSalvar();
      }

      if (confirmado) {
        const temPorcentagemAceitavel = verificaPorcentagemAprovados();
        if (
          estaEmModoEdicaoGeralNotaFinal &&
          !temPorcentagemAceitavel &&
          modoEdicao
        ) {
          setProximoBimestre(numeroBimestre);
          setExibeModalJustificativa(true);
        } else {
          dadosBimestreAtual.justificativa = temPorcentagemAceitavel
            ? null
            : dadosBimestreAtual.justificativa;
          await onSalvarNotas(
            estaEmModoEdicaoGeralNotaFinal,
            estaEmModoEdicaoGeral
          );
          aposValidarJustificativaAntesDeSalvar(
            numeroBimestre,
            clicouSalvar,
            clicouVoltar
          );
        }
      } else {
        aposValidarJustificativaAntesDeSalvar(
          numeroBimestre,
          clicouSalvar,
          clicouVoltar
        );
      }
    } else {
      aposValidarJustificativaAntesDeSalvar(
        numeroBimestre,
        clicouSalvar,
        clicouVoltar
      );
    }
  };

  const onClickVoltar = async () => {
    if (
      ServicoNotaConceito.estaEmModoEdicaoGeral() ||
      ServicoNotaConceito.estaEmModoEdicaoGeralNotaFinal()
    ) {
      validarJustificativaAntesDeSalvar(bimestreCorrente, false, true);
    } else {
      irParaHome();
    }
  };

  const onClickSalvar = () => {
    validarJustificativaAntesDeSalvar(bimestreCorrente, true, false);
  };

  const onChangeTab = async numeroBimestre => {
    if (disciplinaSelecionada) {
      validarJustificativaAntesDeSalvar(numeroBimestre, false, false);
    }

    switch (Number(numeroBimestre)) {
      case 1:
        setDadosBimestreAtual(primeiroBimestre);
        break;
      case 2:
        setDadosBimestreAtual(segundoBimestre);
        break;
      case 3:
        setDadosBimestreAtual(terceiroBimestre);
        break;
      case 4:
        setDadosBimestreAtual(quartoBimestre);
        break;
      default:
        break;
    }
  };

  const onClickCancelar = async cancelar => {
    if (cancelar) {
      obterDadosBimestres(disciplinaSelecionada, dadosBimestreAtual);
      dispatch(setModoEdicaoGeral(false));
      dispatch(setModoEdicaoGeralNotaFinal(false));
      dispatch(setExpandirLinha([]));
    }
  };

  const onChangeOrdenacao = bimestreOrdenado => {
    dispatch(setExpandirLinha([]));
    const bimestreAtualizado = {
      fechamentoTurmaId: bimestreOrdenado.fechamentoTurmaId,
      descricao: bimestreOrdenado.descricao,
      numero: bimestreOrdenado.numero,
      alunos: [...bimestreOrdenado.alunos],
      avaliacoes: [...bimestreOrdenado.avaliacoes],
      periodoInicio: bimestreOrdenado.periodoInicio,
      periodoFim: bimestreOrdenado.periodoFim,
      mediaAprovacaoBimestre: bimestreOrdenado.mediaAprovacaoBimestre,
      listaTiposConceitos: bimestreOrdenado.listaTiposConceitos,
      observacoes: bimestreOrdenado.observacoes,
      podeLancarNotaFinal: bimestreOrdenado.podeLancarNotaFinal,
      periodoInicioTicks: bimestreOrdenado.periodoInicioTicks,
      periodoFimTicks: bimestreOrdenado.periodoFimTicks,
      periodoEscolarId: bimestreOrdenado.periodoEscolarId,
    };
    switch (Number(bimestreOrdenado.numero)) {
      case 1:
        setPrimeiroBimestre(bimestreAtualizado);
        break;
      case 2:
        setSegundoBimestre(bimestreAtualizado);
        break;
      case 3:
        setTerceiroBimestre(bimestreAtualizado);
        break;
      case 4:
        setQuartoBimestre(bimestreAtualizado);
        break;
      default:
        break;
    }
  };

  const onChangeJustificativa = valor => {
    dadosBimestreAtual.justificativa = valor;
  };

  const validaAntesDoSubmit = form => {
    const arrayCampos = Object.keys(valoresIniciais);
    arrayCampos.forEach(campo => {
      form.setFieldTouched(campo, true, true);
    });
    form.validateForm().then(() => {
      if (form.isValid || Object.keys(form.errors).length === 0) {
        form.handleSubmit(e => e);
      }
    });
  };

  const onConfirmarJustificativa = async () => {
    setExibeModalJustificativa(false);
    await onSalvarNotas(
      clicouNoBotaoSalvar,
      ServicoNotaConceito.estaEmModoEdicaoGeralNotaFinal(),
      ServicoNotaConceito.estaEmModoEdicaoGeral()
    );

    refForm.resetForm();
    refForm.setFieldValue('descricao', '');

    aposValidarJustificativaAntesDeSalvar(
      proximoBimestre,
      clicouNoBotaoSalvar,
      clicouNoBotaoVoltar
    );
  };

  return (
    <Container>
      <ModalConteudoHtml
        key="inserirJutificativa"
        visivel={exibeModalJustificativa}
        onClose={() => {}}
        titulo="Inserir justificativa"
        esconderBotaoPrincipal
        esconderBotaoSecundario
        closable={false}
        fecharAoClicarFora={false}
        fecharAoClicarEsc={false}
        width="650px"
      >
        <Formik
          enableReinitialize
          initialValues={valoresIniciais}
          validationSchema={validacoes}
          onSubmit={onConfirmarJustificativa}
          ref={refF => setRefForm(refF)}
          validateOnChange
          validateOnBlur
        >
          {form => (
            <Form>
              <div className="col-md-12">
                <Alert
                  alerta={{
                    tipo: 'warning',
                    id: 'justificativa-porcentagem',
                    mensagem: `A maioria dos estudantes está com ${
                      notasConceitos.Notas === Number(notaTipo)
                        ? 'notas'
                        : 'conceitos'
                    } abaixo do
                               mínimo considerado para aprovação, por isso é necessário que você insira uma justificativa.`,
                    estiloTitulo: { fontSize: '18px' },
                  }}
                  className="mb-2"
                />
              </div>
              <div className="col-md-12">
                <fieldset className="mt-3">
                  <JoditEditor
                    form={form}
                    value={form.values.descricao}
                    onChange={onChangeJustificativa}
                    name="descricao"
                    permiteInserirArquivo={false}
                    labelRequired
                  />
                </fieldset>
              </div>
              <div className="d-flex justify-content-end">
                <Button
                  key="btn-cancelar-justificativa"
                  label="Cancelar"
                  color={Colors.Roxo}
                  bold
                  border
                  className="mr-3 mt-2 padding-btn-confirmacao"
                  onClick={() => {
                    onChangeJustificativa('');
                    form.resetForm();
                    setExibeModalJustificativa(false);
                  }}
                />
                <Button
                  key="btn-sim-confirmacao-justificativa"
                  label="Confirmar"
                  color={Colors.Roxo}
                  bold
                  border
                  className="mr-3 mt-2 padding-btn-confirmacao"
                  onClick={() => validaAntesDoSubmit(form)}
                />
              </div>
            </Form>
          )}
        </Formik>
      </ModalConteudoHtml>
      {!usuario.turmaSelecionada.turma &&
      !ehTurmaInfantil(modalidadesFiltroPrincipal, usuario.turmaSelecionada) ? (
        <Row className="mb-0 pb-0">
          <Grid cols={12} className="mb-0 pb-0">
            <Container>
              <Alert
                alerta={{
                  tipo: 'warning',
                  id: 'AlertaPrincipal',
                  mensagem: 'Você precisa escolher uma turma.',
                  estiloTitulo: { fontSize: '18px' },
                }}
              />
            </Container>
          </Grid>
        </Row>
      ) : null}
      {!podeLancaNota ? (
        <Row className="mb-0 pb-0">
          <Grid cols={12} className="mb-0 pb-0">
            <Container>
              <Alert
                alerta={{
                  tipo: 'warning',
                  id: 'pode-lanca-nota',
                  mensagem:
                    'Este componente curricular não permite o lançamento de nota',
                  estiloTitulo: { fontSize: '18px' },
                }}
                className="mb-2"
              />
            </Container>
          </Grid>
        </Row>
      ) : null}
      {showMsgPeriodoFechamento &&
      !ehTurmaInfantil(modalidadesFiltroPrincipal, usuario.turmaSelecionada) ? (
        <Row className="mb-0 pb-0">
          <Grid cols={12} className="mb-0 pb-0">
            <Container>
              <Alert
                alerta={{
                  tipo: 'warning',
                  id: 'alerta-perido-fechamento',
                  mensagem:
                    'Apenas é possível consultar este registro pois o período não está em aberto.',
                  estiloTitulo: { fontSize: '18px' },
                }}
              />
            </Container>
          </Grid>
        </Row>
      ) : null}
      <AlertaModalidadeInfantil />
      <Loader
        loading={
          !!(
            (carregandoListaBimestres || carregandoGeral) &&
            usuario.turmaSelecionada.turma
          )
        }
      >
        <Cabecalho pagina={tituloNotasConceitos}>
          <BotoesAcoessNotasConceitos
            onClickVoltar={onClickVoltar}
            onClickCancelar={onClickCancelar}
            onClickSalvar={onClickSalvar}
            desabilitarBotao={desabilitarCampos}
          />
        </Cabecalho>
        <Card>
          <div className="col-md-12">
            <div className="row">
              <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                <SelectComponent
                  id="disciplina"
                  name="disciplinaId"
                  lista={listaDisciplinas}
                  valueOption="codigoComponenteCurricular"
                  valueText="nome"
                  valueSelect={disciplinaSelecionada}
                  onChange={onChangeDisciplinas}
                  placeholder="Selecione um componente curricular"
                  disabled={
                    desabilitarDisciplina || !usuario.turmaSelecionada.turma
                  }
                  allowClear={false}
                />
              </div>
            </div>

            {disciplinaSelecionada && podeLancaNota ? (
              <>
                <div className="row">
                  <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-2">
                    <ContainerTabsCard
                      type="card"
                      onChange={onChangeTab}
                      activeKey={String(bimestreCorrente)}
                    >
                      {primeiroBimestre.numero ? (
                        <TabPane
                          tab={primeiroBimestre.descricao}
                          key={primeiroBimestre.numero}
                        >
                          <Avaliacao
                            dados={primeiroBimestre}
                            notaTipo={notaTipo}
                            onChangeOrdenacao={onChangeOrdenacao}
                            desabilitarCampos={desabilitarCampos}
                            ehProfessorCj={ehProfessorCj}
                            ehRegencia={ehRegencia}
                            disciplinaSelecionada={disciplinaSelecionada}
                            exibirTootipStatusGsa={
                              !!primeiroBimestre?.alunos?.find?.(a =>
                                a?.notasAvaliacoes?.find?.(n => !!n?.statusGsa)
                              )
                            }
                            exibirStatusAlunoAusente={
                              !!primeiroBimestre?.alunos?.find?.(a =>
                                a?.notasAvaliacoes?.find?.(n => !!n?.ausente)
                              )
                            }
                          />
                        </TabPane>
                      ) : (
                        ''
                      )}
                      {segundoBimestre.numero ? (
                        <TabPane
                          tab={segundoBimestre.descricao}
                          key={segundoBimestre.numero}
                        >
                          <Avaliacao
                            dados={segundoBimestre}
                            notaTipo={notaTipo}
                            onChangeOrdenacao={onChangeOrdenacao}
                            desabilitarCampos={desabilitarCampos}
                            ehProfessorCj={ehProfessorCj}
                            ehRegencia={ehRegencia}
                            exibirTootipStatusGsa={
                              !!segundoBimestre?.alunos?.find?.(a =>
                                a?.notasAvaliacoes?.find?.(n => !!n?.statusGsa)
                              )
                            }
                            exibirStatusAlunoAusente={
                              !!segundoBimestre?.alunos?.find?.(a =>
                                a?.notasAvaliacoes?.find?.(n => !!n?.ausente)
                              )
                            }
                          />
                        </TabPane>
                      ) : (
                        ''
                      )}
                      {terceiroBimestre.numero ? (
                        <TabPane
                          tab={terceiroBimestre.descricao}
                          key={terceiroBimestre.numero}
                        >
                          <Avaliacao
                            dados={terceiroBimestre}
                            notaTipo={notaTipo}
                            onChangeOrdenacao={onChangeOrdenacao}
                            desabilitarCampos={desabilitarCampos}
                            ehProfessorCj={ehProfessorCj}
                            ehRegencia={ehRegencia}
                            exibirTootipStatusGsa={
                              !!terceiroBimestre?.alunos?.find?.(a =>
                                a?.notasAvaliacoes?.find?.(n => !!n?.statusGsa)
                              )
                            }
                            exibirStatusAlunoAusente={
                              !!terceiroBimestre?.alunos?.find?.(a =>
                                a?.notasAvaliacoes?.find?.(n => !!n?.ausente)
                              )
                            }
                          />
                        </TabPane>
                      ) : (
                        ''
                      )}
                      {quartoBimestre.numero ? (
                        <TabPane
                          tab={quartoBimestre.descricao}
                          key={quartoBimestre.numero}
                        >
                          <Avaliacao
                            dados={quartoBimestre}
                            notaTipo={notaTipo}
                            onChangeOrdenacao={onChangeOrdenacao}
                            desabilitarCampos={desabilitarCampos}
                            ehProfessorCj={ehProfessorCj}
                            ehRegencia={ehRegencia}
                            exibirTootipStatusGsa={
                              !!quartoBimestre?.alunos?.find?.(a =>
                                a?.notasAvaliacoes?.find?.(n => !!n?.statusGsa)
                              )
                            }
                            exibirStatusAlunoAusente={
                              !!quartoBimestre?.alunos?.find?.(a =>
                                a?.notasAvaliacoes?.find?.(n => !!n?.ausente)
                              )
                            }
                          />
                        </TabPane>
                      ) : (
                        ''
                      )}
                    </ContainerTabsCard>
                  </div>
                </div>
                {!!bimestreCorrente && (
                  <>
                    <div className="row mt-2 mb-2 mt-2">
                      <div className="col-md-12">
                        <ContainerAuditoria style={{ float: 'left' }}>
                          <span>
                            <p>{auditoriaInfo.auditoriaInserido || ''}</p>
                            <p>{auditoriaInfo.auditoriaAlterado || ''}</p>
                          </span>
                        </ContainerAuditoria>
                      </div>
                    </div>
                    <div className="row mt-2 mb-2 mt-2">
                      <div className="col-md-12">
                        <ContainerAuditoria style={{ float: 'left' }}>
                          <span>
                            <p>
                              {auditoriaInfo.auditoriaBimestreInserido || ''}
                            </p>
                            <p>
                              {auditoriaInfo.auditoriaBimestreAlterado || ''}
                            </p>
                          </span>
                        </ContainerAuditoria>
                      </div>
                    </div>
                  </>
                )}
                {!bimestreCorrente && (
                  <div className="text-center">Selecione um bimestre</div>
                )}
              </>
            ) : (
              ''
            )}
          </div>
        </Card>
      </Loader>
    </Container>
  );
};

export default Notas;
