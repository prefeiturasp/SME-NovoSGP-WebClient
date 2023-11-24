import CardContent from '@/components/lib/card-content';
import HeaderPage from '@/components/lib/header-page';
import SelectDRE from '@/components/sgp/inputs/form/dre';
import SelectModalidade from '@/components/sgp/inputs/form/modalidade';
import SelectSemestre from '@/components/sgp/inputs/form/semestre';
import SelectTurma from '@/components/sgp/inputs/form/turma';
import SelectUE from '@/components/sgp/inputs/form/ue';
import Select from '@/components/sgp/inputs/select';
import LocalizadorEstudante from '@/components/sgp/localizador-estudante';
import { validateMessages } from '@/core/constants/validate-messages';
import { BuscaAtivaRegistroAcoesFormDto } from '@/core/dto/BuscaAtivaRegistroAcoesFormDto';
import { PermissaoAcoesDto } from '@/core/dto/PermissaoAcoes';
import { RegistroAcaoBuscaAtivaRespostaDto } from '@/core/dto/RegistroAcaoBuscaAtivaRespostaDto';
import buscaAtivaService from '@/core/services/busca-ativa-service';
import { Checkbox, Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import {
  setDesabilitarCamposBuscaAtivaRegistroAcoes,
  setExibirLoaderBuscaAtivaRegistroAcoes,
} from '~/redux/modulos/buscaAtivaRegistroAcoes/actions';
import { verificaSomenteConsulta } from '~/servicos';
import BuscaAtivaRegistroAcoesFormBotoesAcao from './buscaAtivaRegistroAcoesFormBotoesAcao';
import BuscaAtivaRegistroAcoesFormDinamico from './form-dinamico';
import LoaderBuscaAtivaRegistroAcoesForm from './loaderBuscaAtivaRegistroAcoesForm';

type BuscaAtivaRegistroAcoesFormProps = {
  permissoesTela: PermissaoAcoesDto;
  rotaPai: string;
};
const BuscaAtivaRegistroAcoesForm: React.FC<BuscaAtivaRegistroAcoesFormProps> = ({
  permissoesTela,
  rotaPai,
}) => {
  const paramsRoute = useParams();
  const dispatch = useDispatch();
  const location = useLocation();

  const [form] = useForm();

  const anoAtual = dayjs().year();

  const defaultInitialValues = {
    anoLetivo: anoAtual,
    consideraHistorico: false,
  };

  const [formInitialValues, setFormInitialValues] = useState<BuscaAtivaRegistroAcoesFormDto>();

  const registroAcaoId = paramsRoute?.id ? Number(paramsRoute.id) : 0;

  const dadosRouteState: RegistroAcaoBuscaAtivaRespostaDto = location.state;

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(permissoesTela);

    const desabilitar = registroAcaoId
      ? soConsulta || !permissoesTela?.podeIncluir
      : soConsulta || !permissoesTela?.podeAlterar;

    dispatch(setDesabilitarCamposBuscaAtivaRegistroAcoes(desabilitar));
  }, [registroAcaoId, permissoesTela]);

  const mapearDto = (dados: RegistroAcaoBuscaAtivaRespostaDto) => {
    const estudante = { codigo: dados?.aluno?.codigoAluno || '', nome: dados?.aluno?.nome || '' };

    const newInitialValues: BuscaAtivaRegistroAcoesFormDto = {
      consideraHistorico: false,
      anoLetivo: dados.anoLetivo,
      dre: { id: dados.dreId, value: dados.dreCodigo },
      ue: { id: dados.ueId, value: dados.ueCodigo },
      modalidade: { value: dados.modalidade },
      turma: { id: dados.turmaId, value: dados.turmaCodigo },
      localizadorEstudanteDados: [estudante],
      localizadorEstudante: estudante,
    };

    setFormInitialValues(newInitialValues);
  };

  const obterDados = useCallback(async () => {
    dispatch(setExibirLoaderBuscaAtivaRegistroAcoes(true));

    const resposta = await buscaAtivaService.obterRegistroAcao(registroAcaoId);

    if (resposta?.sucesso) {
      mapearDto(resposta.dados);
    }

    dispatch(setExibirLoaderBuscaAtivaRegistroAcoes(false));
  }, [dispatch, registroAcaoId]);

  useEffect(() => {
    if (registroAcaoId) {
      obterDados();
    }
  }, [registroAcaoId, obterDados]);

  useEffect(() => {
    if (!registroAcaoId && dadosRouteState.aluno?.codigoAluno) {
      mapearDto(dadosRouteState);
    }
  }, [registroAcaoId, dadosRouteState]);

  useEffect(() => {
    form.resetFields();
  }, [form, formInitialValues]);

  return (
    <LoaderBuscaAtivaRegistroAcoesForm>
      <Col>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          validateMessages={validateMessages}
          initialValues={formInitialValues || defaultInitialValues}
        >
          <HeaderPage title="Registro de ações">
            <BuscaAtivaRegistroAcoesFormBotoesAcao
              permissoesTela={permissoesTela}
              rotaPai={rotaPai}
            />
          </HeaderPage>
          <CardContent>
            <Row gutter={24}>
              <Form.Item name="consideraHistorico" valuePropName="checked" hidden>
                <Checkbox />
              </Form.Item>

              <Col xs={24} sm={8} md={4}>
                <Form.Item name="anoLetivo" label="Ano Letivo" rules={[{ required: true }]}>
                  <Select options={[{ label: anoAtual, value: anoAtual }]} disabled />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={10}>
                <SelectDRE formItemProps={{ rules: [{ required: true }] }} />
              </Col>

              <Col xs={24} sm={24} md={10}>
                <SelectUE formItemProps={{ rules: [{ required: true }] }} />
              </Col>

              <Col xs={24} md={12} lg={10}>
                <SelectModalidade formItemProps={{ rules: [{ required: true }] }} />
              </Col>

              <Col xs={24} md={12} lg={4}>
                <SelectSemestre />
              </Col>

              <Col xs={24} md={12} lg={10}>
                <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                  {(form) => {
                    const modalidade = form.getFieldValue('modalidade');

                    return (
                      <SelectTurma
                        formItemProps={{ rules: [{ required: true }] }}
                        selectProps={{ disabled: !modalidade }}
                      />
                    );
                  }}
                </Form.Item>
              </Col>

              <Col xs={24}>
                <LocalizadorEstudante />
              </Col>

              <Col xs={24}>
                <BuscaAtivaRegistroAcoesFormDinamico />
              </Col>
            </Row>
          </CardContent>
        </Form>
      </Col>
    </LoaderBuscaAtivaRegistroAcoesForm>
  );
};

export default BuscaAtivaRegistroAcoesForm;
