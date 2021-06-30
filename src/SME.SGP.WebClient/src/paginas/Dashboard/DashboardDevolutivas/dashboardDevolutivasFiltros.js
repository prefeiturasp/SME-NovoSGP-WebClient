import * as moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CheckboxComponent, Loader, SelectComponent } from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';
import { ANO_INICIO_INFANTIL } from '~/constantes/constantes';
import { OPCAO_TODOS } from '~/constantes/constantesGerais';
import { ServicoFiltroRelatorio } from '~/servicos';
import AbrangenciaServico from '~/servicos/Abrangencia';
import { erros } from '~/servicos/alertas';
import ServicoDashboardDevolutivas from '~/servicos/Paginas/Dashboard/ServicoDashboardDevolutivas';

const DashboardDevolutivasFiltros = () => {
  const usuario = useSelector(store => store.usuario);

  const { anoLetivo, dre, ue, modalidade, consideraHistorico } = useSelector(
    store => store.dashboardDevolutivas?.dadosDashboardDevolutivas
  );

  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);

  const [anoAtual] = useState(moment().format('YYYY'));

  const [carregandoAnosLetivos, setCarregandoAnosLetivos] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [carregandoModalidades, setCarregandoModalidades] = useState(false);

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

    ServicoDashboardDevolutivas.atualizarFiltros('anoLetivo', valorAtual);
  };

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnosLetivos(true);

    const anosLetivos = await FiltroHelper.obterAnosLetivos({
      consideraHistorico,
      anoMinimo: ANO_INICIO_INFANTIL,
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
        ServicoDashboardDevolutivas.atualizarFiltros('ue', ueTodos);
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
          ServicoDashboardDevolutivas.atualizarFiltros('ue', lista[0]);
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
      ServicoDashboardDevolutivas.atualizarFiltros('ue', undefined);
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
    ServicoDashboardDevolutivas.atualizarFiltros('ue', undefined);
    ServicoDashboardDevolutivas.atualizarFiltros('dre', valorAtal);
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
          ServicoDashboardDevolutivas.atualizarFiltros('dre', resposta.data[0]);
        }
      } else {
        setListaDres([]);
        ServicoDashboardDevolutivas.atualizarFiltros('dre', undefined);
      }
    }
  }, [usuario.possuiPerfilSme, anoLetivo, consideraHistorico]);

  useEffect(() => {
    obterDres();
  }, [obterDres, anoLetivo, consideraHistorico]);

  const onChangeUe = codigoUe => {
    ServicoDashboardDevolutivas.atualizarFiltros('modalidade', undefined);
    setListaModalidades([]);

    let valorAtal;
    if (codigoUe) {
      const ueAtual = listaUes?.find(item => item.codigo === codigoUe);
      if (ueAtual) {
        valorAtal = ueAtual;
      }
    }
    ServicoDashboardDevolutivas.atualizarFiltros('ue', valorAtal);
  };

  const onChangeAnoLetivo = ano => {
    setListaDres([]);
    setListaUes([]);

    ServicoDashboardDevolutivas.atualizarFiltros('dre', undefined);
    ServicoDashboardDevolutivas.atualizarFiltros('ue', undefined);
    ServicoDashboardDevolutivas.atualizarFiltros('anoLetivo', ano);
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
        ServicoDashboardDevolutivas.atualizarFiltros(
          'modalidade',
          resultado.data[0].valor
        );
      }

      setListaModalidades(resultado.data);
    } else {
      setListaModalidades([]);
      ServicoDashboardDevolutivas.atualizarFiltros('modalidade', undefined);
    }
  }, [ue, anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (ue && anoLetivo) {
      obterModalidades();
    } else {
      setListaModalidades([]);
      ServicoDashboardDevolutivas.atualizarFiltros('modalidade', undefined);
    }
  }, [ue, anoLetivo, consideraHistorico, obterModalidades]);

  const onChangeModalidade = valor => {
    ServicoDashboardDevolutivas.atualizarFiltros('modalidade', valor);
  };

  return (
    <>
      <div className="row">
        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 mb-2">
          <CheckboxComponent
            label="Exibir histórico?"
            onChangeCheckbox={e => {
              ServicoDashboardDevolutivas.atualizarFiltros(
                'anoLetivo',
                undefined
              );
              ServicoDashboardDevolutivas.atualizarFiltros('dre', undefined);
              ServicoDashboardDevolutivas.atualizarFiltros('ue', undefined);
              ServicoDashboardDevolutivas.atualizarFiltros(
                'consideraHistorico',
                e.target.checked
              );
            }}
            checked={consideraHistorico}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12 col-md-6 col-lg-3 col-xl-2 mb-2">
          <Loader loading={carregandoAnosLetivos}>
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
        <div className="col-sm-12 col-md-12 col-lg-9 col-xl-5 mb-2">
          <Loader loading={carregandoDres}>
            <SelectComponent
              id="dre"
              label="DRE"
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
        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-5 mb-2">
          <Loader loading={carregandoUes}>
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
        <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4 mb-2">
          <Loader loading={carregandoModalidades}>
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
      </div>
    </>
  );
};

export default DashboardDevolutivasFiltros;
