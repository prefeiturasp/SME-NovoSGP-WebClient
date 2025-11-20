import { useEffect, useState } from 'react';
// import { ROUTES } from '@/core/enum/routes';
import { useSelector } from 'react-redux';
import { Loader } from '~/componentes';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import Alert from '~/componentes/alert';
import Card from '~/componentes/card';
import Grid from '~/componentes/grid';
import { Cabecalho } from '~/componentes-sgp';
// import SelectComponent from '~/componentes/select';
import { confirmar } from '~/servicos/alertas';
// import ServicoDisciplina from '~/servicos/Paginas/ServicoDisciplina';
import BotaoCancelarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoCancelarPadrao';
import BotaoSalvarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoSalvarPadrao';
import Select from '@/components/lib/inputs/select';
import { Form } from 'antd';

const SondagemNovo = () => {
  const usuario = useSelector((store: any) => store.usuario);
  const { turmaSelecionada } = usuario;
  const turmaId = turmaSelecionada ? turmaSelecionada.turma : 0;
  // const periodo = turmaSelecionada ? turmaSelecionada.periodo : 0;
  const { modalidade } = turmaSelecionada;

  const [listaDisciplinas, setListaDisciplinas] = useState([]);
  const [listaProficiencia, setListaProficiencia] = useState([]);
  const [disciplinaIdSelecionada, setDisciplinaIdSelecionada] = useState();
  // const [proficienciaIdSelecionada, setProficienciaIdSelecionada] = useState();

  const [desabilitarDisciplina, setDesabilitarDisciplina] = useState(false);
  const [modoEdicao] = useState(false); // setModoEdicao
  // const [dadoslista, setDadosLista] = useState([]);
  // const [auditoria, setAuditoria] = useState(undefined);

  // const { permissoes } = usuario;
  // const permissoesTela = permissoes?.[ROUTES.SONDAGEM_NOVO];

  // const [somenteConsulta, setSomenteConsulta] = useState(false); // Verificar se realmente vai ser usado.
  const [exibirLoader] = useState(false); // setExibirLoader

  const modalidadesFiltroPrincipal = useSelector((store: any) => store.filtro.modalidades);

  const [form] = Form.useForm();

  //   useEffect(() => {
  //     const naoSetarSomenteConsultaNoStore = ehTurmaInfantil(
  //       modalidadesFiltroPrincipal,
  //       turmaSelecionada
  //     );
  //     setSomenteConsulta(
  //       verificaSomenteConsulta(permissoesTela, naoSetarSomenteConsultaNoStore)
  //     );
  //   }, [turmaSelecionada, permissoesTela, modalidadesFiltroPrincipal]);

  // const perguntaAoSalvar = async () => {
  //   return confirmar('Atenção', '', 'Suas alterações não foram salvas, deseja salvar agora?');
  // };

  const resetarTela = () => {
    // novosDados = null
    // setModoEdicao(false);
    // buscarDados(disciplinaIdSelecionada, novosDados);
  };

  const onClickCancelar = async () => {
    if (modoEdicao) {
      const confirmado = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?',
      );
      if (confirmado) {
        resetarTela();
      }
    }
  };

  const onClickSalvar = async () => {
    // await salvar();
  };

  const onChangeDisciplinas = async (disciplinaId) => {
    // if (modoEdicao) {
    //   const confirmarSalvar = await perguntaAoSalvar();
    //   if (confirmarSalvar) {
    //     await salvar();
    //   }
    // }

    if (disciplinaId) {
      setDisciplinaIdSelecionada(disciplinaId);
      console.log('DisciplinaId selecionada: ', disciplinaId, disciplinaIdSelecionada);

      const valorSelecionado = form.getFieldValue('disciplinaId');
      console.log('ID:', valorSelecionado);

      const listaProeficiencia = MockProficiencia();
      setListaProficiencia(listaProeficiencia.data);
      // await buscarDados(disciplinaId);
    } else {
      // setDadosLista([]);
      // setAuditoria(undefined);
      // setDisciplinaIdSelecionada(undefined);
    }
  };

  const onChangeProficiencia = async (proficienciaId) => {
    if (proficienciaId) {
      // setProficienciaIdSelecionada(proficienciaId);
      // Carrega o proximo campo caso ele exista
    } else {
      // setDadosLista([]);
      // setAuditoria(undefined);
      // setProficienciaIdSelecionada(undefined);
    }
  };

  const onClickVoltar = async () => {
    // if (modoEdicao) {
    //   const confirmado = await perguntaAoSalvar();
    //   if (confirmado) {
    //     await salvar();
    //     navigate(URL_HOME);
    //   }
    // } else {
    //   navigate(URL_HOME);
    // }
  };

  // const buscarDados = async (disciplinaId, novosDados) => {
  // setExibirLoader(true);
  // let dadosAula = null;
  // if (novosDados) {
  //   dadosAula = novosDados;
  // } else {
  //   const resposta = await api.get(
  //     `v1/aula-prevista/modalidades/${modalidade}/turmas/${turmaId}/disciplinas/${disciplinaId}/semestres/${periodo}`
  //   );
  //   dadosAula = resposta.data;
  // }
  // let periodosFechados = '';
  // if (dadosAula && dadosAula.aulasPrevistasPorBimestre) {
  //   const dadosBimestre = dadosAula.aulasPrevistasPorBimestre;
  //   let totalPrevistas = 0;
  //   let totalCriadasTitular = 0;
  //   let totalCriadasCj = 0;
  //   let totalDadas = 0;
  //   let totalRepostas = 0;
  //   dadosBimestre.forEach(item => {
  //     item.ehBimestreAtual = verificarBimestreAtual(item.inicio, item.fim);
  //     item.dadas = item.cumpridas;
  //     totalPrevistas += item.previstas.quantidade;
  //     totalCriadasTitular += item.criadas.quantidadeTitular;
  //     totalCriadasCj += item.criadas.quantidadeCJ;
  //     totalDadas += item.dadas;
  //     totalRepostas += item.reposicoes;
  //     if (item.previstas.mensagens && item.previstas.mensagens.length > 0) {
  //       item.previstas.temDivergencia = true;
  //     }
  //     periodosFechados += !item.podeEditar
  //       ? periodosFechados.length > 0
  //         ? `, ${item.bimestre}`
  //         : item.bimestre
  //       : '';
  //   });
  //   const dados = {
  //     id: dadosAula.id,
  //     bimestres: dadosBimestre,
  //     totalPrevistas,
  //     totalCriadasTitular,
  //     totalCriadasCj,
  //     totalDadas,
  //     totalRepostas,
  //   };
  //   setDadosLista(dados);
  //   const aud = {
  //     alteradoRf: dadosAula.alteradoRF,
  //     alteradoEm: dadosAula.alteradoEm,
  //     alteradoPor: dadosAula.alteradoPor,
  //     criadoRf: dadosAula.criadoRF,
  //     criadoEm: dadosAula.criadoEm,
  //     criadoPor: dadosAula.criadoPor,
  //   };
  //   if (periodosFechados.length > 0) {
  //     periodosFechados = periodosFechados.replace(/,(?=[^,]*$)/, ' e ');
  //     const mensagem = `Apenas é possível consultar o(s) registro(s) para o(s) bimestre(s) ${periodosFechados},
  //      pois seus períodos de fechamento estão encerrados.`;
  //     exibirAlerta('warning', mensagem);
  //   }
  //   setAuditoria(aud);
  // }
  // setExibirLoader(false);
  // };

  useEffect(() => {
    const obterDisciplinas = async () => {
      // const disciplinas = await ServicoDisciplina.obterDisciplinasPorTurma(
      //   turmaId
      // );
      // Mockado enquanto o serviço não está pronto
      const disciplinas = MockDisciplina();

      setListaDisciplinas(disciplinas.data);
      if (disciplinas?.data?.length === 1) {
        const disciplina = disciplinas.data[0];
        onChangeDisciplinas(disciplina.value);
        setDesabilitarDisciplina(true);
      } else if (disciplinas?.data?.length > 1) {
        // setDadosLista([]);
        // setModoEdicao(false);
        // setDisciplinaIdSelecionada(undefined);
        setListaDisciplinas(disciplinas.data);
        setDesabilitarDisciplina(false);
        // setAuditoria(undefined);
      }
    };

    if (turmaId && !ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada)) {
      obterDisciplinas();
    } else {
      // setDadosLista([]);
      // setModoEdicao(false);
      // setDisciplinaIdSelecionada(undefined);
      setListaDisciplinas([]);
    }
  }, [turmaSelecionada, modalidade, modalidadesFiltroPrincipal]);

  return (
    <Loader loading={exibirLoader} tip="Carregando...">
      {!turmaSelecionada.turma && !ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ? (
        <Grid cols={12} className="p-0">
          <Alert
            alerta={{
              tipo: 'warning',
              id: 'AlertaPrincipal',
              mensagem: 'Você precisa escolher uma turma.',
              estiloTitulo: { fontSize: '18px' },
            }}
            className="mb-2"
          />
        </Grid>
      ) : null}
      <AlertaModalidadeInfantil />
      <Cabecalho pagina="Sondagem - Digitação">
        <>
          <BotaoVoltarPadrao className="mr-2" onClick={() => onClickVoltar()} />
          <BotaoCancelarPadrao onClick={() => onClickCancelar()} />
          <BotaoSalvarPadrao onClick={() => onClickSalvar()} />
        </>
      </Cabecalho>
      <Card>
        <Form form={form}>
          <div className="col-md-12">
            <div className="row">
              <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                <Form.Item label="Componente Curricular" name="disciplinaId">
                  <Select
                    id="disciplina"
                    options={listaDisciplinas}
                    onChange={onChangeDisciplinas}
                    placeholder="Selecione um componente curricular"
                    disabled={desabilitarDisciplina || !turmaSelecionada.turma}
                  />
                </Form.Item>
              </div>
              <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                <Form.Item label="Proficiência" name="proficienciaId">
                  <Select
                    id="Proficiencia"
                    options={listaProficiencia}
                    onChange={onChangeProficiencia}
                    placeholder="Selecione uma Proficiência"
                    disabled={desabilitarDisciplina || !turmaSelecionada.turma}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </Form>
      </Card>
    </Loader>
  );
};

export default SondagemNovo;

const MockDisciplina = () => {
  const disciplina = {
    data: [
      { value: 1, label: 'Língua Portuguesa' },
      { value: 2, label: 'Matemática' },
    ],
  };

  return disciplina;
};

const MockProficiencia = () => {
  const proficiencia = {
    data: [{ value: 1, label: 'Escrita' }],
  };

  return proficiencia;
};
