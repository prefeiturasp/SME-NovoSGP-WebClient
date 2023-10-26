import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import Card from '~/componentes/card';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import AbrangenciaServico from '~/servicos/Abrangencia';
import { erros, sucesso } from '~/servicos/alertas';
import api from '~/servicos/api';
import ServicoFiltroRelatorio from '~/servicos/Paginas/FiltroRelatorio/ServicoFiltroRelatorio';
import ServicoRelatorioControleGrade from '~/servicos/Paginas/Relatorios/DiarioClasse/ControleGrade/ServicoRelatorioControleGrade';
import ServicoComponentesCurriculares from '~/servicos/Paginas/ComponentesCurriculares/ServicoComponentesCurriculares';
import FiltroHelper from '~/componentes-sgp/filtro/helper';
import { ordenarListaMaiorParaMenor } from '~/utils/funcoes/gerais';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';
import { URL_HOME } from '~/constantes';
import { useNavigate } from 'react-router-dom';

const ControleGrade = () => {
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

  const listaTipoRelatorio = [
    { valor: '1', desc: 'Sintético ' },
    { valor: '2', desc: 'Analítico' },
  ];

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
  const [tipoRelatorio, setTipoRelatorio] = useState(undefined);
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

  const onChangeTipoRelatorio = valor => {
    setTipoRelatorio(valor);
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const [anoAtual] = useState(window.moment().format('YYYY'));

  const obterDres = useCallback(async () => {
    if (anoLetivo) {
      setExibirLoader(true);
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
      setExibirLoader(false);
    }
  }, [anoLetivo]);

  useEffect(() => {
    obterDres();
  }, [obterDres]);

  const obterUes = useCallback(async (dre, ano) => {
    if (dre) {
      setExibirLoader(true);
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
      setExibirLoader(false);
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
      setExibirLoader(true);
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

  const obterTurmas = useCallback(async (modalidadeSelecionada, ue, ano) => {
    if (ue && modalidadeSelecionada) {
      setExibirLoader(true);
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
            id: item.id,
            ano: item.ano,
            nomeFiltro: item.nomeFiltro,
          })
        );
        setListaTurmas(lista);
        if (lista.length === 1) {
          setTurmaId(lista[0].valor);
        }
      }
      setExibirLoader(false);
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
    if (ehEjaOuCelp) {
      setListaBimestres(bimestresEja);
    } else {
      setListaBimestres(bimestresFundMedio);
    }
    setBimestre();
  }, [ehEjaOuCelp]);

  const obterAnosLetivos = useCallback(async () => {
    setExibirLoader(true);
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
    setExibirLoader(false);
  }, [anoAtual]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos]);

  const obterComponentesCurriculares = useCallback(async () => {
    let turmas = [];
    if (turmaId === '0') {
      turmas = listaTurmas.filter(item => item.valor !== '0').map(a => a.valor);
    } else {
      turmas = [turmaId];
    }

    setExibirLoader(true);
    const componentes =
      await ServicoComponentesCurriculares.obterComponentesPorListaDeTurmas(
        turmas,
        true
      )
        .catch(e => erros(e))
        .finally(() => setExibirLoader(false));

    if (componentes && componentes.data && componentes.data.length) {
      const lista = [];

      if (turmaId === '0' || componentes.data.length > 1) {
        lista.push({ valor: '0', desc: 'Todos' });
      }

      componentes.data.map(item =>
        lista.push({
          desc: item.nome,
          valor: item.codigo,
        })
      );

      setListaComponentesCurriculares(lista);
      if (lista.length === 1) {
        setComponentesCurricularesId(lista[0].valor);
      }

      if (turmaId === '0' || componentes.data.length > 1) {
        setComponentesCurricularesId('0');
      }
    } else {
      setListaComponentesCurriculares([]);
    }
  }, [turmaId, listaTurmas]);

  useEffect(() => {
    if (ueId && turmaId !== '0' && turmaId !== undefined) {
      obterComponentesCurriculares();
    } else if (ueId && turmaId === '0') {
      const lista = [{ valor: '0', desc: 'Todos' }];
      setComponentesCurricularesId(lista[0].valor);
      setListaComponentesCurriculares(lista);
    } else {
      setComponentesCurricularesId(undefined);
      setListaComponentesCurriculares([]);
    }
  }, [ueId, turmaId]);

  const obterSemestres = async (
    modalidadeSelecionada,
    anoLetivoSelecionado
  ) => {
    setExibirLoader(true);
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
    setExibirLoader(false);
  };

  useEffect(() => {
    if (modalidadeId && anoLetivo && ehEjaOuCelp) {
      obterSemestres(modalidadeId, anoLetivo);
    } else {
      setSemestre();
      setListaSemestres([]);
    }
  }, [obterAnosLetivos, modalidadeId, anoLetivo, ehEjaOuCelp]);

  const cancelar = async () => {
    await setDreId();
    await setUeId();
    await setModalidadeId();
    await setComponentesCurricularesId(undefined);
    await setBimestre();
    await setTurmaId(undefined);
    await setAnoLetivo();
    await setAnoLetivo(anoAtual);
    await setTipoRelatorio();
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
      !componentesCurricularesId ||
      !bimestre ||
      !tipoRelatorio ||
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
    tipoRelatorio,
    clicouBotaoGerar,
    ehEjaOuCelp,
  ]);

  const gerar = async () => {
    setExibirLoader(true);
    setClicouBotaoGerar(true);

    let turmas = [];
    let componentesCurriculares = [componentesCurricularesId];
    let bimestres = [...bimestre];

    if (turmaId === '0') {
      turmas = listaTurmas.filter(item => item.valor !== '0').map(b => b.id);
    } else {
      const turmaSelecionada = listaTurmas.find(
        item => String(item.valor) === String(turmaId)
      );
      turmas = [turmaSelecionada.id];
    }

    if (componentesCurricularesId === '0') {
      componentesCurriculares = listaComponentesCurriculares
        .filter(item => item.valor !== '0')
        .map(b => b.valor);
    }

    if (bimestre[0] === '0') {
      bimestres = listaBimestres
        .filter(item => item.valor !== '0')
        .map(b => b.valor);
    }

    const params = {
      anoLetivo,
      modalidadeTurma: modalidadeId,
      semestre,
      turmas,
      componentesCurriculares,
      bimestres,
      modelo: tipoRelatorio,
    };
    const retorno = await ServicoRelatorioControleGrade.gerar(params)
      .catch(e => erros(e))
      .finally(setExibirLoader(false));
    if (retorno && retorno.status === 200) {
      sucesso(
        'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
      );
    }
  };

  return (
    <>
      <Cabecalho pagina="Relatório controle de grade">
        <BotoesAcaoRelatorio
          onClick={() => {
            navigate(URL_HOME);
          }}
          onClickCancelar={cancelar}
          onClickGerar={gerar}
          desabilitarBtnGerar={desabilitarBtnGerar}
          modoEdicao={modoEdicao}
        />
      </Cabecalho>
      <Card>
        <Loader loading={exibirLoader}>
          <div className="col-md-12">
            <div className="row">
              <div className="col-sm-12 col-md-6 col-lg-2 col-xl-2 mb-2">
                <SelectComponent
                  id="drop-ano-letivo"
                  label="Ano Letivo"
                  lista={listaAnosLetivo}
                  valueOption="valor"
                  valueText="desc"
                  disabled={listaAnosLetivo && listaAnosLetivo.length === 1}
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
                  onChange={onChangeTurma}
                  placeholder="Turma"
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
                    turmaId === '0'
                  }
                  valueSelect={componentesCurricularesId}
                  onChange={onChangeComponenteCurricular}
                  placeholder="Componente curricular"
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
                    const opcaoTodosJaSelecionado = bimestre
                      ? bimestre.includes('0')
                      : false;
                    if (opcaoTodosJaSelecionado) {
                      const listaSemOpcaoTodos = valores.filter(v => v !== '0');
                      onChangeBimestre(listaSemOpcaoTodos);
                    } else if (valores.includes('0')) {
                      onChangeBimestre(['0']);
                    } else {
                      onChangeBimestre(valores);
                    }
                  }}
                  placeholder="Bimestre"
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 mb-2">
                <SelectComponent
                  label="Tipo de Relatório"
                  lista={listaTipoRelatorio}
                  valueOption="valor"
                  valueText="desc"
                  valueSelect={tipoRelatorio}
                  onChange={onChangeTipoRelatorio}
                  placeholder="Selecione o tipo de relatório"
                />
              </div>
            </div>
          </div>
        </Loader>
      </Card>
    </>
  );
};

export default ControleGrade;
