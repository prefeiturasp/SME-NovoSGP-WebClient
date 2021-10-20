import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'antd';

import {
  Button,
  Card,
  CheckboxComponent,
  Colors,
  Loader,
  Localizador,
  SelectComponent,
} from '~/componentes';
import { Cabecalho, FiltroHelper } from '~/componentes-sgp';

import {
  AbrangenciaServico,
  erros,
  history,
  ServicoComponentesCurriculares,
  ServicoFiltroRelatorio,
  ServicoAcompanhamentoRegistros,
  sucesso,
} from '~/servicos';
import { ModalidadeDTO } from '~/dtos';
import { onchangeMultiSelect, ordenarListaMaiorParaMenor } from '~/utils';
import { OPCAO_TODOS } from '~/constantes';

const AcompanhamentoRegistros = () => {
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
  const [
    carregandoComponentesCurriculares,
    setCarregandoComponentesCurriculares,
  ] = useState(false);
  const [
    listaComponentesCurriculares,
    setListaComponentesCurriculares,
  ] = useState([]);
  const [listaBimestres, setListaBimestres] = useState([]);
  const [usuarioRf, setUsuarioRf] = useState();
  const [anoLetivo, setAnoLetivo] = useState();
  const [dreId, setDreId] = useState();
  const [ueId, setUeId] = useState();
  const [modalidadeId, setModalidadeId] = useState();
  const [semestre, setSemestre] = useState();
  const [turmasId, setTurmasId] = useState();
  const [componentesCurriculares, setComponentesCurriculares] = useState();
  const [bimestres, setBimestres] = useState();
  const [clicouBotaoGerar, setClicouBotaoGerar] = useState(false);
  const [desabilitarBtnGerar, setDesabilitarBtnGerar] = useState(true);
  const [carregandoBimestres, setCarregandoBimestres] = useState(false);
  const [consideraHistorico, setConsideraHistorico] = useState(false);

  const limparCampos = () => {
    setModalidadeId();
    setTurmasId();
    setComponentesCurriculares();
    setBimestres();
    setClicouBotaoGerar(false);
  };

  const onChangeConsideraHistorico = e => {
    setConsideraHistorico(e.target.checked);
    setAnoLetivo(anoAtual);
    setDreId();
    setUeId();
    setUsuarioRf();
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
      setListaDres(lista);

      if (lista?.length === 1) {
        setDreId(lista[0].valor);
      }
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
    setClicouBotaoGerar(false);
  };

  const obterSemestres = useCallback(
    async (modalidadeSelecionada, anoLetivoSelecionado) => {
      setCarregandoSemestres(true);
      const retorno = await AbrangenciaServico.obterSemestres(
        consideraHistorico,
        anoLetivoSelecionado,
        modalidadeSelecionada
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoSemestres(false));

      if (retorno?.data?.length) {
        const lista = retorno.data.map(periodo => {
          return { desc: periodo, valor: periodo };
        });

        if (lista?.length === 1) {
          setSemestre(lista[0].valor);
        }
        setListaSemestres(lista);
      }
    },
    [consideraHistorico]
  );

  useEffect(() => {
    if (
      modalidadeId &&
      anoLetivo &&
      String(modalidadeId) === String(ModalidadeDTO.EJA)
    ) {
      obterSemestres(modalidadeId, anoLetivo);
      return;
    }
    setSemestre();
    setListaSemestres([]);
  }, [obterAnosLetivos, obterSemestres, modalidadeId, anoLetivo]);

  const onChangeTurma = valor => {
    setTurmasId(valor);
    setComponentesCurriculares();
    setBimestres();
    setClicouBotaoGerar(false);
  };

  const obterTurmas = useCallback(
    async (modalidadeSelecionada, ue, ano) => {
      if (ue && modalidadeSelecionada) {
        setCarregandoTurmas(true);
        const { data } = await AbrangenciaServico.buscarTurmas(
          ue,
          modalidadeSelecionada,
          '',
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
            setTurmasId([lista[0].valor]);
          }
        }
      }
    },
    [consideraHistorico]
  );

  useEffect(() => {
    if (modalidadeId && ueId) {
      obterTurmas(modalidadeId, ueId, anoLetivo);
      return;
    }
    setTurmasId();
    setListaTurmas([]);
  }, [modalidadeId, ueId, anoLetivo, obterTurmas]);

  const onChangeComponenteCurricular = valor => {
    setComponentesCurriculares(valor);
    setBimestres();
    setClicouBotaoGerar(false);
  };

  const obterComponentesCurriculares = useCallback(
    async (ueCodigo, idsTurma, lista) => {
      if (idsTurma?.length > 0) {
        setCarregandoComponentesCurriculares(true);
        const turmas = [].concat(
          idsTurma[0] === '0'
            ? lista.map(a => a.valor).filter(a => a !== '0')
            : idsTurma
        );
        const disciplinas = await ServicoComponentesCurriculares.obterComponentesPorUeTurmas(
          ueCodigo,
          turmas
        )
          .catch(e => erros(e))
          .finally(() => setCarregandoComponentesCurriculares(false));

        let dadosComponentesCurriculares = [
          {
            codigo: OPCAO_TODOS,
            descricao: 'Todos',
          },
        ];

        if (disciplinas?.data?.length) {
          if (disciplinas.data.length > 1) {
            dadosComponentesCurriculares = dadosComponentesCurriculares.concat(
              disciplinas.data
            );
            setListaComponentesCurriculares(dadosComponentesCurriculares);
            return;
          }

          setListaComponentesCurriculares(disciplinas.data);
          return;
        }
      }

      setComponentesCurriculares();
      setListaComponentesCurriculares([]);
    },
    []
  );

  useEffect(() => {
    if (ueId && turmasId && listaTurmas) {
      obterComponentesCurriculares(ueId, turmasId, listaTurmas);
    }
  }, [ueId, turmasId, listaTurmas, obterComponentesCurriculares]);

  const onChangeBimestre = valor => {
    setBimestres(valor);
    setClicouBotaoGerar(false);
  };

  const obterBimestres = useCallback(async () => {
    setCarregandoBimestres(true);
    const retorno = await ServicoFiltroRelatorio.obterBimestres({
      modalidadeId,
      opcaoTodos: true,
    })
      .catch(e => erros(e))
      .finally(setCarregandoBimestres(false));

    const lista = retorno?.data
      ? retorno.data.map(item => ({
          desc: item.descricao,
          valor: item.valor,
        }))
      : [];
    setListaBimestres(lista);
  }, [modalidadeId]);

  useEffect(() => {
    if (modalidadeId) {
      obterBimestres();
      return;
    }
    setListaBimestres([]);
    setBimestres();
  }, [modalidadeId, obterBimestres]);

  const onChangeLocalizador = valores => {
    setUsuarioRf(valores?.professorRf);
    setClicouBotaoGerar(false);
  };

  const cancelar = () => {
    setAnoLetivo(anoAtual);
    if (dreId) {
      obterDres();
      setDreId();
      setListaDres([]);
    }

    setUeId();
    setListaUes([]);

    setModalidadeId();
    setComponentesCurriculares(undefined);

    setTurmasId(undefined);
    setBimestres();
    setUsuarioRf();
  };

  useEffect(() => {
    const temModalidadeEja = String(modalidadeId) === String(ModalidadeDTO.EJA);
    const consideraSemestre = temModalidadeEja && !semestre;

    const desabilitar =
      !anoLetivo ||
      !dreId ||
      !ueId ||
      !modalidadeId ||
      consideraSemestre ||
      !turmasId?.length ||
      !componentesCurriculares ||
      !bimestres ||
      clicouBotaoGerar;

    setDesabilitarBtnGerar(desabilitar);
  }, [
    anoLetivo,
    dreId,
    ueId,
    modalidadeId,
    turmasId,
    semestre,
    componentesCurriculares,
    bimestres,
    usuarioRf,
    clicouBotaoGerar,
  ]);

  const gerar = async () => {
    setCarregandoGerar(true);
    setClicouBotaoGerar(true);

    const params = {
      exibirHistorico: consideraHistorico,
      anoLetivo,
      dreCodigo: dreId,
      ueCodigo: ueId,
      modalidade: modalidadeId,
      turmasId,
      bimestres,
      componentesCurriculares,
      semestre,
      usuarioRf,
    };

    await ServicoAcompanhamentoRegistros.gerar(params)
      .then(() => {
        sucesso(
          'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
        );
      })
      .catch(e => erros(e))
      .finally(setCarregandoGerar(false));
  };

  return (
    <>
      <Cabecalho pagina="Relatório de acompanhamento dos registros pedagógicos" />
      <Card>
        <Col span={24}>
          <Row gutter={[16, 8]} type="flex" justify="end">
            <Col>
              <Button
                id="btn-voltar-rel-acompanhamento-registros"
                label="Voltar"
                icon="arrow-left"
                color={Colors.Azul}
                border
                onClick={() => {
                  history.push('/');
                }}
              />
            </Col>
            <Col>
              <Button
                id="btn-cancelar-rel-acompanhamento-registros"
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
                  id="btn-gerar-rel-acompanhamento-registros"
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
          <Row gutter={[16, 8]}>
            <Col sm={24}>
              <CheckboxComponent
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
                  id="drop-ano-letivo-rel-pendencias"
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
                  id="drop-dre-rel-pendencias"
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
                  id="drop-ue-rel-pendencias"
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
                  id="drop-modalidade-rel-pendencias"
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
                  id="drop-semestre-rel-pendencias"
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
                  id="drop-turma-rel-pendencias"
                  lista={listaTurmas}
                  valueOption="valor"
                  valueText="nomeFiltro"
                  label="Turma"
                  disabled={
                    !modalidadeId || (listaTurmas && listaTurmas.length === 1)
                  }
                  multiple
                  valueSelect={turmasId}
                  onChange={valores => {
                    onchangeMultiSelect(valores, turmasId, onChangeTurma);
                  }}
                  placeholder="Turma"
                  showSearch
                />
              </Loader>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col sm={24} md={12}>
              <Loader loading={carregandoComponentesCurriculares} ignorarTip>
                <SelectComponent
                  id="drop-componente-curricular-rel-pendencias"
                  lista={listaComponentesCurriculares}
                  valueOption="codigo"
                  valueText="descricao"
                  label="Componente curricular"
                  disabled={
                    !modalidadeId ||
                    !turmasId?.length ||
                    listaComponentesCurriculares?.length === 1
                  }
                  valueSelect={componentesCurriculares}
                  onChange={valores => {
                    onchangeMultiSelect(
                      valores,
                      componentesCurriculares,
                      onChangeComponenteCurricular
                    );
                  }}
                  placeholder="Componente curricular"
                  multiple
                />
              </Loader>
            </Col>
            <Col sm={24} md={12}>
              <Loader loading={carregandoBimestres} ignorarTip>
                <SelectComponent
                  id="drop-bimestre-rel-pendencias"
                  lista={listaBimestres}
                  valueOption="valor"
                  valueText="desc"
                  label="Bimestre"
                  disabled={
                    !modalidadeId ||
                    !turmasId?.length ||
                    !componentesCurriculares?.length
                  }
                  valueSelect={bimestres}
                  onChange={valores => {
                    onchangeMultiSelect(valores, bimestres, onChangeBimestre);
                  }}
                  multiple
                  placeholder="Bimestre"
                />
              </Loader>
            </Col>
          </Row>
          <Row gutter={[16, 16]} type="flex" style={{ padding: '8px 8px 5px' }}>
            <Localizador
              classesRF="px-0"
              dreId={dreId}
              ueId={ueId}
              rfEdicao={usuarioRf}
              anoLetivo={anoLetivo}
              showLabel
              onChange={onChangeLocalizador}
              buscarCaracterPartir={5}
              desabilitado={!ueId}
              buscarPorAbrangencia
            />
          </Row>
        </Col>
      </Card>
    </>
  );
};

export default AcompanhamentoRegistros;
