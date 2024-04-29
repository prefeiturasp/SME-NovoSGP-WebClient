import {
  setLimparDadosQuestionarioDinamico,
  setListaSecoesEmEdicao,
  setQuestionarioDinamicoEmEdicao,
} from '@/@legacy/redux/modulos/questionarioDinamico/actions';
import { TurmaSelecionadaDTO } from '@/core/dto/TurmaSelecionadaDto';
import { useAppDispatch, useAppSelector } from '@/core/hooks/use-redux';

import { useEffect } from 'react';
import {
  limparDadosMapeamentoEstudantes,
  setDadosAlunoObjectCard,
  setEstudantesMapeamentoEstudantes,
} from '~/redux/modulos/mapeamentoEstudantes/actions';

import { AlunoDadosBasicosDto } from '@/core/dto/AlunoDadosBasicosDto';
import { BimestreEnum, BimestreEnumDisplay } from '@/core/enum/bimestre-tab-enum';
import mapeamentoEstudantesService from '@/core/services/mapeamento-estudantes-service';
import { Col } from 'antd';
import ModalErrosQuestionarioDinamico from '~/componentes-sgp/QuestionarioDinamico/Componentes/ModalErrosQuestionarioDinamico/modalErrosQuestionarioDinamico';
import { FormDinamicoMapeamentoEstudantesSecoes } from '../form-dinamico-secoes';
import { ObjectCardMapeamentoEstudantes } from '../object-card';
import { TabelaRetratilMapeamentoEstudantes } from '../tabela-retratil';
export const DadosMapeamentoEstudantes = () => {
  const dispatch = useAppDispatch();
  const usuario = useAppSelector((store) => store.usuario);

  const turmaSelecionada = usuario?.turmaSelecionada as TurmaSelecionadaDTO;

  const turma = turmaSelecionada?.turma;
  const anoLetivo = turmaSelecionada?.anoLetivo;

  const dadosAlunoObjectCard = useAppSelector(
    (store) => store.mapeamentoEstudantes?.dadosAlunoObjectCard as AlunoDadosBasicosDto,
  );

  const bimestreSelecionado = useAppSelector(
    (store) => store.mapeamentoEstudantes.bimestreSelecionado as BimestreEnum,
  );

  useEffect(() => {
    if (turma && anoLetivo && bimestreSelecionado) {
      mapeamentoEstudantesService.obterEstudantes();
    } else {
      dispatch(setEstudantesMapeamentoEstudantes([]));
    }
  }, [dispatch, bimestreSelecionado]);

  const limparDados = () => {
    dispatch(limparDadosMapeamentoEstudantes([]));
    dispatch(setLimparDadosQuestionarioDinamico());
    dispatch(setListaSecoesEmEdicao([]));
    dispatch(setQuestionarioDinamicoEmEdicao(false));
  };

  const onChangeAlunoSelecionado = async (aluno: AlunoDadosBasicosDto) => {
    if (aluno?.codigoEOL === dadosAlunoObjectCard?.codigoEOL) return;

    limparDados();

    dispatch(setDadosAlunoObjectCard({ ...aluno }));
  };

  const permiteOnChangeAluno = async () => {
    const continuar = await mapeamentoEstudantesService.salvar();

    return !!continuar;
  };

  if (!bimestreSelecionado) return <></>;

  return (
    <TabelaRetratilMapeamentoEstudantes
      onChangeAlunoSelecionado={onChangeAlunoSelecionado}
      permiteOnChangeAluno={permiteOnChangeAluno}
    >
      <ObjectCardMapeamentoEstudantes />
      {dadosAlunoObjectCard?.codigoEOL ? (
        <Col xs={24} style={{ padding: 12 }}>
          <ModalErrosQuestionarioDinamico
            mensagem={`Existem campos obrigatórios no ${BimestreEnumDisplay[bimestreSelecionado]}`}
          />
          <FormDinamicoMapeamentoEstudantesSecoes />
        </Col>
      ) : (
        <></>
      )}
    </TabelaRetratilMapeamentoEstudantes>
  );
};
