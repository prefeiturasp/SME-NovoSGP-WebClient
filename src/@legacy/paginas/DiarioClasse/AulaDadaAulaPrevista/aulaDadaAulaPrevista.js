import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Auditoria, Colors, Loader } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_SALVAR_ALTERAR,
} from '~/constantes/ids/button';
import Alert from '~/componentes/alert';
import Button from '~/componentes/button';
import Card from '~/componentes/card';
import Grid from '~/componentes/grid';
import SelectComponent from '~/componentes/select';
import { URL_HOME } from '~/constantes/url';
import RotasDto from '~/dtos/rotasDto';
import {
  confirmar,
  erro,
  erros,
  exibirAlerta,
  sucesso,
} from '~/servicos/alertas';
import api from '~/servicos/api';
import ServicoDisciplina from '~/servicos/Paginas/ServicoDisciplina';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import ListaAulasPorBimestre from './ListaAulasPorBimestre/ListaAulasPorBimestre';
import { useNavigate } from 'react-router-dom';

const AulaDadaAulaPrevista = () => {
  const navigate = useNavigate();

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;
  const turmaId = turmaSelecionada ? turmaSelecionada.turma : 0;
  const periodo = turmaSelecionada ? turmaSelecionada.periodo : 0;
  const { modalidade } = turmaSelecionada;
  const [desabilitarDisciplina, setDesabilitarDisciplina] = useState(false);
  const [listaDisciplinas, setListaDisciplinas] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [disciplinaIdSelecionada, setDisciplinaIdSelecionada] =
    useState(undefined);
  const [dadoslista, setDadosLista] = useState([]);
  const [auditoria, setAuditoria] = useState(undefined);
  const permissoesTela = usuario.permissoes[RotasDto.AULA_DADA_AULA_PREVISTA];
  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const [exibirLoader, setExibirLoader] = useState(false);

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
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

  const perguntaAoSalvar = async () => {
    return confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );
  };

  const verificarBimestreAtual = (dataInicio, dataFim) => {
    const dataAtual = window.moment(new Date());
    return (
      window.moment(dataInicio) <= dataAtual &&
      window.moment(dataFim) >= dataAtual
    );
  };

  const buscarDados = async (disciplinaId, novosDados) => {
    setExibirLoader(true);

    let dadosAula = null;

    if (novosDados) {
      dadosAula = novosDados;
    } else {
      const resposta = await api.get(
        `v1/aula-prevista/modalidades/${modalidade}/turmas/${turmaId}/disciplinas/${disciplinaId}/semestres/${periodo}`
      );

      dadosAula = resposta.data;
    }

    let periodosFechados = '';
    if (dadosAula && dadosAula.aulasPrevistasPorBimestre) {
      const dadosBimestre = dadosAula.aulasPrevistasPorBimestre;
      let totalPrevistas = 0;
      let totalCriadasTitular = 0;
      let totalCriadasCj = 0;
      let totalDadas = 0;
      let totalRepostas = 0;
      dadosBimestre.forEach(item => {
        item.ehBimestreAtual = verificarBimestreAtual(item.inicio, item.fim);
        item.dadas = item.cumpridas;
        totalPrevistas += item.previstas.quantidade;
        totalCriadasTitular += item.criadas.quantidadeTitular;
        totalCriadasCj += item.criadas.quantidadeCJ;
        totalDadas += item.dadas;
        totalRepostas += item.reposicoes;
        if (item.previstas.mensagens && item.previstas.mensagens.length > 0) {
          item.previstas.temDivergencia = true;
        }
        periodosFechados += !item.podeEditar
          ? periodosFechados.length > 0
            ? `, ${item.bimestre}`
            : item.bimestre
          : '';
      });
      const dados = {
        id: dadosAula.id,
        bimestres: dadosBimestre,
        totalPrevistas,
        totalCriadasTitular,
        totalCriadasCj,
        totalDadas,
        totalRepostas,
      };
      setDadosLista(dados);
      const aud = {
        alteradoRf: dadosAula.alteradoRF,
        alteradoEm: dadosAula.alteradoEm,
        alteradoPor: dadosAula.alteradoPor,
        criadoRf: dadosAula.criadoRF,
        criadoEm: dadosAula.criadoEm,
        criadoPor: dadosAula.criadoPor,
      };
      if (periodosFechados.length > 0) {
        periodosFechados = periodosFechados.replace(/,(?=[^,]*$)/, ' e ');
        const mensagem = `Apenas é possível consultar o(s) registro(s) para o(s) bimestre(s) ${periodosFechados},
         pois seus períodos de fechamento estão encerrados.`;
        exibirAlerta('warning', mensagem);
      }
      setAuditoria(aud);
    }
    setExibirLoader(false);
  };

  const resetarTela = (novosDados = null) => {
    setModoEdicao(false);
    buscarDados(disciplinaIdSelecionada, novosDados);
  };

  const salvar = async () => {
    setExibirLoader(true);

    const bimestresQuantidade = [];
    dadoslista.bimestres.forEach(item => {
      const dados = {
        bimestre: item.bimestre,
        quantidade: item.previstas.quantidade,
      };

      bimestresQuantidade.push(dados);
    });

    const temAulaPrevistaVazio = bimestresQuantidade.findIndex(
      element => element.quantidade === null
    );

    if (temAulaPrevistaVazio !== -1) {
      setExibirLoader(false);
      erro('É necessário preencher todos os campos de aulas previstas.');
      return;
    }

    const dados = {
      bimestresQuantidade,
      disciplinaId: disciplinaIdSelecionada,
      modalidade,
      turmaId,
    };

    const apiUrl = dadoslista?.id
      ? api.put(`v1/aula-prevista/${dadoslista?.id}`, dados)
      : api.post(`v1/aula-prevista`, dados);

    apiUrl
      .then(res => {
        if (res?.status === 200) {
          const texto = dadoslista.id ? 'alteradas' : 'salvas';

          sucesso(`Suas informações foram ${texto} com sucesso`);

          if (dadoslista?.id) {
            resetarTela();
          } else {
            resetarTela(res?.data);
          }

          setExibirLoader(false);
        }
      })
      .catch(e => erros(e));
  };

  const onChangeDisciplinas = async disciplinaId => {
    if (modoEdicao) {
      const confirmarSalvar = await perguntaAoSalvar();
      if (confirmarSalvar) {
        await salvar();
      }
    }
    setDisciplinaIdSelecionada(String(disciplinaId));
    await buscarDados(disciplinaId);
  };

  useEffect(() => {
    const obterDisciplinas = async () => {
      const disciplinas = await ServicoDisciplina.obterDisciplinasPorTurma(
        turmaId
      );
      setListaDisciplinas(disciplinas.data);
      if (disciplinas?.data?.length === 1) {
        const disciplina = disciplinas.data[0];
        onChangeDisciplinas(disciplina.id);
        setDesabilitarDisciplina(true);
      }
    };
    if (
      turmaId &&
      !ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada)
    ) {
      obterDisciplinas();
    } else {
      setDadosLista([]);
      setModoEdicao(false);
      setDisciplinaIdSelecionada(undefined);
      setListaDisciplinas([]);
    }
  }, [turmaSelecionada, modalidade, modalidadesFiltroPrincipal]);

  const onClickVoltar = async () => {
    if (modoEdicao) {
      const confirmado = await perguntaAoSalvar();
      if (confirmado) {
        await salvar();
        navigate(URL_HOME);
      }
    } else {
      navigate(URL_HOME);
    }
  };

  const onClickCancelar = async () => {
    if (modoEdicao) {
      const confirmado = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmado) {
        resetarTela();
      }
    }
  };

  const onClickSalvar = async () => {
    await salvar();
  };

  return (
    <Loader loading={exibirLoader} tip="Carregando...">
      {!turmaSelecionada.turma &&
      !ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ? (
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
      <Cabecalho pagina="Aula prevista X Aula dada">
        <>
          <BotaoVoltarPadrao className="mr-2" onClick={() => onClickVoltar()} />
          <Button
            id={SGP_BUTTON_CANCELAR}
            label="Cancelar"
            color={Colors.Roxo}
            border
            className="mr-2"
            onClick={onClickCancelar}
            disabled={!modoEdicao || somenteConsulta}
          />
          <Button
            id={SGP_BUTTON_SALVAR_ALTERAR}
            label={dadoslista?.id ? 'Alterar' : 'Salvar'}
            color={Colors.Roxo}
            border
            bold
            onClick={onClickSalvar}
            disabled={!modoEdicao || somenteConsulta}
          />
        </>
      </Cabecalho>
      <Card>
        <div className="col-md-12">
          <div className="row">
            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
              <SelectComponent
                id="disciplina"
                name="disciplinaId"
                lista={listaDisciplinas}
                valueOption="id"
                valueText="nome"
                valueSelect={disciplinaIdSelecionada}
                onChange={onChangeDisciplinas}
                placeholder="Selecione um componente curricular"
                disabled={desabilitarDisciplina || !turmaSelecionada.turma}
              />
            </div>
            <div className="col-md-12">
              {dadoslista?.bimestres ? (
                <ListaAulasPorBimestre
                  dados={dadoslista}
                  setModoEdicao={e => setModoEdicao(e)}
                  permissoesTela={permissoesTela}
                  somenteConsulta={somenteConsulta}
                />
              ) : (
                <></>
              )}
            </div>
            <div className="col-md-6 d-flex justify-content-start">
              {auditoria ? (
                <Auditoria
                  criadoEm={auditoria.criadoEm}
                  criadoPor={auditoria.criadoPor}
                  criadoRf={auditoria.criadoRf}
                  alteradoPor={auditoria.alteradoPor}
                  alteradoEm={auditoria.alteradoEm}
                  alteradoRf={auditoria.alteradoRf}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Loader>
  );
};

export default AulaDadaAulaPrevista;
