import React, { useCallback, useEffect, useState } from 'react';
import { CheckboxComponent, Loader, SelectComponent } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';
import Alert from '~/componentes/alert';
import Card from '~/componentes/card';
import { URL_HOME } from '~/constantes';
import { OPCAO_TODOS, ANO_INICIO_INFANTIL } from '~/constantes/constantes';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import AbrangenciaServico from '~/servicos/Abrangencia';
import { erros, sucesso } from '~/servicos/alertas';
import api from '~/servicos/api';

import ServicoComponentesCurriculares from '~/servicos/Paginas/ComponentesCurriculares/ServicoComponentesCurriculares';
import ServicoFiltroRelatorio from '~/servicos/Paginas/FiltroRelatorio/ServicoFiltroRelatorio';
import ServicoHistoricoAlteracoesNotas from '~/servicos/Paginas/Relatorios/Fechamento/HistoricoAlteracoesNotas/ServicoHistoricoAlteracoesNotas';
import FiltroHelper from '~/componentes-sgp/filtro/helper';
import { useNavigate } from 'react-router-dom';

const RelatorioHistoricoAlteracoesNotas = () => {
  const navigate = useNavigate();

  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [listaComponentesCurriculares, setListaComponentesCurriculares] =
    useState([]);
  const [listaBimestres, setListaBimestres] = useState([]);

  const listaTipoNota = [
    { valor: '1', desc: 'Ambas' },
    { valor: '2', desc: 'Fechamento' },
    { valor: '3', desc: 'Conselho de classe' },
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
  const [tipoDeNota, setTipoDeNota] = useState('1');
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [clicouBotaoGerar, setClicouBotaoGerar] = useState(false);
  const [desabilitarBtnGerar, setDesabilitarBtnGerar] = useState(true);
  const [modoEdicao, setModoEdicao] = useState(false);

  const ehEjaOuCelp =
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
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const onChangeTurma = valor => {
    setComponentesCurricularesId();
    setTurmaId(valor);
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const onChangeComponenteCurricular = valor => {
    setComponentesCurricularesId(valor);
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const onChangeBimestre = valor => {
    setBimestre(valor);
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const onChangeTipoNota = valor => {
    setTipoDeNota(valor);
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const [anoAtual] = useState(window.moment().format('YYYY'));

  const obterDres = useCallback(async () => {
    if (anoLetivo) {
      setExibirLoader(true);
      const resposta = await AbrangenciaServico.buscarDres(
        `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`,
        consideraHistorico
      )
        .catch(e => erros(e))
        .finally(() => setExibirLoader(false));

      if (resposta?.data?.length) {
        const lista = resposta.data
          .map(item => ({
            desc: item.nome,
            valor: String(item.codigo),
            abrev: item.abreviacao,
          }))
          .filter(d => d.valor !== OPCAO_TODOS);

        setListaDres(lista);

        if (lista && lista.length && lista.length === 1) {
          setDreId(lista[0].valor);
        }
      } else {
        setListaDres([]);
        setDreId(undefined);
      }
    }
  }, [anoLetivo, consideraHistorico]);

  useEffect(() => {
    obterDres();
  }, [obterDres, anoLetivo, consideraHistorico]);

  useEffect(() => {
    setAnoLetivo(anoAtual);
  }, [consideraHistorico, anoAtual]);

  const obterUes = useCallback(async () => {
    if (dreId) {
      setExibirLoader(true);
      const resposta = await AbrangenciaServico.buscarUes(
        dreId,
        `v1/abrangencias/${consideraHistorico}/dres/${dreId}/ues?anoLetivo=${anoLetivo}`,
        true
      )
        .catch(e => erros(e))
        .finally(() => setExibirLoader(false));

      if (resposta?.data?.length) {
        const lista = resposta.data
          .map(item => ({
            desc: item.nome,
            valor: String(item.codigo),
          }))
          .filter(d => d.valor !== OPCAO_TODOS);

        if (lista && lista.length && lista.length === 1) {
          setUeId(lista[0].valor);
        }

        setListaUes(lista);
      } else {
        setListaUes([]);
      }
    }
  }, [consideraHistorico, anoLetivo, dreId]);

  useEffect(() => {
    if (dreId) {
      obterUes();
    } else {
      setUeId();
      setListaUes([]);
    }
  }, [dreId, anoLetivo, consideraHistorico, obterUes]);

  const obterModalidades = async (ue, ano) => {
    if (ue && ano) {
      setExibirLoader(true);

      const { data } = consideraHistorico
        ? await ServicoFiltroRelatorio.obterModalidadesPorAbrangenciaHistorica(
            ue,
            false,
            true,
            ano
          )
        : await ServicoFiltroRelatorio.obterModalidadesPorAbrangencia(ue);

      if (data) {
        const lista = data
          .filter(item => Number(item.valor) !== ModalidadeEnum.CELP)
          .map(item => ({
            desc: item.descricao,
            valor: String(item.valor),
          }));

        if (lista && lista.length && lista.length === 1) {
          setModalidadeId(lista[0].valor);
        }
        setListaModalidades(lista);
      }
      setExibirLoader(false);
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

  const obterTurmas = useCallback(async () => {
    if (dreId && ueId && modalidadeId) {
      setExibirLoader(true);
      const { data } = await AbrangenciaServico.buscarTurmas(
        ueId,
        modalidadeId,
        '',
        anoLetivo,
        consideraHistorico
      );
      if (data) {
        const lista = [];
        if (data.length > 1) {
          lista.push({ valor: OPCAO_TODOS, nomeFiltro: 'Todas' });
        }
        data.map(item =>
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
          setTurmaId([lista[0].valor]);
        }
      }
      setExibirLoader(false);
    }
  }, [ueId, dreId, consideraHistorico, anoLetivo, modalidadeId]);

  useEffect(() => {
    if (modalidadeId && ueId && dreId) {
      obterTurmas();
    } else {
      setTurmaId();
      setListaTurmas([]);
    }
  }, [modalidadeId, ueId, dreId, anoLetivo, consideraHistorico, obterTurmas]);

  useEffect(() => {
    const bi = [];
    bi.push({ desc: 'Todos', valor: OPCAO_TODOS });
    bi.push({ desc: '1º', valor: '1' });
    bi.push({ desc: '2º', valor: '2' });

    if (
      Number(modalidadeId) !== ModalidadeEnum.EJA &&
      Number(modalidadeId) !== ModalidadeEnum.CELP
    ) {
      bi.push({ desc: '3º', valor: '3' });
      bi.push({ desc: '4º', valor: '4' });
    }
    bi.push({ desc: 'Final', valor: '0' });
    setListaBimestres(bi);
    setBimestre();
  }, [modalidadeId]);

  const obterAnosLetivos = useCallback(async () => {
    setExibirLoader(true);
    let anosLetivos = [];

    const anosLetivoComHistorico = await FiltroHelper.obterAnosLetivos({
      consideraHistorico: true,
      anoMinimo: ANO_INICIO_INFANTIL,
    });
    const anosLetivoSemHistorico = await FiltroHelper.obterAnosLetivos({
      consideraHistorico: false,
      anoMinimo: ANO_INICIO_INFANTIL,
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

    setListaAnosLetivo(anosLetivos);
    setExibirLoader(false);
  }, [anoAtual]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos]);

  const obterComponentesCurriculares = useCallback(async () => {
    let turmas = [];
    if (turmaId?.find(item => item === OPCAO_TODOS)) {
      turmas = listaTurmas
        .filter(item => item.valor !== OPCAO_TODOS)
        .map(a => a.valor);
    } else {
      turmas = turmaId;
    }

    setExibirLoader(true);
    const componentes =
      await ServicoComponentesCurriculares.obterComponentesPorListaDeTurmas(
        turmas
      )
        .catch(e => erros(e))
        .finally(() => setExibirLoader(false));

    if (componentes && componentes.data && componentes.data.length) {
      const lista = [];
      if (turmaId === OPCAO_TODOS || componentes.data.length > 1) {
        lista.push({ valor: OPCAO_TODOS, desc: 'Todos' });
      }
      componentes.data.map(item =>
        lista.push({
          desc: item.nome,
          valor: item.codigo,
        })
      );

      setListaComponentesCurriculares(lista);
      if (lista.length === 1) {
        setComponentesCurricularesId([lista[0].valor]);
      }

      if (turmaId === OPCAO_TODOS || componentes.data.length > 1) {
        setComponentesCurricularesId([OPCAO_TODOS]);
      }
    } else {
      setListaComponentesCurriculares([]);
    }
  }, [turmaId, listaTurmas]);

  useEffect(() => {
    if (ueId && turmaId) {
      obterComponentesCurriculares();
    } else {
      setComponentesCurricularesId(undefined);
      setListaComponentesCurriculares([]);
    }
  }, [ueId, turmaId, obterComponentesCurriculares]);

  const obterSemestres = async (
    modalidadeSelecionada,
    anoLetivoSelecionado,
    historico
  ) => {
    setExibirLoader(true);
    const retorno = await api.get(
      `v1/abrangencias/${historico}/semestres?anoLetivo=${anoLetivoSelecionado}&modalidade=${
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
    setExibirLoader(false);
  };

  useEffect(() => {
    if (modalidadeId && anoLetivo && ehEjaOuCelp) {
      obterSemestres(modalidadeId, anoLetivo, consideraHistorico);
    } else {
      setSemestre();
      setListaSemestres([]);
    }
  }, [
    obterAnosLetivos,
    modalidadeId,
    anoLetivo,
    consideraHistorico,
    ehEjaOuCelp,
  ]);

  const cancelar = async () => {
    setConsideraHistorico(false);
    setAnoLetivo(anoAtual);
    setDreId();
    setUeId();
    setModalidadeId();
    setComponentesCurricularesId(undefined);
    setBimestre();
    setTurmaId(undefined);
    setTipoDeNota('1');
    setModoEdicao(false);
  };

  useEffect(() => {
    const desabilitar =
      !anoLetivo ||
      !dreId ||
      !ueId ||
      !modalidadeId ||
      (ehEjaOuCelp ? !semestre : false) ||
      !turmaId ||
      !componentesCurricularesId?.length ||
      !bimestre?.length ||
      !tipoDeNota ||
      clicouBotaoGerar;

    setDesabilitarBtnGerar(desabilitar);
  }, [
    anoLetivo,
    dreId,
    ueId,
    modalidadeId,
    turmaId,
    componentesCurricularesId,
    semestre,
    bimestre,
    tipoDeNota,
    clicouBotaoGerar,
    ehEjaOuCelp,
  ]);

  const gerar = async () => {
    let turmas = turmaId;
    if (turmaId.find(item => item !== OPCAO_TODOS)) {
      turmas = listaTurmas.filter(
        item => item.valor === turmaId.find(codigo => codigo === item.valor)
      );
      if (turmas?.length) {
        turmas = turmas.map(t => t.id);
      }
    }

    const params = {
      codigoDre: dreId,
      codigoUe: ueId,
      anoLetivo,
      modalidadeTurma: modalidadeId,
      semestre,
      turma: turmas,
      componentesCurriculares: componentesCurricularesId,
      bimestres: bimestre,
      tipoAlteracaoNota: tipoDeNota,
    };

    setExibirLoader(true);
    setClicouBotaoGerar(true);

    const retorno = await ServicoHistoricoAlteracoesNotas.gerar(params)
      .catch(e => erros(e))
      .finally(setExibirLoader(false));
    if (retorno && retorno.status === 200) {
      sucesso(
        'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
      );
    }
  };

  const onchangeMultiSelect = (valores, valoreAtual, funSetarNovoValor) => {
    const opcaoTodosJaSelecionado = valoreAtual
      ? valoreAtual.includes(OPCAO_TODOS)
      : false;
    if (opcaoTodosJaSelecionado) {
      const listaSemOpcaoTodos = valores.filter(v => v !== OPCAO_TODOS);
      funSetarNovoValor(listaSemOpcaoTodos);
    } else if (valores.includes(OPCAO_TODOS)) {
      funSetarNovoValor([OPCAO_TODOS]);
    } else {
      funSetarNovoValor(valores);
    }
  };

  return (
    <Loader loading={exibirLoader}>
      {modalidadeId && Number(modalidadeId) === ModalidadeEnum.INFANTIL ? (
        <div className="col-md-12">
          <Alert
            alerta={{
              tipo: 'warning',
              id: 'alerta-sem-turma-conselho-classe',
              mensagem:
                'Não é possível gerar este relatório para a modalidade infantil',
              estiloTitulo: { fontSize: '18px' },
            }}
            className="mb-2"
          />
        </div>
      ) : (
        ''
      )}
      <Cabecalho pagina="Relatório de alteração de notas">
        <BotoesAcaoRelatorio
          onClickVoltar={() => {
            navigate(URL_HOME);
          }}
          onClickCancelar={cancelar}
          onClickGerar={gerar}
          desabilitarBtnGerar={
            desabilitarBtnGerar ||
            Number(modalidadeId) === ModalidadeEnum.INFANTIL
          }
          modoEdicao={modoEdicao}
        />
      </Cabecalho>
      <Card>
        <div className="col-md-12">
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 mb-2">
              <CheckboxComponent
                label="Exibir histórico?"
                onChangeCheckbox={e => {
                  setAnoLetivo();
                  setDreId();
                  setConsideraHistorico(e.target.checked);
                  setModoEdicao(true);
                }}
                checked={consideraHistorico}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-2 col-xl-2 mb-2">
              <SelectComponent
                id="drop-ano-letivo"
                label="Ano Letivo"
                lista={listaAnosLetivo}
                valueOption="valor"
                valueText="desc"
                disabled={listaAnosLetivo?.length === 1}
                onChange={onChangeAnoLetivo}
                valueSelect={anoLetivo}
                placeholder="Ano letivo"
              />
            </div>
            <div className="col-sm-12 col-md-12 col-lg-5 col-xl-5 mb-2">
              <SelectComponent
                id="drop-dre"
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
            </div>
            <div className="col-sm-12 col-md-12 col-lg-5 col-xl-5 mb-2">
              <SelectComponent
                id="drop-ue"
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
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4  mb-2">
              <SelectComponent
                id="drop-modalidade"
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
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4  mb-2">
              <SelectComponent
                id="drop-semestre"
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
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4  mb-2">
              <SelectComponent
                id="drop-turma"
                lista={listaTurmas}
                valueOption="valor"
                valueText="nomeFiltro"
                label="Turma"
                disabled={
                  !modalidadeId || (listaTurmas && listaTurmas.length === 1)
                }
                valueSelect={turmaId}
                placeholder="Turma"
                multiple
                onChange={valores => {
                  onchangeMultiSelect(valores, turmaId, onChangeTurma);
                }}
                showSearch
              />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4  mb-2">
              <SelectComponent
                id="drop-componente-curricular"
                lista={listaComponentesCurriculares}
                valueOption="valor"
                valueText="desc"
                label="Componente curricular"
                disabled={
                  !modalidadeId ||
                  listaComponentesCurriculares?.length === 1 ||
                  turmaId?.find(item => item === OPCAO_TODOS)
                }
                valueSelect={componentesCurricularesId}
                placeholder="Componente curricular"
                multiple
                onChange={valores => {
                  onchangeMultiSelect(
                    valores,
                    componentesCurricularesId,
                    onChangeComponenteCurricular
                  );
                }}
              />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4  mb-2">
              <SelectComponent
                id="drop-bimestre"
                lista={listaBimestres}
                valueOption="valor"
                valueText="desc"
                label="Bimestre"
                disabled={!modalidadeId}
                valueSelect={bimestre}
                multiple
                onChange={valores => {
                  onchangeMultiSelect(valores, bimestre, onChangeBimestre);
                }}
                placeholder="Bimestre"
              />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 mb-2">
              <SelectComponent
                label="Tipo de nota"
                lista={listaTipoNota}
                valueOption="valor"
                valueText="desc"
                valueSelect={tipoDeNota}
                onChange={onChangeTipoNota}
                placeholder="Tipo de nota"
              />
            </div>
          </div>
        </div>
      </Card>
    </Loader>
  );
};

export default RelatorioHistoricoAlteracoesNotas;
