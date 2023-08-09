import { TabelaRetratil } from '@/@legacy/componentes';
import ModalErrosQuestionarioDinamico from '@/@legacy/componentes-sgp/QuestionarioDinamico/Componentes/ModalErrosQuestionarioDinamico/modalErrosQuestionarioDinamico';
import {
  limparDadosRelatorioPAP,
  setEstudanteSelecionadoRelatorioPAP,
  setEstudantesRelatorioPAP,
  setExibirLoaderRelatorioPAP,
} from '@/@legacy/redux/modulos/relatorioPAP/actions';
import { ServicoCalendarios } from '@/@legacy/servicos';
import ServicoRelatorioPAP from '@/@legacy/servicos/Paginas/Relatorios/PAP/RelatorioPAP/ServicoRelatorioPAP';
import { Col } from 'antd';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BotaoOrdenarListaAlunosPAP from '../botaoOrdenarListaAlunosPAP';
import ObjectCardRelatorioPAP from '../objectCardRelatorioPAP';
import SecoesRelatorioPAP from '../secoes';

const DadosRelatorioPAP = () => {
  const dispatch = useDispatch();
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const estudantesRelatorioPAP = useSelector(
    store => store.relatorioPAP?.estudantesRelatorioPAP
  );

  const estudanteSelecionadoRelatorioPAP = useSelector(
    store => store.relatorioPAP?.estudanteSelecionadoRelatorioPAP
  );

  const periodoSelecionadoPAP = useSelector(
    store => store.relatorioPAP?.periodoSelecionadoPAP
  );

  const obterListaAlunos = useCallback(async () => {
    if (turmaSelecionada?.turma) {
      dispatch(setExibirLoaderRelatorioPAP(true));

      const retorno = await ServicoRelatorioPAP.obterListaAlunos(
        turmaSelecionada?.turma,
        periodoSelecionadoPAP?.periodoRelatorioPAPId
      ).catch(e => erros(e));

      if (retorno?.data?.length) {
        retorno.data.forEach(alunoParaAtualizar => {
          alunoParaAtualizar.desabilitado = false;
        });

        dispatch(setEstudantesRelatorioPAP(retorno.data));
      } else {
        dispatch(limparDadosRelatorioPAP());
        dispatch(setEstudantesRelatorioPAP([]));
      }

      dispatch(setExibirLoaderRelatorioPAP(false));
    }
  }, [turmaSelecionada, dispatch, periodoSelecionadoPAP]);

  useEffect(() => {
    if (periodoSelecionadoPAP?.periodoRelatorioPAP) {
      obterListaAlunos();
    } else {
      dispatch(setEstudantesRelatorioPAP([]));
    }
  }, [periodoSelecionadoPAP, obterListaAlunos, dispatch]);

  const obterFrequenciaAluno = async codigoAluno => {
    const retorno = await ServicoCalendarios.obterFrequenciaAluno(
      codigoAluno,
      turmaSelecionada?.turma
    ).catch(e => erros(e));

    return retorno?.data;
  };

  const onChangeAlunoSelecionado = async aluno => {
    dispatch(limparDadosRelatorioPAP());

    const frequenciaGeralAluno = await obterFrequenciaAluno(aluno.codigoEOL);
    const novoAluno = aluno;
    novoAluno.frequencia = frequenciaGeralAluno;

    dispatch(setEstudanteSelecionadoRelatorioPAP(novoAluno));
  };

  const permiteOnChangeAluno = async () => {
    const continuar = await ServicoRelatorioPAP.salvar(true);
    if (continuar) {
      return true;
    }
    return false;
  };

  if (!periodoSelecionadoPAP?.periodoRelatorioPAP) return <></>;
  return (
    <>
      <Col span={24}>
        <BotaoOrdenarListaAlunosPAP />
        {/* TODO - Botão impressão */}
      </Col>
      {estudantesRelatorioPAP?.length ? (
        <Col span={24}>
          <ModalErrosQuestionarioDinamico />
          <TabelaRetratil
            onChangeAlunoSelecionado={onChangeAlunoSelecionado}
            permiteOnChangeAluno={permiteOnChangeAluno}
            alunos={estudantesRelatorioPAP}
            codigoAlunoSelecionado={estudanteSelecionadoRelatorioPAP?.codigoEOL}
            exibirProcessoConcluido
          >
            <>
              <ObjectCardRelatorioPAP />
              <Col style={{ margin: 12 }}>
                <SecoesRelatorioPAP />
              </Col>
            </>
          </TabelaRetratil>
        </Col>
      ) : (
        <></>
      )}
    </>
  );
};

export default DadosRelatorioPAP;
