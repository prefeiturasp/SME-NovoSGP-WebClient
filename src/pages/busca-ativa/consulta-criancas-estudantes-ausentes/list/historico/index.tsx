import {
  SGP_BUTTON_BUSCA_ATIVA_ATUALIZAR_DADOS_RESPONSAVEL,
  SGP_BUTTON_BUSCA_ATIVA_NOVO_REGISTRO_ACAO,
  SGP_BUTTON_CANCELAR_MODAL,
  SGP_BUTTON_SALVAR_MODAL,
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
import { Col, Divider, Form, Row, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BuscaAtivaHistoricoRegistroAcoesList from './list';
import { TipoTelefone } from '@/core/enum/tipo-telefone-enum';
import { DadosResponsavelAtualizarDto } from '@/core/dto/DadosResponsavelAtualizarDto';
import { useForm } from 'antd/es/form/Form';
import { useSelector } from 'react-redux';
import { validateMessages } from '@/core/constants/validate-messages';
import InputEmail from '@/components/sgp/inputs/form/email';
import InputTelefone from '@/components/sgp/inputs/form/telefone';
import { SGP_INPUT_EMAIL, SGP_INPUT_TELEFONE } from '~/constantes/ids/input';
import { maskTelefone } from '@/core/utils/functions';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import Modal from '@/components/lib/modal';
import {
  DESEJA_CANCELAR_ALTERACOES,
  INFORMACOES_NAO_FORAM_SALVAR,
  MENSAGEM_DE_ATENCAO,
} from '@/core/constants/mensagens';

const BuscaAtivaHistoricoRegistroAcoes: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formResponsavel] = useForm();
  const { Text } = Typography;
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
      const response = await responsavelService.atualizarDadosResponsavel(
        formResponsavel.getFieldsValue(true),
      );
      if (response.sucesso) {
        setModalOpen(false);
        obterDados();
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
      <Modal
        title="Atualizar dados do responsável"
        centered
        open={modalOpen}
        onOk={() => salvarDadosResponsavel()}
        onCancel={() => onClickCancelar()}
        destroyOnClose
        cancelButtonProps={{ disabled: loading, id: SGP_BUTTON_CANCELAR_MODAL }}
        okButtonProps={{ disabled: loading, id: SGP_BUTTON_SALVAR_MODAL }}
        okText="Alterar"
        cancelText="Cancelar"
        width={1100}
      >
        <Form
          form={formResponsavel}
          layout="vertical"
          autoComplete="off"
          onFinish={salvarDadosResponsavel}
          validateMessages={validateMessages}
          initialValues={formInitialValues}
        >
          <Col span={24}>
            <Row gutter={24} style={{ marginBottom: 20 }}>
              <Col span={12}>
                <Text strong>Nome: </Text>
                <Text>
                  {formInitialValues?.nome} - {formInitialValues?.tipoResponsavel}
                </Text>
              </Col>
              <Col span={12}>
                <Text strong>CPF: </Text>
                <Text>{formInitialValues?.cpf}</Text>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <InputEmail
                  formItemProps={{ label: 'E-mail do responsável' }}
                  inputProps={{ id: SGP_INPUT_EMAIL }}
                />
              </Col>
              <Col span={12}>
                <InputTelefone
                  formItemProps={{ label: 'Nº Celular do responsável', name: 'celular' }}
                  inputProps={{ id: SGP_INPUT_TELEFONE }}
                />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <InputTelefone
                  formItemProps={{
                    label: 'Nº do telefone residencial do responsável',
                    name: 'foneResidencial',
                    rules: [{ required: false }],
                  }}
                  inputProps={{ id: SGP_INPUT_EMAIL }}
                />
              </Col>
              <Col span={12}>
                <InputTelefone
                  formItemProps={{
                    label: 'Nº do telefone comercial do responsável',
                    rules: [{ required: false }],
                    name: 'foneComercial',
                  }}
                  inputProps={{ id: SGP_INPUT_TELEFONE }}
                />
              </Col>
            </Row>
          </Col>
        </Form>
      </Modal>
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
