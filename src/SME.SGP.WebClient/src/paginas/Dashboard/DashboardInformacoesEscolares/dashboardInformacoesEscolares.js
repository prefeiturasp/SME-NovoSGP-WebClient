import * as moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CheckboxComponent, Loader, SelectComponent } from '~/componentes';
import { Cabecalho, FiltroHelper } from '~/componentes-sgp';
import Button from '~/componentes/button';
import Card from '~/componentes/card';
import { Colors } from '~/componentes/colors';
import { OPCAO_TODOS } from '~/constantes/constantes';
import { URL_HOME } from '~/constantes/url';
import { ServicoFiltroRelatorio } from '~/servicos';
import AbrangenciaServico from '~/servicos/Abrangencia';
import { erros } from '~/servicos/alertas';
import history from '~/servicos/history';
import TabsDashboardInformacoesEscolares from './TabsDashboardInformacoesEscolares/tabsDashboardInformacoesEscolares';

const DashboardInformacoesEscolares = () => {
  const usuario = useSelector(store => store.usuario);

  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);

  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [anoAtual] = useState(moment().format('YYYY'));
  const [anoLetivo, setAnoLetivo] = useState(anoAtual);
  const [dre, setDre] = useState();
  const [ue, setUe] = useState();
  const [modalidade, setModalidade] = useState();

  const [carregandoAnosLetivos, setCarregandoAnosLetivos] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [carregandoModalidades, setCarregandoModalidades] = useState(false);

  const validarValorPadraoAnoLetivo = (lista, atual) => {
    if (lista?.length) {
      const temAnoAtualNaLista = lista.find(
        item => String(item.valor) === String(atual)
      );
      if (temAnoAtualNaLista) {
        setAnoLetivo(atual);
      } else {
        setAnoLetivo(lista[0].valor);
      }
    } else {
      setAnoLetivo();
    }
  };

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnosLetivos(true);

    const anosLetivos = await FiltroHelper.obterAnosLetivos({
      consideraHistorico,
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
        setUe(ueTodos);
        return;
      }

      setCarregandoUes(true);
      const resposta = await AbrangenciaServico.buscarUes(
        dre?.codigo,
        `v1/abrangencias/${consideraHistorico}/dres/${
          dre?.codigo
        }/ues?anoLetivo=${anoLetivo}&consideraNovasUEs=${true}`,
        true
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoUes(false));

      if (resposta?.data?.length) {
        const lista = resposta.data;

        if (usuario.possuiPerfilSmeOuDre && lista?.length > 1) {
          lista.unshift({ codigo: OPCAO_TODOS, nome: 'Todas' });
        }

        setListaUes(lista);

        if (lista?.length === 1) {
          setUe(lista[0]);
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
      setUe();
      setListaUes([]);
    }
  }, [dre, anoLetivo, consideraHistorico, obterUes]);

  const onChangeDre = codigoDre => {
    if (codigoDre) {
      const dreAtual = listaDres?.find(item => item.codigo === codigoDre);
      if (dreAtual) {
        setDre(dreAtual);
      }
    } else {
      setDre();
    }
    setListaUes([]);
    setUe(undefined);
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
        if (usuario.possuiPerfilSme && lista?.length > 1) {
          lista.unshift({ codigo: OPCAO_TODOS, nome: 'Todas' });
        }
        setListaDres(lista);

        if (resposta.data.length === 1) {
          setDre(resposta.data[0]);
        }
      } else {
        setListaDres([]);
        setDre();
      }
    }
  }, [usuario.possuiPerfilSme, anoLetivo, consideraHistorico]);

  useEffect(() => {
    obterDres();
  }, [obterDres, anoLetivo, consideraHistorico]);

  const obterModalidades = useCallback(async () => {
    setCarregandoModalidades(true);

    const resultado = await ServicoFiltroRelatorio.obterModalidades(
      ue?.codigo,
      anoLetivo,
      consideraHistorico,
      true
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoModalidades(false));

    if (resultado?.data?.length) {
      if (resultado.data.length === 1) {
        setModalidade(String(resultado.data[0].valor));
      }

      setListaModalidades(resultado.data);
    } else {
      setListaModalidades([]);
      setModalidade();
    }
  }, [ue, anoLetivo]);

  useEffect(() => {
    if (ue && anoLetivo) {
      obterModalidades();
    } else {
      setListaModalidades([]);
      setModalidade();
    }
  }, [ue, anoLetivo, obterModalidades]);

  const onClickVoltar = () => {
    history.push(URL_HOME);
  };

  const onChangeUe = codigoUe => {
    setModalidade();
    setListaModalidades([]);
    if (codigoUe) {
      const ueAtual = listaUes?.find(item => item.codigo === codigoUe);
      if (ueAtual) {
        setUe(ueAtual);
      }
    } else {
      setUe();
    }
  };

  const onChangeAnoLetivo = ano => {
    setDre();
    setUe();
    setListaDres([]);
    setListaUes([]);
    setAnoLetivo(ano);
  };

  const onChangeModalidade = valor => setModalidade(valor);

  return (
    <>
      <Cabecalho pagina="Dashboard Informações escolares" />
      <Card>
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12 d-flex justify-content-end pb-4">
              <Button
                id="btn-voltar"
                label="Voltar"
                icon="arrow-left"
                color={Colors.Azul}
                border
                onClick={onClickVoltar}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 mb-2">
              <CheckboxComponent
                label="Exibir histórico?"
                onChangeCheckbox={e => {
                  setAnoLetivo();
                  setDre();
                  setUe();
                  setConsideraHistorico(e.target.checked);
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
          <div className="row">
            <div className="col-md-12 mt-2">
              <TabsDashboardInformacoesEscolares
                anoLetivo={anoLetivo}
                dreId={OPCAO_TODOS === dre?.codigo ? OPCAO_TODOS : dre?.id}
                ueId={OPCAO_TODOS === ue?.codigo ? OPCAO_TODOS : ue?.id}
                modalidade={modalidade}
              />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default DashboardInformacoesEscolares;
