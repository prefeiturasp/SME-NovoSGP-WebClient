import { Tabs } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Loader } from '~/componentes';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Alert from '~/componentes/alert';
import Card from '~/componentes/card';
import SelectComponent from '~/componentes/select';
import { ContainerTabsCard } from '~/componentes/tabs/tabs.css';
import { URL_HOME } from '~/constantes/url';
import ServicoDisciplina from '~/servicos/Paginas/ServicoDisciplina';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';
import FechamentoBimestreLista from './fechamento-bimestre-lista/fechamento-bimestre-lista';
import RotasDto from '~/dtos/rotasDto';
import { Fechamento } from './fechamento-bimestre.css';
import FechamentoFinal from '../FechamentoFinal/fechamentoFinal';
import ServicoFechamentoFinal from '~/servicos/Paginas/DiarioClasse/ServicoFechamentoFinal';
import { erros, sucesso, confirmar } from '~/servicos/alertas';
import ServicoFechamentoBimestre from '~/servicos/Paginas/Fechamento/ServicoFechamentoBimestre';
import periodo from '~/dtos/periodo';
import { setExpandirLinha } from '~/redux/modulos/notasConceitos/actions';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import { ModalidadeDTO } from '~/dtos';
import BtnAcoesFechamentoBimestre from './btnAcoesFechamentoBimestre';
import { useNavigate } from 'react-router-dom';

const FechamentoBismestre = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { TabPane } = Tabs;
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada, permissoes } = usuario;
  const permissoesTela = permissoes[RotasDto.FECHAMENTO_BIMESTRE];
  const { podeIncluir, podeAlterar } = permissoesTela;
  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const [emEdicao, setEmEdicao] = useState(false);

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  useEffect(() => {
    const naoSetarSomenteConsultaNoStore = ehTurmaInfantil(
      modalidadesFiltroPrincipal,
      turmaSelecionada
    );
    setSomenteConsulta(
      verificaSomenteConsulta(permissoesTela, naoSetarSomenteConsultaNoStore)
    );
  }, [turmaSelecionada, permissoesTela, modalidadesFiltroPrincipal]);

  const [carregandoDisciplinas, setCarregandoDisciplinas] = useState(false);
  const [carregandoBimestres, setCarregandoBimestres] = useState(false);
  const [listaDisciplinas, setListaDisciplinas] = useState([]);
  const [disciplinaIdSelecionada, setDisciplinaIdSelecionada] = useState(null);
  const [desabilitarDisciplina, setDesabilitarDisciplina] = useState(
    listaDisciplinas && listaDisciplinas.length === 1
  );

  const [bimestreCorrente, setBimestreCorrente] = useState();
  const [dadosBimestre1, setDadosBimestre1] = useState(undefined);
  const [dadosBimestre2, setDadosBimestre2] = useState(undefined);
  const [dadosBimestre3, setDadosBimestre3] = useState(undefined);
  const [dadosBimestre4, setDadosBimestre4] = useState(undefined);
  const [ehRegencia, setEhRegencia] = useState(false);
  const [ehSintese, setEhSintese] = useState(false);
  const [periodoFechamento, setPeriodoFechamento] = useState(periodo.Anual);
  const [situacaoFechamento, setSituacaoFechamento] = useState(0);
  const [registraFrequencia, setRegistraFrequencia] = useState(true);
  const [idDisciplinaTerritorioSaber, setIdDisciplinaTerritorioSaber] =
    useState(undefined);

  const ehModaliadeEJA =
    Number(turmaSelecionada?.modalidade) !== ModalidadeDTO.EJA;

  const ehIgualPeriodoAnual = periodoFechamento === periodo.Anual;

  const refFechamentoFinal = useRef();
  const [fechamentoFinal, setFechamentoFinal] = useState({
    ehRegencia,
    turmaCodigo: turmaSelecionada.turma,
    itens: [],
  });

  const trocarEstadoEmEdicao = novoEstado => {
    setEmEdicao(novoEstado);
  };

  const resetarTela = () => {
    setBimestreCorrente();
    setDadosBimestre1(undefined);
    setDadosBimestre2(undefined);
    setDadosBimestre3(undefined);
    setDadosBimestre4(undefined);
    setEhRegencia(false);
    setEhSintese(false);
    setPeriodoFechamento(periodo.Anual);
    setSituacaoFechamento(0);
    setRegistraFrequencia(true);
    trocarEstadoEmEdicao(false);
    setDesabilitarDisciplina(false);
    setIdDisciplinaTerritorioSaber(undefined);
  };

  const onChangeDisciplinas = id => {
    resetarTela();

    if (id) {
      const disciplina = listaDisciplinas.find(
        c => String(c.codigoComponenteCurricular) === id
      );
      setIdDisciplinaTerritorioSaber(
        disciplina.territorioSaber ? disciplina.id : id
      );
      setEhRegencia(disciplina && disciplina.regencia);
    }

    setDisciplinaIdSelecionada(id);
  };

  const onClickVoltar = async () => {
    let confirmou = true;
    if (emEdicao) {
      confirmou = await confirmar(
        'Atenção',
        'Existem alterações pendentes, deseja realmente sair da tela de fechamento?'
      );
    }
    if (confirmou) {
      navigate(URL_HOME);
      dispatch(setExpandirLinha([]));
    }
  };

  const onClickCancelar = async () => {
    const confirmou = await confirmar(
      'Atenção',
      'Existem alterações pendentes, deseja realmente cancelar?'
    );
    if (confirmou) {
      refFechamentoFinal.current.cancelar();
      trocarEstadoEmEdicao(false);
    }
  };

  useEffect(() => {
    const obterDisciplinas = async () => {
      if (
        turmaSelecionada &&
        turmaSelecionada.turma &&
        !ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada)
      ) {
        setCarregandoDisciplinas(true);
        const lista = await ServicoDisciplina.obterDisciplinasPorTurma(
          turmaSelecionada.turma
        ).catch(e => erros(e));
        if (lista && lista.data) {
          setListaDisciplinas([...lista.data]);
          if (lista.data.length === 1) {
            setDisciplinaIdSelecionada(undefined);
            setIdDisciplinaTerritorioSaber(
              lista.data[0].territorioSaber ? lista.data[0].id : undefined
            );
            setDisciplinaIdSelecionada(
              String(lista.data[0].codigoComponenteCurricular)
            );
            setEhRegencia(lista.data[0].regencia);
            setDesabilitarDisciplina(true);
          }
        } else {
          setListaDisciplinas([]);
        }
        setCarregandoDisciplinas(false);
      }
    };
    setDisciplinaIdSelecionada(undefined);
    setIdDisciplinaTerritorioSaber(undefined);
    setListaDisciplinas([]);
    resetarTela();
    obterDisciplinas();
  }, [turmaSelecionada, modalidadesFiltroPrincipal]);

  const setDadosBimestre = (bimestre, dados) => {
    switch (bimestre) {
      case 1:
        setDadosBimestre1(undefined);
        setDadosBimestre1(dados);
        break;
      case 2:
        setDadosBimestre2(undefined);
        setDadosBimestre2(dados);
        break;
      case 3:
        setDadosBimestre3(undefined);
        setDadosBimestre3(dados);
        break;
      case 4:
        setDadosBimestre4(undefined);
        setDadosBimestre4(dados);
        break;
      default:
        break;
    }
  };

  const obterDados = async (bimestre = 0) => {
    if (disciplinaIdSelecionada) {
      setCarregandoBimestres(true);
      const fechamento = await ServicoFechamentoBimestre.buscarDados(
        turmaSelecionada.turma,
        idDisciplinaTerritorioSaber ?? disciplinaIdSelecionada,
        bimestre,
        turmaSelecionada.periodo
      )
        .catch(e => erros(e))
        .finally(() => {
          setCarregandoBimestres(false);
        });
      if (fechamento && fechamento.data) {
        const dadosFechamento = fechamento.data;
        setEhSintese(dadosFechamento.ehSintese);
        setSituacaoFechamento(dadosFechamento.situacao);
        setPeriodoFechamento(dadosFechamento.periodo);
        setBimestreCorrente(`${dadosFechamento.bimestre}`);
        setDadosBimestre(dadosFechamento.bimestre, dadosFechamento);
      }
    }
  };

  useEffect(() => {
    if (disciplinaIdSelecionada) {
      const disciplina = listaDisciplinas.find(
        item =>
          String(item.codigoComponenteCurricular) ===
          String(disciplinaIdSelecionada)
      );
      if (disciplina) {
        setRegistraFrequencia(disciplina.registraFrequencia);
      }
    }
  }, [disciplinaIdSelecionada, listaDisciplinas]);

  const onConfirmouTrocarTab = numeroBimestre => {
    setBimestreCorrente(numeroBimestre);
    if (numeroBimestre !== 'final') {
      obterDados(numeroBimestre);
    }
  };

  const salvarFechamentoFinal = async () => {
    fechamentoFinal.turmaCodigo = turmaSelecionada.turma;
    fechamentoFinal.ehRegencia = ehRegencia;
    fechamentoFinal.disciplinaId = disciplinaIdSelecionada;
    setCarregandoBimestres(true);
    ServicoFechamentoFinal.salvar(fechamentoFinal)
      .then(result => {
        sucesso(result.data.mensagemConsistencia);
        trocarEstadoEmEdicao(false);
        dispatch(setExpandirLinha([]));
        refFechamentoFinal.current.salvarFechamentoFinal();
        return result.data;
      })
      .catch(e => {
        erros(e);
        setCarregandoBimestres(false);
      });
  };

  const onChangeTab = async numeroBimestre => {
    if (emEdicao) {
      const confirmado = await confirmar(
        'Atenção',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );
      if (confirmado) {
        const salvou = await salvarFechamentoFinal();
        if (salvou) {
          onConfirmouTrocarTab(numeroBimestre);
          trocarEstadoEmEdicao(false);
          dispatch(setExpandirLinha([]));
        }
      } else {
        onConfirmouTrocarTab(numeroBimestre);
        trocarEstadoEmEdicao(false);
        dispatch(setExpandirLinha([]));
      }
    } else {
      onConfirmouTrocarTab(numeroBimestre);
    }
  };

  const [turmaPrograma, setTurmaPrograma] = useState(false);

  useEffect(() => {
    const programa = !!(turmaSelecionada.ano === '0');
    setTurmaPrograma(programa);
  }, [turmaSelecionada.ano]);

  useEffect(() => {
    if (listaDisciplinas && listaDisciplinas.length > 0) {
      const disciplina = listaDisciplinas.find(
        c => String(c.disciplinaId) === String(disciplinaIdSelecionada)
      );
      if (disciplina) setEhRegencia(disciplina.regencia);
    }
  }, [disciplinaIdSelecionada, listaDisciplinas]);

  const onChangeFechamentoFinal = alunosAlterados => {
    const fechamentoFinalDto = fechamentoFinal;
    fechamentoFinalDto.itens = alunosAlterados.map(item => ({
      ...item,
      conceitoId: item?.conceitoId || null,
    }));
    setFechamentoFinal(fechamentoFinalDto);
    trocarEstadoEmEdicao(true);
  };

  return (
    <>
      {!turmaSelecionada.turma &&
      !ehTurmaInfantil(modalidadesFiltroPrincipal, usuario.turmaSelecionada) ? (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'AlertaTurmaFechamentoBimestre',
            mensagem: 'Você precisa escolher uma turma.',
          }}
        />
      ) : (
        <></>
      )}
      <AlertaModalidadeInfantil />
      <Loader loading={carregandoBimestres}>
        <Cabecalho pagina="Fechamento">
          <BtnAcoesFechamentoBimestre
            salvarFechamentoFinal={salvarFechamentoFinal}
            onClickVoltar={onClickVoltar}
            onClickCancelar={onClickCancelar}
            somenteConsulta={somenteConsulta}
            ehSintese={ehSintese}
            setEmEdicao={setEmEdicao}
            emEdicao={emEdicao}
          />
        </Cabecalho>
        <Card>
          <div className="col-md-12">
            <div className="row">
              <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-4">
                <Loader loading={carregandoDisciplinas}>
                  <SelectComponent
                    id="disciplina"
                    name="disciplinaId"
                    lista={listaDisciplinas}
                    valueOption="codigoComponenteCurricular"
                    valueText="nome"
                    valueSelect={disciplinaIdSelecionada}
                    onChange={onChangeDisciplinas}
                    placeholder="Selecione um componente curricular"
                    disabled={
                      desabilitarDisciplina ||
                      !turmaSelecionada.turma ||
                      (listaDisciplinas && listaDisciplinas.length === 1)
                    }
                  />
                </Loader>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="row">
              <Fechamento className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-2">
                <ContainerTabsCard
                  type="card"
                  onChange={onChangeTab}
                  activeKey={bimestreCorrente}
                >
                  <TabPane
                    tab="1º Bimestre"
                    key="1"
                    disabled={!disciplinaIdSelecionada}
                  >
                    {dadosBimestre1 ? (
                      <FechamentoBimestreLista
                        dados={dadosBimestre1}
                        ehRegencia={ehRegencia}
                        ehSintese={ehSintese}
                        situacaoFechamento={situacaoFechamento}
                        codigoComponenteCurricular={
                          idDisciplinaTerritorioSaber ?? disciplinaIdSelecionada
                        }
                        turmaId={turmaSelecionada.turma}
                        anoLetivo={turmaSelecionada.anoLetivo}
                        registraFrequencia={registraFrequencia}
                        desabilitarCampo={
                          !podeIncluir || !podeAlterar || somenteConsulta
                        }
                      />
                    ) : null}
                  </TabPane>

                  <TabPane
                    tab="2º Bimestre"
                    key="2"
                    disabled={!disciplinaIdSelecionada}
                  >
                    {dadosBimestre2 ? (
                      <FechamentoBimestreLista
                        dados={dadosBimestre2}
                        ehRegencia={ehRegencia}
                        ehSintese={ehSintese}
                        situacaoFechamento={situacaoFechamento}
                        codigoComponenteCurricular={
                          idDisciplinaTerritorioSaber ?? disciplinaIdSelecionada
                        }
                        turmaId={turmaSelecionada.turma}
                        anoLetivo={turmaSelecionada.anoLetivo}
                        registraFrequencia={registraFrequencia}
                        desabilitarCampo={
                          !podeIncluir || !podeAlterar || somenteConsulta
                        }
                      />
                    ) : null}
                  </TabPane>
                  {ehIgualPeriodoAnual && ehModaliadeEJA ? (
                    <TabPane
                      tab="3º Bimestre"
                      key="3"
                      disabled={!disciplinaIdSelecionada}
                    >
                      {dadosBimestre3 ? (
                        <FechamentoBimestreLista
                          dados={dadosBimestre3}
                          ehRegencia={ehRegencia}
                          ehSintese={ehSintese}
                          situacaoFechamento={situacaoFechamento}
                          codigoComponenteCurricular={
                            idDisciplinaTerritorioSaber ??
                            disciplinaIdSelecionada
                          }
                          turmaId={turmaSelecionada.turma}
                          anoLetivo={turmaSelecionada.anoLetivo}
                          registraFrequencia={registraFrequencia}
                          desabilitarCampo={
                            !podeIncluir || !podeAlterar || somenteConsulta
                          }
                        />
                      ) : null}
                    </TabPane>
                  ) : null}
                  {ehIgualPeriodoAnual && ehModaliadeEJA ? (
                    <TabPane
                      tab="4º Bimestre"
                      key="4"
                      disabled={!disciplinaIdSelecionada}
                    >
                      {dadosBimestre4 ? (
                        <FechamentoBimestreLista
                          dados={dadosBimestre4}
                          ehRegencia={ehRegencia}
                          ehSintese={ehSintese}
                          situacaoFechamento={situacaoFechamento}
                          codigoComponenteCurricular={
                            idDisciplinaTerritorioSaber ??
                            disciplinaIdSelecionada
                          }
                          turmaId={turmaSelecionada.turma}
                          anoLetivo={turmaSelecionada.anoLetivo}
                          registraFrequencia={registraFrequencia}
                          desabilitarCampo={
                            !podeIncluir || !podeAlterar || somenteConsulta
                          }
                        />
                      ) : null}
                    </TabPane>
                  ) : null}
                  <TabPane
                    tab="Final"
                    key="final"
                    disabled={!disciplinaIdSelecionada}
                  >
                    <FechamentoFinal
                      turmaCodigo={turmaSelecionada.turma}
                      disciplinaCodigo={
                        idDisciplinaTerritorioSaber ?? disciplinaIdSelecionada
                      }
                      ehRegencia={ehRegencia}
                      turmaPrograma={turmaPrograma}
                      onChange={onChangeFechamentoFinal}
                      ref={refFechamentoFinal}
                      desabilitarCampo={
                        !podeIncluir || !podeAlterar || somenteConsulta
                      }
                      somenteConsulta={somenteConsulta}
                      carregandoFechamentoFinal={carregando =>
                        setCarregandoBimestres(carregando)
                      }
                      bimestreCorrente={bimestreCorrente}
                      registraFrequencia={registraFrequencia}
                      semestre={turmaSelecionada.periodo}
                    />
                  </TabPane>
                </ContainerTabsCard>
                {!bimestreCorrente && (
                  <div className="text-center">Selecione um bimestre</div>
                )}
              </Fechamento>
            </div>
          </div>
        </Card>
      </Loader>
    </>
  );
};

export default FechamentoBismestre;
