import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import {
  CheckboxComponent,
  Loader,
  RadioGroupButton,
  SelectComponent,
} from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';
import { OPCAO_TODOS } from '~/constantes/constantes';
import { ModalidadeDTO } from '~/dtos';
import { AbrangenciaServico, erros, ServicoFiltroRelatorio } from '~/servicos';
import { ordenarDescPor } from '~/utils';
import { AvisoBoletim } from './styles';

const Filtros = ({
  onFiltrar,
  filtrou,
  setFiltrou,
  setModoEdicao,
  cancelou,
  setCancelou,
}) => {
  const [anoAtual] = useState(window.moment().format('YYYY'));
  const [anoLetivo, setAnoLetivo] = useState();
  const [carregandoAnosLetivos, setCarregandoAnosLetivos] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoModalidade, setCarregandoModalidade] = useState(false);
  const [carregandoSemestres, setCarregandoSemestres] = useState(false);
  const [carregandoTurmas, setCarregandoTurmas] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [desabilitarEstudante, setDesabilitarEstudante] = useState(false);
  const [dreCodigo, setDreCodigo] = useState();
  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [modalidadeId, setModalidadeId] = useState();
  const [modeloBoletimId, setModeloBoletimId] = useState();
  const [semestre, setSemestre] = useState();
  const [opcaoEstudanteId, setOpcaoEstudanteId] = useState();
  const [turmasId, setTurmasId] = useState('');
  const [ueCodigo, setUeCodigo] = useState();
  const [
    imprimirEstudantesInativos,
    setImprimirEstudantesInativos,
  ] = useState();

  const OPCAO_TODOS_ESTUDANTES = '0';
  const OPCAO_SELECIONAR_ALUNOS = '1';
  const opcoesEstudantes = [
    { desc: 'Todos', valor: OPCAO_TODOS_ESTUDANTES },
    { desc: 'Selecionar Alunos', valor: '1' },
  ];

  const opcoesModeloBoletim = [
    { valor: 1, desc: 'Simples' },
    { valor: 2, desc: 'Detalhado' },
  ];

  const opcoesImprimirEstudantesInativos = [
    { value: true, label: 'Sim' },
    { value: false, label: 'Não' },
  ];

  const limparCampos = () => {
    setListaUes([]);
    setUeCodigo();

    setListaModalidades([]);
    setModalidadeId();

    setListaSemestres([]);
    setSemestre();

    setListaTurmas([]);
    setTurmasId();

    setOpcaoEstudanteId();
    setModeloBoletimId();
    setImprimirEstudantesInativos(false);
  };

  useEffect(() => {
    const params = {
      consideraHistorico,
      anoLetivo,
      dreCodigo,
      ueCodigo,
      modalidadeId,
      semestre: semestre || 0,
      turmasId,
      opcaoEstudanteId,
      modeloBoletimId,
      imprimirEstudantesInativos,
    };

    if (!filtrou) {
      onFiltrar(params);
    }
  }, [
    consideraHistorico,
    anoLetivo,
    dreCodigo,
    ueCodigo,
    modalidadeId,
    semestre,
    turmasId,
    opcaoEstudanteId,
    onFiltrar,
    filtrou,
    modeloBoletimId,
    imprimirEstudantesInativos,
  ]);

  const onChangeConsideraHistorico = e => {
    setConsideraHistorico(e.target.checked);
    limparCampos();
    setDreCodigo();
    setFiltrou(false);
    setModoEdicao(true);
  };

  const onChangeAnoLetivo = ano => {
    limparCampos();
    setAnoLetivo(ano);
    setFiltrou(false);
    setModoEdicao(true);
  };

  const validarValorPadraoAnoLetivo = lista => {
    if (lista?.length) {
      const temAnoAtualNaLista = lista.find(
        item => String(item.valor) === String(anoAtual)
      );
      if (temAnoAtualNaLista) {
        setAnoLetivo(anoAtual);
      } else {
        setAnoLetivo(lista[0].valor);
      }
    } else {
      setAnoLetivo();
    }
  };

  useEffect(() => {
    validarValorPadraoAnoLetivo(listaAnosLetivo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consideraHistorico, listaAnosLetivo]);

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
    const anosOrdenados = ordenarDescPor(anosLetivos, 'valor');
    validarValorPadraoAnoLetivo(anosOrdenados);

    setListaAnosLetivo(anosOrdenados);
    setCarregandoAnosLetivos(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anoAtual, consideraHistorico]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos, consideraHistorico]);

  const onChangeDre = dre => {
    setDreCodigo(dre);
    limparCampos();
    setFiltrou(false);
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
            valor: item.codigo,
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
      setDreCodigo(undefined);
      setListaDres([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anoLetivo]);

  useEffect(() => {
    if (anoLetivo) {
      obterDres();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anoLetivo]);

  const onChangeUe = ue => {
    setUeCodigo(ue);
    setListaModalidades([]);
    setModalidadeId();
    setListaTurmas([]);
    setTurmasId();
    setFiltrou(false);
    setModoEdicao(true);
  };

  const obterUes = useCallback(async () => {
    if (anoLetivo && dreCodigo) {
      setCarregandoUes(true);
      const resposta = await AbrangenciaServico.buscarUes(
        dreCodigo,
        `v1/abrangencias/${consideraHistorico}/dres/${dreCodigo}/ues?anoLetivo=${anoLetivo}`,
        true
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoUes(false));

      if (resposta?.data) {
        const lista = resposta.data.map(item => ({
          desc: item.nome,
          valor: String(item.codigo),
          id: item.id,
        }));

        if (lista?.length === 1) {
          setUeCodigo(lista[0].valor);
        }

        setListaUes(lista);
        return;
      }
      setListaUes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dreCodigo, anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (dreCodigo) {
      obterUes();
      return;
    }
    setListaUes([]);
  }, [dreCodigo, obterUes]);

  const onChangeModalidade = valor => {
    setTurmasId();
    setModalidadeId(valor);
    setFiltrou(false);
    setModoEdicao(true);
  };

  const obterModalidades = useCallback(async (ue, considHistorico) => {
    if (ue) {
      setCarregandoModalidade(true);
      const { data } = considHistorico
        ? await ServicoFiltroRelatorio.obterModalidadesPorAbrangenciaHistorica(
            ue,
            considHistorico
          ).finally(() => setCarregandoModalidade(false))
        : await ServicoFiltroRelatorio.obterModalidadesPorAbrangencia(
            ue
          ).finally(() => setCarregandoModalidade(false));

      if (data?.length) {
        const lista = data.map(item => ({
          desc: item.descricao,
          valor: String(item.valor),
        }));

        setListaModalidades(lista);
        if (lista?.length === 1) {
          setModalidadeId(lista[0].valor);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (anoLetivo && ueCodigo) {
      obterModalidades(ueCodigo, consideraHistorico);
      return;
    }
    setModalidadeId();
    setListaModalidades([]);
  }, [obterModalidades, anoLetivo, ueCodigo, consideraHistorico]);

  const onChangeSemestre = valor => {
    setSemestre(valor);
    setFiltrou(false);
    setModoEdicao(true);
  };

  const obterSemestres = async (
    modalidadeSelecionada,
    anoLetivoSelecionado,
    dreSelecionada,
    ueSelecionada
  ) => {
    setCarregandoSemestres(true);
    const retorno = await AbrangenciaServico.obterSemestres(
      consideraHistorico,
      anoLetivoSelecionado,
      modalidadeSelecionada,
      dreSelecionada,
      ueSelecionada
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
  };

  useEffect(() => {
    if (
      modalidadeId &&
      anoLetivo &&
      String(modalidadeId) === String(ModalidadeDTO.EJA) &&
      dreCodigo &&
      ueCodigo
    ) {
      obterSemestres(modalidadeId, anoLetivo, dreCodigo, ueCodigo);
      return;
    }
    setSemestre();
    setListaSemestres([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obterAnosLetivos, modalidadeId, anoLetivo, dreCodigo, ueCodigo]);

  const onChangeTurma = valor => {
    const temOpcaoTodas = String(valor) === OPCAO_TODOS;

    setTurmasId(valor);
    setOpcaoEstudanteId(OPCAO_TODOS_ESTUDANTES);
    setModeloBoletimId('1');
    setDesabilitarEstudante(temOpcaoTodas);
    setFiltrou(false);
    setModoEdicao(true);
  };

  const onChangeImprimirEstudantesInativos = valor => {
    setFiltrou(false);
    setImprimirEstudantesInativos(valor);
    setModoEdicao(true);
  };

  const obterTurmas = useCallback(async () => {
    if (dreCodigo && ueCodigo && modalidadeId) {
      setCarregandoTurmas(true);
      const retorno = await AbrangenciaServico.buscarTurmas(
        ueCodigo,
        modalidadeId,
        '',
        anoLetivo,
        consideraHistorico,
        [1]
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoTurmas(false));

      if (retorno?.data?.length) {
        const lista = [];
        if (retorno.data.length > 1) {
          lista.push({ valor: OPCAO_TODOS, nomeFiltro: 'Todas' });
        }
        retorno.data.map(item =>
          lista.push({
            desc: item.nome,
            valor: item.codigo,
            id: item.id,
            ano: item.ano,
            nomeFiltro: item.nomeFiltro,
          })
        );

        setListaTurmas(lista);
        if (lista.length === 1) {
          setTurmasId(lista[0].valor);
          setOpcaoEstudanteId(OPCAO_TODOS_ESTUDANTES);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ueCodigo, dreCodigo, consideraHistorico, anoLetivo, modalidadeId]);

  useEffect(() => {
    if (ueCodigo) {
      obterTurmas();
      return;
    }
    setTurmasId();
    setListaTurmas([]);
  }, [ueCodigo, obterTurmas]);

  const onChangeOpcaoEstudante = valor => {
    setFiltrou(false);
    setOpcaoEstudanteId(valor);
    if (!modeloBoletimId) {
      setModeloBoletimId('1');
    }

    setModoEdicao(true);
  };

  const onChangeModeloBoletim = valor => {
    setFiltrou(false);
    setModeloBoletimId(valor);
    setModoEdicao(true);
  };

  useEffect(() => {
    if (cancelou) {
      setConsideraHistorico(false);
      limparCampos();
      setAnoLetivo(anoAtual);
      setDreCodigo();
      obterDres();
      setFiltrou(false);
      setCancelou(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancelou]);

  useEffect(() => {
    if (opcaoEstudanteId !== OPCAO_TODOS_ESTUDANTES) {
      setImprimirEstudantesInativos(false);
    }

    if (opcaoEstudanteId === OPCAO_SELECIONAR_ALUNOS) {
      setFiltrou(false);
      setImprimirEstudantesInativos(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opcaoEstudanteId]);

  return (
    <div className="col-12">
      <div className="row mb-2">
        <div className="col-12">
          <CheckboxComponent
            label="Exibir histórico?"
            onChangeCheckbox={onChangeConsideraHistorico}
            checked={consideraHistorico}
          />
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <Loader loading={carregandoAnosLetivos} ignorarTip>
            <SelectComponent
              label="Ano Letivo"
              lista={listaAnosLetivo}
              valueOption="valor"
              valueText="desc"
              disabled={listaAnosLetivo?.length === 1}
              onChange={onChangeAnoLetivo}
              valueSelect={anoLetivo}
              placeholder="Ano letivo"
            />
          </Loader>
        </div>
        <div className="col-sm-12 col-md-5 col-lg-5 col-xl-5">
          <Loader loading={carregandoDres} ignorarTip>
            <SelectComponent
              label="Diretoria Regional de Educação (DRE)"
              lista={listaDres}
              valueOption="valor"
              valueText="desc"
              disabled={!anoLetivo || listaDres?.length <= 1}
              onChange={onChangeDre}
              valueSelect={dreCodigo}
              placeholder="Diretoria Regional De Educação (DRE)"
              showSearch
            />
          </Loader>
        </div>
        <div className="col-sm-12 col-md-5 col-lg-5 col-xl-5">
          <Loader loading={carregandoUes} ignorarTip>
            <SelectComponent
              id="ue"
              label="Unidade Escolar (UE)"
              lista={listaUes}
              valueOption="valor"
              valueText="desc"
              disabled={!dreCodigo || listaUes?.length === 1}
              onChange={onChangeUe}
              valueSelect={ueCodigo}
              placeholder="Unidade Escolar (UE)"
              showSearch
            />
          </Loader>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-12 col-md-4">
          <Loader loading={carregandoModalidade} ignorarTip>
            <SelectComponent
              id="drop-modalidade"
              label="Modalidade"
              lista={listaModalidades}
              valueOption="valor"
              valueText="desc"
              disabled={!ueCodigo || listaModalidades?.length === 1}
              onChange={onChangeModalidade}
              valueSelect={modalidadeId}
              placeholder="Modalidade"
            />
          </Loader>
        </div>
        <div className="col-sm-12 col-md-4">
          <Loader loading={carregandoSemestres} ignorarTip>
            <SelectComponent
              id="drop-semestre"
              lista={listaSemestres}
              valueOption="valor"
              valueText="desc"
              label="Semestre"
              disabled={
                !modalidadeId ||
                listaSemestres?.length === 1 ||
                String(modalidadeId) !== String(ModalidadeDTO.EJA)
              }
              valueSelect={semestre}
              onChange={onChangeSemestre}
              placeholder="Semestre"
            />
          </Loader>
        </div>
        <div className="col-sm-12 col-md-4">
          <Loader loading={carregandoTurmas} ignorarTip>
            <SelectComponent
              id="turma"
              lista={listaTurmas}
              valueOption="valor"
              valueText="nomeFiltro"
              label="Turma"
              disabled={!modalidadeId || listaTurmas?.length === 1}
              valueSelect={turmasId}
              onChange={onChangeTurma}
              placeholder="Turma"
              showSearch
            />
          </Loader>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12 col-md-4">
          <SelectComponent
            lista={opcoesEstudantes}
            valueOption="valor"
            valueText="desc"
            label="Estudante(s)"
            disabled={!turmasId?.length || desabilitarEstudante}
            valueSelect={opcaoEstudanteId}
            onChange={onChangeOpcaoEstudante}
            placeholder="Estudante(s)"
          />
        </div>
        <div className="col-sm-12 col-md-4">
          <SelectComponent
            lista={opcoesModeloBoletim}
            valueOption="valor"
            valueText="desc"
            label="Modelo de boletim"
            disabled={!turmasId?.length || !opcaoEstudanteId}
            valueSelect={modeloBoletimId}
            onChange={onChangeModeloBoletim}
            placeholder="Modelo de boletim"
          />
          <AvisoBoletim visivel={modeloBoletimId === '2'}>
            Neste modelo cada estudante ocupará no mínimo 1 página
          </AvisoBoletim>
        </div>
        <div className="col-sm-12 col-md-4">
          <RadioGroupButton
            label="Imprimir estudantes inativos"
            opcoes={opcoesImprimirEstudantesInativos}
            valorInicial
            onChange={e => {
              onChangeImprimirEstudantesInativos(e.target.value);
            }}
            value={imprimirEstudantesInativos}
            desabilitado={opcaoEstudanteId !== OPCAO_TODOS_ESTUDANTES}
          />
        </div>
      </div>
    </div>
  );
};

Filtros.propTypes = {
  onFiltrar: PropTypes.func,
  filtrou: PropTypes.bool,
  setFiltrou: PropTypes.func,
  setModoEdicao: PropTypes.func,
  cancelou: PropTypes.bool,
  setCancelou: PropTypes.func,
};

Filtros.defaultProps = {
  onFiltrar: () => {},
  filtrou: false,
  setFiltrou: () => {},
  setModoEdicao: () => {},
  cancelou: false,
  setCancelou: () => {},
};

export default Filtros;
