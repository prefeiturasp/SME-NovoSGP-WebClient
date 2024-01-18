import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CheckboxComponent, Loader, SelectComponent } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';
import Card from '~/componentes/card';
import { URL_HOME } from '~/constantes';
import { OPCAO_TODOS } from '~/constantes/constantes';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import { AbrangenciaServico } from '~/servicos';
import { erros, sucesso } from '~/servicos/alertas';
import api from '~/servicos/api';
import ServicoFiltroRelatorio from '~/servicos/Paginas/FiltroRelatorio/ServicoFiltroRelatorio';
import ServicoRelatorioParecerConclusivo from '~/servicos/Paginas/Relatorios/ParecerConclusivo/ServicoRelatorioParecerConclusivo';
import { ordenarListaMaiorParaMenor } from '~/utils/funcoes/gerais';
import FiltroHelper from '~/componentes-sgp/filtro/helper';
import { CorpoRelatorio } from './relatorioParecerConclusivo.css';
import { useNavigate } from 'react-router-dom';

const RelatorioParecerConclusivo = () => {
  const navigate = useNavigate();

  const usuario = useSelector(store => store.usuario);
  const { possuiPerfilSme, possuiPerfilDre } = usuario;

  const [carregandoGerar, setCarregandoGerar] = useState(false);
  const [carregandoAnosLetivos, setCarregandoAnosLetivos] = useState(false);
  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [listaDres, setListaDres] = useState([]);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [listaUes, setListaUes] = useState([]);
  const [carregandoModalidades, setCarregandoModalidades] = useState(false);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [carregandoSemestres, setCarregandoSemestres] = useState(false);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [carregandoCiclos, setCarregandoCiclos] = useState(false);
  const [listaCiclos, setListaCiclos] = useState([]);
  const [carregandoAnos, setCarregandoAnos] = useState(false);
  const [listaAnos, setListaAnos] = useState([]);
  const [carregandoPareceresConclusivos, setCarregandoPareceresConclusivos] =
    useState(false);
  const [listaPareceresConclusivos, setListaPareceresConclusivos] = useState(
    []
  );
  const listaFormatos = [
    { valor: '1', desc: 'PDF' },
    { valor: '4', desc: 'Excel' },
  ];

  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [anoLetivo, setAnoLetivo] = useState(undefined);
  const [dreId, setDreId] = useState(undefined);
  const [ueId, setUeId] = useState(undefined);
  const [modalidadeId, setModalidadeId] = useState(undefined);
  const [semestre, setSemestre] = useState(undefined);
  const [ciclo, setCiclo] = useState(undefined);
  const [ano, setAno] = useState(undefined);
  const [parecerConclusivoId, setParecerConclusivoId] = useState(undefined);
  const [formato, setFormato] = useState('1');
  const [clicouBotaoGerar, setClicouBotaoGerar] = useState(false);
  const [desabilitarBtnGerar, setDesabilitarBtnGerar] = useState(true);

  const [anoAtual] = useState(window.moment().format('YYYY'));

  const [modoEdicao, setModoEdicao] = useState(false);

  const ehEjaOuCelp =
    Number(modalidadeId) === ModalidadeEnum.EJA ||
    Number(modalidadeId) === ModalidadeEnum.CELP;

  const onChangeConsideraHistorico = e => {
    setConsideraHistorico(e.target.checked);
    setDreId();
    setUeId();
    setListaUes([]);
    setModalidadeId();
    setListaModalidades([]);
    setSemestre();
    setListaSemestres([]);
    setModoEdicao(true);
  };

  const onChangeAnoLetivo = valor => {
    setAnoLetivo(valor);
    setDreId();
    setListaDres([]);
    setUeId();
    setListaUes([]);
    setModalidadeId();
    setListaModalidades([]);
    setSemestre();
    setListaSemestres([]);
    setModoEdicao(true);
  };

  const onChangeDre = valor => {
    setListaUes([]);
    setUeId();
    setCiclo();
    setListaCiclos([]);
    setModalidadeId();
    setListaModalidades([]);
    setAno();
    setListaAnos([]);
    setDreId(valor);
    setModoEdicao(true);
  };

  const onChangeUe = valor => {
    setModalidadeId();
    setListaModalidades([]);
    setCiclo();
    setListaCiclos([]);
    setAno();
    setListaAnos([]);
    setUeId(valor);
    setModoEdicao(true);
  };

  const onChangeModalidade = valor => {
    setAno();
    setListaAnos([]);
    setCiclo();
    setListaCiclos([]);
    setModalidadeId(valor);
    setModoEdicao(true);
  };

  const onChangeSemestre = valor => {
    setSemestre(valor);
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const onChangeCiclos = valor => {
    setAno();
    setListaAnos([]);
    setCiclo(valor);
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const onChangeAnos = valor => {
    if (valor.find(e => e === OPCAO_TODOS)) {
      valor = OPCAO_TODOS;
    }
    setAno(valor);
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const onChangeParecerConclusivo = valor => {
    setParecerConclusivoId(valor);
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const onChangeFormato = valor => {
    setFormato(valor);
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const obterDres = useCallback(async () => {
    if (anoLetivo) {
      setCarregandoDres(true);
      const response = await AbrangenciaServico.buscarDres(
        `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`,
        consideraHistorico
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoDres(false));

      if (response?.data?.length) {
        const lista = response.data.map(item => ({
          desc: item.nome,
          valor: String(item.codigo),
          abrev: item.abreviacao,
        }));

        if (lista?.length > 1 && possuiPerfilSme) {
          lista.unshift({ valor: OPCAO_TODOS, desc: 'Todas' });
        }

        setListaDres(lista);

        if (lista?.length === 1) {
          setDreId(lista[0].valor);
        }
      } else {
        setListaDres([]);
        setDreId(undefined);
      }
    }
  }, [anoLetivo, consideraHistorico, possuiPerfilSme]);

  useEffect(() => {
    obterDres();
  }, [obterDres, anoLetivo, consideraHistorico]);

  const obterUes = useCallback(async () => {
    if (dreId === OPCAO_TODOS) {
      setListaUes([{ valor: OPCAO_TODOS, desc: 'Todas' }]);
      setUeId(OPCAO_TODOS);
      return;
    }

    setCarregandoUes(true);
    const resposta = await AbrangenciaServico.buscarUes(
      dreId,
      `v1/abrangencias/${consideraHistorico}/dres/${dreId}/ues?anoLetivo=${anoLetivo}`,
      true
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoUes(false));

    if (resposta?.data?.length) {
      const lista = resposta.data.map(item => ({
        desc: item.nome,
        valor: String(item.codigo),
      }));

      if (lista?.length > 1 && (possuiPerfilSme || possuiPerfilDre)) {
        lista.unshift({ valor: OPCAO_TODOS, desc: 'Todas' });
      }

      if (lista?.length === 1) {
        setUeId(lista[0].valor);
      }

      setListaUes(lista);
    } else {
      setListaUes([]);
      setUeId();
    }
  }, [consideraHistorico, anoLetivo, dreId, possuiPerfilDre, possuiPerfilSme]);

  useEffect(() => {
    if (dreId) {
      obterUes();
    } else {
      setUeId();
      setListaUes([]);
    }
  }, [dreId, anoLetivo, consideraHistorico, obterUes]);

  const obterModalidades = useCallback(async () => {
    setCarregandoModalidades(true);
    const resposta =
      await ServicoFiltroRelatorio.obterModalidadesPorAbrangencia(ueId)
        .catch(e => erros(e))
        .finally(() => setCarregandoModalidades(false));

    if (resposta?.data?.length) {
      if (resposta?.data?.length === 1) {
        setModalidadeId(resposta.data[0].valor);
      }
      setListaModalidades(resposta.data);
    } else {
      setListaModalidades([]);
      setModalidadeId();
    }
  }, [ueId]);

  useEffect(() => {
    if (ueId) {
      obterModalidades();
    } else {
      setModalidadeId();
      setListaModalidades([]);
    }
  }, [ueId, obterModalidades]);

  const obterAnosLetivos = useCallback(
    async consideraHistoricoEstaMarcado => {
      setCarregandoAnosLetivos(true);

      const resposta = await FiltroHelper.obterAnosLetivos({
        consideraHistorico: consideraHistoricoEstaMarcado,
      })
        .catch(e => erros(e))
        .finally(() => setCarregandoAnosLetivos(false));

      const anosLetivos = resposta || [];

      if (!anosLetivos?.length) {
        anosLetivos.push({
          desc: anoAtual,
          valor: anoAtual,
        });
      }

      const anosOrdenados = ordenarListaMaiorParaMenor(anosLetivos, 'valor');

      setAnoLetivo(anosOrdenados[0]?.valor);
      setListaAnosLetivo(anosOrdenados);
    },
    [anoAtual]
  );

  useEffect(() => {
    obterAnosLetivos(consideraHistorico);
  }, [consideraHistorico, obterAnosLetivos]);

  const obterSemestres = useCallback(async () => {
    setCarregandoSemestres(true);
    const retorno = await api
      .get(
        `v1/abrangencias/${consideraHistorico}/semestres?anoLetivo=${anoLetivo}&modalidade=${
          modalidadeId || 0
        }`
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
    if (modalidadeId && anoLetivo && ehEjaOuCelp) {
      setSemestre();
      obterSemestres();
    } else {
      setSemestre();
      setListaSemestres([]);
    }
  }, [modalidadeId, anoLetivo, obterSemestres, ehEjaOuCelp]);

  const obterCiclos = async (modalidadeSelecionada, codigoUe) => {
    if (
      Number(modalidadeSelecionada) === ModalidadeEnum.EJA ||
      Number(modalidadeSelecionada) === ModalidadeEnum.CELP ||
      Number(modalidadeSelecionada) === ModalidadeEnum.MEDIO
    ) {
      setListaCiclos([{ id: OPCAO_TODOS, descricao: 'Todos' }]);
      setCiclo(OPCAO_TODOS);
    } else if (Number(modalidadeSelecionada) === ModalidadeEnum.INFANTIL) {
      setListaCiclos([]);
      setCiclo();
    } else {
      setCarregandoCiclos(true);
      const retorno = await ServicoFiltroRelatorio.buscarCiclos(
        codigoUe,
        modalidadeSelecionada
      )
        .catch(e => erros(e))
        .finally(() => {
          setCarregandoCiclos(false);
        });
      if (retorno?.data?.length) {
        if (retorno.data.length === 1) {
          await setListaCiclos(retorno.data);
          await setCiclo(String(retorno.data[0].id));
        } else {
          setCiclo();
          let lista = [{ id: OPCAO_TODOS, descricao: 'Todos' }];
          lista = lista.concat(retorno.data);
          setListaCiclos(lista);
        }
      }
    }
  };

  const obterPareceresConclusivos = useCallback(async () => {
    setCarregandoPareceresConclusivos(true);
    const retorno =
      await ServicoRelatorioParecerConclusivo.buscarPareceresConclusivos()
        .catch(e => erros(e))
        .finally(() => {
          setCarregandoPareceresConclusivos(false);
        });
    if (retorno && retorno.data) {
      setParecerConclusivoId();
      let lista =
        retorno.data.length > 1 ? [{ id: OPCAO_TODOS, nome: 'Todos' }] : [];
      lista = lista.concat(retorno.data);
      setListaPareceresConclusivos(lista);
    }
  }, []);

  useEffect(() => {
    obterPareceresConclusivos();
  }, [obterPareceresConclusivos]);

  const obterAnos = async (modalidadeIdSelecionada, cicloSelecionado) => {
    if (
      Number(modalidadeIdSelecionada) === ModalidadeEnum.EJA ||
      Number(modalidadeIdSelecionada) === ModalidadeEnum.CELP
    ) {
      setListaAnos([{ valor: OPCAO_TODOS, descricao: 'Todos' }]);
      setAno(OPCAO_TODOS);
    } else if (modalidadeIdSelecionada && cicloSelecionado) {
      setCarregandoAnos(true);
      cicloSelecionado =
        cicloSelecionado === OPCAO_TODOS ||
        Number(modalidadeIdSelecionada) === ModalidadeEnum.MEDIO
          ? '0'
          : cicloSelecionado;
      const retorno =
        await ServicoFiltroRelatorio.obterAnosEscolaresPorAbrangencia(
          modalidadeIdSelecionada,
          cicloSelecionado
        ).finally(setCarregandoAnos(false));
      if (retorno?.data?.length) {
        if (retorno.data.length === 1) {
          setListaAnos(retorno.data);
          setAno(String(retorno.data[0].valor));
        } else {
          let lista = [{ valor: OPCAO_TODOS, descricao: 'Todos' }];
          lista = lista.concat(retorno.data);
          if (cicloSelecionado === '0' && retorno.data.length > 1) {
            setAno(OPCAO_TODOS);
          }
          setListaAnos(lista);
        }
      }
    } else {
      setAno();
    }
  };

  useEffect(() => {
    if (modalidadeId && ueId) {
      setCiclo();
      obterCiclos(modalidadeId, ueId);
    } else {
      setListaCiclos([]);
      setCiclo();
    }
  }, [modalidadeId, ueId]);

  useEffect(() => {
    obterAnos(modalidadeId, ciclo);
  }, [modalidadeId, ciclo]);

  const cancelar = () => {
    setDreId();
    setUeId();
    setConsideraHistorico(false);
    setAnoLetivo(anoAtual);
    setCiclo();
    setAno();
    setParecerConclusivoId();
    setAnoLetivo(anoAtual);
    setFormato('1');
    setModoEdicao(false);
  };

  useEffect(() => {
    const desabilitar =
      !anoLetivo ||
      !dreId ||
      !ueId ||
      !modalidadeId ||
      (ehEjaOuCelp ? !semestre : false) ||
      (Number(modalidadeId) !== ModalidadeEnum.MEDIO ? !ciclo : false) ||
      !ano ||
      ano?.length <= 0 ||
      !parecerConclusivoId ||
      !formato ||
      clicouBotaoGerar;

    setDesabilitarBtnGerar(desabilitar);
  }, [
    anoLetivo,
    dreId,
    ueId,
    modalidadeId,
    ciclo,
    semestre,
    parecerConclusivoId,
    formato,
    ano,
    clicouBotaoGerar,
    ehEjaOuCelp,
  ]);

  const gerar = async () => {
    setCarregandoGerar(true);
    setClicouBotaoGerar(true);

    const params = {
      anoLetivo,
      dreCodigo: dreId === OPCAO_TODOS ? '' : dreId,
      ueCodigo: ueId === OPCAO_TODOS ? '' : ueId,
      modalidade: modalidadeId === OPCAO_TODOS ? null : modalidadeId,
      semestre: ehEjaOuCelp ? semestre : null,
      ciclo: ciclo === OPCAO_TODOS ? 0 : ciclo,
      anos: ano.toString() !== OPCAO_TODOS ? [].concat(ano) : [],
      parecerConclusivoId:
        parecerConclusivoId === OPCAO_TODOS ? 0 : parecerConclusivoId,
      tipoFormatoRelatorio: formato,
      historico: consideraHistorico,
    };
    await ServicoRelatorioParecerConclusivo.gerar(params)
      .then(() => {
        sucesso(
          'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
        );
      })
      .catch(e => erros(e))
      .finally(setCarregandoGerar(false));
  };

  return (
    <CorpoRelatorio>
      <AlertaModalidadeInfantil
        exibir={Number(modalidadeId) === ModalidadeEnum.INFANTIL}
        validarModalidadeFiltroPrincipal={false}
      />
      <Cabecalho pagina="Parecer Conclusivo">
        <BotoesAcaoRelatorio
          onClickVoltar={() => {
            navigate(URL_HOME);
          }}
          onClickCancelar={cancelar}
          onClickGerar={gerar}
          desabilitarBtnGerar={desabilitarBtnGerar}
          carregandoGerar={carregandoGerar}
          temLoaderBtnGerar
          modoEdicao={modoEdicao}
        />
      </Cabecalho>
      <Card>
        <div className="col-md-12">
          <div className="row mb-2">
            <div className="col-12">
              <CheckboxComponent
                label="Exibir histórico?"
                checked={consideraHistorico}
                onChangeCheckbox={onChangeConsideraHistorico}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-2 col-xl-2 mb-2">
              <Loader loading={carregandoAnosLetivos} tip="">
                <SelectComponent
                  id="drop-ano-letivo-rel-parecer"
                  label="Ano Letivo"
                  lista={listaAnosLetivo}
                  valueOption="valor"
                  valueText="desc"
                  onChange={onChangeAnoLetivo}
                  valueSelect={anoLetivo}
                  placeholder="Ano letivo"
                  disabled={listaAnosLetivo?.length === 1}
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-5 col-xl-5 mb-2">
              <Loader loading={carregandoDres} tip="">
                <SelectComponent
                  id="drop-dre-rel-parecer"
                  label="Diretoria Regional de Educação (DRE)"
                  lista={listaDres}
                  valueOption="valor"
                  valueText="desc"
                  disabled={!anoLetivo || (listaDres && listaDres.length === 1)}
                  onChange={onChangeDre}
                  valueSelect={dreId}
                  placeholder="Diretoria Regional De Educação (DRE)"
                  showSearch
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-5 col-xl-5 mb-2">
              <Loader loading={carregandoUes} tip="">
                <SelectComponent
                  id="drop-ue-rel-parecer"
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
            </div>
            <div className="col-sm-12 col-md-6 mb-2">
              <Loader loading={carregandoModalidades} tip="">
                <SelectComponent
                  id="drop-modalidade-rel-parecer"
                  label="Modalidade"
                  lista={listaModalidades}
                  valueOption="valor"
                  valueText="descricao"
                  disabled={
                    !ueId || (listaModalidades && listaModalidades.length === 1)
                  }
                  onChange={onChangeModalidade}
                  valueSelect={modalidadeId}
                  placeholder="Modalidade"
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-2 mb-2">
              <Loader loading={carregandoSemestres} tip="">
                <SelectComponent
                  id="drop-semestre-rel-parecer"
                  lista={listaSemestres}
                  valueOption="valor"
                  valueText="desc"
                  label="Semestre"
                  disabled={
                    !modalidadeId ||
                    (listaSemestres && listaSemestres.length === 1) ||
                    (Number(modalidadeId) !== ModalidadeEnum.EJA &&
                      Number(modalidadeId) !== ModalidadeEnum.CELP)
                  }
                  valueSelect={semestre}
                  onChange={onChangeSemestre}
                  placeholder="Semestre"
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-4 mb-2">
              <Loader loading={carregandoCiclos} tip="">
                <SelectComponent
                  id="drop-ciclos-rel-parecer"
                  label="Ciclo"
                  lista={listaCiclos}
                  valueOption="id"
                  valueText="descricao"
                  disabled={
                    (listaCiclos && listaCiclos.length === 1) ||
                    Number(modalidadeId) === ModalidadeEnum.MEDIO
                  }
                  onChange={onChangeCiclos}
                  valueSelect={ciclo}
                  placeholder="Ciclo"
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-6 mb-2">
              <Loader loading={carregandoAnos} tip="">
                <SelectComponent
                  id="drop-ano-rel-parecer"
                  label="Ano"
                  lista={listaAnos}
                  valueOption="valor"
                  valueText="descricao"
                  disabled={listaAnos && listaAnos.length === 1}
                  onChange={onChangeAnos}
                  valueSelect={ano}
                  placeholder="Ano"
                  multiple
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-4 mb-2">
              <Loader loading={carregandoPareceresConclusivos} tip="">
                <SelectComponent
                  id="drop-parecer-conclucivo-rel-parecer"
                  label="Parecer conclusivo"
                  lista={listaPareceresConclusivos}
                  valueOption="id"
                  valueText="nome"
                  disabled={
                    listaPareceresConclusivos &&
                    listaPareceresConclusivos.length === 1
                  }
                  onChange={onChangeParecerConclusivo}
                  valueSelect={parecerConclusivoId}
                  placeholder="Parecer conclusivo"
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-2 mb-2">
              <SelectComponent
                id="drop-formato-rel-parecer"
                label="Formato"
                lista={listaFormatos}
                valueOption="valor"
                valueText="desc"
                onChange={onChangeFormato}
                valueSelect={formato}
                placeholder="Formato"
              />
            </div>
          </div>
        </div>
      </Card>
    </CorpoRelatorio>
  );
};

export default RelatorioParecerConclusivo;
