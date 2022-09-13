import { Col, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  CampoNumero,
  Card,
  CheckboxComponent,
  Colors,
  Loader,
  SelectComponent,
} from '~/componentes';
import { Cabecalho, FiltroHelper } from '~/componentes-sgp';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_GERAR,
  SGP_BUTTON_VOLTAR,
  SGP_CHECKBOX_EXIBIR_HISTORICO,
  SGP_SELECT_ANO_LETIVO,
  SGP_SELECT_DRE,
  SGP_SELECT_MODALIDADE,
  SGP_SELECT_SEMESTRE,
  SGP_SELECT_TURMA,
  SGP_SELECT_UE,
} from '~/componentes-sgp/filtro/idsCampos';
import { OPCAO_TODOS, URL_HOME } from '~/constantes';
import { ModalidadeDTO } from '~/dtos';
import {
  AbrangenciaServico,
  erros,
  history,
  ServicoFiltroRelatorio,
  ServicoRelatorioFrequencia,
  sucesso,
} from '~/servicos';
import {
  onchangeMultiSelect,
  ordenarListaMaiorParaMenor,
  obterTodosMeses,
} from '~/utils';
import api from '~/servicos/api';

const RelatorioFrequenciaMensal = () => {
  const [anoAtual] = useState(window.moment().format('YYYY'));
  const [carregandoGerar, setCarregandoGerar] = useState(false);
  const [carregandoAnos, setCarregandoAnos] = useState(false);
  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [listaDres, setListaDres] = useState([]);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [listaUes, setListaUes] = useState([]);
  const [carregandoModalidades, setCarregandoModalidades] = useState(false);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [carregandoSemestres, setCarregandoSemestres] = useState(false);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [carregandoTurmas, setCarregandoTurmas] = useState(false);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [listaMesesReferencias, setListaMesesReferencias] = useState([]);
  const listaFormatos = [
    { valor: '1', desc: 'PDF' },
    { valor: '4', desc: 'EXCEL' },
  ];

  const [anoLetivo, setAnoLetivo] = useState();
  const [dreId, setDreId] = useState();
  const [ueId, setUeId] = useState();
  const [modalidadeId, setModalidadeId] = useState();
  const [semestre, setSemestre] = useState();
  const [turmasCodigo, setTurmasCodigo] = useState();
  const [desabilitarBtnGerar, setDesabilitarBtnGerar] = useState(true);
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [mesesReferencias, setMesesReferencias] = useState();
  const [tipoFormatoRelatorio, setTipoFormatoRelatorio] = useState('1');
  const [
    apenasAlunosPercentualAbaixoDe,
    setApenasAlunosPercentualAbaixoDe,
  ] = useState();

  const ANO_MINIMO = 2020;

  const limparCampos = () => {
    setModalidadeId();
    setTurmasCodigo();
  };

  const onChangeConsideraHistorico = e => {
    setConsideraHistorico(e.target.checked);
    setAnoLetivo(anoAtual);
    setDreId();
    setUeId();
  };

  const onChangeAnoLetivo = async valor => {
    setDreId();
    setUeId();
    setAnoLetivo(valor);
    limparCampos();
  };

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnos(true);
    let anosLetivos = [];

    const [anosLetivoComHistorico, anosLetivoSemHistorico] = await Promise.all([
      FiltroHelper.obterAnosLetivos({
        consideraHistorico: true,
        anoMinimo: ANO_MINIMO,
      }),
      FiltroHelper.obterAnosLetivos({
        consideraHistorico: false,
      }),
    ])
      .catch(e => erros(e))
      .finally(() => setCarregandoAnos(false));
    anosLetivos = anosLetivos.concat(anosLetivoComHistorico);

    anosLetivoSemHistorico.forEach(ano => {
      if (!anosLetivoComHistorico.find(a => a.valor === ano.valor)) {
        anosLetivos.push(ano);
      }
    });

    if (!anosLetivos.length) {
      anosLetivos.push({
        desc: anoAtual,
        valor: anoAtual,
      });
    }

    if (anosLetivos?.length) {
      const temAnoAtualNaLista = anosLetivos.find(
        item => String(item.valor) === String(anoAtual)
      );
      if (temAnoAtualNaLista) setAnoLetivo(anoAtual);
      else setAnoLetivo(anosLetivos[0].valor);
    }

    setListaAnosLetivo(ordenarListaMaiorParaMenor(anosLetivos, 'valor'));
  }, [anoAtual]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos]);

  const onChangeDre = valor => {
    setDreId(valor);
    setUeId();
    setUeId();
    limparCampos();
  };

  const obterDres = useCallback(async () => {
    setCarregandoDres(true);
    const retorno = await AbrangenciaServico.buscarDres(
      `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoDres(false));
    if (retorno?.data?.length) {
      const lista = retorno.data
        .map(item => ({
          desc: item.nome,
          valor: String(item.codigo),
          abrev: item.abreviacao,
        }))
        .sort(FiltroHelper.ordenarLista('desc'));

      if (lista?.length === 1) {
        setDreId(lista[0].valor);
      } else {
        lista.unshift({
          desc: 'Todas',
          valor: OPCAO_TODOS,
        });
      }

      setListaDres(lista);
      return;
    }
    setListaDres([]);
    setDreId();
  }, [anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (anoLetivo) {
      obterDres();
    }
  }, [obterDres, anoLetivo]);

  const onChangeUe = valor => {
    setUeId(valor);
    limparCampos();
  };

  const obterUes = useCallback(
    async (dre, ano) => {
      if (dre) {
        if (dre === OPCAO_TODOS) {
          setListaUes([{ valor: OPCAO_TODOS, desc: 'Todas' }]);
          setUeId(OPCAO_TODOS);
          return;
        }

        setCarregandoUes(true);
        const { data } = await AbrangenciaServico.buscarUes(
          dre,
          `v1/abrangencias/${consideraHistorico}/dres/${dre}/ues?anoLetivo=${ano}`,
          true
        )
          .catch(e => erros(e))
          .finally(() => setCarregandoUes(false));
        if (data) {
          const lista = data.map(item => ({
            desc: item.nome,
            valor: String(item.codigo),
          }));

          if (lista?.length === 1) {
            setUeId(lista[0].valor);
          } else {
            lista.unshift({
              desc: 'Todas',
              valor: OPCAO_TODOS,
            });
          }

          setListaUes(lista);
          return;
        }
        setListaUes([]);
      }
    },
    [consideraHistorico]
  );

  useEffect(() => {
    if (dreId) {
      obterUes(dreId, anoLetivo);
      return;
    }
    setUeId();
    setListaUes([]);
  }, [dreId, anoLetivo, obterUes]);

  const onChangeModalidade = valor => {
    limparCampos();
    setModalidadeId(valor);
  };

  const obterModalidades = async (ue, ano) => {
    if (ue && ano) {
      setCarregandoModalidades(true);
      const {
        data,
      } = await ServicoFiltroRelatorio.obterModalidadesPorAbrangencia(ue)
        .catch(e => erros(e))
        .finally(() => setCarregandoModalidades(false));

      if (data) {
        const lista = data.map(item => ({
          desc: item.descricao,
          valor: String(item.valor),
        }));

        if (lista?.length === 1) {
          setModalidadeId(lista[0].valor);
        }
        setListaModalidades(lista);
      }
    }
  };

  useEffect(() => {
    if (anoLetivo && ueId) {
      obterModalidades(ueId, anoLetivo);
      return;
    }
    setModalidadeId();
    setListaModalidades([]);
  }, [anoLetivo, ueId]);

  const onChangeSemestre = valor => {
    setSemestre(valor);
  };

  const obterSemestres = useCallback(async () => {
    setCarregandoSemestres(true);
    const retorno = await api
      .get(
        `v1/abrangencias/${consideraHistorico}/semestres?anoLetivo=${anoLetivo}&modalidade=${modalidadeId ||
          0}`
      )
      .catch(e => erros(e))
      .finally(() => {
        setCarregandoSemestres(false);
      });
    if (retorno?.data) {
      const lista = retorno.data.map(periodo => {
        return { desc: periodo, valor: periodo };
      });

      if (lista?.length === 1) {
        setSemestre(lista[0].valor);
      }
      setListaSemestres(lista);
    } else {
      setListaSemestres();
      setSemestre();
    }
  }, [modalidadeId, anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (
      modalidadeId &&
      anoLetivo &&
      String(modalidadeId) === String(ModalidadeDTO.EJA)
    ) {
      setSemestre();
      obterSemestres();
    } else {
      setSemestre();
      setListaSemestres([]);
    }
  }, [modalidadeId, anoLetivo, obterSemestres]);

  const onChangeTurma = valor => {
    setTurmasCodigo(valor);
  };

  const obterTurmas = useCallback(
    async (modalidadeSelecionada, ue, ano, semestreSelecionado) => {
      if (ue && modalidadeSelecionada) {
        const OPCAO_TODAS_TURMA = { valor: OPCAO_TODOS, nomeFiltro: 'Todas' };
        if (ue === OPCAO_TODOS) {
          setListaTurmas([OPCAO_TODAS_TURMA]);
          setTurmasCodigo([OPCAO_TODAS_TURMA.valor]);
          return;
        }

        setCarregandoTurmas(true);
        const { data } = await AbrangenciaServico.buscarTurmas(
          ue,
          modalidadeSelecionada,
          semestreSelecionado,
          ano,
          consideraHistorico
        )
          .catch(e => erros(e))
          .finally(() => setCarregandoTurmas(false));

        if (data) {
          const lista = [];
          if (data.length > 1) {
            lista.push({ valor: OPCAO_TODOS, nomeFiltro: 'Todas' });
          }
          data.map(item =>
            lista.push({
              desc: item.nome,
              valor: item.codigo,
              nomeFiltro: item.nomeFiltro,
            })
          );
          setListaTurmas(lista);
          if (lista.length === 1) {
            setTurmasCodigo([lista[0].valor]);
          }
        }
      }
    },
    [consideraHistorico]
  );

  useEffect(() => {
    if (modalidadeId && ueId) {
      obterTurmas(modalidadeId, ueId, anoLetivo, semestre);
      return;
    }
    setTurmasCodigo();
    setListaTurmas([]);
  }, [modalidadeId, ueId, anoLetivo, semestre, obterTurmas]);

  const cancelar = () => {
    setConsideraHistorico(false);
    setAnoLetivo(anoAtual);
    if (dreId) {
      obterDres();
      setDreId();
      setListaDres([]);
    }
    setUeId();
    setListaUes([]);
    setModalidadeId();
    setTurmasCodigo(undefined);
    setMesesReferencias();
    setApenasAlunosPercentualAbaixoDe();
    setTipoFormatoRelatorio('1');
  };

  const montarMeses = useCallback(() => {
    if (turmasCodigo?.length) {
      const meses = obterTodosMeses();
      delete meses[0];
      meses.unshift({ numeroMes: OPCAO_TODOS, nome: 'Todos' });
      setListaMesesReferencias(meses);
    } else {
      setListaMesesReferencias([]);
      setMesesReferencias();
    }
  }, [turmasCodigo]);

  useEffect(() => {
    montarMeses();
  }, [montarMeses]);

  const onChangeMes = valor => {
    setMesesReferencias(valor);
  };

  const onChangeFormato = valor => setTipoFormatoRelatorio(valor);

  useEffect(() => {
    const temModalidadeEja = String(modalidadeId) === String(ModalidadeDTO.EJA);
    const consideraSemestre = temModalidadeEja && !semestre;

    const desabilitar =
      !anoLetivo ||
      !dreId ||
      !ueId ||
      !modalidadeId ||
      consideraSemestre ||
      !turmasCodigo?.length ||
      !mesesReferencias?.length ||
      !tipoFormatoRelatorio;

    setDesabilitarBtnGerar(desabilitar);
  }, [
    anoLetivo,
    dreId,
    ueId,
    modalidadeId,
    turmasCodigo,
    semestre,
    mesesReferencias,
    tipoFormatoRelatorio,
  ]);

  const gerar = async () => {
    setCarregandoGerar(true);

    const params = {
      exibirHistorico: consideraHistorico,
      anoLetivo,
      codigoDre: dreId,
      codigoUe: ueId,
      modalidade: modalidadeId,
      codigosTurmas: turmasCodigo,
      semestre,
      mesesReferencias,
      apenasAlunosPercentualAbaixoDe,
      tipoFormatoRelatorio,
    };

    await ServicoRelatorioFrequencia.gerar(params, true)
      .then(() => {
        sucesso(
          'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
        );
        setDesabilitarBtnGerar(true);
      })
      .catch(e => erros(e))
      .finally(setCarregandoGerar(false));
  };

  return (
    <>
      <Cabecalho pagina="Relatório de frequência mensal">
        <Row gutter={[8, 8]} type="flex">
          <Col>
            <Button
              id={SGP_BUTTON_VOLTAR}
              label="Voltar"
              icon="arrow-left"
              color={Colors.Azul}
              border
              onClick={() => {
                history.push(URL_HOME);
              }}
            />
          </Col>
          <Col>
            <Button
              id={SGP_BUTTON_CANCELAR}
              label="Cancelar"
              color={Colors.Azul}
              border
              bold
              onClick={cancelar}
            />
          </Col>
          <Col>
            <Loader loading={carregandoGerar} ignorarTip>
              <Button
                id={SGP_BUTTON_GERAR}
                icon="print"
                label="Gerar"
                color={Colors.Roxo}
                bold
                onClick={gerar}
                disabled={desabilitarBtnGerar}
              />
            </Loader>
          </Col>
        </Row>
      </Cabecalho>
      <Card padding="24px 24px">
        <Col span={24}>
          <Row gutter={[16, 8]}>
            <Col sm={24}>
              <CheckboxComponent
                id={SGP_CHECKBOX_EXIBIR_HISTORICO}
                label="Exibir histórico?"
                onChangeCheckbox={onChangeConsideraHistorico}
                checked={consideraHistorico}
                disabled={listaAnosLetivo.length === 1}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col sm={24} md={12} xl={4}>
              <Loader loading={carregandoAnos} ignorarTip>
                <SelectComponent
                  id={SGP_SELECT_ANO_LETIVO}
                  label="Ano Letivo"
                  lista={listaAnosLetivo}
                  valueOption="valor"
                  valueText="desc"
                  disabled={
                    !consideraHistorico ||
                    !listaAnosLetivo?.length ||
                    listaAnosLetivo?.length === 1
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
                    !anoLetivo || listaDres?.length === 1 || !listaDres?.length
                  }
                  onChange={onChangeDre}
                  valueSelect={dreId}
                  placeholder="Diretoria Regional De Educação (DRE)"
                  showSearch
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
                  disabled={!dreId || (listaUes && listaUes.length === 1)}
                  onChange={onChangeUe}
                  valueSelect={ueId}
                  placeholder="Unidade Escolar (UE)"
                  showSearch
                />
              </Loader>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col sm={24} md={12} xl={8}>
              <Loader loading={carregandoModalidades} ignorarTip>
                <SelectComponent
                  id={SGP_SELECT_MODALIDADE}
                  label="Modalidade"
                  lista={listaModalidades}
                  valueOption="valor"
                  valueText="desc"
                  disabled={
                    !ueId || (listaModalidades && listaModalidades.length === 1)
                  }
                  onChange={onChangeModalidade}
                  valueSelect={modalidadeId}
                  placeholder="Modalidade"
                />
              </Loader>
            </Col>
            <Col sm={24} md={12} xl={8}>
              <Loader loading={carregandoSemestres} ignorarTip>
                <SelectComponent
                  id={SGP_SELECT_SEMESTRE}
                  lista={listaSemestres}
                  valueOption="valor"
                  valueText="desc"
                  label="Semestre"
                  disabled={
                    !modalidadeId ||
                    (listaSemestres && listaSemestres.length === 1) ||
                    String(modalidadeId) !== String(ModalidadeDTO.EJA)
                  }
                  valueSelect={semestre}
                  onChange={onChangeSemestre}
                  placeholder="Semestre"
                />
              </Loader>
            </Col>
            <Col sm={24} md={12} xl={8}>
              <Loader loading={carregandoTurmas} ignorarTip>
                <SelectComponent
                  id={SGP_SELECT_TURMA}
                  lista={listaTurmas}
                  valueOption="valor"
                  valueText="nomeFiltro"
                  label="Turma"
                  disabled={
                    !modalidadeId || (listaTurmas && listaTurmas.length === 1)
                  }
                  multiple
                  valueSelect={turmasCodigo}
                  onChange={valores => {
                    onchangeMultiSelect(valores, turmasCodigo, onChangeTurma);
                  }}
                  placeholder="Turma"
                  showSearch
                />
              </Loader>
            </Col>
            <Col sm={24} md={12} xl={8}>
              <Loader loading={carregandoTurmas} ignorarTip>
                <SelectComponent
                  id="meses"
                  lista={listaMesesReferencias}
                  valueOption="numeroMes"
                  valueText="nome"
                  label="Mês de referência"
                  disabled={
                    !turmasCodigo?.length || listaMesesReferencias?.length === 1
                  }
                  multiple
                  valueSelect={mesesReferencias}
                  onChange={valores => {
                    onchangeMultiSelect(valores, mesesReferencias, onChangeMes);
                  }}
                  placeholder="Mês de referência"
                />
              </Loader>
            </Col>
            <Col sm={24} md={12} xl={8}>
              <CampoNumero
                label="Apenas crianças/estudantes com % abaixo de "
                placeholder="Apenas crianças/estudantes com % abaixo de"
                esconderSetas
                onChange={valorNovo => {
                  setApenasAlunosPercentualAbaixoDe(valorNovo);
                }}
                value={apenasAlunosPercentualAbaixoDe}
                min={1}
                max={100}
                className="w-100"
                maxLength={4}
              />
            </Col>
            <Col sm={24} md={12} xl={8}>
              <SelectComponent
                label="Formato"
                lista={listaFormatos}
                valueOption="valor"
                valueText="desc"
                valueSelect={tipoFormatoRelatorio}
                onChange={onChangeFormato}
              />
            </Col>
          </Row>
        </Col>
      </Card>
    </>
  );
};

export default RelatorioFrequenciaMensal;
