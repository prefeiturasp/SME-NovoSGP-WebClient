import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  SelectComponent,
  ListaPaginada,
  Loader,
  CheckboxComponent,
} from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import Card from '~/componentes/card';
import { URL_HOME } from '~/constantes/url';
import modalidade from '~/dtos/modalidade';
import AbrangenciaServico from '~/servicos/Abrangencia';
import api from '~/servicos/api';
import history from '~/servicos/history';
import FiltroHelper from '~/componentes-sgp/filtro/helper';
import { erros, sucesso } from '~/servicos/alertas';
import LocalizadorEstudante from '~/componentes/LocalizadorEstudante';
import ServicoHistoricoEscolar from '~/servicos/Paginas/HistoricoEscolar/ServicoHistoricoEscolar';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';
import { ServicoFiltroRelatorio } from '~/servicos';

const HistoricoEscolar = () => {
  const codigosAlunosSelecionados = useSelector(
    state => state.localizadorEstudante.codigosAluno
  );

  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [anoAtual] = useState(window.moment().format('YYYY'));

  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaSemestre, setListaSemestre] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);

  const [anoLetivo, setAnoLetivo] = useState(undefined);
  const [dreId, setDreId] = useState(undefined);
  const [ueId, setUeId] = useState(undefined);
  const [modalidadeId, setModalidadeId] = useState(undefined);
  const [semestre, setSemestre] = useState(undefined);
  const [turmaId, setTurmaId] = useState(undefined);
  const [estudanteOpt, setEstudanteOpt] = useState(undefined);
  const [imprimirDadosResp, setImprimirDadosResp] = useState('0');
  const [preencherDataImpressao, setPreencherDataImpressao] = useState('0');

  const [desabilitarBtnGerar, setDesabilitarBtnGerar] = useState(true);
  const [
    alunoLocalizadorSelecionado,
    setAlunoLocalizadorSelecionado,
  ] = useState();

  const [alunosSelecionados, setAlunosSelecionados] = useState([]);
  const [filtro, setFiltro] = useState({});
  const [modoEdicao, setModoEdicao] = useState(false);

  const vaidaDesabilitarBtnGerar = useCallback(
    desabilitar => {
      if (String(modalidadeId) === String(modalidade.INFANTIL)) {
        setDesabilitarBtnGerar(true);
      } else {
        setDesabilitarBtnGerar(desabilitar);
      }
    },
    [modalidadeId]
  );

  useEffect(() => {
    if (codigosAlunosSelecionados?.length > 0) {
      setAlunosSelecionados([]);
      setEstudanteOpt('0');
    }
  }, [codigosAlunosSelecionados]);

  const listaEstudanteOpt = [
    { valor: '0', desc: 'Todos' },
    { valor: '1', desc: 'Estudantes selecionados' },
  ];

  const listaSimNao = [
    { valor: '0', desc: 'Sim' },
    { valor: '1', desc: 'Não' },
  ];

  const colunas = [
    {
      title: 'Número',
      dataIndex: 'numeroChamada',
    },
    {
      title: 'Nome',
      dataIndex: 'nome',
    },
  ];

  const [carregandoAnos, setCarregandoAnos] = useState(false);

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnos(true);
    const anosLetivos = await FiltroHelper.obterAnosLetivos({
      consideraHistorico,
    });
    setListaAnosLetivo(anosLetivos);
    setAnoLetivo();
    setAnoLetivo(anosLetivos[0].valor);
    setDreId();
    setListaDres([]);
    setAlunosSelecionados([]);
    setEstudanteOpt('0');
    setCarregandoAnos(false);

  }, [anoAtual, consideraHistorico]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos]);

  const [carregandoModalidades, setCarregandoModalidades] = useState(false);

  const obterModalidades = useCallback(
    async (ue, ano) => {
      if (ue && ano) {
        setCarregandoModalidades(true);
        setModalidadeId();
        const resposta = await ServicoFiltroRelatorio.obterModalidades(
          ue,
          ano,
          consideraHistorico
        )
          .catch(e => erros(e))
          .finally(() => setCarregandoModalidades(false));

        if (resposta?.data?.length) {
          const lista = resposta.data;

          if (lista?.length === 1) {
            setModalidadeId(lista[0].valor);
          }
          setListaModalidades(lista);
        }
      }
    },
    [consideraHistorico]
  );

  const [carregandoUes, setCarregandoUes] = useState(false);

  const obterUes = useCallback(async (dre, ano, considHistorico = false) => {
    if (dre && ano) {
      setCarregandoUes(true);
      const resposta = await AbrangenciaServico.buscarUes(
        dre,
        `v1/abrangencias/${considHistorico}/dres/${dre}/ues?anoLetivo=${ano}`,
        true
      )
        .catch(e => {
          erros(e);
          setCarregandoUes(false);
        })
        .finally(() => setCarregandoUes(false));
      if (resposta?.data?.length) {
        const lista = resposta.data.map(item => ({
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

  const onChangeDre = dre => {
    setDreId(dre);

    setListaUes([]);
    setUeId();

    setListaModalidades([]);
    setModalidadeId();

    setListaSemestre([]);
    setSemestre();

    setListaTurmas([]);
    setTurmaId();

    setModoEdicao(true);
  };

  const [carregandoDres, setCarregandoDres] = useState(false);

  const obterDres = useCallback(async () => {
    if (anoLetivo) {
      setCarregandoDres(true);
      const { data } = await AbrangenciaServico.buscarDres(
        `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`
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

  const [carregandoTurmas, setCarregandoTurmas] = useState(false);

  const obterTurmas = useCallback(
    async (modalidadeSelecionada, ue, ano, considHistorico = false) => {
      if (ue && modalidadeSelecionada) {
        setCarregandoTurmas(true);
        const { data } = await AbrangenciaServico.buscarTurmas(
          ue,
          modalidadeSelecionada,
          semestre,
          ano,
          considHistorico,
          true
        );
        if (data) {
          const lista = data.map(item => ({
            desc: item.nome,
            valor: item.codigo,
            nomeFiltro: item.nomeFiltro,
          }));
          setListaTurmas(lista);

          if (lista && lista.length && lista.length === 1) {
            setTurmaId(lista[0].valor);
          }

          if (alunoLocalizadorSelecionado?.codigoTurma) {
            setTurmaId(alunoLocalizadorSelecionado.codigoTurma);
          }
        }
        setCarregandoTurmas(false);
      }
    },
    [alunoLocalizadorSelecionado, semestre]
  );

  const [carregandoSemestres, setCarregandoSemestres] = useState(false);

  const obterSemestres = useCallback(
    async (modalidadeSelecionada, anoLetivoSelecionado) => {
      setCarregandoSemestres(true);
      const retorno = await api.get(
        `v1/abrangencias/${consideraHistorico}/semestres?anoLetivo=${anoLetivoSelecionado}&modalidade=${modalidadeSelecionada ||
          0}`
      );
      if (retorno && retorno.data) {
        const lista = retorno.data.map(periodo => {
          return { desc: periodo, valor: periodo };
        });

        if (lista && lista.length && lista.length === 1) {
          setSemestre(lista[0].valor?.toString());
        }
        setListaSemestre(lista);

        if (
          Number(modalidadeSelecionada) === modalidade.EJA &&
          alunoLocalizadorSelecionado?.semestre
        ) {
          setSemestre(alunoLocalizadorSelecionado?.semestre?.toString());
        }
      }
      setCarregandoSemestres(false);
    },
    [alunoLocalizadorSelecionado, consideraHistorico]
  );

  useEffect(() => {
    if (anoLetivo && ueId) {
      obterModalidades(ueId, anoLetivo);
    } else {
      setModalidadeId();
      setListaModalidades([]);
    }

  }, [anoLetivo, ueId]);

  useEffect(() => {
    if (dreId) {
      obterUes(dreId, anoLetivo, consideraHistorico);
    } else {
      setUeId();
      setListaUes([]);
    }

  }, [dreId, anoLetivo, obterUes]);

  useEffect(() => {
    if (modalidadeId && ueId && anoLetivo) {
      obterTurmas(modalidadeId, ueId, anoLetivo, consideraHistorico);
    } else {
      setTurmaId();
      setListaTurmas([]);
    }

  }, [modalidadeId, ueId, anoLetivo, semestre]);

  useEffect(() => {
    if (modalidadeId && anoLetivo) {
      if (Number(modalidadeId) === modalidade.EJA) {
        obterSemestres(modalidadeId, anoLetivo);
      } else {
        setSemestre();
        setListaSemestre([]);
      }
    } else {
      setSemestre();
      setListaSemestre([]);
    }

  }, [modalidadeId, anoLetivo]);

  useEffect(() => {
    let desabilitar = true;
    if (
      anoLetivo?.length > 0 ||
      dreId?.length > 0 ||
      ueId?.length > 0 ||
      modalidadeId?.length > 0
    ) {
      if (turmaId?.length > 0 && String(estudanteOpt) === '0') {
        desabilitar = false;
      } else if (
        String(estudanteOpt) === '1' &&
        alunosSelecionados?.length > 0
      ) {
        desabilitar = false;
      } else if (codigosAlunosSelecionados?.length > 0) {
        desabilitar = false;
      }
    }

    if (Number(modalidadeId) === modalidade.EJA) {
      vaidaDesabilitarBtnGerar(!semestre || desabilitar);
    } else {
      vaidaDesabilitarBtnGerar(desabilitar);
    }
  }, [
    alunoLocalizadorSelecionado,
    codigosAlunosSelecionados,
    anoLetivo,
    dreId,
    ueId,
    modalidadeId,
    turmaId,
    semestre,
    vaidaDesabilitarBtnGerar,
    estudanteOpt,
    alunosSelecionados,
  ]);

  useEffect(() => {
    obterDres();
  }, [obterDres]);

  const onClickVoltar = () => {
    history.push(URL_HOME);
  };

  const onClickCancelar = () => {
    setConsideraHistorico(false);
    setAnoLetivo();
    setDreId();
    setListaAnosLetivo([]);
    setListaDres([]);

    setEstudanteOpt();

    obterAnosLetivos();

    setModoEdicao(false);
  };

  const gerarHistorico = async params => {
    const requisicao = await ServicoHistoricoEscolar.gerar(params);
    return requisicao.status === 200 && requisicao.data;
  };

  const [carregandoGerar, setCarregandoGerar] = useState(false);

  const onClickGerar = () => {
    setCarregandoGerar(true);

    const params = {
      anoLetivo,
      dreCodigo: dreId,
      ueCodigo: ueId,
      modalidade: modalidadeId,
      semestre,
      turmaCodigo: turmaId,
      consideraHistorico,
      imprimirDadosResponsaveis: imprimirDadosResp === '0',
      preencherDataImpressao: preencherDataImpressao === '0',
      alunosCodigo:
        codigosAlunosSelecionados?.length > 0
          ? codigosAlunosSelecionados
          : alunosSelecionados,
    };

    if (gerarHistorico(params)) {
      sucesso(
        'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado'
      );
      setDesabilitarBtnGerar(true);
    }

    setCarregandoGerar(false);
  };

  const onChangeUe = ue => {
    setUeId(ue);

    setListaModalidades([]);
    setModalidadeId();

    setListaSemestre([]);
    setSemestre();

    setListaTurmas([]);
    setTurmaId();

    setModoEdicao(true);
  };

  const onChangeModalidade = novaModalidade => {
    setModalidadeId(novaModalidade);

    setListaSemestre([]);
    setSemestre();

    setListaTurmas([]);
    setTurmaId();

    setModoEdicao(true);
  };

  const onChangeAnoLetivo = ano => {
    setAnoLetivo(ano);

    setListaModalidades([]);
    setModalidadeId();

    setListaSemestre([]);
    setSemestre();

    setListaTurmas([]);
    setTurmaId();

    setModoEdicao(true);
  };

  const onChangeSemestre = valor => {
    setSemestre(valor);
    setModoEdicao(true);
  };

  const onChangeTurma = valor => {
    setTurmaId(valor);
    setEstudanteOpt('0');
    setModoEdicao(true);
  };

  const onChangeEstudanteOpt = valor => {
    if (valor === '1') {
      setFiltro({
        anoLetivo,
        modalidade: modalidadeId,
        dreCodigo: dreId,
        ueCodigo: ueId,
        turmaCodigo: turmaId,
        semestre,
      });
    } else {
      setAlunosSelecionados([]);
    }
    setEstudanteOpt(valor);
    setModoEdicao(true);
  };

  const onChangeImprimirDadosResp = valor => {
    setImprimirDadosResp(valor);
    setModoEdicao(true);
  };

  const onChangePreencherDataImpressao = valor => {
    setPreencherDataImpressao(valor);
    setModoEdicao(true);
  };

  const onChangeLocalizadorEstudante = aluno => {
    if (aluno?.alunoCodigo && aluno?.alunoNome) {
      setAlunoLocalizadorSelecionado(aluno);
      if (aluno?.codigoTurma) {
        setTurmaId(aluno?.codigoTurma);
      }
      if (
        Number(aluno?.modalidadeCodigo) === modalidade.EJA &&
        aluno?.semestre
      ) {
        setSemestre(aluno?.semestre?.toString());
      }
      if (aluno?.modalidadeCodigo) {
        setModalidadeId(aluno?.modalidadeCodigo?.toString());
      }
      vaidaDesabilitarBtnGerar(false);
    } else {
      setAlunoLocalizadorSelecionado();
    }
    setModoEdicao(true);
  };

  const onSelecionarItems = items => {
    setAlunosSelecionados([...items.map(item => String(item.codigo))]);
    setModoEdicao(true);
  };

  function onCheckedConsideraHistorico(e) {
    setConsideraHistorico(e.target.checked);
    setModoEdicao(true);
  }

  return (
    <>
      <AlertaModalidadeInfantil
        exibir={String(modalidadeId) === String(modalidade.INFANTIL)}
        validarModalidadeFiltroPrincipal={false}
      />
      <Cabecalho pagina="Histórico Escolar">
        <BotoesAcaoRelatorio
          onClickVoltar={onClickVoltar}
          onClickCancelar={onClickCancelar}
          onClickGerar={onClickGerar}
          desabilitarBtnGerar={desabilitarBtnGerar}
          carregandoGerar={carregandoGerar}
          temLoaderBtnGerar
          modoEdicao={modoEdicao}
        />
      </Cabecalho>
      <Card>
        <div className="col-md-12">
          <div className="row">
            <div className="col-sm-12 mb-4">
              <CheckboxComponent
                label="Exibir histórico?"
                onChangeCheckbox={onCheckedConsideraHistorico}
                checked={consideraHistorico}
              />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-2 col-xl-2 mb-2">
              <Loader loading={carregandoAnos} tip="">
                <SelectComponent
                  label="Ano Letivo"
                  lista={listaAnosLetivo}
                  valueOption="valor"
                  valueText="desc"
                  disabled={
                    (listaAnosLetivo && listaAnosLetivo.length === 1) ||
                    codigosAlunosSelecionados?.length > 0
                  }
                  onChange={onChangeAnoLetivo}
                  valueSelect={anoLetivo}
                  placeholder="Ano letivo"
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-5 col-xl-5 mb-2">
              <Loader loading={carregandoDres} tip="">
                <SelectComponent
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
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-2">
              <div className="row">
                <LocalizadorEstudante
                  showLabel
                  ueId={ueId}
                  onChange={onChangeLocalizadorEstudante}
                  anoLetivo={anoLetivo}
                  desabilitado={!dreId || !ueId}
                />
              </div>
            </div>
            <div
              className={`"col-sm-12 col-md-6 ${
                modalidadeId && String(modalidadeId) === String(modalidade.EJA)
                  ? `col-lg-3 col-xl-3`
                  : `col-lg-4 col-xl-4`
              } mb-2"`}
            >
              <Loader loading={carregandoModalidades} tip="">
                <SelectComponent
                  label="Modalidade"
                  lista={listaModalidades}
                  valueOption="valor"
                  valueText="descricao"
                  disabled={
                    !ueId ||
                    alunoLocalizadorSelecionado?.length ||
                    (listaModalidades && listaModalidades.length === 1) ||
                    codigosAlunosSelecionados?.length > 0
                  }
                  onChange={onChangeModalidade}
                  valueSelect={modalidadeId}
                  placeholder="Modalidade"
                />
              </Loader>
            </div>
            {String(modalidadeId) === String(modalidade.EJA) ? (
              <div className="col-sm-12 col-md-12 col-lg-3 col-xl-3 mb-2">
                <Loader loading={carregandoSemestres} tip="">
                  <SelectComponent
                    lista={listaSemestre}
                    valueOption="valor"
                    valueText="desc"
                    label="Semestre"
                    disabled={
                      !modalidadeId ||
                      (listaSemestre && listaSemestre.length === 1) ||
                      String(modalidadeId) === String(modalidade.FUNDAMENTAL) ||
                      alunoLocalizadorSelecionado?.semestre
                    }
                    valueSelect={semestre}
                    onChange={onChangeSemestre}
                    placeholder="Semestre"
                  />
                </Loader>
              </div>
            ) : null}
            <div
              className={`"col-sm-12 col-md-6 ${
                modalidadeId && String(modalidadeId) === String(modalidade.EJA)
                  ? `col-lg-3 col-xl-3`
                  : `col-lg-4 col-xl-4`
              } mb-2"`}
            >
              <Loader loading={carregandoTurmas} tip="">
                <SelectComponent
                  lista={listaTurmas}
                  valueOption="valor"
                  valueText="nomeFiltro"
                  label="Turma"
                  disabled={
                    !modalidadeId ||
                    alunoLocalizadorSelecionado?.length ||
                    (listaTurmas && listaTurmas.length === 1) ||
                    codigosAlunosSelecionados?.length > 0
                  }
                  valueSelect={turmaId}
                  onChange={onChangeTurma}
                  placeholder="Turma"
                  showSearch
                />
              </Loader>
            </div>
            <div
              className={`"col-sm-12 col-md-6 ${
                modalidadeId && String(modalidadeId) === String(modalidade.EJA)
                  ? `col-lg-3 col-xl-3`
                  : `col-lg-4 col-xl-4`
              } mb-2"`}
            >
              <SelectComponent
                label="Estudantes"
                lista={listaEstudanteOpt}
                valueOption="valor"
                valueText="desc"
                valueSelect={estudanteOpt}
                onChange={onChangeEstudanteOpt}
                placeholder="Estudantes"
                disabled={
                  !turmaId ||
                  alunoLocalizadorSelecionado ||
                  codigosAlunosSelecionados?.length > 0
                }
              />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 mb-2">
              <SelectComponent
                label="Imprimir dados dos responsáveis"
                lista={listaSimNao}
                valueOption="valor"
                valueText="desc"
                valueSelect={imprimirDadosResp}
                onChange={onChangeImprimirDadosResp}
              />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 mb-2">
              <SelectComponent
                label="Preencher a data de impressão"
                lista={listaSimNao}
                valueOption="valor"
                valueText="desc"
                valueSelect={preencherDataImpressao}
                onChange={onChangePreencherDataImpressao}
              />
            </div>
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-2">
              {estudanteOpt === '1' ? (
                <ListaPaginada
                  url="v1/boletim/alunos"
                  id="lista-alunos-historico-escolar"
                  idLinha="codigo"
                  colunaChave="codigo"
                  colunas={colunas}
                  filtro={filtro}
                  multiSelecao
                  temPaginacao={false}
                  selecionarItems={onSelecionarItems}
                />
              ) : null}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default HistoricoEscolar;