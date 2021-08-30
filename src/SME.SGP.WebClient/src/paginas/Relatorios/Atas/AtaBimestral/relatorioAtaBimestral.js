import React, { useCallback, useEffect, useState } from 'react';

import {
  Button,
  Card,
  CheckboxComponent,
  Colors,
  Loader,
  SelectComponent,
} from '~/componentes';

import {
  AlertaModalidadeInfantil,
  Cabecalho,
  FiltroHelper,
} from '~/componentes-sgp';

import { OPCAO_TODOS, URL_HOME } from '~/constantes';
import { ModalidadeDTO } from '~/dtos';
import {
  AbrangenciaServico,
  erros,
  history,
  ServicoFiltroRelatorio,
  ServicoRelatorioAtaBimestral,
  sucesso,
} from '~/servicos';

const RelatorioAtaBimestral = () => {
  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaBimestres, setListaBimestres] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [listaUes, setListaUes] = useState([]);

  const [anoAtual] = useState(window.moment().format('YYYY'));
  const [anoLetivo, setAnoLetivo] = useState();
  const [bimestre, setBimestre] = useState();
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [dreId, setDreId] = useState();
  const [modalidadeId, setModalidadeId] = useState();
  const [semestre, setSemestre] = useState();
  const [turmaId, setTurmaId] = useState();
  const [ueId, setUeId] = useState();

  const [carregandoAnosLetivos, setCarregandoAnosLetivos] = useState(false);
  const [carregandoBimestres, setCarregandoBimestres] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoModalidades, setCarregandoModalidades] = useState(false);
  const [carregandoSemestres, setCarregandoSemestres] = useState(false);
  const [carregandoTurmas, setCarregandoTurmas] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);

  const [desabilitarBtnGerar, setDesabilitarBtnGerar] = useState(true);

  const onClickCancelar = () => {
    setConsideraHistorico(false);
    setAnoLetivo(anoAtual);
    setDreId();
    setUeId();
    setModalidadeId();
    setSemestre();
    setTurmaId();
    setBimestre();
    setDesabilitarBtnGerar(true);
  };

  const onCheckedConsideraHistorico = e => {
    setAnoLetivo(anoAtual);
    setConsideraHistorico(e.target.checked);
  };

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnosLetivos(true);
    const anosLetivo = await FiltroHelper.obterAnosLetivos({
      consideraHistorico,
    }).catch(e => erros(e));
    if (anosLetivo) {
      setListaAnosLetivo(anosLetivo);
      setAnoLetivo(anosLetivo[0].valor);
      setDreId();
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
    setDreId();

    setListaModalidades([]);
    setModalidadeId();

    setListaSemestres([]);
    setSemestre();

    setListaTurmas([]);
    setTurmaId();
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
            valor: item.codigo,
            abrev: item.abreviacao,
            id: item.id,
          }))
          .sort(FiltroHelper.ordenarLista('desc'));
        setListaDres(lista);

        if (lista?.length === 1) {
          setDreId(lista[0].id);
        }
        return;
      }
      setDreId();
      setListaDres([]);
    }
  }, [anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (anoLetivo) {
      obterDres();
    }
  }, [obterDres, anoLetivo]);

  const onChangeDre = dre => {
    setDreId(dre);

    setListaUes([]);
    setUeId();

    setListaModalidades([]);
    setModalidadeId();

    setListaSemestres([]);
    setSemestre();

    setListaTurmas([]);
    setTurmaId();
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
          consideraHistorico
        )
          .catch(e => erros(e))
          .finally(() => setCarregandoUes(false));

        if (retorno?.data?.length) {
          const lista = retorno.data.map(item => ({
            desc: item.nome,
            valor: String(item.codigo),
          }));

          if (lista && lista.length && lista.length === 1) {
            setUeId(lista[0].valor);
          }

          setListaUes(lista);
          return;
        }
      }
      setListaUes([]);
    },
    [consideraHistorico]
  );

  useEffect(() => {
    if (dreId) {
      obterUes(dreId);
      return;
    }
    setUeId();
    setListaUes([]);
  }, [dreId, obterUes]);

  const onChangeUe = ue => {
    setUeId(ue);

    setListaModalidades([]);
    setModalidadeId();

    setListaSemestres([]);
    setSemestre();

    setListaTurmas([]);
    setTurmaId();
  };

  const obterModalidades = useCallback(async (ue, ano) => {
    setCarregandoModalidades(true);
    if (ue && ano) {
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
  }, []);

  useEffect(() => {
    if (anoLetivo && ueId) {
      obterModalidades(ueId, anoLetivo);
      return;
    }
    setModalidadeId();
    setListaModalidades([]);
  }, [anoLetivo, ueId, obterModalidades]);

  const onChangeModalidade = novaModalidade => {
    setModalidadeId(novaModalidade);

    setListaSemestres([]);
    setSemestre();

    setListaTurmas([]);
    setTurmaId();

    setListaBimestres([]);
    setBimestre();
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

  const onChangeSemestre = valor => setSemestre(valor);

  const obterTurmas = useCallback(
    async (modalidadeSelecionada, ue) => {
      setCarregandoTurmas(true);
      if (ue && modalidadeSelecionada) {
        const retorno = await AbrangenciaServico.buscarTurmas(
          ue,
          modalidadeSelecionada,
          '',
          anoLetivo,
          consideraHistorico,
          false,
          [1, 7]
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
            setTurmaId(lista[0].valor);
          }
          return;
        }
        setListaTurmas([]);
      }
    },
    [anoLetivo, consideraHistorico]
  );

  useEffect(() => {
    if (modalidadeId && ueId) {
      obterTurmas(modalidadeId, ueId);
      return;
    }
    setTurmaId();
    setListaTurmas([]);
  }, [modalidadeId, ueId, obterTurmas]);

  const onChangeTurma = valor => {
    const todosSetado = turmaId?.find(a => a === OPCAO_TODOS);
    const todos = valor.find(a => a === OPCAO_TODOS && !todosSetado);
    const novoValor = todosSetado && valor.length === 2 ? [valor[1]] : valor;
    setTurmaId(todos ? [todos] : novoValor);
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
  };

  useEffect(() => {
    const desabilitar =
      !anoLetivo ||
      !dreId ||
      !ueId ||
      !modalidadeId ||
      !turmaId?.length ||
      !bimestre;

    let desabilitado = desabilitar;

    if (Number(modalidadeId) === Number(ModalidadeDTO.EJA)) {
      desabilitado = !semestre || desabilitar;
    }
    setDesabilitarBtnGerar(desabilitado);
  }, [anoLetivo, dreId, ueId, modalidadeId, turmaId, semestre, bimestre]);

  const onClickGerar = async () => {
    const params = {
      anoLetivo,
      dreId,
      ueId,
      modalidadeId,
      semestre,
      turmaId,
      bimestre,
    };
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
        exibir={String(modalidadeId) === String(ModalidadeDTO.INFANTIL)}
        validarModalidadeFiltroPrincipal={false}
      />
      <Cabecalho pagina="Ata bimestral" classes="mb-2" />
      <Card>
        <div className="col-md-12 p-0">
          <div className="row mb-2">
            <div className="col-md-12 d-flex justify-content-end">
              <Button
                id="btn-voltar-ata-final-resultado"
                label="Voltar"
                icon="arrow-left"
                color={Colors.Azul}
                border
                className="mr-3"
                onClick={() => history.push(URL_HOME)}
              />
              <Button
                id="btn-cancelar-ata-final-resultado"
                label="Cancelar"
                color={Colors.Azul}
                border
                bold
                className="mr-3"
                onClick={onClickCancelar}
              />
              <Button
                id="btn-gerar-ata-final-resultado"
                icon="print"
                label="Gerar"
                color={Colors.Roxo}
                bold
                onClick={onClickGerar}
                disabled={
                  String(modalidadeId) === String(ModalidadeDTO.INFANTIL) ||
                  desabilitarBtnGerar
                }
              />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-sm-12">
              <CheckboxComponent
                label="Exibir histórico?"
                onChangeCheckbox={onCheckedConsideraHistorico}
                checked={consideraHistorico}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-12 col-md-4 col-lg-2 col-xl-2 pr-0">
              <Loader loading={carregandoAnosLetivos} ignorarTip>
                <SelectComponent
                  label="Ano Letivo"
                  placeholder="Ano Letivo"
                  lista={listaAnosLetivo}
                  valueOption="valor"
                  valueText="desc"
                  disabled={
                    listaAnosLetivo?.length === 1 || !listaAnosLetivo?.length
                  }
                  onChange={onChangeAnoLetivo}
                  valueSelect={anoLetivo}
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-5 col-xl-5 pr-0">
              <Loader loading={carregandoDres} ignorarTip>
                <SelectComponent
                  label="Diretoria Regional de Educação (DRE)"
                  placeholder="Diretoria Regional de Educação (DRE)"
                  lista={listaDres}
                  valueOption="valor"
                  valueText="desc"
                  disabled={
                    listaDres?.length === 1 || !listaDres?.length || !anoLetivo
                  }
                  onChange={onChangeDre}
                  valueSelect={dreId}
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
                    listaUes?.length === 1 || !listaUes?.length || !dreId
                  }
                  onChange={onChangeUe}
                  valueSelect={ueId}
                  showSearch
                />
              </Loader>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-12 col-md-8 col-lg-4 col-xl-4 pr-0">
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
                    !ueId
                  }
                  onChange={onChangeModalidade}
                  valueSelect={modalidadeId}
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4 pr-0">
              <Loader loading={carregandoSemestres} ignorarTip>
                <SelectComponent
                  lista={listaSemestres}
                  valueOption="valor"
                  valueText="desc"
                  label="Semestre"
                  placeholder="Selecione o semestre"
                  disabled={
                    !modalidadeId ||
                    Number(modalidadeId) !== ModalidadeDTO.EJA ||
                    listaSemestres?.length === 1 ||
                    !listaSemestres?.length
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
                    !modalidadeId
                  }
                  valueSelect={turmaId}
                  onChange={onChangeTurma}
                  multiple
                  showSearch
                />
              </Loader>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-4 pr-0">
              <Loader loading={carregandoBimestres} ignorarTip>
                <SelectComponent
                  lista={listaBimestres}
                  valueOption="valor"
                  valueText="desc"
                  label="Bimestre"
                  disabled={
                    !turmaId?.length ||
                    listaBimestres?.length === 1 ||
                    !listaBimestres?.length
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
