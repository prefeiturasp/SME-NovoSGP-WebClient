import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import Card from '~/componentes/card';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import AbrangenciaServico from '~/servicos/Abrangencia';
import { erros, sucesso } from '~/servicos/alertas';
import api from '~/servicos/api';
import { ServicoComponentesCurriculares } from '~/servicos';
import FiltroHelper from '~/componentes-sgp/filtro/helper';
import ServicoFiltroRelatorio from '~/servicos/Paginas/FiltroRelatorio/ServicoFiltroRelatorio';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import ServicoRelatorioCompensacaoAusencia from '~/servicos/Paginas/Relatorios/CompensacaoAusencia/ServicoRelatorioCompensacaoAusencia';
import { ordenarListaMaiorParaMenor } from '~/utils/funcoes/gerais';
import { URL_HOME } from '~/constantes';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';
import { useNavigate } from 'react-router-dom';

const RelatorioCompensacaoAusencia = () => {
  const navigate = useNavigate();

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
  const [listaComponentesCurriculares, setListaComponentesCurriculares] =
    useState([]);
  const [listaBimestres, setListaBimestres] = useState([]);

  const bimestresEja = [
    { valor: '0', desc: 'Todos' },
    { valor: '1', desc: '1' },
    { valor: '2', desc: '2' },
  ];

  const bimestresFundMedio = [
    { valor: '0', desc: 'Todos' },
    { valor: '1', desc: '1' },
    { valor: '2', desc: '2' },
    { valor: '3', desc: '3' },
    { valor: '4', desc: '4' },
  ];

  const [anoLetivo, setAnoLetivo] = useState(undefined);
  const [dreId, setDreId] = useState(undefined);
  const [ueId, setUeId] = useState(undefined);
  const [modalidadeId, setModalidadeId] = useState(undefined);
  const [semestre, setSemestre] = useState(undefined);
  const [turmaId, setTurmaId] = useState(undefined);
  const [componentesCurricularesId, setComponentesCurricularesId] =
    useState(undefined);
  const [bimestre, setBimestre] = useState(undefined);

  const [modoEdicao, setModoEdicao] = useState(false);
  const [desabilitarBtnGerar, setDesabilitarBtnGerar] = useState(true);

  const ehEJAOuCelp =
    Number(modalidadeId) === ModalidadeEnum.EJA ||
    Number(modalidadeId) === ModalidadeEnum.CELP;

  const onChangeAnoLetivo = async valor => {
    setDreId();
    setUeId();
    setModalidadeId();
    setTurmaId();
    setComponentesCurricularesId();
    setAnoLetivo(valor);
    setModoEdicao(true);
  };

  const onChangeDre = valor => {
    setDreId(valor);
    setUeId();
    setModalidadeId();
    setTurmaId();
    setComponentesCurricularesId();
    setUeId(undefined);
    setModoEdicao(true);
  };

  const onChangeUe = valor => {
    setModalidadeId();
    setTurmaId();
    setComponentesCurricularesId();
    setUeId(valor);
    setModoEdicao(true);
  };

  const onChangeModalidade = valor => {
    setTurmaId();
    setComponentesCurricularesId();
    setModalidadeId(valor);
    setModoEdicao(true);
  };

  const onChangeSemestre = valor => {
    setSemestre(valor);
    setModoEdicao(true);
  };

  const onChangeTurma = valor => {
    setComponentesCurricularesId();
    setTurmaId(valor);
    setModoEdicao(true);
  };

  const onChangeComponenteCurricular = valor => {
    setComponentesCurricularesId([valor]);
    setModoEdicao(true);
  };

  const onChangeBimestre = valor => {
    setBimestre(valor);
    setModoEdicao(true);
  };

  const [anoAtual] = useState(window.moment().format('YYYY'));

  const obterDres = useCallback(async () => {
    if (anoLetivo) {
      setCarregandoDres(true);
      const { data } = await AbrangenciaServico.buscarDres(
        `v1/abrangencias/false/dres?anoLetivo=${anoLetivo}`
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
        setDreId(undefined);
      }
      setCarregandoDres(false);
    }
  }, [anoLetivo]);

  useEffect(() => {
    obterDres();
  }, [obterDres]);

  const obterUes = useCallback(async (dre, ano) => {
    if (dre) {
      setCarregandoUes(true);
      const { data } = await AbrangenciaServico.buscarUes(
        dre,
        `v1/abrangencias/false/dres/${dre}/ues?anoLetivo=${ano}`,
        true
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
      setCarregandoUes(false);
    }
  }, []);

  useEffect(() => {
    if (dreId) {
      obterUes(dreId, anoLetivo);
    } else {
      setUeId();
      setListaUes([]);
    }
  }, [dreId, anoLetivo, obterUes]);

  const obterModalidades = async (ue, ano) => {
    if (ue && ano) {
      setCarregandoModalidades(true);
      const { data } =
        await ServicoFiltroRelatorio.obterModalidadesPorAbrangencia(ue);

      if (data) {
        const lista = data.map(item => ({
          desc: item.descricao,
          valor: String(item.valor),
        }));

        if (lista && lista.length && lista.length === 1) {
          setModalidadeId(lista[0].valor);
        }
        setListaModalidades(lista);
      }
      setCarregandoModalidades(false);
    }
  };

  useEffect(() => {
    if (anoLetivo && ueId) {
      obterModalidades(ueId, anoLetivo);
    } else {
      setModalidadeId();
      setListaModalidades([]);
    }
  }, [anoLetivo, ueId]);

  const obterTurmas = useCallback(async (modalidadeSelecionada, ue, ano) => {
    if (ue && modalidadeSelecionada) {
      setCarregandoTurmas(true);
      const { data } = await AbrangenciaServico.buscarTurmas(
        ue,
        modalidadeSelecionada,
        '',
        ano
      );
      if (data) {
        const lista = [];
        if (data.length > 1) {
          lista.push({ valor: '0', nomeFiltro: 'Todas' });
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
          setTurmaId(lista[0].valor);
        }
      }
      setCarregandoTurmas(false);
    }
  }, []);

  useEffect(() => {
    if (modalidadeId && ueId) {
      obterTurmas(modalidadeId, ueId, anoLetivo);
    } else {
      setTurmaId();
      setListaTurmas([]);
    }
  }, [modalidadeId, ueId, anoLetivo, obterTurmas]);

  useEffect(() => {
    if (ehEJAOuCelp) {
      setListaBimestres(bimestresEja);
    } else {
      setListaBimestres(bimestresFundMedio);
    }
    setBimestre();
  }, [ehEJAOuCelp]);

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnos(true);
    let anosLetivos = [];

    const anosLetivoComHistorico = await FiltroHelper.obterAnosLetivos({
      consideraHistorico: true,
    });
    const anosLetivoSemHistorico = await FiltroHelper.obterAnosLetivos({
      consideraHistorico: false,
    });

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

    if (anosLetivos && anosLetivos.length) {
      const temAnoAtualNaLista = anosLetivos.find(
        item => String(item.valor) === String(anoAtual)
      );
      if (temAnoAtualNaLista) setAnoLetivo(anoAtual);
      else setAnoLetivo(anosLetivos[0].valor);
    }

    setListaAnosLetivo(ordenarListaMaiorParaMenor(anosLetivos, 'valor'));
    setCarregandoAnos(false);
  }, [anoAtual]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos]);

  const obterComponentesCurriculares = useCallback(
    async (ueCodigo, idsTurma, lista) => {
      if (idsTurma?.length > 0) {
        setCarregandoComponentesCurriculares(true);
        const turmas = [].concat(
          idsTurma[0] === '0'
            ? lista.map(a => a.valor).filter(a => a !== '0')
            : idsTurma
        );
        const disciplinas =
          await ServicoComponentesCurriculares.obterComponentesPorUeTurmas(
            ueCodigo,
            turmas
          ).catch(e => erros(e));
        let componentesCurriculares = [];
        componentesCurriculares.push({
          codigo: '0',
          descricao: 'Todos',
        });

        if (disciplinas && disciplinas.data && disciplinas.data.length) {
          if (disciplinas.data.length > 1) {
            componentesCurriculares = componentesCurriculares.concat(
              disciplinas.data
            );
            setListaComponentesCurriculares(componentesCurriculares);
          } else {
            setListaComponentesCurriculares(disciplinas.data);
          }
        } else {
          setListaComponentesCurriculares([]);
        }
        setCarregandoComponentesCurriculares(false);
      } else {
        setComponentesCurricularesId(undefined);
        setListaComponentesCurriculares([]);
      }
    },
    []
  );

  useEffect(() => {
    if (ueId && turmaId && listaTurmas)
      obterComponentesCurriculares(ueId, turmaId, listaTurmas);
  }, [ueId, turmaId, listaTurmas, obterComponentesCurriculares]);

  const obterSemestres = async (
    modalidadeSelecionada,
    anoLetivoSelecionado
  ) => {
    setCarregandoSemestres(true);
    const retorno = await api.get(
      `v1/abrangencias/false/semestres?anoLetivo=${anoLetivoSelecionado}&modalidade=${
        modalidadeSelecionada || 0
      }`
    );
    if (retorno && retorno.data) {
      const lista = retorno.data.map(periodo => {
        return { desc: periodo, valor: periodo };
      });

      if (lista && lista.length && lista.length === 1) {
        setSemestre(lista[0].valor);
      }
      setListaSemestres(lista);
    }
    setCarregandoSemestres(false);
  };

  useEffect(() => {
    if (modalidadeId && anoLetivo && ehEJAOuCelp) {
      obterSemestres(modalidadeId, anoLetivo);
    } else {
      setSemestre();
      setListaSemestres([]);
    }
  }, [obterAnosLetivos, modalidadeId, anoLetivo, ehEJAOuCelp]);

  const cancelar = async () => {
    await setDreId();
    await setUeId();
    await setModalidadeId();
    await setComponentesCurricularesId(undefined);
    await setBimestre();
    await setTurmaId(undefined);
    await setAnoLetivo();
    await setAnoLetivo(anoAtual);
    setModoEdicao(false);
    setDesabilitarBtnGerar(true);
  };

  useEffect(() => {
    const desabilitar =
      !anoLetivo ||
      !dreId ||
      !ueId ||
      !modalidadeId ||
      (ehEJAOuCelp ? !semestre : false) ||
      !turmaId ||
      !componentesCurricularesId ||
      !bimestre ||
      Number(modalidadeId) === ModalidadeEnum.INFANTIL;

    setDesabilitarBtnGerar(desabilitar);
  }, [
    anoLetivo,
    dreId,
    ueId,
    modalidadeId,
    semestre,
    turmaId,
    componentesCurricularesId,
    bimestre,
    ehEJAOuCelp,
  ]);

  const gerar = async () => {
    setCarregandoGerar(true);
    const params = {
      anoLetivo,
      dreCodigo: dreId,
      ueCodigo: ueId,
      modalidade: modalidadeId,
      turmasCodigo: turmaId === '0' ? [] : [].concat(turmaId),
      bimestre,
      componentesCurriculares:
        componentesCurricularesId?.length === 1 &&
        componentesCurricularesId[0] === '0'
          ? []
          : componentesCurricularesId,
      semestre,
    };
    const retorno = await ServicoRelatorioCompensacaoAusencia.gerar(params)
      .catch(e => erros(e))
      .finally(setCarregandoGerar(false));
    if (retorno && retorno.status === 200) {
      sucesso(
        'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
      );
      setDesabilitarBtnGerar(true);
    }
  };

  return (
    <>
      <AlertaModalidadeInfantil
        exibir={Number(modalidadeId) === ModalidadeEnum.INFANTIL}
        validarModalidadeFiltroPrincipal={false}
      />
      <Cabecalho pagina="Relatório de compensação de ausência">
        <BotoesAcaoRelatorio
          onClickVoltar={() => navigate(URL_HOME)}
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
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-2 col-xl-2 mb-2">
              <Loader loading={carregandoAnos} tip="">
                <SelectComponent
                  id="drop-ano-letivo-rel-pendencias"
                  label="Ano Letivo"
                  lista={listaAnosLetivo}
                  valueOption="valor"
                  valueText="desc"
                  disabled={listaAnosLetivo && listaAnosLetivo.length === 1}
                  onChange={onChangeAnoLetivo}
                  valueSelect={anoLetivo}
                  placeholder="Ano letivo"
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-5 col-xl-5 mb-2">
              <Loader loading={carregandoDres} tip="">
                <SelectComponent
                  id="drop-dre-rel-pendencias"
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
            </div>
            <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3  mb-2">
              <Loader loading={carregandoModalidades} tip="">
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
            </div>
            <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-2">
              <Loader loading={carregandoSemestres} tip="">
                <SelectComponent
                  id="drop-semestre-rel-pendencias"
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
            <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-2">
              <Loader loading={carregandoTurmas} tip="">
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
                  valueSelect={turmaId}
                  onChange={valor => {
                    if (valor.includes('0')) {
                      onChangeTurma('0');
                    } else {
                      onChangeTurma(valor);
                    }
                  }}
                  placeholder="Turma"
                  showSearch
                />
              </Loader>
            </div>
            <div className={`"col-sm-12 col-md-6 col-lg-2`}>
              <Loader loading={carregandoComponentesCurriculares} tip="">
                <SelectComponent
                  id="drop-componente-curricular-rel-pendencias"
                  lista={listaComponentesCurriculares}
                  valueOption="codigo"
                  valueText="descricao"
                  label="Componente curricular"
                  disabled={
                    !modalidadeId || listaComponentesCurriculares?.length === 1
                  }
                  valueSelect={componentesCurricularesId}
                  onChange={onChangeComponenteCurricular}
                  placeholder="Componente curricular"
                />
              </Loader>
            </div>
            <div className={`"col-sm-12 col-md-6 col-lg-2`}>
              <SelectComponent
                id="drop-bimestre-rel-pendencias"
                lista={listaBimestres}
                valueOption="valor"
                valueText="desc"
                label="Bimestre"
                disabled={!modalidadeId}
                valueSelect={bimestre}
                onChange={onChangeBimestre}
                placeholder="Bimestre"
              />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default RelatorioCompensacaoAusencia;
