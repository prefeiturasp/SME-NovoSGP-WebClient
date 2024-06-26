import React, { useCallback, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import { useSelector } from 'react-redux';
import shortid from 'shortid';
import * as Yup from 'yup';
import { Col, Row } from 'antd';
import { CampoTexto, Colors, Label, Loader } from '~/componentes';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Alert from '~/componentes/alert';
import Auditoria from '~/componentes/auditoria';
import Button from '~/componentes/button';
import Card from '~/componentes/card';
import JoditEditor from '~/componentes/jodit-editor/joditEditor';
import SelectComponent from '~/componentes/select';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import { ROUTES } from '@/core/enum/routes';
import { confirmar, erro, erros, sucesso } from '~/servicos/alertas';
import { setBreadcrumbManual } from '~/servicos/breadcrumb-services';
import ServicoCompensacaoAusencia from '~/servicos/Paginas/DiarioClasse/ServicoCompensacaoAusencia';
import ServicoDisciplina from '~/servicos/Paginas/ServicoDisciplina';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';
import CopiarCompensacao from './copiarCompensacao';
import ListaAlunos from './listasAlunos/listaAlunos';
import ListaAlunosAusenciasCompensadas from './listasAlunos/listaAlunosAusenciasCompensadas';
import {
  Badge,
  BotaoListaAlunos,
  ColunaBotaoListaAlunos,
  ListaCopiarCompensacoes,
} from './styles';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import {
  SGP_BUTTON_ADICIONAR_ESTUDANTE_TABELA_AUSENCIA_COMPENSADA,
  SGP_BUTTON_ALTERAR_CADASTRAR,
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_COPIAR_COMPENSACAO,
  SGP_BUTTON_REMOVER_ESTUDANTE_TABELA_AUSENCIA_COMPENSADA,
} from '~/constantes/ids/button';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import {
  SGP_SELECT_BIMESTRE,
  SGP_SELECT_COMPONENTE_CURRICULAR,
} from '~/constantes/ids/select';
import { SGP_JODIT_EDITOR_COMPENSACAO_AUSENCIA_DETALHAMENTO_ATIVIDADE } from '~/constantes/ids/jodit-editor';
import {
  SGP_INPUT_NOME_ATIVIDADE,
  SGP_INPUT_NOME_ESTUDANTE,
} from '~/constantes/ids/input';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import _ from 'lodash';

const CompensacaoAusenciaForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paramsRoute = useParams();

  const idCompensacaoAusencia = paramsRoute?.id || 0;

  const usuario = useSelector(store => store.usuario);

  const permissoesTela = usuario.permissoes[ROUTES.COMPENSACAO_AUSENCIA];
  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const [desabilitarCampos, setDesabilitarCampos] = useState(false);

  const { turmaSelecionada } = usuario;

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );
  const ehEjaOuCelp =
    Number(turmaSelecionada.modalidade) === ModalidadeEnum.EJA ||
    Number(turmaSelecionada.modalidade) === ModalidadeEnum.CELP;

  const [refForm, setRefForm] = useState({});
  const [auditoria, setAuditoria] = useState([]);
  const [idsAlunos, setIdsAlunos] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [temRegencia, setTemRegencia] = useState(false);
  const [novoRegistro, setNovoRegistro] = useState(true);
  const [listaDisciplinas, setListaDisciplinas] = useState([]);
  const [exibirAuditoria, setExibirAuditoria] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(false);
  const [carregandoGeral, setCarregandoGeral] = useState(false);
  const [alunosAusenciaTurma, setAlunosAusenciaTurma] = useState([]);
  const [carregouInformacoes, setCarregouInformacoes] = useState(false);
  const [carregandoDisciplinas, setCarregandoDisciplinas] = useState(false);
  const [desabilitarDisciplina, setDesabilitarDisciplina] = useState(false);
  const [bimestreSugeridoCopia, setBimestreSugeridoCopia] = useState(null);
  const [selecaoAlunoSelecionado, setSelecaoAlunoSelecionado] = useState('');
  const [listaDisciplinasRegencia, setListaDisciplinasRegencia] = useState([]);
  const [alunosAusenciaCompensada, setAlunosAusenciaCompensada] = useState([]);
  const [exibirCopiarCompensacao, setExibirCopiarCompensacao] = useState(false);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState(undefined);
  const [foraDoPeriodo, setForaDoPeriodo] = useState(false);
  const [turmaSelecionadaFiltroPrincipal, setTurmaSelecionadaFiltroPrincipal] =
    useState(undefined);
  const [idsAlunosAusenciaCompensadas, setIdsAlunosAusenciaCompensadas] =
    useState([]);
  const [alunosAusenciaTurmaOriginal, setAlunosAusenciaTurmaOriginal] =
    useState([]);
  const [carregandoListaAlunosFrequencia, setCarregandoListaAlunosFrequencia] =
    useState(false);

  const [compensacoesParaCopiar, setCompensacoesParaCopiar] = useState({
    compensacaoOrigemId: 0,
    turmasIds: [],
    bimestre: 0,
  });

  const formInicial = {
    disciplinaId: '',
    bimestre: '',
    atividade: '',
    descricao: '',
  };

  const [valoresIniciais, setValoresIniciais] = useState(formInicial);
  const [limparCampoDescricao, setLimparCampoDescricao] = useState(false);

  const [validacoes] = useState(
    Yup.object({
      descricao: Yup.string().required('Descrição obrigatória'),
      disciplinaId: Yup.string().required('Disciplina obrigatória'),
      bimestre: Yup.string().required('Bimestre obrigatório'),
      atividade: Yup.string()
        .required('Atividade obrigatória')
        .max(250, 'Máximo 250 caracteres'),
    })
  );

  const [listaBimestres, setListaBimestres] = useState([]);

  useEffect(() => {
    let listaBi = [];
    if (ehEjaOuCelp) {
      listaBi = [
        { valor: 1, descricao: '1°' },
        { valor: 2, descricao: '2°' },
      ];
    } else {
      listaBi = [
        { valor: 1, descricao: '1°' },
        { valor: 2, descricao: '2°' },
        { valor: 3, descricao: '3°' },
        { valor: 4, descricao: '4°' },
      ];
    }

    setListaBimestres(listaBi);
  }, [turmaSelecionada.modalidade]);

  const ForaPerido = () => {
    return (
      <Alert
        alerta={{
          tipo: 'warning',
          id: 'alerta-perido-fechamento',
          mensagem:
            'Apenas é possível consultar este registro pois o período não está em aberto.',
          estiloTitulo: { fontSize: '18px' },
        }}
        className="mb-2"
      />
    );
  };

  const podeAlterarNoPeriodo = useCallback(
    async bimestre => {
      const podeAlterar =
        await ServicoCompensacaoAusencia.verificarSePodeAlterarNoPeriodo(
          turmaSelecionada.turma,
          bimestre
        ).catch(e => {
          erros(e);
        });
      if (podeAlterar && podeAlterar.data) {
        setDesabilitarCampos(false);
        return true;
      }
      setDesabilitarCampos(true);
      return false;
    },
    [turmaSelecionada.turma]
  );

  useEffect(() => {
    if (!novoRegistro) {
      setBreadcrumbManual(
        location.pathname,
        'Alterar Compensação de Ausência',
        ROUTES.COMPENSACAO_AUSENCIA
      );
    }
  }, [location, novoRegistro]);

  useEffect(() => {
    const naoSetarSomenteConsultaNoStore = ehTurmaInfantil(
      modalidadesFiltroPrincipal,
      turmaSelecionada
    );
    setSomenteConsulta(
      verificaSomenteConsulta(permissoesTela, naoSetarSomenteConsultaNoStore)
    );
  }, [turmaSelecionada, permissoesTela, modalidadesFiltroPrincipal]);

  useEffect(() => {
    const desabilitar = novoRegistro
      ? somenteConsulta || !permissoesTela.podeIncluir
      : somenteConsulta || !permissoesTela.podeAlterar;
    setDesabilitarCampos(desabilitar);
  }, [somenteConsulta, novoRegistro, permissoesTela]);

  const removerAlunosDuplicadosEdicao = (alunosTurma, alunosEdicao) => {
    const novaLista = alunosTurma.filter(
      aluno => !alunosEdicao.find(al => String(al.id) === String(aluno.id))
    );
    return novaLista;
  };

  const obterAlunosComAusencia = useCallback(
    async (disciplinaId, bimestre, listaAlunosEdicao) => {
      setCarregandoListaAlunosFrequencia(true);
      const alunos = await ServicoCompensacaoAusencia.obterAlunosComAusencia(
        turmaSelecionada.turma,
        disciplinaId,
        bimestre
      ).catch(e => {
        setCarregandoListaAlunosFrequencia(false);
        setAlunosAusenciaTurma([]);
        setAlunosAusenciaTurmaOriginal([]);
        erros(e);
      });
      if (alunos && alunos.data && alunos.data.length) {
        if (listaAlunosEdicao && listaAlunosEdicao.length) {
          const listaSemDuplicados = removerAlunosDuplicadosEdicao(
            alunos.data,
            listaAlunosEdicao
          );
          setAlunosAusenciaTurma([...listaSemDuplicados]);
          setAlunosAusenciaTurmaOriginal([...listaSemDuplicados]);
        } else {
          setAlunosAusenciaTurma([...alunos.data]);
          setAlunosAusenciaTurmaOriginal([...alunos.data]);
        }
      } else {
        setAlunosAusenciaTurma([]);
        setAlunosAusenciaTurmaOriginal([]);
      }
      setCarregandoListaAlunosFrequencia(false);
    },
    [turmaSelecionada.turma]
  );

  // Usando somente quando o registro é edição, vem com disciploinas regencia para marcar o label!
  const selecionarDisciplinas = useCallback(
    (disciplinasRegenciaEdicao, disciplinasRegencia) => {
      const disciplinas = [...disciplinasRegencia];
      disciplinasRegenciaEdicao.forEach(item => {
        disciplinas.forEach((disci, indice) => {
          if (
            String(item.codigo) === String(disci.codigoComponenteCurricular)
          ) {
            disciplinas[indice].selecionada = !disciplinas[indice].selecionada;
            disciplinas[indice].codigo =
              disciplinas[indice].codigoComponenteCurricular;
          }
        });
      });
      setListaDisciplinasRegencia(disciplinas);
    },
    []
  );

  const obterDisciplinasRegencia = useCallback(
    async (
      codigoDisciplinaSelecionada,
      disciplinasLista,
      disciplinasRegenciaEdicao
    ) => {
      const disciplina = disciplinasLista.find(
        c =>
          String(c.codigoComponenteCurricular) ===
          String(codigoDisciplinaSelecionada)
      );
      if (disciplina && disciplina.regencia) {
        const disciplinasRegencia =
          await ServicoDisciplina.obterDisciplinasPlanejamento(
            codigoDisciplinaSelecionada,
            turmaSelecionada.turma,
            false,
            disciplina.regencia
          ).catch(e => erros(e));

        if (
          disciplinasRegencia &&
          disciplinasRegencia.data &&
          disciplinasRegencia.data.length
        ) {
          if (disciplinasRegenciaEdicao && disciplinasRegenciaEdicao.length) {
            selecionarDisciplinas(
              disciplinasRegenciaEdicao,
              disciplinasRegencia.data
            );
          } else {
            setListaDisciplinasRegencia(disciplinasRegencia.data);
          }
          setTemRegencia(true);
        }
      } else {
        setListaDisciplinasRegencia([]);
        setTemRegencia(false);
      }
    },
    [turmaSelecionada.turma, selecionarDisciplinas]
  );

  const consultaPorId = useCallback(
    async disciplinas => {
      if (idCompensacaoAusencia && disciplinas.length) {
        setCarregandoDados(true);
        const resultado = await ServicoCompensacaoAusencia.obterPorId(
          idCompensacaoAusencia
        ).catch(e => {
          erros(e);
          setCarregandoDados(false);
        });

        if (resultado && resultado.data) {
          obterDisciplinasRegencia(
            resultado.data.disciplinaId,
            disciplinas,
            resultado.data.disciplinasRegencia
          );

          const dentroPeriodo = await podeAlterarNoPeriodo(
            String(resultado.data.bimestre)
          );
          setForaDoPeriodo(!dentroPeriodo);

          const disciplinasRegencia =
            resultado.data.disciplinasRegencia &&
            resultado.data.disciplinasRegencia.length
              ? resultado.data.disciplinasRegencia
              : [];

          setValoresIniciais({
            disciplinaId: String(resultado.data.disciplinaId),
            bimestre: String(resultado.data.bimestre),
            atividade: resultado.data.atividade,
            descricao: resultado.data.descricao,
            disciplinasRegencia,
          });

          // Usado no Modal de copiar compensação!
          setBimestreSugeridoCopia(String(resultado.data.bimestre));
          if (resultado.data.alunos && resultado.data.alunos.length) {
            setAlunosAusenciaCompensada(resultado.data.alunos);
          }

          if (dentroPeriodo) {
            obterAlunosComAusencia(
              resultado.data.disciplinaId,
              resultado.data.bimestre,
              resultado.data.alunos
            );
          }

          setAuditoria({
            criadoPor: resultado.data.criadoPor,
            criadoRf: resultado.data.criadoRf,
            criadoEm: resultado.data.criadoEm,
            alteradoPor: resultado.data.alteradoPor,
            alteradoRf: resultado.data.alteradoRf,
            alteradoEm: resultado.data.alteradoEm,
          });
          setExibirAuditoria(true);
          setCarregouInformacoes(true);
          setCarregandoDados(false);
        } else {
          setCarregandoDados(false);
        }
        setNovoRegistro(false);
      }
    },
    [
      idCompensacaoAusencia,
      obterAlunosComAusencia,
      podeAlterarNoPeriodo,
      obterDisciplinasRegencia,
    ]
  );

  useEffect(() => {
    if (disciplinaSelecionada && listaDisciplinas && listaDisciplinas.length) {
      obterDisciplinasRegencia(String(disciplinaSelecionada), listaDisciplinas);
    }
  }, [disciplinaSelecionada, listaDisciplinas, obterDisciplinasRegencia]);

  const resetarForm = useCallback(() => {
    setListaDisciplinas([]);
    setDisciplinaSelecionada(undefined);
    if (refForm && refForm.resetForm) {
      refForm.resetForm();
    }
    setListaDisciplinasRegencia([]);
    setTemRegencia(false);
  }, [refForm]);

  const onChangeCampos = () => {
    if (
      !foraDoPeriodo &&
      !desabilitarCampos &&
      carregouInformacoes &&
      !modoEdicao
    ) {
      setModoEdicao(true);
    }
  };

  const selecionarDisciplina = indice => {
    const disciplinas = [...listaDisciplinasRegencia];
    disciplinas[indice].selecionada = !disciplinas[indice].selecionada;
    disciplinas[indice].codigo = disciplinas[indice].codigoComponenteCurricular;
    setListaDisciplinasRegencia(disciplinas);
    onChangeCampos();
  };

  const limparListas = () => {
    setAlunosAusenciaCompensada([]);
    setIdsAlunosAusenciaCompensadas([]);
    setIdsAlunos([]);
    setAlunosAusenciaTurma([]);
    setAlunosAusenciaTurmaOriginal([]);
  };

  const onChangeBimestre = async (bimestre, form, disciplina = 0) => {
    limparListas();
    const dentroPeriodo = await podeAlterarNoPeriodo(String(bimestre));
    setForaDoPeriodo(!dentroPeriodo);

    if (dentroPeriodo && (disciplina > 0 || form.values.disciplinaId)) {
      let podeEditar = false;
      const valorDisciplina =
        disciplina > 0 ? disciplina : form.values.disciplinaId;

      const exucutandoCalculoFrequencia =
        await ServicoCompensacaoAusencia.obterStatusCalculoFrequencia(
          turmaSelecionada.turma,
          valorDisciplina,
          bimestre
        ).catch(e => {
          erros(e);
        });
      if (
        exucutandoCalculoFrequencia &&
        exucutandoCalculoFrequencia.status === 200
      ) {
        const temProcessoEmExecucao =
          exucutandoCalculoFrequencia && exucutandoCalculoFrequencia.data;

        if (temProcessoEmExecucao) {
          podeEditar = false;
        } else {
          podeEditar = true;
        }

        if (podeEditar) {
          setAlunosAusenciaCompensada([]);
          setIdsAlunosAusenciaCompensadas([]);
          setIdsAlunos([]);
          if (bimestre && form && valorDisciplina) {
            obterAlunosComAusencia(valorDisciplina, bimestre);
          } else {
            setAlunosAusenciaTurma([]);
            setAlunosAusenciaTurmaOriginal([]);
          }
          onChangeCampos();
        } else {
          erro(
            'No momento não é possível realizar a edição pois tem cálculo(s) em processo, tente mais tarde!'
          );
        }
      }
    }
  };

  const onChangeDisciplina = async (codigoDisciplina, form) => {
    setDisciplinaSelecionada(codigoDisciplina);
    setAlunosAusenciaTurma([]);
    setAlunosAusenciaTurmaOriginal([]);
    setAlunosAusenciaCompensada([]);
    setIdsAlunosAusenciaCompensadas([]);
    setIdsAlunos([]);
    obterDisciplinasRegencia(codigoDisciplina, listaDisciplinas);
    onChangeCampos();

    if (form.values.bimestre > 0)
      await onChangeBimestre(form.values.bimestre, form, codigoDisciplina);
  };

  const obterDisciplinas = useCallback(async () => {
    setCarregandoDisciplinas(true);
    const disciplinas = await ServicoDisciplina.obterDisciplinasPorTurma(
      turmaSelecionada.turma
    );

    setAlunosAusenciaTurma([]);

    if (disciplinas.data && disciplinas.data.length) {
      const disciplinasPreparadas = disciplinas.data.map(disciplina => {
        return {
          ...disciplina,
          codigoSelecao: disciplina.codigoComponenteCurricular,
        };
      });

      setListaDisciplinas(disciplinasPreparadas);
    } else {
      setListaDisciplinas([]);
    }

    const valoresIniciaisForm = {
      disciplinaId: '',
      bimestre: '',
      atividade: '',
      descricao: '',
    };

    const registroNovo = !idCompensacaoAusencia;

    if (disciplinas.data && disciplinas.data.length === 1) {
      setDesabilitarDisciplina(true);

      const disciplina = disciplinas.data[0];

      if (registroNovo) {
        const disciplinaSelecionada = String(
          disciplina.codigoComponenteCurricular
        );

        valoresIniciaisForm.disciplinaId = disciplinaSelecionada;

        setDisciplinaSelecionada(String(disciplinaSelecionada));
      }
      setCarregandoDisciplinas(false);
    } else {
      setDesabilitarDisciplina(false);
    }

    if (registroNovo) {
      setCarregouInformacoes(true);
      setValoresIniciais(valoresIniciaisForm);
    } else {
      consultaPorId(
        disciplinas && disciplinas.data && disciplinas.data.length
          ? disciplinas.data
          : []
      );
    }
    setCarregandoDisciplinas(false);
  }, [idCompensacaoAusencia, turmaSelecionada.turma, consultaPorId]);

  useEffect(() => {
    if (!turmaSelecionada.turma) {
      navigate(ROUTES.COMPENSACAO_AUSENCIA);
    }

    if (
      turmaSelecionadaFiltroPrincipal &&
      turmaSelecionadaFiltroPrincipal !== turmaSelecionada.turma
    ) {
      resetarForm();
    }
    setTurmaSelecionadaFiltroPrincipal(turmaSelecionada.turma);
    if (
      turmaSelecionadaFiltroPrincipal &&
      turmaSelecionada.turma &&
      String(turmaSelecionadaFiltroPrincipal) ===
        String(turmaSelecionada.turma) &&
      listaDisciplinas.length < 1 &&
      !ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada)
    ) {
      obterDisciplinas(turmaSelecionada.turma);
    }
  }, [
    obterDisciplinas,
    resetarForm,
    turmaSelecionadaFiltroPrincipal,
    listaDisciplinas,
    turmaSelecionada,
    modalidadesFiltroPrincipal,
  ]);

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

  const onClickExcluir = async () => {
    if (!novoRegistro) {
      const confirmado = await confirmar(
        'Excluir compensação',
        '',
        'Você tem certeza que deseja excluir este registro',
        'Excluir',
        'Cancelar'
      );
      if (confirmado) {
        setCarregandoGeral(true);
        const excluir = await ServicoCompensacaoAusencia.deletar([
          idCompensacaoAusencia,
        ])
          .catch(e => erros(e))
          .finally(() => setCarregandoGeral(false));

        if (excluir && excluir.status === 200) {
          sucesso('Compensação excluída com sucesso.');
          navigate(ROUTES.COMPENSACAO_AUSENCIA);
        }
      }
    }
  };

  const resetarTelaEdicaoComId = async form => {
    setCarregouInformacoes(false);
    setCarregandoDados(true);
    setAlunosAusenciaCompensada([]);
    const dadosEdicao = await ServicoCompensacaoAusencia.obterPorId(
      idCompensacaoAusencia
    )
      .catch(e => {
        erros(e);
      })
      .finally(() => setCarregandoDados(false));

    if (dadosEdicao && dadosEdicao.status === 200) {
      setIdsAlunos([]);
      setIdsAlunosAusenciaCompensadas([]);
      if (dadosEdicao.data.alunos && dadosEdicao.data.alunos.length) {
        setAlunosAusenciaCompensada(dadosEdicao.data.alunos);
      } else {
        setAlunosAusenciaCompensada([]);
      }

      const dentroPeriodo = await podeAlterarNoPeriodo(
        String(form.values.bimestre)
      );
      setForaDoPeriodo(!dentroPeriodo);

      if (dentroPeriodo) {
        obterAlunosComAusencia(
          form.values.disciplinaId,
          form.values.bimestre,
          dadosEdicao.data.alunos
        );
      }
      obterDisciplinasRegencia(
        form.values.disciplinaId,
        listaDisciplinas,
        dadosEdicao.data.disciplinasRegencia
      );
      form.resetForm();
      setModoEdicao(false);
      setCarregouInformacoes(true);
    }
  };

  const onClickCancelar = async form => {
    if (modoEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) {
        if (idCompensacaoAusencia) {
          resetarTelaEdicaoComId(form);
        } else {
          setValoresIniciais({ ...formInicial, descricao: null });
          setLimparCampoDescricao(true);
          setCarregouInformacoes(false);
          setIdsAlunos([]);
          setAlunosAusenciaTurma([]);
          setAlunosAusenciaTurmaOriginal([]);
          setIdsAlunosAusenciaCompensadas([]);
          setAlunosAusenciaCompensada([]);
          form.resetForm();
          setModoEdicao(false);
          setCarregouInformacoes(true);
        }
      }
    }
  };

  useEffect(() => {
    if (limparCampoDescricao) {
      setLimparCampoDescricao(false);
      setValoresIniciais({ ...formInicial, descricao: '' });
    }
  }, [limparCampoDescricao]);

  const perguntaAoSalvar = async () => {
    return confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );
  };

  const onClickVoltar = async form => {
    if (modoEdicao) {
      const confirmado = await perguntaAoSalvar();
      if (confirmado) {
        validaAntesDoSubmit(form);
      } else {
        navigate(ROUTES.COMPENSACAO_AUSENCIA);
      }
    } else {
      navigate(ROUTES.COMPENSACAO_AUSENCIA);
    }
  };

  const onClickCadastrar = async valoresForm => {
    setCarregandoGeral(true);
    const paramas = valoresForm;
    paramas.id = idCompensacaoAusencia;
    paramas.turmaId = turmaSelecionada.turma;
    paramas.disciplinasRegenciaIds = [];
    if (temRegencia) {
      const somenteSelecionados = listaDisciplinasRegencia.filter(
        item => item.selecionada
      );
      paramas.disciplinasRegenciaIds = somenteSelecionados.map(item =>
        String(item.codigoComponenteCurricular)
      );
    }
    paramas.alunos = alunosAusenciaCompensada.map(item => {
      const compensacaoAusenciaAlunoAula = item?.compensacoes?.length
        ? item.compensacoes?.map(c => ({
            registroFrequenciaAlunoId: c?.registroFrequenciaAlunoId,
          }))
        : [];

      return {
        id: item.id,
        qtdFaltasCompensadas: item.quantidadeFaltasCompensadas,
        compensacaoAusenciaAlunoAula,
      };
    });

    const cadastrado = await ServicoCompensacaoAusencia.salvar(
      paramas.id,
      paramas
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoGeral(false));

    if (cadastrado && cadastrado.status === 200) {
      if (
        compensacoesParaCopiar &&
        compensacoesParaCopiar.compensacaoOrigemId &&
        compensacoesParaCopiar.dadosTurmas &&
        compensacoesParaCopiar.dadosTurmas.length
      ) {
        await ServicoCompensacaoAusencia.copiarCompensacao(
          compensacoesParaCopiar
        )
          .then(resposta => {
            if (resposta.status === 200) {
              sucesso(resposta.data);
            }
          })
          .catch(e => erros(e));
      }
      if (idCompensacaoAusencia) {
        sucesso('Compensação alterada com sucesso.');
      } else {
        sucesso('Compensação criada com sucesso.');
      }
      navigate(ROUTES.COMPENSACAO_AUSENCIA);
    }
  };

  const obterListaAlunosComIdsSelecionados = (list, ids) => {
    return list.filter(item => ids.find(id => String(id) === String(item.id)));
  };

  const obterListaAlunosSemIdsSelecionados = (list, ids) => {
    return list.filter(item => !ids.find(id => String(id) === String(item.id)));
  };

  const onClickAdicionarAlunos = () => {
    if (!desabilitarCampos && idsAlunos && idsAlunos.length) {
      const novaListaAlunosAusenciaCompensada =
        obterListaAlunosComIdsSelecionados(alunosAusenciaTurma, idsAlunos).map(
          item => {
            return {
              ...item,
              quantidadeFaltasCompensadas: undefined,
              alunoSemSalvar: true,
            };
          }
        );

      const novaListaAlunos = obterListaAlunosSemIdsSelecionados(
        alunosAusenciaTurma,
        idsAlunos
      );

      const novaListaAlunosOriginal = obterListaAlunosSemIdsSelecionados(
        alunosAusenciaTurmaOriginal,
        idsAlunos
      );

      onChangeCampos();
      setAlunosAusenciaTurmaOriginal([...novaListaAlunosOriginal]);
      setAlunosAusenciaTurma([...novaListaAlunos]);
      setAlunosAusenciaCompensada([
        ...novaListaAlunosAusenciaCompensada,
        ...alunosAusenciaCompensada,
      ]);
      setIdsAlunos([]);
    }
  };

  const onClickRemoverAlunos = async () => {
    if (
      !desabilitarCampos &&
      idsAlunosAusenciaCompensadas &&
      idsAlunosAusenciaCompensadas.length
    ) {
      const listaAlunosRemover = alunosAusenciaCompensada.filter(item =>
        idsAlunosAusenciaCompensadas.find(
          id => String(id) === String(item.id) && !item?.alunoSemSalvar
        )
      );

      const dadosAlunoMsg = listaAlunosRemover?.map(
        item => `${item.id} - ${item.nome}`
      );

      let confirmado = true;

      if (listaAlunosRemover?.length) {
        confirmado = await confirmar(
          'Excluir estudante',
          dadosAlunoMsg,
          'A frequência do(s) seguinte(s) estudante(s) será recalculada somente quando salvar as suas alterações',
          'Excluir',
          'Cancelar',
          true
        );
      }
      if (confirmado) {
        const novaListaAlunosOriginal = obterListaAlunosComIdsSelecionados(
          alunosAusenciaTurmaOriginal,
          idsAlunosAusenciaCompensadas
        );

        const novaListaAlunos = obterListaAlunosComIdsSelecionados(
          alunosAusenciaCompensada,
          idsAlunosAusenciaCompensadas
        );

        const novaListaAlunosAusenciaCompensada =
          obterListaAlunosSemIdsSelecionados(
            alunosAusenciaCompensada,
            idsAlunosAusenciaCompensadas
          );

        onChangeCampos();
        setAlunosAusenciaTurmaOriginal([...novaListaAlunosOriginal]);
        setAlunosAusenciaTurma([...novaListaAlunos, ...alunosAusenciaTurma]);
        setAlunosAusenciaCompensada([...novaListaAlunosAusenciaCompensada]);
        setIdsAlunosAusenciaCompensadas([]);
      }
    }
  };

  const onSelectRowAlunos = ids => {
    if (!desabilitarCampos) {
      setIdsAlunos(ids);
    }
  };

  const onSelectRowAlunosAusenciaCompensada = ids => {
    if (!desabilitarCampos) {
      setIdsAlunosAusenciaCompensadas(ids);
    }
  };

  const atualizarValoresListaCompensacao = novaListaAlunos => {
    if (!desabilitarCampos) {
      onChangeCampos();
      setAlunosAusenciaCompensada(_.cloneDeep(novaListaAlunos));
    }
  };

  const onChangeSelecaoAluno = e => {
    const valor = e.target.value;

    const listaParaPesquisar =
      alunosAusenciaTurmaOriginal && alunosAusenciaTurmaOriginal.length
        ? alunosAusenciaTurmaOriginal
        : alunosAusenciaTurma;

    if (!selecaoAlunoSelecionado) {
      setAlunosAusenciaTurmaOriginal(alunosAusenciaTurma);
    }

    if (!valor) {
      setAlunosAusenciaTurma([...alunosAusenciaTurmaOriginal]);
    }

    if (valor) {
      const listaNova = listaParaPesquisar.filter(aluno => {
        return aluno.nome
          .toString()
          .toLowerCase()
          .includes(valor.toLowerCase());
      });
      setAlunosAusenciaTurma(listaNova);
    }

    setSelecaoAlunoSelecionado(valor);
    setIdsAlunos([]);
  };

  const abrirCopiarCompensacao = () => {
    setExibirCopiarCompensacao(true);
  };

  const fecharCopiarCompensacao = () => {
    setExibirCopiarCompensacao(false);
  };

  const onCopiarCompensacoes = (valores, dadosTurmas) => {
    const valoresCopia = {
      compensacaoOrigemId: idCompensacaoAusencia,
      turmasIds: valores.turmas,
      bimestre: valores.bimestre,
      dadosTurmas,
    };
    setCompensacoesParaCopiar(valoresCopia);
  };

  const montarExibicaoCompensacoesCopiar = () => {
    return compensacoesParaCopiar.dadosTurmas.map(turma => {
      return (
        <div className="font-weight-bold" key={`turma-${shortid.generate()}`}>
          - {turma.nome}
        </div>
      );
    });
  };

  return (
    <Loader loading={carregandoGeral} ignorarTip>
      {exibirCopiarCompensacao ? (
        <CopiarCompensacao
          visivel={exibirCopiarCompensacao}
          turmaId={turmaSelecionada.turma}
          listaBimestres={listaBimestres}
          onCloseCopiarCompensacao={fecharCopiarCompensacao}
          onCopiarCompensacoes={onCopiarCompensacoes}
          compensacoesParaCopiar={compensacoesParaCopiar}
          bimestreSugerido={bimestreSugeridoCopia}
        />
      ) : (
        ''
      )}
      {foraDoPeriodo &&
      turmaSelecionada &&
      !ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ? (
        <ForaPerido />
      ) : (
        ''
      )}
      <AlertaModalidadeInfantil />
      <Loader
        loading={carregandoDados || carregandoListaAlunosFrequencia}
        tip=""
      >
        <Formik
          enableReinitialize
          ref={refF => setRefForm(refF)}
          initialValues={valoresIniciais}
          validationSchema={validacoes}
          onSubmit={onClickCadastrar}
          validateOnChange
          validateOnBlur
        >
          {form => (
            <Form>
              <Cabecalho pagina="Cadastrar Compensação de Ausência">
                <Row gutter={[8, 8]} type="flex">
                  <Col>
                    <BotaoVoltarPadrao onClick={() => onClickVoltar(form)} />
                  </Col>
                  <Col>
                    <Button
                      id={SGP_BUTTON_CANCELAR}
                      label="Cancelar"
                      color={Colors.Roxo}
                      border
                      onClick={() => onClickCancelar(form)}
                      disabled={!modoEdicao}
                    />
                  </Col>
                  <Col>
                    <BotaoExcluirPadrao
                      disabled={
                        somenteConsulta ||
                        !permissoesTela.podeExcluir ||
                        novoRegistro ||
                        foraDoPeriodo
                      }
                      onClick={onClickExcluir}
                    />
                  </Col>
                  <Col>
                    <Button
                      id={SGP_BUTTON_ALTERAR_CADASTRAR}
                      label={`${
                        idCompensacaoAusencia > 0 ? 'Alterar' : 'Cadastrar'
                      }`}
                      color={Colors.Roxo}
                      border
                      bold
                      onClick={() => validaAntesDoSubmit(form)}
                      disabled={
                        ehTurmaInfantil(
                          modalidadesFiltroPrincipal,
                          turmaSelecionada
                        ) ||
                        desabilitarCampos ||
                        (idCompensacaoAusencia && !modoEdicao)
                      }
                    />
                  </Col>
                </Row>
              </Cabecalho>
              <Card>
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-sm-12 col-md-8 col-lg-4 col-xl-4 mb-2">
                      <Loader loading={carregandoDisciplinas} tip="">
                        <SelectComponent
                          form={form}
                          id={SGP_SELECT_COMPONENTE_CURRICULAR}
                          label="Componente Curricular"
                          name="disciplinaId"
                          lista={listaDisciplinas}
                          valueOption="codigoSelecao"
                          valueText="nome"
                          onChange={valor => onChangeDisciplina(valor, form)}
                          placeholder="Disciplina"
                          disabled={
                            desabilitarCampos ||
                            desabilitarDisciplina ||
                            !novoRegistro
                          }
                          allowClear={false}
                          labelRequired
                        />
                      </Loader>
                    </div>
                    <div className="col-sm-12 col-md-4 col-lg-2 col-xl-2 mb-2">
                      <SelectComponent
                        form={form}
                        id={SGP_SELECT_BIMESTRE}
                        label="Bimestre"
                        name="bimestre"
                        lista={listaBimestres}
                        valueOption="valor"
                        valueText="descricao"
                        onChange={bi => onChangeBimestre(bi, form)}
                        placeholder="Bimestre"
                        disabled={!novoRegistro}
                        allowClear={false}
                        labelRequired
                      />
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-2">
                      <CampoTexto
                        id={SGP_INPUT_NOME_ATIVIDADE}
                        form={form}
                        label="Atividade"
                        placeholder="Atividade"
                        name="atividade"
                        onChange={onChangeCampos}
                        type="input"
                        maxLength="250"
                        desabilitado={desabilitarCampos}
                        labelRequired
                      />
                    </div>
                    {temRegencia && listaDisciplinasRegencia && (
                      <div className="col-sm-12 col-md-12 col-lg-5 col-xl-5 mb-2">
                        <Label text="Componente curricular" />
                        {listaDisciplinasRegencia.map((disciplina, indice) => {
                          return (
                            <Badge
                              key={disciplina.codigoComponenteCurricular}
                              role="button"
                              onClick={e => {
                                e.preventDefault();
                                if (!desabilitarCampos) {
                                  selecionarDisciplina(indice);
                                }
                              }}
                              aria-pressed={disciplina.selecionada && true}
                              alt={disciplina.nome}
                              className="badge badge-pill border text-dark bg-white font-weight-light px-2 py-1 mr-2"
                            >
                              {disciplina.nome}
                            </Badge>
                          );
                        })}
                      </div>
                    )}

                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-2">
                      {carregouInformacoes ? (
                        <JoditEditor
                          form={form}
                          name="descricao"
                          onChange={onChangeCampos}
                          label="Detalhamento da atividade"
                          desabilitar={desabilitarCampos}
                          value={valoresIniciais?.descricao}
                          labelRequired
                          id={
                            SGP_JODIT_EDITOR_COMPENSACAO_AUSENCIA_DETALHAMENTO_ATIVIDADE
                          }
                        />
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-5 col-md-5 col-lg-5 col-xl-5 mb-2">
                      <CampoTexto
                        id={SGP_INPUT_NOME_ESTUDANTE}
                        label="Seleção dos estudantes"
                        placeholder="Digite o nome do estudante"
                        onChange={onChangeSelecaoAluno}
                        value={selecaoAlunoSelecionado}
                        type="input"
                        icon
                      />
                    </div>
                  </div>
                  <div
                    className="mt-2"
                    style={{ flexGrow: 1, display: 'flex' }}
                  >
                    <div>
                      <ListaAlunos
                        lista={alunosAusenciaTurma}
                        onSelectRow={onSelectRowAlunos}
                        idsAlunos={idsAlunos}
                      />
                    </div>
                    <ColunaBotaoListaAlunos style={{ margin: '15px' }}>
                      <BotaoListaAlunos
                        id={
                          SGP_BUTTON_ADICIONAR_ESTUDANTE_TABELA_AUSENCIA_COMPENSADA
                        }
                        className="mb-2"
                        onClick={onClickAdicionarAlunos}
                      >
                        <i className="fas fa-chevron-right" />
                      </BotaoListaAlunos>
                      <BotaoListaAlunos
                        id={
                          SGP_BUTTON_REMOVER_ESTUDANTE_TABELA_AUSENCIA_COMPENSADA
                        }
                        onClick={onClickRemoverAlunos}
                      >
                        <i className="fas fa-chevron-left" />
                      </BotaoListaAlunos>
                    </ColunaBotaoListaAlunos>
                    <div>
                      <ListaAlunosAusenciasCompensadas
                        listaAusenciaCompensada={alunosAusenciaCompensada}
                        onSelectRow={onSelectRowAlunosAusenciaCompensada}
                        idsAlunosAusenciaCompensadas={
                          idsAlunosAusenciaCompensadas
                        }
                        atualizarValoresListaCompensacao={
                          atualizarValoresListaCompensacao
                        }
                        desabilitarCampos={desabilitarCampos}
                        idCompensacaoAusencia={idCompensacaoAusencia}
                        turmaCodigo={turmaSelecionada.turma}
                        bimestre={form?.values?.bimestre}
                        disciplinaId={form?.values?.disciplinaId}
                        anoLetivo={turmaSelecionada?.anoLetivo}
                      />
                    </div>
                  </div>
                  {exibirAuditoria ? (
                    <Auditoria
                      criadoEm={auditoria.criadoEm}
                      criadoPor={auditoria.criadoPor}
                      alteradoPor={auditoria.alteradoPor}
                      alteradoEm={auditoria.alteradoEm}
                    />
                  ) : (
                    ''
                  )}
                  <div className="row mt-3">
                    <div className="col-md-12">
                      <Button
                        id={SGP_BUTTON_COPIAR_COMPENSACAO}
                        label="Copiar Compensação"
                        icon="share-square"
                        color={Colors.Azul}
                        className="mr-3"
                        border
                        onClick={abrirCopiarCompensacao}
                        disabled={novoRegistro || desabilitarCampos}
                      />
                      {compensacoesParaCopiar &&
                      compensacoesParaCopiar.compensacaoOrigemId &&
                      compensacoesParaCopiar.dadosTurmas.length ? (
                        <ListaCopiarCompensacoes>
                          <div className="mb-1">
                            Compensação será copiada para:
                          </div>
                          <div
                            className="font-weight-bold"
                            key={`bimestre-${shortid.generate()}`}
                          >
                            - Bimestre {compensacoesParaCopiar.bimestre}
                          </div>
                          {montarExibicaoCompensacoesCopiar()}
                        </ListaCopiarCompensacoes>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Form>
          )}
        </Formik>
      </Loader>
    </Loader>
  );
};

export default CompensacaoAusenciaForm;
