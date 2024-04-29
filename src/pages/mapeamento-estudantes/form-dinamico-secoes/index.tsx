import { AlunoDadosBasicosDto } from '@/core/dto/AlunoDadosBasicosDto';
import { SecaoQuestionarioDto } from '@/core/dto/SecaoQuestionarioDto';
import { TurmaSelecionadaDTO } from '@/core/dto/TurmaSelecionadaDto';
import { useAppSelector } from '@/core/hooks/use-redux';
import mapeamentoEstudantesService from '@/core/services/mapeamento-estudantes-service';
import React, { useCallback, useEffect } from 'react';
import { FormDinamicoMapeamentoEstudantesCampos } from '../form-dinamico-campos';

export const FormDinamicoMapeamentoEstudantesSecoes: React.FC = () => {
  const usuario = useAppSelector((store) => store.usuario);

  const dadosAlunoObjectCard = useAppSelector(
    (store) => store.mapeamentoEstudantes?.dadosAlunoObjectCard as AlunoDadosBasicosDto,
  );

  const bimestreSelecionado = useAppSelector(
    (store) => store.mapeamentoEstudantes.bimestreSelecionado,
  );

  const dadosSecoesMapeamentoEstudantes = useAppSelector(
    (store) =>
      store.mapeamentoEstudantes?.dadosSecoesMapeamentoEstudantes as SecaoQuestionarioDto[],
  );

  const mapeamentoEstudanteId = useAppSelector(
    (store) => store.mapeamentoEstudantes?.mapeamentoEstudanteId,
  );

  const turmaSelecionada = usuario?.turmaSelecionada as TurmaSelecionadaDTO;
  const turmaId = turmaSelecionada?.id;
  const codigoEOL = dadosAlunoObjectCard?.codigoEOL;

  const obterIdentificador = useCallback(async () => {
    mapeamentoEstudantesService.obterIdentificador(codigoEOL, turmaId, bimestreSelecionado);
  }, [bimestreSelecionado, turmaId, codigoEOL]);

  useEffect(() => {
    obterIdentificador();
  }, [bimestreSelecionado, obterIdentificador]);

  if (!dadosSecoesMapeamentoEstudantes?.length) return <></>;

  return (
    <>
      {dadosSecoesMapeamentoEstudantes.map((secao) => (
        <FormDinamicoMapeamentoEstudantesCampos
          secao={secao}
          key={secao.id}
          mapeamentoEstudanteId={mapeamentoEstudanteId}
        />
      ))}
    </>
  );
};
