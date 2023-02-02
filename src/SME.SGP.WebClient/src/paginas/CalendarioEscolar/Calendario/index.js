import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  Base,
  Button,
  Card,
  Colors,
  Grid,
  Loader,
  SelectAutocomplete,
  SelectComponent,
  CheckboxComponent,
} from '~/componentes';
import { Cabecalho, FiltroHelper } from '~/componentes-sgp';
import Calendario from '~/componentes-sgp/calendarioEscolar/Calendario';
import { store } from '~/redux';
import { zeraCalendario } from '~/redux/modulos/calendarioEscolar/actions';
import {
  AbrangenciaServico,
  api,
  history,
  ServicoCalendarios,
} from '~/servicos';
import { erro, sucesso } from '~/servicos/alertas';
import { Div } from './index.css';
import { OPCAO_TODOS } from '~/constantes';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { SGP_CHECKBOX_EXIBIR_HISTORICO } from '~/constantes/ids/checkbox';
export const ContainerLabelDiasLetivos = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  background-color: ${props => props.color};
  color: white;
  padding: 6px;
  border-radius: 4px;
`;

const CalendarioEscolar = () => {
  const [anoLetivo, setAnoLetivo] = useState();
  const [tipoCalendarioSelecionado, setTipoCalendarioSelecionado] = useState(
    undefined
  );
  const [diasLetivos, setDiasLetivos] = useState({});
  const [carregandoTipos, setCarregandoTipos] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [imprimindo, setImprimindo] = useState(false);
  const [podeImprimir, setPodeImprimir] = useState(false);
  const [unidadesEscolares, setUnidadesEscolares] = useState([]);
  const [listaTipoCalendario, setListaTipoCalendario] = useState([]);
  const [valorTipoCalendario, setValorTipoCalendario] = useState('');
  const [pesquisaTipoCalendario, setPesquisaTipoCalendario] = useState('');
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const eventoCalendarioEdicao = useSelector(
    state => state.calendarioEscolar.eventoCalendarioEdicao
  );

  const usuario = useSelector(s => s.usuario);

  const [eventoSme] = useState(true);

  const selecionarTipoCalendario = useCallback(() => {
    const calendarioId = eventoCalendarioEdicao.tipoCalendario;
    const calendario = listaTipoCalendario?.find(
      item => item.id === calendarioId
    );

    if (calendario) {
      setValorTipoCalendario(calendario.descricao);
      setTipoCalendarioSelecionado(calendarioId);
      setAnoLetivo(calendario.anoLetivo);
    }
  }, [eventoCalendarioEdicao, listaTipoCalendario]);

  useEffect(() => {
    if (eventoCalendarioEdicao?.tipoCalendario) {
      if (eventoCalendarioEdicao.eventoSme) {
        selecionarTipoCalendario();
      }
    }
  }, [eventoCalendarioEdicao, selecionarTipoCalendario]);

  const [dreSelecionada, setDreSelecionada] = useState(undefined);
  const [unidadeEscolarSelecionada, setUnidadeEscolarSelecionada] = useState(
    undefined
  );

  const consultarDiasLetivos = () => {
    api
      .post('v1/calendarios/dias-letivos', {
        tipoCalendarioId: tipoCalendarioSelecionado,
        dreId: dreSelecionada,
        ueId: unidadeEscolarSelecionada,
      })
      .then(resposta => {
        if (resposta.data) setDiasLetivos(resposta.data);
      })
      .catch(() => {
        setDiasLetivos({});
      });
  };

  const dresStore = useSelector(state => state.filtro.dres);
  const [dres, setDres] = useState([]);

  const obterDres = () => {
    setUnidadeEscolarSelecionada(undefined);
    setUnidadesEscolares([]);
    setCarregandoDres(true);
    api
      .get('v1/abrangencias/false/dres')
      .then(resposta => {
        if (resposta.data) {
          const lista = [];
          if (resposta.data) {
            resposta.data.forEach(dre => {
              lista.push({
                desc: dre.nome,
                valor: dre.codigo,
                abrev: dre.abreviacao,
              });
            });
            setDres(lista.sort(FiltroHelper.ordenarLista('desc')));
            if (usuario.possuiPerfilSme) {
              lista.unshift({ valor: OPCAO_TODOS, desc: 'Todas' });
              setDreSelecionada(OPCAO_TODOS);
            }
          }
          setCarregandoDres(false);
        }
      })
      .catch(() => {
        setDres(dresStore);
        setCarregandoDres(false);
      });
  };

  const [filtros, setFiltros] = useState({
    tipoCalendarioSelecionado,
    eventoSme,
    dreSelecionada,
    unidadeEscolarSelecionada,
  });

  const [carregandoMeses, setCarregandoMeses] = useState(false);

  useEffect(() => {
    setDreSelecionada(undefined);
    setDres([]);
    obterDres();

    setFiltros({
      tipoCalendarioSelecionado,
      eventoSme,
      dreSelecionada,
      unidadeEscolarSelecionada,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tipoCalendarioSelecionado && unidadeEscolarSelecionada) {
      consultarDiasLetivos();
    } else {
      setDiasLetivos();
    }
    store.dispatch(zeraCalendario());
    setFiltros({
      tipoCalendarioSelecionado,
      eventoSme,
      dreSelecionada,
      unidadeEscolarSelecionada,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoCalendarioSelecionado, unidadeEscolarSelecionada]);

  const aoClicarBotaoVoltar = () => {
    history.push('/');
  };

  useEffect(() => {
    setFiltros({
      tipoCalendarioSelecionado,
      eventoSme,
      dreSelecionada,
      unidadeEscolarSelecionada,
    });
    store.dispatch(zeraCalendario());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventoSme]);

  useEffect(() => {
    if (!dreSelecionada && carregandoMeses) {
      setCarregandoDres(true);
      return;
    }
    setCarregandoDres(false);
    if (dres.length === 1) {
      setDreSelecionada(dres[0].valor);
    } else if (dres && eventoCalendarioEdicao && eventoCalendarioEdicao.dre) {
      setDreSelecionada(eventoCalendarioEdicao.dre);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dres, carregandoMeses]);

  const unidadesEscolaresStore = useSelector(
    state => state.filtro.unidadesEscolares
  );

  const obterUnidadesEscolares = dre => {
    if (dre === OPCAO_TODOS) {
      setUnidadesEscolares([{ valor: OPCAO_TODOS, desc: 'Todas' }]);
      return;
    }

    setCarregandoUes(true);
    const calendario = listaTipoCalendario.find(
      item => item.id === tipoCalendarioSelecionado
    );

    const modalidade = ServicoCalendarios.converterModalidade(
      calendario?.modalidade
    );
    AbrangenciaServico.buscarUes(dre, '', false, modalidade,consideraHistorico)
      .then(resposta => {
        if (resposta.data) {
          const lista = [];
          if (resposta.data) {
            resposta.data.forEach(unidade => {
              lista.push({
                desc: unidade.nome,
                valor: unidade.codigo,
              });
            });

            setUnidadesEscolares(lista);
            if (lista.length && usuario.possuiPerfilSmeOuDre) {
              lista.unshift({ valor: OPCAO_TODOS, desc: 'Todas' });
              setUnidadeEscolarSelecionada(OPCAO_TODOS);
            }
          }
        }
        setCarregandoUes(false);
      })
      .catch(() => {
        setUnidadesEscolares(unidadesEscolaresStore);
        setCarregandoUes(false);
      });
  };

  const gerarRelatorio = async () => {
    setImprimindo(true);
    const payload = {
      DreCodigo: dreSelecionada,
      UeCodigo: unidadeEscolarSelecionada,
      TipoCalendarioId: tipoCalendarioSelecionado,
      EhSME: eventoSme,
    };
    await ServicoCalendarios.gerarRelatorio(payload)
      .then(() => {
        sucesso(
          'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
        );
      })
      .finally(setImprimindo(false))
      .catch(e => erro(e));
  };

  useEffect(() => {
    if (unidadesEscolares.length === 1) {
      setUnidadeEscolarSelecionada(unidadesEscolares[0].valor);
    } else if (
      unidadesEscolares &&
      eventoCalendarioEdicao &&
      eventoCalendarioEdicao.unidadeEscolar
    ) {
      setDreSelecionada(eventoCalendarioEdicao.dre);
      setUnidadeEscolarSelecionada(eventoCalendarioEdicao.unidadeEscolar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unidadesEscolares, carregandoMeses]);

  const aoSelecionarDre = dre => {
    setValorTipoCalendario();
    setTipoCalendarioSelecionado();
    setAnoLetivo();
    store.dispatch(zeraCalendario());
    setDreSelecionada(dre);
    setUnidadeEscolarSelecionada();
  };

  useEffect(() => {
    if (dreSelecionada) {
      obterUnidadesEscolares(dreSelecionada);
    } else {
      setUnidadeEscolarSelecionada();
    }
    setFiltros({
      tipoCalendarioSelecionado,
      eventoSme,
      dreSelecionada,
      unidadeEscolarSelecionada,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dreSelecionada]);

  const aoSelecionarUnidadeEscolar = unidade => {
    setValorTipoCalendario();
    setTipoCalendarioSelecionado();
    setAnoLetivo();
    setUnidadeEscolarSelecionada(unidade);
  };

  useEffect(() => {
    setPodeImprimir(tipoCalendarioSelecionado);
  }, [tipoCalendarioSelecionado]);

  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      if (!unidadeEscolarSelecionada) {
        setValorTipoCalendario();
        setTipoCalendarioSelecionado();
        setAnoLetivo();
        return;
      }
      setCarregandoTipos(true);
      setCarregandoMeses(true);

      const {
        data,
      } = await ServicoCalendarios.obterTiposCalendarioAutoComplete(
        pesquisaTipoCalendario
      );

      if (isSubscribed) {
        setListaTipoCalendario(data);
        setCarregandoTipos(false);
        setCarregandoMeses(false);

        if (data?.length === 1) {
          setValorTipoCalendario(data[0].descricao);
          setTipoCalendarioSelecionado(data[0].id);
          setAnoLetivo(data[0].anoLetivo);
        }
      }
    })();

    return () => {
      isSubscribed = false;
    };
  }, [pesquisaTipoCalendario, unidadeEscolarSelecionada]);

  const selecionaTipoCalendario = descricao => {
    const tipo = listaTipoCalendario?.find(t => t.descricao === descricao);
    if (Number(tipo?.id) || !tipo?.id) {
      store.dispatch(zeraCalendario());
      setValorTipoCalendario(descricao);
    }
    setTipoCalendarioSelecionado(tipo?.id);
    setAnoLetivo(tipo?.anoLetivo);
  };

  const handleSearch = descricao => {
    if (descricao.length > 2 || descricao.length === 0) {
      setPesquisaTipoCalendario(descricao);
    }
  };
  const onCheckedConsideraHistorico = e => {
    limparFiltrosSelecionados();
    setConsideraHistorico(e.target.checked);
  };
  const limparFiltrosSelecionados = () => {
    setValorTipoCalendario();
    setTipoCalendarioSelecionado();
    setAnoLetivo();
    store.dispatch(zeraCalendario());
    setDreSelecionada();
    setUnidadeEscolarSelecionada();
  };

  return (
    <>
      <Cabecalho pagina="Calendário escolar">
        <BotaoVoltarPadrao onClick={() => aoClicarBotaoVoltar()} />
      </Cabecalho>
      <Card>
        <Grid cols={12}>
          <Div className="row">
          <div className="col-sm-12 mb-4">
              <CheckboxComponent
                id={SGP_CHECKBOX_EXIBIR_HISTORICO}
                label="Exibir histórico?"
                onChangeCheckbox={onCheckedConsideraHistorico}
                checked={consideraHistorico}
              />
            </div>
            <Grid cols={6} className="mb-2">
              <Loader loading={carregandoDres}>
                <SelectComponent
                  id="dre"
                  onChange={aoSelecionarDre}
                  lista={dres}
                  valueOption="valor"
                  valueText="desc"
                  valueSelect={dreSelecionada}
                  placeholder="Diretoria Regional de Educação (DRE)"
                  disabled={!dres?.length || dres?.length === 1}
                  showSearch
                  label="Diretoria Regional de Educação (DRE)"
                />
              </Loader>
            </Grid>
            <Grid cols={6} className="mb-2">
              <Loader loading={carregandoUes} tip="">
                <SelectComponent
                  id="ue"
                  onChange={aoSelecionarUnidadeEscolar}
                  lista={unidadesEscolares}
                  valueOption="valor"
                  valueText="desc"
                  valueSelect={unidadeEscolarSelecionada}
                  placeholder="Unidade Escolar (UE)"
                  disabled={!dreSelecionada || unidadesEscolares?.length === 1}
                  showSearch
                  label="Unidade Escolar (UE)"
                />
              </Loader>
            </Grid>
            <Grid cols={6}>
              <Loader loading={carregandoTipos} tip="">
                <SelectAutocomplete
                  showList
                  isHandleSearch
                  placeholder="Tipo de calendário"
                  className="col-md-12"
                  name="tipoCalendarioId"
                  id="tipoCalendarioId"
                  lista={listaTipoCalendario}
                  valueField="id"
                  textField="descricao"
                  onSelect={selecionaTipoCalendario}
                  onChange={selecionaTipoCalendario}
                  handleSearch={handleSearch}
                  value={valorTipoCalendario}
                  disabled={
                    listaTipoCalendario?.length === 1 ||
                    !unidadeEscolarSelecionada
                  }
                  label="Calendário"
                />
              </Loader>
            </Grid>
          </Div>
          <Div className="row ">
            <Grid
              cols={12}
              className="d-flex"
              style={{ justifyContent: 'space-between', marginTop: '40px' }}
            >
              <Div className="mb-2">
                <Loader loading={imprimindo} ignorarTip>
                  <Button
                    className="btn-imprimir"
                    icon="print"
                    color={Colors.Azul}
                    border
                    onClick={() => gerarRelatorio()}
                    disabled={!podeImprimir}
                    id="btn-imprimir-relatorio-calendario"
                  />
                </Loader>
              </Div>

              <Div className="mb-2 d-flex" style={{ alignItems: 'center' }}>
                {diasLetivos && diasLetivos?.estaAbaixoPermitido ? (
                  <ContainerLabelDiasLetivos color={Base.LaranjaCalendario}>
                    Abaixo do mínimo estabelecido pela legislação
                  </ContainerLabelDiasLetivos>
                ) : (
                  ''
                )}
                {diasLetivos &&
                (diasLetivos.dias || diasLetivos?.estaAbaixoPermitido) ? (
                  <ContainerLabelDiasLetivos
                    className="ml-2"
                    color={
                      diasLetivos?.estaAbaixoPermitido
                        ? Base.LaranjaCalendario
                        : Base.Azul
                    }
                  >
                    Nº de dias letivos: {diasLetivos?.dias?.toString()}
                  </ContainerLabelDiasLetivos>
                ) : (
                  ''
                )}
              </Div>
            </Grid>
          </Div>

          <Div className="row">
            <Grid cols={12}>
              <Loader loading={carregandoMeses}>
                <Calendario filtros={{ ...filtros, anoLetivo }} />
              </Loader>
            </Grid>
          </Div>
        </Grid>
      </Card>
    </>
  );
};

export default CalendarioEscolar;
