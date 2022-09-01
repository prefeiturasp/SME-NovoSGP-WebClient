import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loader } from '~/componentes';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Alert from '~/componentes/alert';
import Button from '~/componentes/button';
import Card from '~/componentes/card';
import { Colors } from '~/componentes/colors';
import ListaPaginada from '~/componentes/listaPaginada/listaPaginada';
import SelectComponent from '~/componentes/select';
import { URL_HOME } from '~/constantes/url';
import modalidade from '~/dtos/modalidade';
import RotasDto from '~/dtos/rotasDto';
import { confirmar, erro, erros, sucesso } from '~/servicos/alertas';
import history from '~/servicos/history';
import ServicoCompensacaoAusencia from '~/servicos/Paginas/DiarioClasse/ServicoCompensacaoAusencia';
import ServicoDisciplina from '~/servicos/Paginas/ServicoDisciplina';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';

import { AlunosCompensacao } from './styles';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import CompensacaoAusenciaListaCamposDebounce from './compensacaoAusenciaListaCamposDebounce';
import {
  SGP_BUTTON_EXCLUIR,
  SGP_BUTTON_NOVO,
  SGP_BUTTON_VOLTAR,
} from '~/componentes-sgp/filtro/idsCampos';

const CompensacaoAusenciaLista = () => {
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const permissoesTela = usuario.permissoes[RotasDto.COMPENSACAO_AUSENCIA];
  const [somenteConsulta, setSomenteConsulta] = useState(false);

  const [exibirLista, setExibirLista] = useState(false);
  const [carregandoDisciplinas, setCarregandoDisciplinas] = useState(false);
  const [desabilitarDisciplina, setDesabilitarDisciplina] = useState(false);
  const [listaDisciplinas, setListaDisciplinas] = useState([]);
  const [compensacoesSelecionadas, setCompensacoesSelecionadas] = useState([]);
  const [bimestreSelecionado, setBimestreSelecionado] = useState('');
  const [filtro, setFiltro] = useState({});
  const [nomeAtividade, setNomeAtividade] = useState('');
  const [nomeAluno, setNomeAluno] = useState('');
  const [componenteSemFrequencia, setComponenteSemFrequencia] = useState(false);
  const [listaBimestres, setListaBimestres] = useState([]);
  const [disciplinaIdSelecionada, setDisciplinaIdSelecionada] = useState(
    undefined
  );

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
    if (!disciplinaIdSelecionada || disciplinaIdSelecionada === 0) return;

    const disciplinaSelecionada = listaDisciplinas.find(
      x =>
        toString(x.codigoComponenteCurricular) ===
        toString(disciplinaIdSelecionada)
    );

    setComponenteSemFrequencia(
      disciplinaSelecionada && !disciplinaSelecionada.registraFrequencia
    );
  }, [disciplinaIdSelecionada, listaDisciplinas]);

  const montaExibicaoAlunos = dados => {
    return (
      <AlunosCompensacao>
        {dados.map(aluno => (
          <span>{aluno}</span>
        ))}
      </AlunosCompensacao>
    );
  };

  const colunas = [
    {
      title: 'Bimestre',
      dataIndex: 'bimestre',
    },
    {
      title: 'Atividade',
      dataIndex: 'atividadeNome',
      width: '30%',
    },
    {
      title: 'Estudantes',
      dataIndex: 'alunos',
      width: '60%',
      render: dados => montaExibicaoAlunos(dados),
    },
  ];

  const filtrar = useCallback(() => {
    const paramsFiltrar = {
      turmaId: turmaSelecionada.turma,
      disciplinaId: disciplinaIdSelecionada,
      bimestre: bimestreSelecionado,
      alunoNome: nomeAluno,
      atividadeNome: nomeAtividade,
    };
    setCompensacoesSelecionadas([]);
    setFiltro({ ...paramsFiltrar });
  }, [
    disciplinaIdSelecionada,
    nomeAluno,
    nomeAtividade,
    bimestreSelecionado,
    turmaSelecionada.turma,
  ]);

  const resetarFiltro = () => {
    setListaDisciplinas([]);
    setDisciplinaIdSelecionada(undefined);
    setNomeAluno('');
    setNomeAtividade('');
    setDesabilitarDisciplina(false);
    setBimestreSelecionado(undefined);
  };

  useEffect(() => {
    const obterDisciplinas = async () => {
      setCarregandoDisciplinas(true);
      const disciplinas = await ServicoDisciplina.obterDisciplinasPorTurma(
        turmaSelecionada.turma
      ).catch(e => erros(e));

      if (disciplinas && disciplinas.data && disciplinas.data.length) {
        const disciplinasPreparadas = disciplinas.data.map(disciplina => {
          return {
            ...disciplina,
            codigoSelecao: disciplina.territorioSaber
              ? disciplina.id
              : disciplina.codigoComponenteCurricular,
          };
        });

        setListaDisciplinas(disciplinasPreparadas);
      } else {
        setListaDisciplinas([]);
      }
      if (disciplinas && disciplinas.data && disciplinas.data.length === 1) {
        const disciplina = disciplinas.data[0];
        setDisciplinaIdSelecionada(
          String(disciplina.codigoComponenteCurricular)
        );
        setDesabilitarDisciplina(true);
      }
      setCarregandoDisciplinas(false);
    };

    if (
      turmaSelecionada.turma &&
      !ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada)
    ) {
      resetarFiltro();
      obterDisciplinas();
    } else {
      resetarFiltro();
    }

    let listaBi = [];
    if (String(turmaSelecionada.modalidade) === String(modalidade.EJA)) {
      listaBi = [
        { valor: 1, descricao: '1° Bimestre' },
        { valor: 2, descricao: '2° Bimestre' },
      ];
    } else {
      listaBi = [
        { valor: 1, descricao: '1° Bimestre' },
        { valor: 2, descricao: '2° Bimestre' },
        { valor: 3, descricao: '3° Bimestre' },
        { valor: 4, descricao: '4° Bimestre' },
      ];
    }
    setListaBimestres(listaBi);
  }, [turmaSelecionada, modalidadesFiltroPrincipal]);

  useEffect(() => {
    if (disciplinaIdSelecionada) {
      setExibirLista(true);
    } else {
      setExibirLista(false);
    }
    filtrar();
  }, [disciplinaIdSelecionada, filtrar]);

  const onChangeDisciplinas = disciplinaId => {
    if (!disciplinaId) {
      setNomeAluno('');
      setNomeAtividade('');
      setBimestreSelecionado(undefined);
    }
    setDisciplinaIdSelecionada(disciplinaId);
  };

  const onChangeBimestre = bimestre => {
    setBimestreSelecionado(bimestre);
  };

  const onClickEditar = async compensacao => {
    let podeEditar = false;
    const exucutandoCalculoFrequencia = await ServicoCompensacaoAusencia.obterStatusCalculoFrequencia(
      turmaSelecionada.turma,
      disciplinaIdSelecionada,
      compensacao.bimestre
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
        history.push(`compensacao-ausencia/editar/${compensacao.id}`);
      } else {
        erro(
          'No momento não é possível realizar a edição pois tem cálculo(s) em processo, tente mais tarde!'
        );
      }
    }
  };

  const onClickVoltar = () => {
    history.push(URL_HOME);
  };

  const onClickExcluir = async () => {
    if (compensacoesSelecionadas && compensacoesSelecionadas.length > 0) {
      const listaExcluir = compensacoesSelecionadas.map(
        item => item.nomeAtividade
      );
      const confirmadoParaExcluir = await confirmar(
        'Excluir compensação',
        listaExcluir,
        `Deseja realmente excluir ${
          compensacoesSelecionadas.length > 1
            ? 'estas compensações'
            : 'esta compensação'
        }?`,
        'Excluir',
        'Cancelar'
      );
      if (confirmadoParaExcluir) {
        const idsDeletar = compensacoesSelecionadas.map(c => c.id);
        const excluir = await ServicoCompensacaoAusencia.deletar(
          idsDeletar
        ).catch(e => erros(e));
        if (excluir && excluir.status === 200) {
          const mensagemSucesso = `${
            compensacoesSelecionadas.length > 1
              ? 'Compensações excluídas'
              : 'Compensação excluída'
          } com sucesso.`;
          sucesso(mensagemSucesso);
          filtrar();
        }
      }
    }
  };

  const onSelecionarItems = items => {
    setCompensacoesSelecionadas(items);
  };

  const onClickNovo = () => {
    history.push(`compensacao-ausencia/novo`);
  };

  return (
    <>
      {!turmaSelecionada.turma &&
      !ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ? (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'compensacao-selecione-turma',
            mensagem: 'Você precisa escolher uma turma.',
            estiloTitulo: { fontSize: '18px' },
          }}
          className="mb-2"
        />
      ) : (
        ''
      )}
      {componenteSemFrequencia && (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'componenteSemFrequencia-alerta',
            mensagem:
              'Não é possível cadastrar compensação de ausência para componente curricular que não controla frequência.',
            estiloTitulo: { fontSize: '18px' },
          }}
          className="mb-2"
        />
      )}
      <AlertaModalidadeInfantil />
      <Cabecalho pagina="Compensação de Ausência">
        <div className="col-md-12 d-flex justify-content-end">
          <Button
            id={SGP_BUTTON_VOLTAR}
            label="Voltar"
            icon="arrow-left"
            color={Colors.Azul}
            border
            className="mr-2"
            onClick={onClickVoltar}
          />
          <Button
            id={SGP_BUTTON_EXCLUIR}
            label="Excluir"
            color={Colors.Vermelho}
            border
            className="mr-2"
            onClick={onClickExcluir}
            disabled={
              !permissoesTela.podeExcluir ||
              (compensacoesSelecionadas && compensacoesSelecionadas.length < 1)
            }
          />
          <Button
            id={SGP_BUTTON_NOVO}
            label="Novo"
            color={Colors.Roxo}
            border
            bold
            onClick={onClickNovo}
            disabled={
              ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ||
              somenteConsulta ||
              componenteSemFrequencia ||
              !permissoesTela.podeIncluir ||
              !turmaSelecionada.turma ||
              (turmaSelecionada.turma && listaDisciplinas.length < 1)
            }
          />
        </div>
      </Cabecalho>
      <Card>
        <div className="col-md-12">
          <div className="row">
            <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-2">
              <Loader loading={carregandoDisciplinas} tip="">
                <SelectComponent
                  id="disciplina"
                  name="disciplinaId"
                  lista={listaDisciplinas}
                  valueOption="codigoSelecao"
                  valueText="nome"
                  valueSelect={disciplinaIdSelecionada}
                  onChange={onChangeDisciplinas}
                  placeholder="Componente Curricular"
                  disabled={desabilitarDisciplina}
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-2">
              <SelectComponent
                id="bimestre"
                name="bimestre"
                onChange={onChangeBimestre}
                valueOption="valor"
                valueText="descricao"
                lista={listaBimestres}
                placeholder="Bimestre"
                valueSelect={bimestreSelecionado}
                disabled={!disciplinaIdSelecionada}
              />
            </div>
            <CompensacaoAusenciaListaCamposDebounce
              disciplinaIdSelecionada={disciplinaIdSelecionada}
              setNomeAtividade={setNomeAtividade}
              setNomeAluno={setNomeAluno}
              nomeAtividade={nomeAtividade}
              nomeAluno={nomeAluno}
            />
          </div>
        </div>
        {exibirLista ? (
          <div className="col-md-12 pt-2">
            <ListaPaginada
              url="v1/compensacoes/ausencia"
              id="lista-compensacao"
              colunaChave="id"
              colunas={colunas}
              filtro={filtro}
              onClick={onClickEditar}
              multiSelecao
              selecionarItems={onSelecionarItems}
            />
          </div>
        ) : (
          ''
        )}
      </Card>
    </>
  );
};

export default CompensacaoAusenciaLista;
