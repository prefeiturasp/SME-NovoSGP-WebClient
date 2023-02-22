import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
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
import { erro, erros, sucesso } from '~/servicos/alertas';
import history from '~/servicos/history';
import ServicoPendenciasFechamento from '~/servicos/Paginas/Fechamento/ServicoPendenciasFechamento';
import ServicoDisciplina from '~/servicos/Paginas/ServicoDisciplina';
import situacaoPendenciaDto from '~/dtos/situacaoPendenciaDto';
import {
  AprovadoList,
  PendenteList,
  ResolvidoList,
} from './situacaoFechamento.css';
import RotasDto from '~/dtos/rotasDto';
import { setBreadcrumbManual } from '~/servicos/breadcrumb-services';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import { BotaoImprimir } from './pendenciasFechamentoLista.css';
import ServicoRelatorioPendencias from '~/servicos/Paginas/Relatorios/Pendencias/ServicoRelatorioPendencias';
import ServicoPeriodoEscolar from '~/servicos/Paginas/Calendario/ServicoPeriodoEscolar';
import {
  SGP_BUTTON_APROVAR,
  SGP_BUTTON_IMPRIMIR,
} from '~/constantes/ids/button';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';

// eslint-disable-next-line react/prop-types
const PendenciasFechamentoLista = ({ match }) => {
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );
  const location = useLocation();
  const permissoesTela = usuario.permissoes[RotasDto.PENDENCIAS_FECHAMENTO];
  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const [lista, setLista] = useState([]);

  const [carregandoDisciplinas, setCarregandoDisciplinas] = useState(false);
  const [listaDisciplinas, setListaDisciplinas] = useState([]);
  const [pendenciasSelecionadas, setPendenciasSelecionadas] = useState([]);
  const [bimestreSelecionado, setBimestreSelecionado] = useState('');
  const [filtro, setFiltro] = useState({});
  const [listaBimestres, setListaBimestres] = useState([]);
  const [disciplinaIdSelecionada, setDisciplinaIdSelecionada] = useState(
    undefined
  );
  const [filtrouValoresRota, setFiltrouValoresRota] = useState(false);
  const [imprimindo, setImprimido] = useState(false);
  const [bimestresAbertoFechado, setBimestresAbertoFechado] = useState([]);

  const resetarFiltro = () => {
    setListaDisciplinas([]);
    setDisciplinaIdSelecionada(undefined);
    setBimestreSelecionado(undefined);
  };

  useEffect(() => {
    const naoSetarSomenteConsultaNoStore = ehTurmaInfantil(
      modalidadesFiltroPrincipal,
      turmaSelecionada
    );
    setSomenteConsulta(
      verificaSomenteConsulta(permissoesTela, naoSetarSomenteConsultaNoStore)
    );

    if (naoSetarSomenteConsultaNoStore) {
      resetarFiltro();
      setListaBimestres([]);
    }
  }, [turmaSelecionada, permissoesTela, modalidadesFiltroPrincipal]);

  const montaExibicaoSituacao = (situacaoId, pendencia) => {
    switch (situacaoId) {
      case situacaoPendenciaDto.Pendente:
        return (
          <PendenteList>
            <span>{pendencia.situacaoNome}</span>
          </PendenteList>
        );
      case situacaoPendenciaDto.Resolvida:
        return (
          <ResolvidoList>
            <span>{pendencia.situacaoNome}</span>
          </ResolvidoList>
        );
      case situacaoPendenciaDto.Aprovada:
        return (
          <AprovadoList>
            <span>{pendencia.situacaoNome}</span>
          </AprovadoList>
        );
      default:
        return '';
    }
  };

  const colunas = [
    {
      title: 'Componente curricular',
      dataIndex: 'componenteCurricular',
      width: '20%',
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      width: '65%',
    },
    {
      title: 'Situação',
      dataIndex: 'situacao',
      width: '8%',
      render: (situacaoId, dados) => montaExibicaoSituacao(situacaoId, dados),
    },
  ];

  const filtrar = useCallback(() => {
    const paramsFiltrar = {
      turmaCodigo: turmaSelecionada.turma,
      componenteCurricularId: disciplinaIdSelecionada,
      bimestre: bimestreSelecionado,
    };
    setPendenciasSelecionadas([]);
    setFiltro({ ...paramsFiltrar });
  }, [disciplinaIdSelecionada, bimestreSelecionado, turmaSelecionada.turma]);

  useEffect(() => {
    const montaBimestres = async () => {
      let listaBi = [];
      if (Number(turmaSelecionada.modalidade) === modalidade.EJA) {
        listaBi = [
          { valor: 1, descricao: 'Primeiro bimestre' },
          { valor: 2, descricao: 'Segundo bimestre' },
        ];
      } else {
        listaBi = [
          { valor: 1, descricao: 'Primeiro bimestre' },
          { valor: 2, descricao: 'Segundo bimestre' },
          { valor: 3, descricao: 'Terceiro bimestre' },
          { valor: 4, descricao: 'Quarto bimestre' },
        ];
      }
      setListaBimestres(listaBi);

      if (!filtrouValoresRota && match?.params?.bimestre) {
        const { bimestre } = match?.params;
        const temBimestreNaLista = listaBi.find(
          item => Number(item.valor) === Number(bimestre)
        );
        if (temBimestreNaLista) {
          setBimestreSelecionado(String(bimestre));
        }
        setBreadcrumbManual(
          `${match?.url}`,
          '',
          `${RotasDto.PENDENCIAS_FECHAMENTO}`
        );
        return true;
      }
      return false;
    };

    const obterBimestresAbertoFechado = async () => {
      const retorno = await ServicoPeriodoEscolar.obterPeriodosAbertos(
        turmaSelecionada.turma
      ).catch(e => erros(e));
      if (retorno?.data?.length) {
        setBimestresAbertoFechado(retorno.data);
      } else {
        setBimestresAbertoFechado([]);
      }
    };

    const obterDisciplinas = async temSugestaoBimestre => {
      setCarregandoDisciplinas(true);
      const disciplinas = await ServicoDisciplina.obterDisciplinasPorTurma(
        turmaSelecionada.turma
      ).catch(e => erros(e));

      if (disciplinas && disciplinas.data && disciplinas.data.length) {
        setListaDisciplinas(disciplinas.data);
      } else {
        setListaDisciplinas([]);
      }

      if (
        temSugestaoBimestre &&
        disciplinas &&
        disciplinas.data &&
        disciplinas.data.length === 1
      ) {
        const disciplina = disciplinas.data[0];
        setDisciplinaIdSelecionada(
          String(disciplina.codigoComponenteCurricular)
        );
      }

      if (!filtrouValoresRota && match?.params?.codigoComponenteCurricular) {
        const { codigoComponenteCurricular } = match?.params;
        const temNaLista = disciplinas.data.find(
          item =>
            String(item.codigoComponenteCurricular) ===
            String(codigoComponenteCurricular)
        );
        if (temNaLista) {
          setDisciplinaIdSelecionada(String(codigoComponenteCurricular));
          setFiltrouValoresRota(true);
        }
      }

      setCarregandoDisciplinas(false);
    };

    resetarFiltro();
    if (
      turmaSelecionada.turma &&
      !ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada)
    ) {
      montaBimestres().then(temSugestaoBimestre => {
        obterDisciplinas(temSugestaoBimestre);
        obterBimestresAbertoFechado();
      });
    } else {
      resetarFiltro();
    }

  }, [turmaSelecionada, modalidadesFiltroPrincipal]);

  useEffect(() => {
    filtrar();
  }, [disciplinaIdSelecionada, bimestreSelecionado, filtrar]);

  const onChangeDisciplinas = disciplinaId => {
    setDisciplinaIdSelecionada(disciplinaId);
  };

  const onChangeBimestre = bimestre => {
    setBimestreSelecionado(bimestre);
    if (!bimestre) {
      setDisciplinaIdSelecionada(undefined);
    }

    if (bimestre && listaDisciplinas && listaDisciplinas.length === 1) {
      const disciplina = listaDisciplinas[0];
      setDisciplinaIdSelecionada(String(disciplina.codigoComponenteCurricular));
    }
  };

  const onClickEditar = pendencia => {
    if (permissoesTela.podeConsultar) {
      history.push(
        `${RotasDto.PENDENCIAS_FECHAMENTO}/${pendencia.pendenciaId}`
      );
    }
  };

  const onClickVoltar = () => {
    if (location?.state?.rotaOrigem) {
      history.push(location.state.rotaOrigem);
    } else {
      history.push(URL_HOME);
    }
  };

  const onSelecionarItems = items => {
    setPendenciasSelecionadas(items);
  };

  const onClickAprovar = async () => {
    const ids = pendenciasSelecionadas.map(e => e.pendenciaId);
    const retorno = await ServicoPendenciasFechamento.aprovar(ids).catch(e =>
      erros(e)
    );
    if (retorno && retorno.data) {
      const comErros = retorno.data.filter(item => !item.sucesso);
      if (comErros && comErros.length) {
        const mensagensErros = comErros.map(e => e.mensagemConsistencia);
        mensagensErros.forEach(msg => {
          erro(msg);
        });
      } else {
        if (ids && ids.length > 1) {
          sucesso(`Pendências aprovadas com sucesso`);
        } else {
          sucesso(`Pendência aprovada com sucesso`);
        }
        filtrar();
      }
    }
  };

  const gerarRelatorio = async () => {
    setImprimido(true);
    const params = {
      anoLetivo: turmaSelecionada.anoLetivo,
      dreCodigo: turmaSelecionada.dre,
      ueCodigo: turmaSelecionada.unidadeEscolar,
      modalidade: turmaSelecionada.modalidade,
      turmasCodigo: [turmaSelecionada.turma],
      bimestre: bimestreSelecionado,
      componentesCurriculares: disciplinaIdSelecionada
        ? [disciplinaIdSelecionada]
        : [],
      exibirDetalhamento: true,
    };
    await ServicoRelatorioPendencias.gerar(params)
      .then(() => {
        sucesso(
          'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
        );
      })
      .catch(e => erros(e))
      .finally(setImprimido(false));
  };

  const periodoAberto =
    bimestresAbertoFechado?.length &&
    bimestresAbertoFechado?.find(
      b => String(b?.bimestre) === bimestreSelecionado
    )?.aberto;

  const exibirTabela = match?.params?.codigoComponenteCurricular
    ? !!filtro?.componenteCurricularId
    : !!filtro?.bimestre;
  return (
    <>
      {bimestreSelecionado && !periodoAberto ? (
        <div className="col-md-12">
          <Alert
            alerta={{
              tipo: 'warning',
              mensagem:
                'Apenas é possível consultar este registro pois o período não está em aberto.',
              estiloTitulo: { fontSize: '18px' },
            }}
            className="mb-2"
          />
        </div>
      ) : (
        <></>
      )}
      {!turmaSelecionada.turma &&
      !ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ? (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'pendencias-selecione-turma',
            mensagem: 'Você precisa escolher uma turma.',
            estiloTitulo: { fontSize: '18px' },
          }}
          className="mb-2"
        />
      ) : (
        ''
      )}
      <AlertaModalidadeInfantil />
      <Cabecalho pagina="Análise de Pendências">
        <>
          <BotaoVoltarPadrao className="mr-2" onClick={() => onClickVoltar()} />
          <BotaoImprimir className="d-flex mr-2">
            <Loader loading={imprimindo}>
              <Button
                className="btn-imprimir"
                icon="print"
                color={Colors.Azul}
                border
                onClick={() => gerarRelatorio()}
                disabled={lista.length === 0 || !bimestreSelecionado}
                id={SGP_BUTTON_IMPRIMIR}
              />
            </Loader>
          </BotaoImprimir>
          <Button
            id={SGP_BUTTON_APROVAR}
            label="Aprovar"
            color={Colors.Roxo}
            border
            bold
            className="mr-2"
            onClick={onClickAprovar}
            disabled={
              !periodoAberto ||
              ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ||
              !turmaSelecionada.turma ||
              somenteConsulta ||
              !permissoesTela.podeAlterar ||
              (turmaSelecionada.turma && listaDisciplinas.length < 1) ||
              (pendenciasSelecionadas && pendenciasSelecionadas.length < 1) ||
              pendenciasSelecionadas.filter(
                item => Number(item?.situacao) === situacaoPendenciaDto.Aprovada
              ).length > 0
            }
          />
        </>
      </Cabecalho>
      <Card>
        <div className="col-md-12">
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-2">
              <SelectComponent
                id="bimestre"
                name="bimestre"
                onChange={onChangeBimestre}
                valueOption="valor"
                valueText="descricao"
                lista={listaBimestres}
                placeholder="Selecione o bimestre"
                valueSelect={bimestreSelecionado}
                disabled={ehTurmaInfantil(
                  modalidadesFiltroPrincipal,
                  turmaSelecionada
                )}
              />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-2">
              <Loader loading={carregandoDisciplinas} tip="">
                <SelectComponent
                  id="disciplina"
                  name="disciplinaId"
                  lista={listaDisciplinas}
                  valueOption="codigoComponenteCurricular"
                  valueText="nome"
                  valueSelect={disciplinaIdSelecionada}
                  onChange={onChangeDisciplinas}
                  placeholder="Selecione o componente curricular"
                  disabled={
                    ehTurmaInfantil(
                      modalidadesFiltroPrincipal,
                      turmaSelecionada
                    ) ||
                    listaDisciplinas?.length === 1 ||
                    !bimestreSelecionado
                  }
                />
              </Loader>
            </div>
          </div>
        </div>
        {exibirTabela ? (
          <div className="col-md-12 pt-2">
            <ListaPaginada
              url="v1/fechamentos/pendencias/listar"
              id="lista-pendencias-fechamento"
              colunaChave="pendenciaId"
              colunas={colunas}
              filtro={filtro}
              onClick={onClickEditar}
              multiSelecao={!somenteConsulta}
              selecionarItems={onSelecionarItems}
              setLista={dados => setLista(dados)}
            />
          </div>
        ) : (
          ''
        )}
      </Card>
    </>
  );
};

export default PendenciasFechamentoLista;
