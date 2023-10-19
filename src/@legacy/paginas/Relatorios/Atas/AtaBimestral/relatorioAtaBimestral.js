import { ROUTES } from '@/core/enum/routes';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  Card,
  CheckboxComponent,
  Loader,
  SelectComponent,
} from '~/componentes';

import {
  AlertaModalidadeInfantil,
  Cabecalho,
  FiltroHelper,
} from '~/componentes-sgp';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';

import { OPCAO_TODOS, URL_HOME } from '~/constantes';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import {
  AbrangenciaServico,
  erros,
  ServicoFiltroRelatorio,
  ServicoRelatorioAtaBimestral,
  sucesso,
} from '~/servicos';

const RelatorioAtaBimestral = () => {
  const navigate = useNavigate();

  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaBimestres, setListaBimestres] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [listaTurmasPorSemestre, setListaTurmasPorSemestre] = useState({});
  const [listaUes, setListaUes] = useState({});

  const [anoAtual] = useState(window.moment().format('YYYY'));
  const [anoLetivo, setAnoLetivo] = useState();
  const [bimestre, setBimestre] = useState();
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [dreCodigo, setDreCodigo] = useState();
  const [modalidadeId, setModalidadeId] = useState();
  const [semestre, setSemestre] = useState();
  const [turmaCodigo, setTurmaCodigo] = useState();
  const [ueCodigo, setUeCodigo] = useState();

  const [carregandoAnosLetivos, setCarregandoAnosLetivos] = useState(false);
  const [carregandoBimestres, setCarregandoBimestres] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoModalidades, setCarregandoModalidades] = useState(false);
  const [carregandoSemestres, setCarregandoSemestres] = useState(false);
  const [carregandoTurmas, setCarregandoTurmas] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);

  const [desabilitarBtnGerar, setDesabilitarBtnGerar] = useState(true);

  const [modoEdicao, setModoEdicao] = useState(false);

  const usuarioStore = useSelector(store => store.usuario);
  const permissoesTela = usuarioStore.permissoes[ROUTES.ATA_BIMESTRAL];

  const ehModalidadeInfantil =
    String(modalidadeId) === String(ModalidadeEnum.INFANTIL);

  const onClickCancelar = () => {
    setConsideraHistorico(false);
    setAnoLetivo(anoAtual);
    setDreCodigo();
    setUeCodigo();
    setModalidadeId();
    setSemestre();
    setTurmaCodigo();
    setBimestre();
    setListaTurmasPorSemestre({});
    setDesabilitarBtnGerar(true);
    setModoEdicao(false);
  };

  const onCheckedConsideraHistorico = e => {
    setAnoLetivo(anoAtual);
    setConsideraHistorico(e.target.checked);
    setModoEdicao(true);
  };

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnosLetivos(true);
    const anosLetivo = await FiltroHelper.obterAnosLetivos({
      consideraHistorico,
    }).catch(e => erros(e));
    if (anosLetivo) {
      setListaAnosLetivo(anosLetivo);
      setAnoLetivo(anosLetivo[0].valor);
      setDreCodigo();
    } else {
      setListaAnosLetivo([]);
    }
    setCarregandoAnosLetivos(false);
  }, [consideraHistorico]);

  useEffect(() => {
    obterAnosLetivos(consideraHistorico);
  }, [obterAnosLetivos, consideraHistorico]);

  const onChangeAnoLetivo = ano => {
    setAnoLetivo(ano);
    setDreCodigo();

    setListaModalidades([]);
    setModalidadeId();

    setListaSemestres([]);
    setSemestre();

    setListaTurmas([]);
    setListaTurmasPorSemestre({});
    setTurmaCodigo();

    setModoEdicao(true);
  };

  const obterDres = useCallback(async () => {
    if (anoLetivo) {
      setCarregandoDres(true);
      const resposta = await AbrangenciaServico.buscarDres(
        `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoDres(false));

      if (resposta?.data?.length) {
        const lista = resposta.data
          .map(item => ({
            desc: item.nome,
            valor: String(item.codigo),
            abrev: item.abreviacao,
            id: item.id,
          }))
          .sort(FiltroHelper.ordenarLista('desc'));
        setListaDres(lista);

        if (lista?.length === 1) {
          setDreCodigo(lista[0].valor);
        }
        return;
      }
      setDreCodigo();
      setListaDres([]);
    }
  }, [anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (anoLetivo) {
      obterDres();
    }
  }, [obterDres, anoLetivo]);

  const onChangeDre = dre => {
    setDreCodigo(dre);

    setListaUes([]);
    setUeCodigo();

    setListaModalidades([]);
    setModalidadeId();

    setListaSemestres([]);
    setSemestre();

    setListaTurmas([]);
    setListaTurmasPorSemestre({});
    setTurmaCodigo();

    setModoEdicao(true);
  };

  const obterUes = useCallback(
    async dre => {
      setCarregandoUes(true);
      if (dre) {
        const retorno = await AbrangenciaServico.buscarUes(
          dre,
          '',
          false,
          undefined,
          consideraHistorico,
          anoLetivo
        )
          .catch(e => erros(e))
          .finally(() => setCarregandoUes(false));

        if (retorno?.data?.length) {
          const lista = retorno.data.map(item => ({
            desc: item.nome,
            valor: String(item.codigo),
          }));

          if (lista && lista.length && lista.length === 1) {
            setUeCodigo(lista[0].valor);
          }

          setListaUes(lista);
          return;
        }
      }
      setListaUes([]);
    },
    [consideraHistorico, anoLetivo]
  );

  useEffect(() => {
    if (dreCodigo) {
      obterUes(dreCodigo);
      return;
    }
    setUeCodigo();
    setListaUes([]);
  }, [dreCodigo, obterUes]);

  const onChangeUe = ue => {
    setUeCodigo(ue);

    setListaModalidades([]);
    setModalidadeId();

    setListaSemestres([]);
    setSemestre();

    setListaTurmas([]);
    setListaTurmasPorSemestre({});
    setTurmaCodigo();

    setModoEdicao(true);
  };

  const obterModalidades = useCallback(
    async (ue, ano) => {
      if (ue && ano && !ehModalidadeInfantil) {
        setCarregandoModalidades(true);
        const retorno = await ServicoRelatorioAtaBimestral.obterModalidades(
          ano,
          ue
        )
          .catch(e => erros(e))
          .finally(() => setCarregandoModalidades(false));

        if (retorno?.data?.length) {
          const lista = retorno.data.map(item => ({
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
    [ehModalidadeInfantil]
  );

  useEffect(() => {
    if (anoLetivo && ueCodigo) {
      obterModalidades(ueCodigo, anoLetivo);
      return;
    }
    setModalidadeId();
    setListaModalidades([]);
  }, [anoLetivo, ueCodigo, obterModalidades]);

  const onChangeModalidade = novaModalidade => {
    setModalidadeId(novaModalidade);

    setListaSemestres([]);
    setSemestre();

    setListaTurmas([]);
    setListaTurmasPorSemestre({});
    setTurmaCodigo();

    setListaBimestres([]);
    setBimestre();

    setModoEdicao(true);
  };

  const obterSemestres = useCallback(
    async (modalidadeSelecionada, anoLetivoSelecionado, ue) => {
      setCarregandoSemestres(true);

      const [primeiroSemestre, segundoSemestre] = await Promise.all([
        AbrangenciaServico.buscarTurmas(
          ue,
          modalidadeSelecionada,
          1,
          anoLetivoSelecionado,
          consideraHistorico,
          false,
          [1, 2, 7]
        ),
        AbrangenciaServico.buscarTurmas(
          ue,
          modalidadeSelecionada,
          2,
          anoLetivoSelecionado,
          consideraHistorico,
          false,
          [1, 2, 7]
        ),
      ])
        .catch(e => erros(e))
        .finally(() => setCarregandoSemestres(false));

      const lista = [];
      const listaTurmasSemestre = {};

      if (primeiroSemestre?.data?.length) {
        lista.push({ desc: 1, valor: 1 });
        listaTurmasSemestre[1] = primeiroSemestre.data;
      }

      if (segundoSemestre?.data?.length) {
        lista.push({ desc: 2, valor: 2 });
        listaTurmasSemestre[2] = segundoSemestre.data;
      }

      if (lista?.length === 1) {
        setSemestre(lista[0].valor);
      }

      setListaSemestres(lista);
      setListaTurmasPorSemestre(listaTurmasSemestre);
    },
    [consideraHistorico]
  );

  useEffect(() => {
    if (
      (modalidadeId &&
        anoLetivo &&
        String(modalidadeId) === String(ModalidadeEnum.EJA)) ||
      String(modalidadeId) === String(ModalidadeEnum.CELP)
    ) {
      obterSemestres(modalidadeId, anoLetivo, ueCodigo);
      return;
    }
    setSemestre();
    setListaSemestres([]);
  }, [obterAnosLetivos, obterSemestres, modalidadeId, ueCodigo, anoLetivo]);

  const onChangeSemestre = valor => {
    setSemestre(valor);
    setModoEdicao(true);
  };

  const obterTurmas = useCallback(
    async (modalidadeSelecionada, ue) => {
      if (ue && modalidadeSelecionada && !ehModalidadeInfantil) {
        setCarregandoTurmas(true);
        const retorno = await AbrangenciaServico.buscarTurmas(
          ue,
          modalidadeSelecionada,
          '',
          anoLetivo,
          consideraHistorico,
          false,
          Number(modalidadeSelecionada) === ModalidadeEnum.Medio
            ? []
            : [1, 2]
        )
          .catch(e => erros(e))
          .finally(() => setCarregandoTurmas(false));
        if (retorno?.data?.length) {
          const lista = retorno.data.map(item => ({
            desc: item.nome,
            valor: item.codigo,
            nomeFiltro: item.nomeFiltro,
          }));

          lista.unshift({ nomeFiltro: 'Todas', valor: OPCAO_TODOS });

          setListaTurmas(lista);

          if (lista?.length === 1) {
            setTurmaCodigo(lista[0].valor);
          }
          return;
        }
        setListaTurmas([]);
        setListaTurmasPorSemestre({});
      }
    },
    [anoLetivo, consideraHistorico, ehModalidadeInfantil]
  );

  const obterTurmasEJA = useCallback(
    async (semestreSelecionado, listaTurmasPorSemestreSelecionada) => {
      if (
        Object.keys(listaTurmasPorSemestreSelecionada)?.length &&
        !ehModalidadeInfantil &&
        semestreSelecionado
      ) {
        const lista = listaTurmasPorSemestreSelecionada[
          semestreSelecionado
        ].map(item => ({
          desc: item.nome,
          valor: item.codigo,
          nomeFiltro: item.nomeFiltro,
        }));
        lista.unshift({ nomeFiltro: 'Todas', valor: OPCAO_TODOS });

        setListaTurmas(lista);

        if (lista?.length === 1) {
          setTurmaCodigo(lista[0].valor);
        }
        return;
      }
      setListaTurmas([]);
      setListaTurmasPorSemestre({});
    },
    [ehModalidadeInfantil]
  );

  useEffect(() => {
    const temModalidadeEjaOuCelp =
      Number(modalidadeId) === ModalidadeEnum.EJA ||
      Number(modalidadeId) === ModalidadeEnum.CELP;
    if (modalidadeId && ueCodigo && !temModalidadeEjaOuCelp) {
      obterTurmas(modalidadeId, ueCodigo);
    }
  }, [modalidadeId, ueCodigo, obterTurmasEJA, obterTurmas]);

  useEffect(() => {
    const temModalidadeEjaOuCelp =
      Number(modalidadeId) === ModalidadeEnum.EJA ||
      Number(modalidadeId) === ModalidadeEnum.CELP;
    if (
      modalidadeId &&
      ueCodigo &&
      temModalidadeEjaOuCelp &&
      Object.keys(listaTurmasPorSemestre)?.length &&
      semestre
    ) {
      obterTurmasEJA(semestre, listaTurmasPorSemestre);
    }
  }, [
    listaTurmasPorSemestre,
    modalidadeId,
    semestre,
    ueCodigo,
    obterTurmasEJA,
  ]);

  const onChangeTurma = valor => {
    const todosSetado = turmaCodigo?.find(a => a === OPCAO_TODOS);
    const todos = valor.find(a => a === OPCAO_TODOS && !todosSetado);
    const novoValor = todosSetado && valor.length === 2 ? [valor[1]] : valor;
    setTurmaCodigo(todos ? [todos] : novoValor);
    setModoEdicao(true);
  };

  const obterBimestres = useCallback(async () => {
    setCarregandoBimestres(true);
    const retorno = await ServicoFiltroRelatorio.obterBimestres({
      modalidadeId,
    })
      .catch(e => erros(e))
      .finally(() => setCarregandoBimestres(false));

    if (retorno?.data) {
      const lista = retorno.data.map(item => ({
        desc: item.descricao,
        valor: item.valor,
      }));
      setListaBimestres(lista);
    }
  }, [modalidadeId]);

  useEffect(() => {
    if (modalidadeId) {
      obterBimestres();
      return;
    }
    setListaBimestres([]);
    setBimestre(undefined);
  }, [modalidadeId, obterBimestres]);

  const onChangeBimestre = valor => {
    setBimestre(valor);
    setModoEdicao(true);
  };

  useEffect(() => {
    const desabilitar =
      !anoLetivo ||
      !dreCodigo ||
      !ueCodigo ||
      !modalidadeId ||
      !turmaCodigo?.length ||
      !bimestre;

    let desabilitado = desabilitar;

    if (
      Number(modalidadeId) === Number(ModalidadeEnum.EJA) ||
      Number(modalidadeId) === Number(ModalidadeEnum.CELP)
    ) {
      desabilitado = !semestre || desabilitar;
    }
    setDesabilitarBtnGerar(desabilitado);
  }, [
    anoLetivo,
    dreCodigo,
    ueCodigo,
    modalidadeId,
    turmaCodigo,
    semestre,
    bimestre,
  ]);

  const onClickGerar = async () => {
    const params = {
      anoLetivo,
      dreCodigo,
      ueCodigo,
      modalidadeId,
      semestre,
      turmasCodigo: [],
      bimestre,
      exibirHistorico: consideraHistorico,
    };
    if (turmaCodigo.find(item => item === OPCAO_TODOS)) {
      params.turmasCodigo = listaTurmas
        .filter(item => String(item.valor) !== OPCAO_TODOS)
        .map(item => item.valor);
    } else {
      params.turmasCodigo = turmaCodigo;
    }

    const retorno = await ServicoRelatorioAtaBimestral.gerar(params).catch(e =>
      erros(e)
    );
    if (retorno?.status === 200) {
      sucesso(
        'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
      );
      setDesabilitarBtnGerar(true);
    }
  };

  return (
    <>
      <AlertaModalidadeInfantil
        exibir={ehModalidadeInfantil}
        validarModalidadeFiltroPrincipal={false}
      />
      <Cabecalho pagina="Ata bimestral">
        <BotoesAcaoRelatorio
          onClickVoltar={() => navigate(URL_HOME)}
          onClickCancelar={onClickCancelar}
          onClickGerar={onClickGerar}
          desabilitarBtnGerar={
            String(modalidadeId) === String(ModalidadeEnum.INFANTIL) ||
            desabilitarBtnGerar ||
            !permissoesTela?.podeConsultar
          }
          modoEdicao={modoEdicao}
        />
      </Cabecalho>
      <Card>
        <div className="col-md-12">
          <div className="row mb-2">
            <div className="col-sm-12">
              <CheckboxComponent
                label="Exibir histórico?"
                onChangeCheckbox={onCheckedConsideraHistorico}
                checked={consideraHistorico}
                disabled={!permissoesTela?.podeConsultar}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-12 col-md-4 col-lg-2 col-xl-2">
              <Loader loading={carregandoAnosLetivos} ignorarTip>
                <SelectComponent
                  label="Ano Letivo"
                  placeholder="Ano Letivo"
                  lista={listaAnosLetivo}
                  valueOption="valor"
                  valueText="desc"
                  disabled={
                    listaAnosLetivo?.length === 1 ||
                    !listaAnosLetivo?.length ||
                    !permissoesTela?.podeConsultar
                  }
                  onChange={onChangeAnoLetivo}
                  valueSelect={anoLetivo}
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-5 col-xl-5">
              <Loader loading={carregandoDres} ignorarTip>
                <SelectComponent
                  label="Diretoria Regional de Educação (DRE)"
                  placeholder="Diretoria Regional de Educação (DRE)"
                  lista={listaDres}
                  valueOption="valor"
                  valueText="desc"
                  disabled={
                    listaDres?.length === 1 ||
                    !listaDres?.length ||
                    !anoLetivo ||
                    !permissoesTela?.podeConsultar
                  }
                  onChange={onChangeDre}
                  valueSelect={dreCodigo}
                  showSearch
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-5 col-xl-5">
              <Loader loading={carregandoUes} ignorarTip>
                <SelectComponent
                  label="Unidade Escolar (UE)"
                  placeholder="Unidade Escolar (UE)"
                  lista={listaUes}
                  valueOption="valor"
                  valueText="desc"
                  disabled={
                    listaUes?.length === 1 ||
                    !listaUes?.length ||
                    !dreCodigo ||
                    !permissoesTela?.podeConsultar
                  }
                  onChange={onChangeUe}
                  valueSelect={ueCodigo}
                  showSearch
                />
              </Loader>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-12 col-md-8 col-lg-4 col-xl-4">
              <Loader loading={carregandoModalidades} ignorarTip>
                <SelectComponent
                  label="Modalidade"
                  placeholder="Selecione a modalidade"
                  lista={listaModalidades}
                  valueOption="valor"
                  valueText="desc"
                  disabled={
                    listaModalidades.length === 1 ||
                    !listaModalidades.length ||
                    !ueCodigo ||
                    !permissoesTela?.podeConsultar
                  }
                  onChange={onChangeModalidade}
                  valueSelect={modalidadeId}
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4">
              <Loader loading={carregandoSemestres} ignorarTip>
                <SelectComponent
                  lista={listaSemestres}
                  valueOption="valor"
                  valueText="desc"
                  label="Semestre"
                  placeholder="Selecione o semestre"
                  disabled={
                    !modalidadeId ||
                    Number(modalidadeId) !== ModalidadeEnum.EJA ||
                    Number(modalidadeId) !== ModalidadeEnum.CELP ||
                    listaSemestres?.length === 1 ||
                    !listaSemestres?.length ||
                    !permissoesTela?.podeConsultar
                  }
                  valueSelect={semestre}
                  onChange={onChangeSemestre}
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-4">
              <Loader loading={carregandoTurmas} ignorarTip>
                <SelectComponent
                  lista={listaTurmas}
                  valueOption="valor"
                  valueText="nomeFiltro"
                  label="Turma"
                  placeholder="Selecione a turma"
                  disabled={
                    listaTurmas.length === 1 ||
                    !listaTurmas.length ||
                    !modalidadeId ||
                    !permissoesTela?.podeConsultar ||
                    ehModalidadeInfantil
                  }
                  valueSelect={turmaCodigo}
                  onChange={onChangeTurma}
                  multiple
                  showSearch
                />
              </Loader>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-4">
              <Loader loading={carregandoBimestres} ignorarTip>
                <SelectComponent
                  lista={listaBimestres}
                  valueOption="valor"
                  valueText="desc"
                  label="Bimestre"
                  disabled={
                    !turmaCodigo?.length ||
                    listaBimestres?.length === 1 ||
                    !listaBimestres?.length ||
                    !permissoesTela?.podeConsultar ||
                    ehModalidadeInfantil
                  }
                  valueSelect={bimestre}
                  onChange={onChangeBimestre}
                  placeholder="Selecione o bimestre"
                />
              </Loader>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default RelatorioAtaBimestral;
