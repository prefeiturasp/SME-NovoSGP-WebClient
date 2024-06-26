import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';

import { ROUTES } from '@/core/enum/routes';

// Redux
import { useSelector } from 'react-redux';

// Componentes SGP
import { Cabecalho, Ordenacao } from '~/componentes-sgp';

// Componentes
import { Alert, ButtonGroup, Card, Grid, Loader } from '~/componentes';
import AlertaSelecionarTurma from './componentes/AlertaSelecionarTurma';
import BarraNavegacao from './componentes/BarraNavegacao';
import EixoObjetivo from './componentes/EixoObjetivo';
import PeriodosDropDown from './componentes/PeriodosDropDown';
import TabelaAlunos from './componentes/TabelaAlunos';

// Estilos
import { Linha } from '~/componentes/EstilosGlobais';

// Serviços
import AcompanhamentoPAPServico from '~/servicos/Paginas/Relatorios/PAP/Acompanhamento';
import { confirmar, erro, sucesso } from '~/servicos/alertas';

// Reducer Hook
import Reducer, {
  carregarAlunos,
  carregarEixos,
  carregarObjetivos,
  carregarPeriodo,
  carregarRespostas,
  estadoInicial,
  setarObjetivoAtivo,
} from './reducer';

// Utils
import { useNavigate } from 'react-router-dom';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import { SGP_BUTTON_SALVAR } from '~/constantes/ids/button';
import { verificaSomenteConsulta } from '~/servicos';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import { valorNuloOuVazio } from '~/utils/funcoes/gerais';

function RelatorioPAPAcompanhamento() {
  const navigate = useNavigate();

  const usuario = useSelector(store => store.usuario);
  const permissoesTela =
    usuario.permissoes[ROUTES.RELATORIO_PAP_ACOMPANHAMENTO];
  const [estado, disparar] = useReducer(Reducer, estadoInicial);
  const [periodo, setPeriodo] = useState(undefined);
  const [ordenacao, setOrdenacao] = useState(2);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [estadoOriginalAlunos, setEstadoOriginalAlunos] = useState(null);
  const { turmaSelecionada } = useSelector(store => store.usuario);
  const [semPeriodos, setSemPeriodos] = useState(false);
  const permTela = usuario.permissoes[ROUTES.RELATORIO_PAP_ACOMPANHAMENTO];
  const [somenteLeitura, setSomenteLeitura] = useState(
    permTela.podeConsultar &&
      !permTela.podeIncluir &&
      !permTela.podeAlterar &&
      !permTela.podeExcluir
  );
  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const dispararAlteracoes = dados => {
    setEstadoOriginalAlunos(dados.periodo.alunos);
    disparar(carregarAlunos(dados.periodo.alunos));
    disparar(carregarPeriodo(dados.periodo));
    disparar(carregarEixos(dados.eixos));
    disparar(
      carregarObjetivos(dados.objetivos.sort((a, b) => a.ordem - b.ordem))
    );
    disparar(carregarRespostas(dados.respostas));
  };

  const salvarAlteracoes = useCallback(
    async (objetivo, botaoSalvar) => {
      try {
        setCarregando(true);
        const req = await AcompanhamentoPAPServico.Salvar({
          ordenacao,
          periodo: {
            ...estado.Periodo,
            alunos: estado.Alunos,
          },
        });

        if (req.status === 200) {
          dispararAlteracoes(req.data);
          if (objetivo) {
            disparar(setarObjetivoAtivo(objetivo.id));
          }
          setModoEdicao(false);
          setCarregando(false);
          if (botaoSalvar) {
            sucesso('Alterações salvas com sucesso');
          }
        }
      } catch (err) {
        setCarregando(false);
        erro(`${err.response.data.mensagens[0]}`);
      }
    },
    [estado.Alunos, estado.Periodo, ordenacao]
  );

  const onChangeObjetivoHandler = useCallback(
    async objetivo => {
      if (!somenteLeitura) {
        salvarAlteracoes(objetivo);
        return;
      }

      if (objetivo) {
        disparar(setarObjetivoAtivo(objetivo.id));
      }
    },
    [salvarAlteracoes, somenteLeitura]
  );

  const limparTela = useCallback(() => {
    dispararAlteracoes({
      periodo: { alunos: [] },
      eixos: [],
      respostas: [],
      objetivos: [],
    });
    disparar(setarObjetivoAtivo({ id: 0 }));
    setPeriodo(undefined);
    setCarregando(false);
    return false;
  }, []);

  const onChangePeriodoHandler = async valor => {
    try {
      setCarregando(true);
      setSomenteLeitura(
        permTela.podeConsultar &&
          !permTela.podeIncluir &&
          !permTela.podeAlterar &&
          !permTela.podeExcluir
      );

      if (modoEdicao && !somenteLeitura) {
        const confirmou = await confirmar(
          'Atenção',
          'Você não salvou as informações preenchidas.',
          'Deseja realmente cancelar as alterações?'
        );
        if (!confirmou) {
          setCarregando(false);
          return false;
        }
      }

      setModoEdicao(false);
      if (valorNuloOuVazio(valor)) {
        limparTela();
      } else {
        setPeriodo(valor);

        const { data } = await AcompanhamentoPAPServico.ListarAlunos({
          TurmaId: turmaSelecionada.id,
          TurmaCodigo: turmaSelecionada.turma,
          PeriodoId: valor,
        });

        if (!data) {
          erro(
            'Não foram encontrados dados para a turma e período selecionados.'
          );
          setCarregando(false);
          return false;
        }

        setSomenteLeitura(!!data.somenteLeitura);
        dispararAlteracoes(data);
        disparar(setarObjetivoAtivo(estado.Objetivos[0]));
        setCarregando(false);
      }
    } catch (err) {
      setCarregando(false);

      if (err.response) {
        const { data } = err.response;
        if (data) {
          const { mensagens } = data;
          erro(`${mensagens[0]}`);
        } else {
          erro('Não foi possível completar a requisição');
        }
      } else {
        erro('Ocorreu um erro interno, por favor contate o suporte');
      }
    }
    return true;
  };

  const onChangeRespostaHandler = async (aluno, valor) => {
    setModoEdicao(true);
    const alunoCorrente = estado.Alunos.find(
      x => x.codAluno === aluno.codAluno
    );

    const novaResposta = {
      respostaId: String(valor),
      objetivoId: estado.ObjetivoAtivo.id,
    };

    let respostasAluno = [];
    if (!valorNuloOuVazio(valor)) {
      respostasAluno =
        alunoCorrente.respostas && alunoCorrente.respostas.length > 0
          ? [
              ...alunoCorrente.respostas.filter(
                y => y.objetivoId !== estado.ObjetivoAtivo.id
              ),
              novaResposta,
            ]
          : [novaResposta];
    } else {
      respostasAluno =
        alunoCorrente.respostas && alunoCorrente.respostas.length > 0
          ? [
              ...alunoCorrente.respostas.filter(
                y => y.objetivoId !== estado.ObjetivoAtivo.id
              ),
            ]
          : [];
    }

    disparar(
      carregarAlunos(
        estado.Alunos.map(item =>
          item.codAluno === aluno.codAluno
            ? {
                ...aluno,
                respostas: respostasAluno,
              }
            : item
        )
      )
    );
  };

  const objetivosCorrentes = useMemo(() => {
    const objetivos = [];
    const eixos = estado.Eixos.filter(
      x => x.periodoId === Number(periodo) || x.periodoId === 0
    );

    eixos.forEach(item => {
      estado.Objetivos.forEach(obj => {
        if (Number(obj.eixoId) === Number(item.id)) {
          objetivos.push(obj);
        }
      });
    });

    return objetivos;
  }, [estado.Eixos, estado.Objetivos, periodo]);

  const respostasCorrentes = useMemo(() => {
    return (
      estado.ObjetivoAtivo &&
      estado.Respostas.filter(x => x.objetivoId === estado.ObjetivoAtivo.id)
    );
  }, [estado.ObjetivoAtivo, estado.Respostas]);

  const onClickCancelarHandler = useCallback(async () => {
    if (!modoEdicao) return;
    const confirmou = await confirmar(
      'Atenção',
      'Você não salvou as informações preenchidas.',
      'Deseja realmente cancelar as alterações?'
    );
    if (confirmou) {
      setModoEdicao(false);
      disparar(carregarAlunos(estadoOriginalAlunos));
    }
  }, [estadoOriginalAlunos, modoEdicao]);

  const onClickVoltarHandler = useCallback(async () => {
    if (!modoEdicao) {
      navigate('/');
      return;
    }

    const confirmou = await confirmar(
      'Atenção',
      'Você não salvou as informações preenchidas.',
      'Deseja realmente cancelar as alterações?'
    );
    if (confirmou) {
      setModoEdicao(false);
      navigate('/');
    }
  }, [modoEdicao]);

  useEffect(() => {
    limparTela();
    verificaSomenteConsulta(permissoesTela);
  }, [limparTela, permissoesTela, turmaSelecionada]);

  return (
    <>
      <AlertaSelecionarTurma />
      {somenteLeitura &&
        !ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) && (
          <Alert
            alerta={{
              tipo: 'warning',
              id: 'pap-somente-leitura',
              mensagem:
                'Não é possível preencher o relatório fora do período estipulado pela SME',
              estiloTitulo: { fontSize: '18px' },
            }}
            className="mb-4"
          />
        )}
      {semPeriodos &&
        !ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) && (
          <Alert
            alerta={{
              tipo: 'warning',
              id: 'sem-periodo-pap',
              mensagem:
                'Somente é possivel realizar o preenchimento do PAP para turmas PAP',
              estiloTitulo: { fontSize: '18px' },
            }}
            className="mb-4"
          />
        )}
      <AlertaModalidadeInfantil />
      <Loader loading={carregando}>
        <Cabecalho pagina="Relatório de encaminhamento e acompanhamento do PAP">
          <ButtonGroup
            somenteConsulta={somenteLeitura}
            permissoesTela={
              usuario.permissoes[ROUTES.RELATORIO_PAP_ACOMPANHAMENTO]
            }
            modoEdicao={modoEdicao}
            temItemSelecionado
            onClickVoltar={() => onClickVoltarHandler()}
            onClickBotaoPrincipal={() =>
              salvarAlteracoes(estado.ObjetivoAtivo, true)
            }
            onClickCancelar={() => onClickCancelarHandler()}
            labelBotaoPrincipal="Salvar"
            idBotaoPrincipal={SGP_BUTTON_SALVAR}
            desabilitarBotaoPrincipal={
              ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ||
              somenteLeitura ||
              !modoEdicao ||
              !periodo
            }
          />
        </Cabecalho>
        <Card>
          <Grid cols={12}>
            <Linha className="row m-0">
              <Grid cols={3}>
                <PeriodosDropDown
                  codigoTurma={turmaSelecionada && turmaSelecionada.turma}
                  setSemPeriodos={setSemPeriodos}
                  onChangePeriodo={onChangePeriodoHandler}
                  valor={periodo}
                  desabilitado={
                    semPeriodos ||
                    turmaSelecionada.turma === null ||
                    turmaSelecionada.turma === undefined
                  }
                />
              </Grid>
            </Linha>
          </Grid>
          <Grid className="mt-4" cols={12}>
            <BarraNavegacao
              objetivos={objetivosCorrentes}
              objetivoAtivo={estado.ObjetivoAtivo}
              onChangeObjetivo={objetivo => onChangeObjetivoHandler(objetivo)}
            />
          </Grid>
          <Grid className="mt-2" cols={12}>
            <EixoObjetivo
              eixo={
                estado.ObjetivoAtivo &&
                estado.Eixos.filter(
                  x => x.id === estado.ObjetivoAtivo.eixoId
                )[0]
              }
              objetivo={estado.ObjetivoAtivo}
            />
          </Grid>
          <Grid className="mt-2" cols={12}>
            <Ordenacao
              retornoOrdenado={retorno => disparar(carregarAlunos(retorno))}
              ordenarColunaNumero="numeroChamada"
              ordenarColunaTexto="nome"
              conteudoParaOrdenar={estado.Alunos}
              desabilitado={somenteLeitura || estado.Alunos.length <= 0}
              onChangeOrdenacao={valor => setOrdenacao(valor)}
            />
          </Grid>

          <Grid className="mt-2" cols={12}>
            <TabelaAlunos
              alunos={estado.Alunos}
              objetivoAtivo={estado.ObjetivoAtivo}
              respostas={respostasCorrentes}
              onChangeResposta={onChangeRespostaHandler}
              somenteConsulta={
                permTela.podeConsultar &&
                !permTela.podeIncluir &&
                !permTela.podeAlterar &&
                !permTela.podeExcluir
              }
            />
          </Grid>
        </Card>
      </Loader>
    </>
  );
}

export default RelatorioPAPAcompanhamento;
