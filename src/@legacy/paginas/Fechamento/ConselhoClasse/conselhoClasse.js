import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Alert from '~/componentes/alert';
import Card from '~/componentes/card';
import RotasDto from '~/dtos/rotasDto';
import {
  limparDadosConselhoClasse,
  setAlunosConselhoClasse,
  setPodeAcessar,
  setDadosAlunoObjectCard,
  setExibirLoaderGeralConselhoClasse,
  setDadosPrincipaisConselhoClasse,
} from '~/redux/modulos/conselhoClasse/actions';
import { erros } from '~/servicos/alertas';
import ServicoConselhoClasse from '~/servicos/Paginas/ConselhoClasse/ServicoConselhoClasse';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import { Container } from './conselhoClasse.css';
import BotaoGerarRelatorioConselhoClasseTurma from './DadosConselhoClasse/BotaoGerarRelatorioConselhoClasseTurma/botaoGerarRelatorioConselhoClasseTurma';
import BotaoOrdenarListaAlunos from './DadosConselhoClasse/BotaoOrdenarListaAlunos/botaoOrdenarListaAlunos';
import BotoesAcoesConselhoClasse from './DadosConselhoClasse/BotoesAcoes/botoesAcoesConselhoClasse';
import DadosConselhoClasse from './DadosConselhoClasse/dadosConselhoClasse';
import LoaderConselhoClasse from './DadosConselhoClasse/LoaderConselhoClasse/laderConselhoClasse';
import MarcadorParecerConclusivo from './DadosConselhoClasse/MarcadorParecerConclusivo/marcadorParecerConclusivo';
import ModalImpressaoBimestre from './DadosConselhoClasse/ModalImpressaoBimestre/modalImpressaoBimestre';
import ObjectCardConselhoClasse from './DadosConselhoClasse/ObjectCardConselhoClasse/objectCardConselhoClasse';
import TabelaRetratilConselhoClasse from './DadosConselhoClasse/TabelaRetratilConselhoClasse/tabelaRetratilConselhoClasse';
import servicoSalvarConselhoClasse from './servicoSalvarConselhoClasse';

const ConselhoClasse = () => {
  const dispatch = useDispatch();

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;
  const { turma, anoLetivo, periodo } = turmaSelecionada;
  const permissoesTela = usuario.permissoes[RotasDto.CONSELHO_CLASSE];

  const [exibirListas, setExibirListas] = useState(false);
  const [turmaAtual, setTurmaAtual] = useState(0);

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const dadosPrincipaisConselhoClasse = useSelector(
    store => store.conselhoClasse.dadosPrincipaisConselhoClasse
  );

  const obterListaAlunos = useCallback(async () => {
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

  const verificarExibicaoMarcador = async codigoEOL => {
    // Somente quando for bimestre diferente de final vai ter retorno com valor!
    const resposta = await ServicoConselhoClasse.obterConselhoClasseTurmaFinal(
      turmaSelecionada.turma,
      codigoEOL,
      turmaSelecionada.consideraHistorico
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
        const retorno = await servicoSalvarConselhoClasse.validaParecerConclusivo(
          conselhoClasseId,
          fechamentoTurmaId,
          codigoEOL,
          turmaSelecionada.turma,
          usuario.turmaSelecionada.consideraHistorico
        );

        const valores = {
          fechamentoTurmaId,
          conselhoClasseId: conselhoClasseId || 0,
          conselhoClasseAlunoId,
          alunoCodigo: codigoEOL,
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
    resetarInfomacoes();
    verificarExibicaoMarcador(aluno.codigoEOL);
    dispatch(setDadosAlunoObjectCard(aluno));
  };

  const permiteOnChangeAluno = async () => {
    const validouNotaConceitoPosConselho = await servicoSalvarConselhoClasse.validarNotaPosConselho();
    if (validouNotaConceitoPosConselho) {
      const validouAnotacaoRecomendacao = await servicoSalvarConselhoClasse.validarSalvarRecomendacoesAlunoFamilia();
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
                  <div className="col-md-12 mb-2 d-flex">
                    <BotaoOrdenarListaAlunos />
                    <BotaoGerarRelatorioConselhoClasseTurma />
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