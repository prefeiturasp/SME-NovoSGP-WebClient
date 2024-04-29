import { Auditoria } from '@/components/sgp/auditoria';
import { AlunoDadosBasicosDto } from '@/core/dto/AlunoDadosBasicosDto';
import { QuestaoDto } from '@/core/dto/QuestaoDto';
import { SecaoQuestionarioDto } from '@/core/dto/SecaoQuestionarioDto';
import { TurmaSelecionadaDTO } from '@/core/dto/TurmaSelecionadaDto';
import { useAppDispatch, useAppSelector } from '@/core/hooks/use-redux';
import mapeamentoEstudantesService from '@/core/services/mapeamento-estudantes-service';
import React, { useCallback, useEffect, useState } from 'react';

import QuestionarioDinamicoFuncoes from '~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import QuestionarioDinamico from '~/componentes-sgp/QuestionarioDinamico/questionarioDinamico';
import { setExibirLoaderMapeamentoEstudantes } from '~/redux/modulos/mapeamentoEstudantes/actions';

interface FormDinamicoMapeamentoEstudantesCamposProps {
  secao: SecaoQuestionarioDto;
  mapeamentoEstudanteId: any;
}
export const FormDinamicoMapeamentoEstudantesCampos: React.FC<
  FormDinamicoMapeamentoEstudantesCamposProps
> = ({ secao, mapeamentoEstudanteId }) => {
  const dispatch = useAppDispatch();

  const usuario = useAppSelector((store) => store.usuario);

  const dadosAlunoObjectCard = useAppSelector(
    (store) => store.mapeamentoEstudantes?.dadosAlunoObjectCard as AlunoDadosBasicosDto,
  );

  const bimestreSelecionado = useAppSelector(
    (store) => store.mapeamentoEstudantes.bimestreSelecionado,
  );

  const desabilitarCamposMapeamentoEstudantes = useAppSelector(
    (store) => store.mapeamentoEstudantes?.desabilitarCamposMapeamentoEstudantes,
  );

  const turmaSelecionada = usuario?.turmaSelecionada as TurmaSelecionadaDTO;
  const turmaId = turmaSelecionada?.id;
  const codigoEOL = dadosAlunoObjectCard?.codigoEOL;

  const [questionario, setQuestionario] = useState<QuestaoDto[]>([]);

  const obterQuestionario = useCallback(async () => {
    dispatch(setExibirLoaderMapeamentoEstudantes(true));

    const resposta = await mapeamentoEstudantesService.obterQuestionario({
      mapeamentoEstudanteId,
      questionarioId: secao.questionarioId,
      codigoAluno: codigoEOL,
      bimestre: bimestreSelecionado,
      turmaId,
    });

    if (resposta.sucesso) {
      setQuestionario(resposta.dados);
    } else {
      setQuestionario([]);
    }

    dispatch(setExibirLoaderMapeamentoEstudantes(false));
  }, [dispatch, secao, mapeamentoEstudanteId, codigoEOL, bimestreSelecionado]);

  useEffect(() => {
    obterQuestionario();
  }, [secao, obterQuestionario]);

  if (!questionario?.length) return <></>;

  return (
    <div className="col-sm-12 mb-2 mt-2">
      <QuestionarioDinamico
        dados={secao}
        turmaId={turmaId}
        dadosQuestionarioAtual={questionario}
        desabilitarCampos={desabilitarCamposMapeamentoEstudantes}
        onChangeQuestionario={() => {
          QuestionarioDinamicoFuncoes.guardarSecaoEmEdicao(secao?.id);
        }}
      />

      <Auditoria {...secao.auditoria} />
    </div>
  );
};
