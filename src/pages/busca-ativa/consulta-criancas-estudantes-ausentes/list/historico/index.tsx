import {
  SGP_BUTTON_BUSCA_ATIVA_ATUALIZAR_DADOS_RESPONSAVEL,
  SGP_BUTTON_BUSCA_ATIVA_NOVO_REGISTRO_ACAO,
} from '~/constantes/ids/button';
import { confirmar, erros, verificaSomenteConsulta } from '~/servicos';
import ServicoConselhoClasse from '~/servicos/Paginas/ConselhoClasse/ServicoConselhoClasse';
import ButtonPrimary from '@/components/lib/button/primary';
import CardContent from '@/components/lib/card-content';
import HeaderPage from '@/components/lib/header-page';
import CardDetalhesCriancaEstudante from '@/components/sgp/card-detalhes-crianca-estudante';
import { AlunoReduzidoDto } from '@/core/dto/AlunoReduzidoDto';
import { RegistroAcaoBuscaAtivaRespostaDto } from '@/core/dto/RegistroAcaoBuscaAtivaRespostaDto';
import { ROUTES } from '@/core/enum/routes';
import estudanteService from '@/core/services/estudante-service';
import responsavelService from '@/core/services/busca-ativa-service';
import { Col, Divider, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BuscaAtivaHistoricoRegistroAcoesList from './list';
import { TipoTelefone } from '@/core/enum/tipo-telefone-enum';
import { DadosResponsavelAtualizarDto } from '@/core/dto/DadosResponsavelAtualizarDto';
import { useForm } from 'antd/es/form/Form';
import { useSelector } from 'react-redux';
import { maskTelefone } from '@/core/utils/functions';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  DESEJA_CANCELAR_ALTERACOES,
  INFORMACOES_NAO_FORAM_SALVAR,
  MENSAGEM_DE_ATENCAO,
} from '@/core/constants/mensagens';
import ModalAtualizarDados from './components/modal-atualizar-dados';

const BuscaAtivaHistoricoRegistroAcoes: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formResponsavel] = useForm();
  const usuario = useSelector((state: any) => state.usuario);
  const { permissoes } = usuario;
  const podeIncluir =
    permissoes?.[ROUTES.BUSCA_ATIVA_CONSULTA_CRIANCAS_ESTUDANTES_AUSENTES]?.podeIncluir;

  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const [loading, setLoading] = useState(false);

  const registroAcaoBuscaAtivaResposta: RegistroAcaoBuscaAtivaRespostaDto = location.state;

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(
      permissoes?.[ROUTES.BUSCA_ATIVA_CONSULTA_CRIANCAS_ESTUDANTES_AUSENTES],
    );

    setSomenteConsulta(soConsulta);
  }, [permissoes]);

  const anoLetivo = registroAcaoBuscaAtivaResposta?.anoLetivo;
  const codigoAluno = registroAcaoBuscaAtivaResposta?.aluno?.codigoAluno || '';
  const turmaCodigo = registroAcaoBuscaAtivaResposta?.turmaCodigo;

  const [dados, setDados] = useState<AlunoReduzidoDto | undefined>();
  const [formInitialValues, setFormInitialValues] = useState<DadosResponsavelAtualizarDto>();
  const [modalOpen, setModalOpen] = useState(false);

  const obterFrequenciaGlobalAluno = useCallback(async () => {
    const retorno = await ServicoConselhoClasse.obterFrequenciaAluno(
      codigoAluno,
      turmaCodigo,
    ).catch((e) => erros(e));

    return retorno?.data;
  }, [turmaCodigo, codigoAluno]);

  const dadosResponsavelParaAtualizar = useCallback(() => {
    const telefonesFiliacao1 = dados?.dadosResponsavelFiliacao?.telefonesFiliacao1;

    let celular = '';
    let foneResidencial = '';
    let foneComercial = '';

    telefonesFiliacao1?.forEach((telefone) => {
      const telefoneFormatado = telefone?.numero ? `${telefone?.ddd}${telefone?.numero}` : '';

      switch (telefone?.tipoTelefone) {
        case TipoTelefone.Celular:
          celular = maskTelefone(telefoneFormatado);
          break;
        case TipoTelefone.Residencial:
          foneResidencial = maskTelefone(telefoneFormatado);
          break;
        case TipoTelefone.Comercial:
          foneComercial = maskTelefone(telefoneFormatado);
          break;

        default:
          break;
      }
    });

    const dadosResponsavel: DadosResponsavelAtualizarDto = {
      nome: dados?.nomeResponsavel,
      tipoResponsavel: dados?.tipoResponsavel,
      cpf: dados?.dadosResponsavelFiliacao.cpf,
      email: dados?.dadosResponsavelFiliacao.email,
      celular,
      foneResidencial,
      foneComercial,
    };

    setFormInitialValues(dadosResponsavel);
  }, [dados]);

  const obterDados = useCallback(async () => {
    setLoading(true);
    const resposta = await estudanteService.obterDadosEstudante({
      anoLetivo,
      codigoAluno,
      codigoTurma: turmaCodigo,
      carregarDadosResponsaveis: true,
    });

    if (resposta.sucesso) {
      const novaFreq = await obterFrequenciaGlobalAluno();
      resposta.dados.frequencia = novaFreq;
      setDados(resposta.dados);
    } else {
      setDados(undefined);
    }

    setLoading(false);
  }, [anoLetivo, codigoAluno, turmaCodigo, obterFrequenciaGlobalAluno]);

  const salvarDadosResponsavel = useCallback(async () => {
    formResponsavel.validateFields().then(async () => {
      const obterTodosValoresForm = formResponsavel.getFieldsValue(true);
      setLoading(true);
      const response = await responsavelService.atualizarDadosResponsavel(obterTodosValoresForm);
      if (response.sucesso) {
        obterDados();
        setFormInitialValues(undefined);
        setModalOpen(false);
      } else {
        setLoading(false);
      }
    });
  }, [formResponsavel]);

  useEffect(() => {
    obterDados();
  }, [obterDados]);

  useEffect(() => {
    formResponsavel.resetFields();
  }, [formResponsavel, formInitialValues]);

  const abrirModal = () => {
    dadosResponsavelParaAtualizar();
    setModalOpen(true);
  };
  const onClickCancelar = async () => {
    if (formResponsavel.isFieldsTouched()) {
      const confirmou = await confirmar(
        MENSAGEM_DE_ATENCAO,
        INFORMACOES_NAO_FORAM_SALVAR,
        DESEJA_CANCELAR_ALTERACOES,
      );
      if (confirmou) {
        formResponsavel.resetFields();
      }
    } else {
      setModalOpen(false);
    }
  };
  const onClickVoltar = () => navigate(ROUTES.BUSCA_ATIVA_CONSULTA_CRIANCAS_ESTUDANTES_AUSENTES);
  const onClickNovoRegistroAcao = () =>
    navigate(ROUTES.BUSCA_ATIVA_HISTORICO_REGISTRO_ACOES_NOVO, {
      state: registroAcaoBuscaAtivaResposta,
    });

  return (
    <>
      <ModalAtualizarDados
        modalOpen={modalOpen}
        salvarDadosResponsavel={salvarDadosResponsavel}
        onClickCancelar={onClickCancelar}
        formInitialValues={formInitialValues}
        loading={loading}
      />
      <Col>
        <HeaderPage title="Registro de ações">
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
              </Col>
              <Col>
                <ButtonPrimary
                  id={SGP_BUTTON_BUSCA_ATIVA_NOVO_REGISTRO_ACAO}
                  disabled={!podeIncluir || somenteConsulta}
                  onClick={() => onClickNovoRegistroAcao()}
                >
                  Novo registro de ação
                </ButtonPrimary>
              </Col>
              <Col>
                <ButtonPrimary
                  id={SGP_BUTTON_BUSCA_ATIVA_ATUALIZAR_DADOS_RESPONSAVEL}
                  disabled={!podeIncluir || somenteConsulta}
                  onClick={() => abrirModal()}
                >
                  Atualizar dados do responsável
                </ButtonPrimary>
              </Col>
            </Row>
          </Col>
        </HeaderPage>
        <CardContent>
          <Row gutter={24}>
            <Col xs={24}>
              <CardDetalhesCriancaEstudante
                dados={dados}
                loading={loading}
                titulo="Detalhes estudante/criança"
              />
              <Divider />
              <BuscaAtivaHistoricoRegistroAcoesList />
            </Col>
          </Row>
        </CardContent>
      </Col>
    </>
  );
};

export default BuscaAtivaHistoricoRegistroAcoes;
