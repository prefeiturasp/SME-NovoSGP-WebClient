import QuestionarioDinamicoFuncoes from '@/@legacy/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import { setDesabilitarCamposRelatorioPAP } from '@/@legacy/redux/modulos/relatorioPAP/actions';
import { confirmar, verificaSomenteConsulta } from '@/@legacy/servicos';
import ServicoRelatorioPAP from '@/@legacy/servicos/Paginas/Relatorios/PAP/RelatorioPAP/ServicoRelatorioPAP';
import { ROUTES } from '@/core/enum/routes';
import { Col, Row } from 'antd';
import { HttpStatusCode } from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_SALVAR,
} from '~/constantes/ids/button';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';

const BotoesAcoesRelatorioPAP = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const permissoesTela = usuario.permissoes[ROUTES.RELATORIO_PAP];

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const estudantesRelatorioPAP = useSelector(
    store => store.relatorioPAP.estudantesRelatorioPAP
  );

  const desabilitarCamposRelatorioPAP = useSelector(
    store => store.relatorioPAP.desabilitarCamposRelatorioPAP
  );

  const questionarioDinamicoEmEdicao = useSelector(
    store => store.questionarioDinamico.questionarioDinamicoEmEdicao
  );

  const periodoSelecionadoPAP = useSelector(
    store => store.relatorioPAP.periodoSelecionadoPAP
  );

  const alunoEhMatriculadoNoPAP = useSelector(
    store =>
      store.relatorioPAP.estudanteSelecionadoRelatorioPAP?.ehMatriculadoTurmaPAP
  );

  const disabledBtnDefault =
    desabilitarCamposRelatorioPAP || !questionarioDinamicoEmEdicao;

  const turmaSelecionadaEhInfantil = ehTurmaInfantil(
    modalidadesFiltroPrincipal,
    turmaSelecionada
  );

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(permissoesTela);
    const desabilitar =
      !alunoEhMatriculadoNoPAP &&
      (!permissoesTela?.podeAlterar || !permissoesTela?.podeIncluir);

    if (soConsulta) {
      dispatch(setDesabilitarCamposRelatorioPAP(true));
      return;
    }

    if (!alunoEhMatriculadoNoPAP) {
      dispatch(setDesabilitarCamposRelatorioPAP(true));
      return;
    }

    const periodoAberto = !!periodoSelecionadoPAP?.periodoAberto;

    dispatch(setDesabilitarCamposRelatorioPAP(desabilitar && !periodoAberto));
  }, [
    permissoesTela,
    periodoSelecionadoPAP,
    alunoEhMatriculadoNoPAP,
    dispatch,
  ]);

  const onClickSalvar = () => ServicoRelatorioPAP.salvar();

  const onClickVoltar = async () => {
    if (questionarioDinamicoEmEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );

      if (confirmou) {
        const resposta = await ServicoRelatorioPAP.salvar();
        if (resposta?.status === HttpStatusCode.Ok) navigate(ROUTES.PRINCIPAL);
      } else {
        navigate(ROUTES.PRINCIPAL);
      }
    } else {
      navigate(ROUTES.PRINCIPAL);
    }
  };

  const onClickCancelar = async () => {
    if (!desabilitarCamposRelatorioPAP && questionarioDinamicoEmEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) {
        QuestionarioDinamicoFuncoes.limparDadosOriginaisQuestionarioDinamico(
          ServicoRelatorioPAP.removerArquivo
        );
      }
    }
  };

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col>
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Col>
      <Col>
        <Button
          id={SGP_BUTTON_CANCELAR}
          label="Cancelar"
          color={Colors.Roxo}
          border
          onClick={() => onClickCancelar()}
          disabled={disabledBtnDefault || !estudantesRelatorioPAP.length}
        />
      </Col>
      <Col>
        <Button
          id={SGP_BUTTON_SALVAR}
          label="Salvar"
          color={Colors.Roxo}
          border
          bold
          onClick={() => onClickSalvar()}
          disabled={turmaSelecionadaEhInfantil || disabledBtnDefault}
        />
      </Col>
    </Row>
  );
};

export default BotoesAcoesRelatorioPAP;
