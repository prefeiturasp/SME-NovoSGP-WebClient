import BotaoVoltarPadrao from '@/@legacy/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_BUSCA_ATIVA_ATUALIZAR_DADOS_RESPONSAVEL,
  SGP_BUTTON_BUSCA_ATIVA_NOVO_REGISTRO_ACAO,
} from '@/@legacy/constantes/ids/button';
import { confirmar, erros, verificaSomenteConsulta } from '@/@legacy/servicos';
import ServicoConselhoClasse from '@/@legacy/servicos/Paginas/ConselhoClasse/ServicoConselhoClasse';
import ButtonPrimary from '@/components/lib/button/primary';
import CardContent from '@/components/lib/card-content';
import HeaderPage from '@/components/lib/header-page';
import CardDetalhesCriancaEstudante from '@/components/sgp/card-detalhes-crianca-estudante';
import { AlunoReduzidoDto } from '@/core/dto/AlunoReduzidoDto';
import { RegistroAcaoBuscaAtivaRespostaDto } from '@/core/dto/RegistroAcaoBuscaAtivaRespostaDto';
import { ROUTES } from '@/core/enum/routes';
import estudanteService from '@/core/services/estudante-service';
import responsavelService from '@/core/services/reponsavel-service';
import { Col, Divider, Form, Modal, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BuscaAtivaHistoricoRegistroAcoesList from './list';
import { TipoTelefone } from '@/core/enum/tipo-telefone-enum';
import { DadosResponsavelAtualizarDto } from '@/core/dto/DadosResponsavelAtualizarDto';
import { validateMessages } from '@/core/constants/validate-messages';
import { useForm } from 'antd/es/form/Form';
import InputEmail from '@/components/sgp/inputs/form/email';
import { SGP_INPUT_EMAIL, SGP_INPUT_TELEFONE } from '~/constantes/ids/input';
import { Grid } from '~/componentes';
import InputTelefone from '@/components/sgp/inputs/form/telefone';
import { useSelector } from 'react-redux';

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

  const dadosResponsavelParaAtualizar = useCallback(async () => {
    const celular = dados?.dadosResponsavelFiliacao?.telefonesFiliacao1?.filter(
      (x) => x.tipoTelefone === TipoTelefone.Celular,
    )[0];
    const residencial = dados?.dadosResponsavelFiliacao?.telefonesFiliacao1?.filter(
      (x) => x.tipoTelefone === TipoTelefone.Residencial,
    )[0];
    const comercial = dados?.dadosResponsavelFiliacao?.telefonesFiliacao1?.filter(
      (x) => x.tipoTelefone === TipoTelefone.Comercial,
    )[0];

    const nrCelular = celular !== undefined ? `${celular?.ddd} ${celular?.numero}` : null;
    const nrResidencial =
      residencial !== undefined ? `${residencial?.ddd}${residencial?.numero}` : null;
    const nrComercial = comercial !== undefined ? `${comercial?.ddd}${comercial?.numero}` : null;

    const dadosResponsavel = {
      nome: `${dados?.nomeResponsavel} (${dados?.tipoResponsavel})`,
      cpf: dados?.cpfResponsavel || null,
      email: dados?.emailResponsavel || null,
      celular: nrCelular,
      foneResidencial: nrResidencial,
      foneComercial: nrComercial,
    } as DadosResponsavelAtualizarDto;

    setFormInitialValues(dadosResponsavel);
  }, [dados]);

  const salvarDadosResponsavel = useCallback(async () => {
    formResponsavel.validateFields().then(async () => {
      const response = await responsavelService.atualizarDadosResponsavel(
        formResponsavel.getFieldsValue(),
      );
      if (response.sucesso) {
        setModalOpen(false);
        obterDados();
      }
      console.log(response);
    });
  }, [formResponsavel]);

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
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?',
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
        okText="Atualizar"
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
          <hr />
          <Grid cols={12}>
            <div className="row">
              <Grid cols={6} className="mb-2">
                <Form.Item name="nome" label="Responsável">
                  {formInitialValues?.nome}
                </Form.Item>
              </Grid>
              <Grid cols={6} className="mb-2">
                <Form.Item label="CPF" name="cpf">
                  {formInitialValues?.cpf}
                </Form.Item>
              </Grid>
            </div>
          </Grid>
          <Grid cols={12}>
            <div className="row">
              <Grid cols={6} className="mb-2">
                <InputEmail
                  formItemProps={{ label: 'E-mail do responsável' }}
                  inputProps={{ id: SGP_INPUT_EMAIL, disabled: false }}
                />
              </Grid>
              <Grid cols={6} className="mb-2">
                <InputTelefone
                  formItemProps={{ label: 'Nº Celular do responsável', name: 'celular' }}
                  inputProps={{ id: SGP_INPUT_TELEFONE, disabled: false }}
                />
              </Grid>
            </div>
          </Grid>
          <Grid cols={12}>
            <div className="row">
              <Grid cols={6} className="mb-2">
                <InputTelefone
                  formItemProps={{
                    label: 'Nº do telefone residencial do responsável',
                    name: 'foneResidencial',
                    rules: [{ required: false }],
                  }}
                  inputProps={{ id: SGP_INPUT_EMAIL, disabled: false }}
                />
              </Grid>
              <Grid cols={6} className="mb-2">
                <InputTelefone
                  formItemProps={{
                    label: 'Nº do telefone comercial do responsável',
                    rules: [{ required: false }],
                    name: 'foneComercial',
                  }}
                  inputProps={{ id: SGP_INPUT_TELEFONE, disabled: false }}
                />
              </Grid>
            </div>
          </Grid>
          <hr />
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
                  disabled={!podeIncluir}
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
