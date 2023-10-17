import { ROUTES } from '@/core/enum/routes';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Alert from '~/componentes/alert';
import Card from '~/componentes/card';
import {
  limparDadosConselhoClasse,
  setAlunosConselhoClasse,
  setDadosAlunoObjectCard,
  setDadosInconsistenciasEstudantes,
  setDadosPrincipaisConselhoClasse,
  setExibirLoaderGeralConselhoClasse,
  setPodeAcessar,
} from '~/redux/modulos/conselhoClasse/actions';
import ServicoConselhoClasse from '~/servicos/Paginas/ConselhoClasse/ServicoConselhoClasse';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import { erros } from '~/servicos/alertas';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';
import BotaoConferirConselhoClasse from './DadosConselhoClasse/BotaoConferir/botaoConferirConselhoClasse';
import BotaoGerarRelatorioConselhoClasseTurma from './DadosConselhoClasse/BotaoGerarRelatorioConselhoClasseTurma/botaoGerarRelatorioConselhoClasseTurma';
import BotaoOrdenarListaAlunos from './DadosConselhoClasse/BotaoOrdenarListaAlunos/botaoOrdenarListaAlunos';
import BotoesAcoesConselhoClasse from './DadosConselhoClasse/BotoesAcoes/botoesAcoesConselhoClasse';
import LoaderConselhoClasse from './DadosConselhoClasse/LoaderConselhoClasse/laderConselhoClasse';
import MarcadorParecerConclusivo from './DadosConselhoClasse/MarcadorParecerConclusivo/marcadorParecerConclusivo';
import ModalImpressaoBimestre from './DadosConselhoClasse/ModalImpressaoBimestre/modalImpressaoBimestre';
import ObjectCardConselhoClasse from './DadosConselhoClasse/ObjectCardConselhoClasse/objectCardConselhoClasse';
import TabelaRetratilConselhoClasse from './DadosConselhoClasse/TabelaRetratilConselhoClasse/tabelaRetratilConselhoClasse';
import DadosConselhoClasse from './DadosConselhoClasse/dadosConselhoClasse';
import { Container } from './conselhoClasse.css';
import servicoSalvarConselhoClasse from './servicoSalvarConselhoClasse';

const ConselhoClasse = () => {
  const dispatch = useDispatch();

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;
  const { turma, anoLetivo, periodo } = turmaSelecionada;
  const permissoesTela = usuario.permissoes[ROUTES.CONSELHO_CLASSE];

  const [exibirListas, setExibirListas] = useState(false);
  const [turmaAtual, setTurmaAtual] = useState(0);

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const dadosPrincipaisConselhoClasse = useSelector(
    store => store.conselhoClasse.dadosPrincipaisConselhoClasse
  );

  const dadosAlunoObjectCard = useSelector(
    store => store.conselhoClasse.dadosAlunoObjectCard
  );

  const obterListaAlunos = useCallback(async () => {
    dispatch(setDadosInconsistenciasEstudantes([]));
    dispatch(setExibirLoaderGeralConselhoClasse(true));
    const retorno = await ServicoConselhoClasse.obterListaAlunos(
      turma,
      anoLetivo,
      periodo
    ).catch(e => erros(e));
    if (retorno && retorno.data) {
      dispatch(setAlunosConselhoClasse(retorno.data));
      setExibirListas(true);
    }
    dispatch(setExibirLoaderGeralConselhoClasse(false));
  }, [anoLetivo, dispatch, turma, periodo]);

  const resetarInfomacoes = useCallback(() => {
    dispatch(limparDadosConselhoClasse());
  }, [dispatch]);

  useEffect(() => {
    const naoSetarSomenteConsultaNoStore = ehTurmaInfantil(
      modalidadesFiltroPrincipal,
      turmaSelecionada
    );
    verificaSomenteConsulta(permissoesTela, naoSetarSomenteConsultaNoStore);
  }, [turmaSelecionada, permissoesTela, modalidadesFiltroPrincipal]);

  useEffect(() => {
    if (turmaSelecionada.turma !== turmaAtual) {
      setTurmaAtual(turmaSelecionada.turma);
    }
    resetarInfomacoes();
    if (
      turmaSelecionada &&
      turmaSelecionada.turma &&
      turmaSelecionada.turma === turmaAtual &&
      !ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada)
    ) {
      obterListaAlunos();
    }
  }, [turmaAtual, turmaSelecionada]);

  const verificarExibicaoMarcador = async aluno => {
    // Somente quando for bimestre diferente de final vai ter retorno com valor!
    const resposta = await ServicoConselhoClasse.obterConselhoClasseTurmaFinal(
      turmaSelecionada.turma,
      aluno.codigoEOL,
      aluno.desabilitado ? true : false
    );

    if (resposta?.data) {
      const {
        conselhoClasseId,
        fechamentoTurmaId,
        conselhoClasseAlunoId,
        tipoNota,
      } = resposta?.data;
      if (
        fechamentoTurmaId !== 0 &&
        conselhoClasseId !== 0 &&
        conselhoClasseAlunoId
      ) {
        const retorno =
          await servicoSalvarConselhoClasse.validaParecerConclusivo(
            conselhoClasseId,
            fechamentoTurmaId,
            aluno.codigoEOL,
            turmaSelecionada.turma,
            usuario.turmaSelecionada.consideraHistorico
          );

        const valores = {
          fechamentoTurmaId,
          conselhoClasseId: conselhoClasseId || 0,
          conselhoClasseAlunoId,
          alunoCodigo: aluno.codigoEOL,
          ...dadosPrincipaisConselhoClasse,
          tipoNota,
        };
        if (!Object.keys(dadosPrincipaisConselhoClasse).length) {
          dispatch(setDadosPrincipaisConselhoClasse(valores));
        }
        dispatch(setPodeAcessar(retorno));
      }
    }
  };

  const onChangeAlunoSelecionado = async aluno => {
    if (aluno.codigoEOL === dadosAlunoObjectCard.codigoEOL) return;

    resetarInfomacoes();
    verificarExibicaoMarcador(aluno);
    dispatch(setDadosAlunoObjectCard(aluno));
  };

  const permiteOnChangeAluno = async () => {
    const validouNotaConceitoPosConselho =
      await servicoSalvarConselhoClasse.validarNotaPosConselho();
    if (validouNotaConceitoPosConselho) {
      const validouAnotacaoRecomendacao =
        await servicoSalvarConselhoClasse.validarSalvarRecomendacoesAlunoFamilia();
      if (validouNotaConceitoPosConselho && validouAnotacaoRecomendacao) {
        return true;
      }
    }
    return false;
  };

  return (
    <Container>
      {!turmaSelecionada.turma &&
      !ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ? (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'alerta-sem-turma-conselho-classe',
            mensagem: 'Você precisa escolher uma turma.',
          }}
        />
      ) : (
        <></>
      )}
      <ModalImpressaoBimestre />
      <AlertaModalidadeInfantil />
      <LoaderConselhoClasse>
        <Cabecalho pagina="Conselho de classe">
          <BotoesAcoesConselhoClasse />
        </Cabecalho>
        <Card>
          {turmaSelecionada.turma &&
          !ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ? (
            <>
              {exibirListas ? (
                <>
                  <div className="col-md-12 mb-2 d-flex justify-content-between">
                    <div className="d-flex">
                      <BotaoOrdenarListaAlunos />
                      <BotaoGerarRelatorioConselhoClasseTurma />
                    </div>
                    <BotaoConferirConselhoClasse />
                  </div>
                  <div className="col-md-12 mb-2">
                    <TabelaRetratilConselhoClasse
                      onChangeAlunoSelecionado={onChangeAlunoSelecionado}
                      permiteOnChangeAluno={permiteOnChangeAluno}
                    >
                      <ObjectCardConselhoClasse />
                      <MarcadorParecerConclusivo />
                      <DadosConselhoClasse
                        turmaCodigo={turmaSelecionada.turma}
                        modalidade={turmaSelecionada.modalidade}
                      />
                    </TabelaRetratilConselhoClasse>
                  </div>
                </>
              ) : (
                ''
              )}
            </>
          ) : (
            ''
          )}
        </Card>
      </LoaderConselhoClasse>
    </Container>
  );
};

export default ConselhoClasse;
