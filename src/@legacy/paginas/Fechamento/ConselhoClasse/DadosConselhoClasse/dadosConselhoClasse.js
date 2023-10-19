import { ROUTES } from '@/core/enum/routes';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '~/componentes';
import { ContainerTabsCard } from '~/componentes/tabs/tabs.css';
import modalidadeDto from '~/dtos/modalidade';
import {
  setBimestreAtual,
  setDadosPrincipaisConselhoClasse,
  setDentroPeriodo,
  setDesabilitarCampos,
  setExpandirLinha,
  setFechamentoPeriodoInicioFim,
  setIdCamposNotasPosConselho,
  setNotaConceitoPosConselhoAtual,
  setPodeAcessar,
} from '~/redux/modulos/conselhoClasse/actions';
import ServicoConselhoClasse from '~/servicos/Paginas/ConselhoClasse/ServicoConselhoClasse';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import { erros } from '~/servicos/alertas';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';
import servicoSalvarConselhoClasse from '../servicoSalvarConselhoClasse';
import AlertaDentroPeriodo from './AlertaDentroPeriodo/alertaDentroPeriodo';
import AnotacoesRecomendacoes from './AnotacoesRecomendacoes/anotacoesRecomendacoes';
import ListasNotasConceitos from './ListasNotasConceito/listasNotasConceitos';
import MarcadorPeriodoInicioFim from './MarcadorPeriodoInicioFim/marcadorPeriodoInicioFim';
import Sintese from './Sintese/Sintese';

const { TabPane } = Tabs;

const DadosConselhoClasse = props => {
  const { turmaCodigo, modalidade } = props;

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;
  const permissoesTela = usuario.permissoes[ROUTES.CONSELHO_CLASSE];

  const dispatch = useDispatch();

  const bimestreAtual = useSelector(
    store => store.conselhoClasse.bimestreAtual
  );

  const dadosAlunoObjectCard = useSelector(
    store => store.conselhoClasse.dadosAlunoObjectCard
  );

  const podeAcessar = useSelector(store => store.conselhoClasse.podeAcessar);

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const { codigoEOL, desabilitado } = dadosAlunoObjectCard;

  const [semDados, setSemDados] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [turmaAtual, setTurmaAtual] = useState(0);

  const limparDadosNotaPosConselhoJustificativa = useCallback(() => {
    dispatch(setExpandirLinha([]));
    dispatch(setNotaConceitoPosConselhoAtual({}));
    dispatch(setIdCamposNotasPosConselho({}));
  }, [dispatch]);

  const validaPermissoes = useCallback(
    novoRegistro => {
      const naoSetarSomenteConsultaNoStore = ehTurmaInfantil(
        modalidadesFiltroPrincipal,
        turmaSelecionada
      );
      const somenteConsulta = verificaSomenteConsulta(
        permissoesTela,
        naoSetarSomenteConsultaNoStore
      );

      const desabilitar = novoRegistro
        ? somenteConsulta || !permissoesTela.podeIncluir
        : somenteConsulta || !permissoesTela.podeAlterar;

      dispatch(setDesabilitarCampos(desabilitar));
    },
    [dispatch, permissoesTela, turmaSelecionada, modalidadesFiltroPrincipal]
  );

  // Quando passa bimestre 0 o retorno vai trazer dados do bimestre corrente!
  const caregarInformacoes = useCallback(
    async (bimestreConsulta = 0, carregarParecer = true) => {
      limparDadosNotaPosConselhoJustificativa();
      setCarregando(true);
      setSemDados(true);
      const ehFinal = bimestreConsulta === 'final';
      const retorno = await ServicoConselhoClasse.obterInformacoesPrincipais(
        turmaCodigo,
        usuario.turmaSelecionada.consideraHistorico && bimestreConsulta === 0
          ? '1'
          : ehFinal
          ? '0'
          : bimestreConsulta,
        codigoEOL,
        ehFinal,
        dadosAlunoObjectCard.desabilitado ? true : false
      ).catch(e => {
        erros(e);
        dispatch(
          setBimestreAtual({
            valor: bimestreConsulta,
            dataInicio: null,
            dataFim: null,
          })
        );
        dispatch(setDadosPrincipaisConselhoClasse({}));
        setSemDados(true);
      });

      if (retorno && retorno.data) {
        const {
          conselhoClasseId,
          fechamentoTurmaId,
          conselhoClasseAlunoId,
          bimestre,
          bimestrePeriodoInicio,
          bimestrePeriodoFim,
          periodoFechamentoInicio,
          periodoFechamentoFim,
          tipoNota,
          media,
          anoLetivo,
          periodoAberto,
        } = retorno.data;

        const novoRegistro = !conselhoClasseId;
        validaPermissoes(novoRegistro);

        let validouPodeAcessar = podeAcessar;
        if (
          fechamentoTurmaId &&
          conselhoClasseId &&
          bimestreConsulta === 'final' &&
          conselhoClasseAlunoId &&
          carregarParecer
        ) {
          validouPodeAcessar =
            await servicoSalvarConselhoClasse.validaParecerConclusivo(
              conselhoClasseId,
              fechamentoTurmaId,
              codigoEOL,
              turmaCodigo,
              turmaSelecionada?.consideraHistorico
            );
          dispatch(setPodeAcessar(validouPodeAcessar));
        }

        if (!validouPodeAcessar) {
          dispatch(
            setBimestreAtual({
              valor: bimestreConsulta,
              dataInicio: bimestrePeriodoInicio,
              dataFim: bimestrePeriodoFim,
            })
          );
          setCarregando(false);
          return;
        }

        const valores = {
          fechamentoTurmaId,
          conselhoClasseId: conselhoClasseId || 0,
          conselhoClasseAlunoId,
          alunoCodigo: codigoEOL,
          turmaCodigo,
          alunoDesabilitado: desabilitado,
          tipoNota,
          media,
          periodoAberto,
        };

        dispatch(setDadosPrincipaisConselhoClasse(valores));
        dispatch(setDentroPeriodo(!!periodoAberto));

        const datas = {
          periodoFechamentoInicio,
          periodoFechamentoFim,
        };
        dispatch(setFechamentoPeriodoInicioFim(datas));

        if (periodoFechamentoFim) {
          ServicoConselhoClasse.carregarListaTiposConceito(
            periodoFechamentoFim
          );
        } else {
          ServicoConselhoClasse.carregarListaTiposConceito(
            `${anoLetivo}/12/31`
          );
        }

        if (ehFinal) {
          dispatch(
            setBimestreAtual({
              valor: bimestreConsulta,
              dataInicio: null,
              dataFim: null,
            })
          );
        } else if (bimestre) {
          dispatch(
            setBimestreAtual({
              valor: String(bimestre),
              dataInicio: bimestrePeriodoInicio,
              dataFim: bimestrePeriodoFim,
            })
          );
        } else {
          dispatch(
            setBimestreAtual({ valor: '1', dataInicio: null, dataFim: null })
          );
        }
        setSemDados(false);
      } else {
        validaPermissoes(true);
        setCarregando(false);
      }
    },
    [
      codigoEOL,
      desabilitado,
      dispatch,
      limparDadosNotaPosConselhoJustificativa,
      turmaCodigo,
      validaPermissoes,
      usuario,
      podeAcessar,
      turmaSelecionada,
    ]
  );

  useEffect(() => {
    if (codigoEOL && String(turmaSelecionada.turma) === String(turmaAtual)) {
      if (bimestreAtual.valor) {
        caregarInformacoes(bimestreAtual.valor);
      }
    }
    if (String(turmaSelecionada.turma) !== String(turmaAtual)) {
      dispatch(
        setBimestreAtual({ valor: '', dataInicio: null, dataFim: null })
      );
      setTurmaAtual(turmaSelecionada.turma);
    }
  }, [codigoEOL, turmaSelecionada, turmaAtual]);

  const onChangeTab = async numeroBimestre => {
    let continuar = false;

    const validouNotaConceitoPosConselho =
      await servicoSalvarConselhoClasse.validarNotaPosConselho();

    if (validouNotaConceitoPosConselho) {
      const validouAnotacaoRecomendacao =
        await servicoSalvarConselhoClasse.validarSalvarRecomendacoesAlunoFamilia();
      if (validouNotaConceitoPosConselho && validouAnotacaoRecomendacao) {
        continuar = true;
      }
    }

    if (continuar) {
      caregarInformacoes(numeroBimestre, false);
    }
  };

  const montarDados = () => {
    return !semDados &&
      String(turmaSelecionada.turma) === String(turmaAtual) ? (
      <>
        <AlertaDentroPeriodo />
        <MarcadorPeriodoInicioFim />
        <ListasNotasConceitos bimestreSelecionado={bimestreAtual} />
        <Sintese
          ehFinal={bimestreAtual.valor === 'final'}
          bimestreSelecionado={bimestreAtual.valor}
          turmaId={turmaSelecionada.turma}
        />
        <AnotacoesRecomendacoes
          bimestre={bimestreAtual}
          codigoTurma={turmaCodigo}
          setCarregandoAba={setCarregando}
        />
      </>
    ) : semDados && !carregando ? (
      <div className="text-center">Sem dados</div>
    ) : null;
  };

  return (
    <Loader loading={carregando}>
      {codigoEOL ? (
        <ContainerTabsCard
          width="20%"
          type="card"
          onChange={onChangeTab}
          activeKey={bimestreAtual.valor}
        >
          <TabPane tab="1º Bimestre" key="1">
            {bimestreAtual.valor === '1' ? montarDados() : ''}
          </TabPane>
          <TabPane tab="2º Bimestre" key="2">
            {bimestreAtual.valor === '2' ? montarDados() : ''}
          </TabPane>
          {modalidade.toString() !== ModalidadeEnum.EJA.toString() ||
          modalidade.toString() !== ModalidadeEnum.CELP.toString() ? (
            <TabPane tab="3º Bimestre" key="3">
              {bimestreAtual.valor === '3' ? montarDados() : ''}
            </TabPane>
          ) : (
            ''
          )}
          {modalidade.toString() !== ModalidadeEnum.EJA.toString() ||
          modalidade.toString() !== ModalidadeEnum.CELP.toString() ? (
            <TabPane tab="4º Bimestre" key="4">
              {bimestreAtual.valor === '4' ? montarDados() : ''}
            </TabPane>
          ) : (
            ''
          )}
          <TabPane tab="Final" key="final">
            {bimestreAtual.valor === 'final' ? montarDados() : ''}
          </TabPane>
        </ContainerTabsCard>
      ) : (
        ''
      )}
      {codigoEOL && !bimestreAtual?.valor && (
        <div className="text-center">Selecione um bimestre</div>
      )}
    </Loader>
  );
};

DadosConselhoClasse.propTypes = {
  turmaCodigo: PropTypes.oneOfType([PropTypes.any]),
  modalidade: PropTypes.oneOfType([PropTypes.any]),
};

DadosConselhoClasse.defaultProps = {
  turmaCodigo: '',
  modalidade: '',
};

export default DadosConselhoClasse;
