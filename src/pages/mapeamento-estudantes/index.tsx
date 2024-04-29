import { TurmaSelecionadaDTO } from '@/core/dto/TurmaSelecionadaDto';
import { ROUTES } from '@/core/enum/routes';
import { useAppSelector } from '@/core/hooks/use-redux';
import { Col } from 'antd';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import {
  limparDadosMapeamentoEstudantes,
  setDesabilitarCamposMapeamentoEstudantes,
  setEstudantesMapeamentoEstudantes,
} from '~/redux/modulos/mapeamentoEstudantes/actions';
import {
  setLimparDadosQuestionarioDinamico,
  setListaSecoesEmEdicao,
} from '~/redux/modulos/questionarioDinamico/actions';
import { verificaSomenteConsulta } from '~/servicos';
import { BotoesAcoesMapeamentoEstudantes } from './botoes-acoes';
import { DadosMapeamentoEstudantes } from './dados';
import { LoaderMapeamentoEstudantes } from './loader';
import { AlertaSemTurmaSelecionada } from '@/components/sgp/alertas/sem-turma-selecionada';

export const MapeamentoEstudantes = () => {
  const dispatch = useDispatch();
  const usuario = useAppSelector((store) => store.usuario);

  const permissoes = usuario.permissoes as any;
  const permissoesTela = permissoes[ROUTES.MAPEAMENTO_ESTUDANTES];

  const turmaSelecionada = usuario?.turmaSelecionada as TurmaSelecionadaDTO;

  const limparDados = useCallback(() => {
    dispatch(setEstudantesMapeamentoEstudantes([]));
    dispatch(limparDadosMapeamentoEstudantes());
    dispatch(setListaSecoesEmEdicao([]));
    dispatch(setLimparDadosQuestionarioDinamico());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      limparDados();
    };
  }, [dispatch, limparDados]);

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(permissoesTela);
    const desabilitar =
      soConsulta || (!permissoesTela?.podeAlterar && !permissoesTela?.podeIncluir);

    dispatch(setDesabilitarCamposMapeamentoEstudantes(desabilitar));
  }, [permissoesTela, dispatch]);

  useEffect(() => {
    limparDados();
  }, [turmaSelecionada, limparDados]);

  return (
    <>
      <AlertaSemTurmaSelecionada />
      <LoaderMapeamentoEstudantes>
        <Cabecalho pagina="Mapeamento de estudantes">
          <BotoesAcoesMapeamentoEstudantes />
        </Cabecalho>

        <Card padding="24px 24px">
          {turmaSelecionada?.turma ? (
            <Col xs={24}>
              <DadosMapeamentoEstudantes />
            </Col>
          ) : (
            <></>
          )}
        </Card>
      </LoaderMapeamentoEstudantes>
    </>
  );
};
