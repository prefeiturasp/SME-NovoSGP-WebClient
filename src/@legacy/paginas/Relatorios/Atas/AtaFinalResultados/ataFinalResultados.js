import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { useSelector } from 'react-redux';
import { SelectComponent, CheckboxComponent, Loader } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import Card from '~/componentes/card';
import { URL_HOME } from '~/constantes/url';
import modalidade from '~/dtos/modalidade';
import RotasDto from '~/dtos/rotasDto';
import AbrangenciaServico from '~/servicos/Abrangencia';
import { erros, sucesso } from '~/servicos/alertas';
import api from '~/servicos/api';
import history from '~/servicos/history';
import ServicoConselhoAtaFinal from '~/servicos/Paginas/ConselhoAtaFinal/ServicoConselhoAtaFinal';
import FiltroHelper from '~/componentes-sgp/filtro/helper';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import { OPCAO_TODOS } from '~/constantes/constantes';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';
import { SGP_CHECKBOX_EXIBIR_HISTORICO } from '~/constantes/ids/checkbox';
import {
  SGP_SELECT_ANO_LETIVO,
  SGP_SELECT_DRE,
  SGP_SELECT_FORMATO,
  SGP_SELECT_MODALIDADE,
  SGP_SELECT_SEMESTRE,
  SGP_SELECT_TURMA,
  SGP_SELECT_UE,
  SGP_SELECT_VISUALIZACAO,
} from '~/constantes/ids/select';
import { ModalidadeDTO } from '~/dtos';

const AtaFinalResultados = () => {
  const usuarioStore = useSelector(store => store.usuario);
  const permissoesTela = usuarioStore.permissoes[RotasDto.ATA_FINAL_RESULTADOS];

  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaSemestre, setListaSemestre] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);

  const [anoLetivo, setAnoLetivo] = useState();
  const [dreId, setDreId] = useState();
  const [ueId, setUeId] = useState();
  const [modalidadeId, setModalidadeId] = useState();
  const [semestre, setSemestre] = useState();
  const [turmaId, setTurmaId] = useState();
  const [formato, setFormato] = useState('1');
  const [consideraHistorico, setConsideraHistorico] = useState(false);

  const [desabilitarBtnGerar, setDesabilitarBtnGerar] = useState(true);
  const [desabilitarBtnFormato, setDesabilitarBtnFormato] = useState(true);
  const [carregandoAnosLetivos, setCarregandoAnosLetivos] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [listaVisualizacao, setListaVisualizacao] = useState([]);
  const [desabilitaVisualizacao, setDesabilitaVisualizacao] = useState(true);
  const [visualizacao, setVisualizacao] = useState('');
  const [listaTurmasCompletas, setListaTurmasCompletas] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);

  const listaFormatos = [
    { valor: '1', desc: 'PDF' },
    { valor: '4', desc: 'EXCEL' },
  ];

  const ehEJA = Number(modalidadeId) === ModalidadeDTO.EJA;

  const obterAnosLetivos = useCallback(async considHistorico => {
    setCarregandoAnosLetivos(true);
    const anosLetivo = await FiltroHelper.obterAnosLetivos({
      consideraHistorico: considHistorico,
    }).catch(e => erros(e));
    if (anosLetivo) {
      setListaAnosLetivo(anosLetivo);
      setAnoLetivo(anosLetivo[0]?.valor);
      setDreId();
    } else {
      setListaAnosLetivo([]);
    }
    setCarregandoAnosLetivos(false);
  }, []);

  const obterModalidades = useCallback(
    async (ue, ano) => {
      if (ue && ano) {
        const { data } = await api.get(`/v1/ues/${ue}/modalidades?ano=${ano}`);
        if (data) {
          const lista = data.map(item => ({
            desc: item.nome,
            valor: String(item.id),
          }));

          if (lista && lista.length && lista.length === 1) {
            setModalidadeId(lista[0].valor);
          }
          setListaModalidades(lista);
        }
      }
    },

    [ueId]
  );

  const obterVisualizacoes = useCallback(async () => {
    const { data } = await api.get(
      `/v1/relatorios/filtros/ata-final/tipos-visualizacao`
    );
    if (data) {
      const lista = data.map(item => ({
        desc: item.desc,
        valor: item.valor,
      }));
      setListaVisualizacao(lista);
    }
  }, []);

  const obterUes = useCallback(
    async dre => {
      setCarregandoUes(true);
      if (dre) {
        const { data } = await AbrangenciaServico.buscarUes(
          dre,
          '',
          false,
          undefined,
          consideraHistorico,
          anoLetivo
        );
        if (data) {
          const lista = data.map(item => ({
            desc: item.nome,
            valor: String(item.codigo),
          }));

          if (lista && lista.length && lista.length === 1) {
            setUeId(lista[0].valor);
          }

          setListaUes(lista);
        } else {
          setListaUes([]);
        }
      }
      setCarregandoUes(false);
    },

    [dreId, anoLetivo]
  );

  const onChangeDre = dre => {
    setDreId(dre);

    setListaUes([]);
    setUeId(undefined);

    setListaModalidades([]);
    setModalidadeId(undefined);

    setListaSemestre([]);
    setSemestre(undefined);

    setListaTurmas([]);
    setTurmaId(undefined);

    setModoEdicao(true);
  };

  const obterDres = useCallback(async () => {
    if (anoLetivo) {
      setCarregandoDres(true);
      const { data } = await AbrangenciaServico.buscarDres(
        `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`,
        consideraHistorico
      );
      if (data && data.length) {
        const lista = data
          .map(item => ({
            desc: item.nome,
            valor: String(item.codigo),
            abrev: item.abreviacao,
          }))
          .sort(FiltroHelper.ordenarLista('desc'));
        setListaDres(lista);

        if (lista && lista.length && lista.length === 1) {
          setDreId(lista[0].valor);
        }
      } else {
        setListaDres([]);
      }
      setCarregandoDres(false);
    }

  }, [anoLetivo]);

  const obterTurmas = useCallback(
    async (modalidadeSelecionada, ue, semestreSelecionado, ehEja) => {
      if (ue && modalidadeSelecionada) {
        const { data } = await AbrangenciaServico.buscarTurmas(
          ue,
          modalidadeSelecionada,
          semestreSelecionado,
          anoLetivo,
          consideraHistorico,
          false,
          []
        );
        if (data) {
          setListaTurmasCompletas(data);
          const lista = data.map(item => ({
            desc: item.nome,
            valor: item.codigo,
            nomeFiltro: item.nomeFiltro,
          }));

          if (ehEja && !semestreSelecionado) return;

          lista.unshift({ nomeFiltro: 'Todas', valor: OPCAO_TODOS });

          setListaTurmas(lista);

          if (lista && lista.length && lista.length === 1) {
            setTurmaId(lista[0].valor);
          }
        } else {
          setListaTurmasCompletas([]);
        }
      }
    },

    [modalidadeId]
  );

  const obterSemestres = async (
    modalidadeSelecionada,
    anoLetivoSelecionado
  ) => {
    const retorno = await api.get(
      `v1/abrangencias/${consideraHistorico}/semestres?anoLetivo=${anoLetivoSelecionado}&modalidade=${modalidadeSelecionada ||
        0}`
    );
    if (retorno && retorno.data) {
      const lista = retorno.data.map(periodo => {
        return { desc: periodo, valor: periodo };
      });

      if (lista && lista.length && lista.length === 1) {
        setSemestre(lista[0].valor);
      }
      setListaSemestre(lista);
    }
  };

  useEffect(() => {
    if (anoLetivo && ueId) {
      obterModalidades(ueId, anoLetivo);
    } else {
      setModalidadeId(undefined);
      setListaModalidades([]);
    }

  }, [ueId]);

  useEffect(() => {
    if (dreId) {
      obterUes(dreId);
    } else {
      setUeId(undefined);
      setListaUes([]);
    }
  }, [dreId, obterUes]);

  useEffect(() => {
    if (modalidadeId && ueId) {
      obterTurmas(modalidadeId, ueId, semestre, ehEJA);
    } else {
      setTurmaId(undefined);
      setListaTurmas([]);
    }
  }, [modalidadeId, ueId, obterTurmas, semestre, ehEJA]);

  useEffect(() => {
    if (modalidadeId && anoLetivo) {
      if (modalidadeId === modalidade.EJA) {
        obterSemestres(modalidadeId, anoLetivo);
      } else {
        setSemestre(undefined);
        setListaSemestre([]);
      }
    } else {
      setSemestre(undefined);
      setListaSemestre([]);
    }

  }, [modalidadeId, anoLetivo]);

  useEffect(() => {
    const desabilitar =
      !anoLetivo ||
      !dreId ||
      !ueId ||
      !modalidadeId ||
      !turmaId?.length ||
      !formato;

    let desabilitado = desabilitar;

    if (Number(modalidadeId) === Number(modalidade.EJA)) {
      desabilitado = !semestre || desabilitar;
    } else if (Number(modalidadeId) === Number(modalidade.ENSINO_MEDIO)) {
      desabilitado = desabilitar || !visualizacao;
    }

    setDesabilitarBtnGerar(desabilitado);
  }, [
    anoLetivo,
    dreId,
    ueId,
    modalidadeId,
    turmaId,
    formato,
    semestre,
    visualizacao,
  ]);

  useEffect(() => {
    obterAnosLetivos(consideraHistorico);
  }, [obterAnosLetivos, consideraHistorico]);

  useEffect(() => {
    obterDres();
  }, [obterDres]);

  useEffect(() => {
    obterVisualizacoes();
  }, [obterVisualizacoes]);

  const compararTurmaAno = (stringComparacao, valorComparacao, arrayTurmas) => {
    return listaTurmasCompletas.filter(
      turmaCompleta =>
        arrayTurmas.find(arrayTurma => turmaCompleta.codigo === arrayTurma) &&
        parseInt(turmaCompleta[stringComparacao], 10) ===
          parseInt(valorComparacao, 10)
    );
  };

  const checarTipoTurma = arrayTurmas => {
    setVisualizacao('');
    const turmaItinerancia = compararTurmaAno('tipoTurma', 7, arrayTurmas);
    const turmaPrimeiro = compararTurmaAno('ano', 1, arrayTurmas);
    const turmaSegundo = compararTurmaAno('ano', 2, arrayTurmas);
    const turmaTerceiro = compararTurmaAno('ano', 3, arrayTurmas);
    const ehModalidadeMedio =
      parseInt(modalidadeId, 10) === parseInt(modalidade.ENSINO_MEDIO, 10);

    if (
      turmaItinerancia.length === arrayTurmas?.length ||
      (ehModalidadeMedio &&
        !turmaSegundo.length &&
        (turmaPrimeiro.length || turmaTerceiro.length))
    ) {
      setVisualizacao(
        `${
          listaVisualizacao.find(a => a.desc?.toUpperCase() === 'TURMA')?.valor
        }`
      );
      return true;
    }
    if (!turmaSegundo.length) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    let turmaExcecao = false;
    if (turmaId?.length && turmaId[0] !== OPCAO_TODOS) {
      turmaExcecao = checarTipoTurma(turmaId);
    }
    const desabilita =
      !modalidadeId ||
      !turmaId ||
      (turmaId.length === 1 && turmaId[0] !== OPCAO_TODOS && turmaExcecao) ||
      parseInt(modalidadeId, 10) !== parseInt(modalidade.ENSINO_MEDIO, 10) ||
      !turmaId.length ||
      turmaExcecao;
    setDesabilitaVisualizacao(desabilita);

  }, [turmaId, modalidadeId, listaTurmasCompletas]);

  const onClickVoltar = () => {
    history.push(URL_HOME);
  };

  const onClickCancelar = () => {
    setConsideraHistorico(false);
    setAnoLetivo(undefined);
    setDreId(undefined);
    setListaAnosLetivo([]);
    setListaDres([]);

    obterAnosLetivos(consideraHistorico);
    obterDres();

    setFormato('PDF');

    setModoEdicao(false);
  };

  const onClickGerar = async () => {
    if (permissoesTela.podeConsultar) {
      const params = {
        turmasCodigos: [],
        anoLetivo,
        tipoFormatoRelatorio: formato,
        visualizacao,
        semestre,
      };
      if (turmaId.find(t => t === OPCAO_TODOS)) {
        params.turmasCodigos = listaTurmas.map(item => String(item.valor));
      } else {
        params.turmasCodigos = turmaId;
      }
      const retorno = await ServicoConselhoAtaFinal.gerar(params).catch(e =>
        erros(e)
      );
      if (retorno && retorno.status === 200) {
        sucesso(
          'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
        );
        setDesabilitarBtnGerar(true);
      }
    }
  };

  const onChangeUe = ue => {
    setUeId(ue);

    setListaModalidades([]);
    setModalidadeId(undefined);

    setListaSemestre([]);
    setSemestre(undefined);

    setListaTurmas([]);
    setTurmaId(undefined);

    setModoEdicao(true);
  };

  const onChangeModalidade = novaModalidade => {
    setModalidadeId(novaModalidade);

    setListaSemestre([]);
    setSemestre(undefined);

    if (Number(novaModalidade) === modalidade.EJA)
      obterSemestres(novaModalidade, anoLetivo);

    setListaTurmas([]);
    setTurmaId(undefined);
    setVisualizacao('');

    setModoEdicao(true);
  };

  const onChangeAnoLetivo = ano => {
    setAnoLetivo(ano);
    setDreId();

    setListaModalidades([]);
    setModalidadeId(undefined);

    setListaSemestre([]);
    setSemestre(undefined);

    setListaTurmas([]);
    setTurmaId(undefined);

    setModoEdicao(true);
  };

  const resetFormato = valor => {
    if (valor) {
      setFormato('1');
    }
  };

  const habilitarSelecaoFormato = valor => {
    const turmaSelecionada = listaTurmas?.find(item => item.valor === valor);
    const ehDesabilitado = turmaSelecionada?.desc === 'Todas';
    setDesabilitarBtnFormato(ehDesabilitado);
    resetFormato(ehDesabilitado);
  };

  const onChangeSemestre = valor => {
    setListaTurmas([]);
    setTurmaId(undefined);
    setSemestre(valor);
    setModoEdicao(true);
  };

  const onChangeTurma = valor => {
    const todosSetado = turmaId?.find(a => a === OPCAO_TODOS);
    const todos = valor.find(a => a === OPCAO_TODOS && !todosSetado);
    const novoValor = todosSetado && valor.length === 2 ? [valor[1]] : valor;
    setTurmaId(todos ? [todos] : novoValor);
    habilitarSelecaoFormato(valor);
    setVisualizacao('');
    setModoEdicao(true);
  };

  const onChangeFormato = valor => {
    setFormato(valor);
    setModoEdicao(true);
  };

  const onChangeVisualizacao = valor => {
    if (visualizacao !== valor) setVisualizacao(valor);
    setModoEdicao(true);
  };

  function onCheckedConsideraHistorico(e) {
    setAnoLetivo(undefined);
    setConsideraHistorico(e.target.checked);
    setModoEdicao(true);
  }

  return (
    <>
      <AlertaModalidadeInfantil
        exibir={String(modalidadeId) === String(modalidade.INFANTIL)}
        validarModalidadeFiltroPrincipal={false}
      />

      <Cabecalho pagina="Ata de resultados finais">
        <BotoesAcaoRelatorio
          onClickVoltar={onClickVoltar}
          onClickCancelar={onClickCancelar}
          onClickGerar={onClickGerar}
          desabilitarBtnGerar={
            String(modalidadeId) === String(modalidade.INFANTIL) ||
            desabilitarBtnGerar ||
            !permissoesTela.podeConsultar
          }
          modoEdicao={modoEdicao}
        />
      </Cabecalho>

      <Card padding="24px 24px">
        <Col span={24}>
          <Row gutter={[16, 8]}>
            <Col sm={24}>
              <CheckboxComponent
                id={SGP_CHECKBOX_EXIBIR_HISTORICO}
                label="Exibir histórico?"
                onChangeCheckbox={onCheckedConsideraHistorico}
                checked={consideraHistorico}
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col sm={24} md={12} xl={4}>
              <Loader loading={carregandoAnosLetivos} ignorarTip>
                <SelectComponent
                  id={SGP_SELECT_ANO_LETIVO}
                  label="Ano Letivo"
                  lista={listaAnosLetivo}
                  valueOption="valor"
                  valueText="desc"
                  disabled={
                    !permissoesTela.podeConsultar ||
                    (listaAnosLetivo && listaAnosLetivo.length === 1)
                  }
                  onChange={onChangeAnoLetivo}
                  valueSelect={anoLetivo}
                  placeholder="Ano letivo"
                />
              </Loader>
            </Col>

            <Col sm={24} md={12} xl={10}>
              <Loader loading={carregandoDres} ignorarTip>
                <SelectComponent
                  id={SGP_SELECT_DRE}
                  label="Diretoria Regional de Educação (DRE)"
                  lista={listaDres}
                  valueOption="valor"
                  valueText="desc"
                  disabled={
                    !permissoesTela.podeConsultar ||
                    (listaDres && listaDres.length === 1) ||
                    !anoLetivo
                  }
                  onChange={onChangeDre}
                  valueSelect={dreId}
                  showSearch
                  placeholder="Diretoria Regional de Educação (DRE)"
                />
              </Loader>
            </Col>

            <Col sm={24} md={12} xl={10}>
              <Loader loading={carregandoUes} ignorarTip>
                <SelectComponent
                  id={SGP_SELECT_UE}
                  label="Unidade Escolar (UE)"
                  lista={listaUes}
                  valueOption="valor"
                  valueText="desc"
                  disabled={
                    !permissoesTela.podeConsultar ||
                    (listaUes && listaUes.length === 1) ||
                    !dreId
                  }
                  onChange={onChangeUe}
                  valueSelect={ueId}
                  showSearch
                  placeholder="Unidade Escolar (UE)"
                />
              </Loader>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col sm={24} md={12} xl={8}>
              <SelectComponent
                id={SGP_SELECT_MODALIDADE}
                label="Modalidade"
                lista={listaModalidades}
                valueOption="valor"
                valueText="desc"
                disabled={
                  !permissoesTela.podeConsultar ||
                  (listaModalidades && listaModalidades.length === 1) ||
                  !ueId
                }
                onChange={onChangeModalidade}
                valueSelect={modalidadeId}
                placeholder="Selecione uma modalidade"
              />
            </Col>

            <Col sm={24} md={12} xl={6}>
              <SelectComponent
                id={SGP_SELECT_SEMESTRE}
                lista={listaSemestre}
                valueOption="valor"
                valueText="desc"
                label="Semestre"
                disabled={
                  !permissoesTela.podeConsultar ||
                  !modalidadeId ||
                  Number(modalidadeId) !== modalidade.EJA ||
                  (listaSemestre && listaSemestre.length === 1)
                }
                valueSelect={semestre}
                onChange={onChangeSemestre}
                placeholder="Selecione o semestre"
              />
            </Col>

            <Col sm={24} md={12} xl={10}>
              <SelectComponent
                id={SGP_SELECT_TURMA}
                lista={listaTurmas}
                valueOption="valor"
                valueText="nomeFiltro"
                label="Turma"
                disabled={
                  !permissoesTela.podeConsultar ||
                  !modalidadeId ||
                  listaTurmas?.length === 1 ||
                  (ehEJA && !semestre)
                }
                valueSelect={turmaId}
                onChange={onChangeTurma}
                multiple
                showSearch
                placeholder="Selecione uma ou mais turmas"
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col sm={24} md={12} xl={6}>
              <SelectComponent
                id={SGP_SELECT_VISUALIZACAO}
                label="Visualização"
                lista={listaVisualizacao}
                valueOption="valor"
                valueText="desc"
                valueSelect={visualizacao}
                onChange={onChangeVisualizacao}
                disabled={desabilitaVisualizacao}
                placeholder="Selecione uma visualização"
              />
            </Col>

            <Col sm={24} md={12} xl={4}>
              <SelectComponent
                id={SGP_SELECT_FORMATO}
                label="Formato"
                lista={listaFormatos}
                valueOption="valor"
                valueText="desc"
                valueSelect={formato}
                onChange={onChangeFormato}
                disabled={desabilitarBtnFormato}
                placeholder="Selecione um formato"
              />
            </Col>
          </Row>
        </Col>
      </Card>
    </>
  );
};

export default AtaFinalResultados;