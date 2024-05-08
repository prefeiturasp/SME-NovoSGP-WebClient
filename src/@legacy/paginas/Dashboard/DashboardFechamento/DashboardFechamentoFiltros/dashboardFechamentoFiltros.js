import * as moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CheckboxComponent, Loader, SelectComponent } from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';
import { OPCAO_TODOS } from '~/constantes/constantes';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import { ServicoFiltroRelatorio } from '~/servicos';
import AbrangenciaServico from '~/servicos/Abrangencia';
import { erros } from '~/servicos/alertas';
import ServicoPeriodoEscolar from '~/servicos/Paginas/Calendario/ServicoPeriodoEscolar';
import ServicoDashboardFechamento from '~/servicos/Paginas/Dashboard/ServicoDashboardFechamento';

const DashboardFechamentoFiltros = () => {
  const usuario = useSelector(store => store.usuario);

  const {
    anoLetivo,
    dre,
    ue,
    modalidade,
    semestre,
    consideraHistorico,
    bimestre,
  } = useSelector(store => store.dashboardFechamento?.dadosDashboardFechamento);

  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [listaBimestres, setListaBimestres] = useState([]);

  const [anoAtual] = useState(moment().format('YYYY'));

  const [carregandoAnosLetivos, setCarregandoAnosLetivos] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [carregandoModalidades, setCarregandoModalidades] = useState(false);
  const [carregandoSemestres, setCarregandoSemestres] = useState(false);
  const [carregandoBimestres, setCarregandoBimestres] = useState(false);

  const validarValorPadraoAnoLetivo = (lista, atual) => {
    let valorAtual;

    if (lista?.length) {
      const temAnoAtualNaLista = lista.find(
        item => String(item.valor) === String(atual)
      );
      if (temAnoAtualNaLista) {
        valorAtual = atual;
      } else {
        valorAtual = lista[0].valor;
      }
    }

    ServicoDashboardFechamento.atualizarFiltros('anoLetivo', valorAtual);
  };
  const naoEhEJAOuCelp =
    Number(modalidade) !== ModalidadeEnum.EJA &&
    Number(modalidade) !== ModalidadeEnum.CELP;

  const ehEJAOuCelp =
    Number(modalidade) === ModalidadeEnum.EJA ||
    Number(modalidade) === ModalidadeEnum.CELP;
  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnosLetivos(true);

    const anosLetivos = await FiltroHelper.obterAnosLetivos({
      consideraHistorico,
      anoMinimo: 2021,
    });

    if (!anosLetivos.length) {
      anosLetivos.push({
        desc: anoAtual,
        valor: anoAtual,
      });
    }

    validarValorPadraoAnoLetivo(anosLetivos, anoAtual);

    setListaAnosLetivo(anosLetivos);
    setCarregandoAnosLetivos(false);
  }, [anoAtual, consideraHistorico]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos, consideraHistorico]);

  const obterUes = useCallback(async () => {
    if (dre?.codigo) {
      if (dre?.codigo === OPCAO_TODOS) {
        const ueTodos = { nome: 'Todas', codigo: OPCAO_TODOS };
        setListaUes([ueTodos]);
        ServicoDashboardFechamento.atualizarFiltros('ue', ueTodos);
        return;
      }

      setCarregandoUes(true);
      const resposta = await AbrangenciaServico.buscarUes(
        dre?.codigo,
        `v1/abrangencias/${consideraHistorico}/dres/${dre?.codigo}/ues?anoLetivo=${anoLetivo}`,
        true
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoUes(false));

      if (resposta?.data?.length) {
        const lista = resposta.data;

        if (usuario.possuiPerfilSmeOuDre) {
          lista.unshift({ codigo: OPCAO_TODOS, nome: 'Todas' });
        }

        setListaUes(lista);

        if (lista?.length === 1) {
          ServicoDashboardFechamento.atualizarFiltros('ue', lista[0]);
        }
      } else {
        setListaUes([]);
      }
    }
  }, [consideraHistorico, anoLetivo, dre, usuario.possuiPerfilSmeOuDre]);

  useEffect(() => {
    if (dre?.codigo) {
      obterUes();
    } else {
      ServicoDashboardFechamento.atualizarFiltros('ue', undefined);
      setListaUes([]);
    }
  }, [dre, anoLetivo, consideraHistorico, obterUes]);

  const onChangeDre = codigoDre => {
    let valorAtal;

    if (codigoDre) {
      const dreAtual = listaDres?.find(item => item.codigo === codigoDre);
      if (dreAtual) {
        valorAtal = dreAtual;
      }
    }
    setListaUes([]);
    ServicoDashboardFechamento.atualizarFiltros('ue', undefined);
    ServicoDashboardFechamento.atualizarFiltros('bimestre', undefined);
    ServicoDashboardFechamento.atualizarFiltros('dre', valorAtal);
  };

  const obterDres = useCallback(async () => {
    if (anoLetivo) {
      setCarregandoDres(true);
      const resposta = await AbrangenciaServico.buscarDres(
        `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`,
        consideraHistorico
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoDres(false));

      if (resposta?.data?.length) {
        const lista = resposta.data;
        if (usuario.possuiPerfilSme) {
          lista.unshift({ codigo: OPCAO_TODOS, nome: 'Todas' });
        }
        setListaDres(lista);

        if (resposta.data.length === 1) {
          ServicoDashboardFechamento.atualizarFiltros('dre', resposta.data[0]);
        }
      } else {
        setListaDres([]);
        ServicoDashboardFechamento.atualizarFiltros('dre', undefined);
      }
    }
  }, [usuario.possuiPerfilSme, anoLetivo, consideraHistorico]);

  useEffect(() => {
    obterDres();
  }, [obterDres, anoLetivo, consideraHistorico]);

  const onChangeUe = codigoUe => {
    ServicoDashboardFechamento.atualizarFiltros('modalidade', undefined);
    ServicoDashboardFechamento.atualizarFiltros('bimestre', undefined);
    setListaModalidades([]);

    let valorAtal;
    if (codigoUe) {
      const ueAtual = listaUes?.find(item => item.codigo === codigoUe);
      if (ueAtual) {
        valorAtal = ueAtual;
      }
    }
    ServicoDashboardFechamento.atualizarFiltros('ue', valorAtal);
  };

  const onChangeAnoLetivo = ano => {
    setListaDres([]);
    setListaUes([]);

    ServicoDashboardFechamento.atualizarFiltros('dre', undefined);
    ServicoDashboardFechamento.atualizarFiltros('ue', undefined);
    ServicoDashboardFechamento.atualizarFiltros('bimestre', undefined);
    ServicoDashboardFechamento.atualizarFiltros('anoLetivo', ano);
  };

  const obterModalidades = useCallback(async () => {
    setCarregandoModalidades(true);

    const resultado = await ServicoFiltroRelatorio.obterModalidades(
      ue?.codigo,
      anoLetivo,
      consideraHistorico
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoModalidades(false));

    if (resultado?.data?.length) {
      if (resultado.data.length === 1) {
        ServicoDashboardFechamento.atualizarFiltros(
          'modalidade',
          resultado.data[0].valor
        );
      }

      setListaModalidades(resultado.data);
    } else {
      setListaModalidades([]);
      ServicoDashboardFechamento.atualizarFiltros('modalidade', undefined);
    }
  }, [ue, anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (ue && anoLetivo) {
      obterModalidades();
    } else {
      setListaModalidades([]);
      ServicoDashboardFechamento.atualizarFiltros('modalidade', undefined);
    }
  }, [ue, anoLetivo, consideraHistorico, obterModalidades]);

  const onChangeModalidade = valor => {
    ServicoDashboardFechamento.atualizarFiltros('semestre', undefined);
    ServicoDashboardFechamento.atualizarFiltros('bimestre', undefined);
    setListaSemestres([]);

    ServicoDashboardFechamento.atualizarFiltros('modalidade', valor);
  };

  const obterSemestres = useCallback(async () => {
    setCarregandoSemestres(true);
    const retorno = await AbrangenciaServico.obterSemestres(
      consideraHistorico,
      anoLetivo,
      modalidade,
      dre?.codigo === OPCAO_TODOS ? '' : dre?.codigo,
      ue?.codigo === OPCAO_TODOS ? '' : ue?.codigo
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoSemestres(false));

    if (retorno?.data?.length) {
      const lista = retorno.data.map(periodo => {
        return { desc: periodo, valor: periodo };
      });

      if (lista?.length === 1) {
        ServicoDashboardFechamento.atualizarFiltros('semestre', lista[0].valor);
      }
      setListaSemestres(lista);
    } else {
      ServicoDashboardFechamento.atualizarFiltros('semestre', undefined);
      setListaSemestres([]);
    }
  }, [consideraHistorico, anoLetivo, modalidade]);

  useEffect(() => {
    if (ue && modalidade && anoLetivo && ehEJAOuCelp) {
      obterSemestres();
    } else {
      ServicoDashboardFechamento.atualizarFiltros('semestre', undefined);
      setListaSemestres([]);
    }
  }, [ue, modalidade, anoLetivo, consideraHistorico, obterSemestres]);

  const onChangeSemestre = valor => {
    ServicoDashboardFechamento.atualizarFiltros('bimestre', undefined);
    setListaBimestres([]);
    ServicoDashboardFechamento.atualizarFiltros('semestre', valor);
  };

  const onChangeBimestre = valor => {
    ServicoDashboardFechamento.atualizarFiltros('bimestre', valor);
  };

  const obterBimestres = useCallback(async () => {
    setCarregandoBimestres(true);
    const dados =
      await ServicoPeriodoEscolar.obterPeriodosPorAnoLetivoModalidade(
        modalidade,
        anoLetivo,
        semestre
      ).finally(() => setCarregandoBimestres(false));

    if (dados?.data?.length) {
      const dadosBimestres = dados.data.map(item => {
        return {
          valor: item.bimestre.toString(),
          descricao: item.descricao,
        };
      });
      dadosBimestres.push({ valor: '0', descricao: 'Final' });
      setListaBimestres(dadosBimestres);
    } else setListaBimestres([]);
  }, [anoLetivo, modalidade, semestre]);

  useEffect(() => {
    const validouEJAOuCELP = ehEJAOuCelp ? !!semestre : true;
    if (anoLetivo && modalidade && validouEJAOuCELP) {
      obterBimestres();
    } else {
      setListaBimestres([]);
    }
  }, [obterBimestres, anoLetivo, modalidade, semestre, ehEJAOuCelp]);

  return (
    <>
      <div className="row">
        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 mb-2 mt-1">
          <CheckboxComponent
            label="Exibir histórico?"
            onChangeCheckbox={e => {
              ServicoDashboardFechamento.atualizarFiltros(
                'anoLetivo',
                undefined
              );
              ServicoDashboardFechamento.atualizarFiltros('dre', undefined);
              ServicoDashboardFechamento.atualizarFiltros('ue', undefined);
              ServicoDashboardFechamento.atualizarFiltros(
                'consideraHistorico',
                e.target.checked
              );
              ServicoDashboardFechamento.atualizarFiltros(
                'bimestre',
                undefined
              );
            }}
            checked={consideraHistorico}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12 col-md-6 col-lg-3 col-xl-2 mb-3 pr-0">
          <Loader loading={carregandoAnosLetivos} ignorarTip>
            <SelectComponent
              id="ano-letivo"
              label="Ano Letivo"
              lista={listaAnosLetivo}
              valueOption="valor"
              valueText="desc"
              disabled={listaAnosLetivo?.length === 1}
              onChange={onChangeAnoLetivo}
              valueSelect={anoLetivo}
              placeholder="Selecione o ano"
            />
          </Loader>
        </div>
        <div className="col-sm-12 col-md-12 col-lg-9 col-xl-5 mb-3 pr-0">
          <Loader loading={carregandoDres} ignorarTip>
            <SelectComponent
              id="dre"
              label="Diretoria Regional de Educação (DRE)"
              lista={listaDres}
              valueOption="codigo"
              valueText="nome"
              disabled={listaDres?.length === 1}
              onChange={onChangeDre}
              valueSelect={dre?.codigo}
              placeholder="Diretoria Regional de Educação (DRE)"
              showSearch
            />
          </Loader>
        </div>
        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-5 mb-3">
          <Loader loading={carregandoUes} ignorarTip>
            <SelectComponent
              id="ue"
              label="Unidade Escolar (UE)"
              lista={listaUes}
              valueOption="codigo"
              valueText="nome"
              disabled={listaUes?.length === 1}
              onChange={onChangeUe}
              valueSelect={ue?.codigo}
              placeholder="Unidade Escolar (UE)"
              showSearch
            />
          </Loader>
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4 mb-3 pr-0">
          <Loader loading={carregandoModalidades} ignorarTip>
            <SelectComponent
              id="modalidade"
              label="Modalidade"
              lista={listaModalidades}
              valueOption="valor"
              valueText="descricao"
              disabled={listaModalidades?.length === 1}
              onChange={onChangeModalidade}
              valueSelect={modalidade}
              placeholder="Selecione uma modalidade"
            />
          </Loader>
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4 mb-3 pr-0">
          <Loader loading={carregandoSemestres} ignorarTip>
            <SelectComponent
              id="semestre"
              label="Semestre"
              lista={listaSemestres}
              valueOption="valor"
              valueText="desc"
              disabled={listaSemestres?.length === 1 || naoEhEJAOuCelp}
              onChange={onChangeSemestre}
              valueSelect={semestre}
              placeholder="Selecione um semestre"
            />
          </Loader>
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4 mb-3">
          <Loader loading={carregandoBimestres} ignorarTip>
            <SelectComponent
              id="bimestre"
              label="Bimestre"
              name="bimestre"
              lista={listaBimestres}
              valueOption="valor"
              valueText="descricao"
              valueSelect={bimestre}
              placeholder="Selecione um bimestre"
              onChange={onChangeBimestre}
              disabled={!modalidade || (ehEJAOuCelp && !semestre)}
            />
          </Loader>
        </div>
      </div>
    </>
  );
};

export default DashboardFechamentoFiltros;
