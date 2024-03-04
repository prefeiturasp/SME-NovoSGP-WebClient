import CardContent from '@/components/lib/card-content';
import HeaderPage from '@/components/lib/header-page';
import Select from '@/components/lib/inputs/select';
import SelectDRE from '@/components/sgp/inputs/form/dre';
import SelectModalidade from '@/components/sgp/inputs/form/modalidade';
import SelectSemestre from '@/components/sgp/inputs/form/semestre';
import SelectTurma from '@/components/sgp/inputs/form/turma';
import SelectUE from '@/components/sgp/inputs/form/ue';
import LocalizadorEstudante from '@/components/sgp/localizador-estudante';
import { validateMessages } from '@/core/constants/validate-messages';
import { BuscaAtivaRegistroAcoesFormDto } from '@/core/dto/BuscaAtivaRegistroAcoesFormDto';
import { PermissaoAcoesDto } from '@/core/dto/PermissaoAcoes';
import { RegistroAcaoBuscaAtivaRespostaDto } from '@/core/dto/RegistroAcaoBuscaAtivaRespostaDto';
import { ROUTES } from '@/core/enum/routes';
import { useAppSelector } from '@/core/hooks/use-redux';
import buscaAtivaService from '@/core/services/busca-ativa-service';
import { Checkbox, Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import {
  setDadosSecoesBuscaAtivaRegistroAcoes,
  setExibirLoaderBuscaAtivaRegistroAcoes,
} from '~/redux/modulos/buscaAtivaRegistroAcoes/actions';
import BuscaAtivaRegistroAcoesAuditoria from './auditoria';
import BuscaAtivaRegistroAcoesFormBotoesAcao from './buscaAtivaRegistroAcoesFormBotoesAcao';
import BuscaAtivaRegistroAcoesFormDinamico from './form-dinamico';
import LoaderBuscaAtivaRegistroAcoesForm from './loaderBuscaAtivaRegistroAcoesForm';

type BuscaAtivaRegistroAcoesFormProps = {
  rotaPai?: string;
  rotaPermissoesTela?: string;
};
const BuscaAtivaRegistroAcoesForm: React.FC<BuscaAtivaRegistroAcoesFormProps> = (props) => {
  const paramsRoute = useParams();
  const dispatch = useDispatch();
  const location = useLocation();

  const [form] = useForm();

  const anoAtual = dayjs().year();

  const usuario = useAppSelector((state) => state.usuario);

  const permissoes: any = usuario?.permissoes;

  const rotaPai = props?.rotaPai || ROUTES.BUSCA_ATIVA_REGISTRO_ACOES;
  const rotaPermissoesTela = props?.rotaPermissoesTela || ROUTES.BUSCA_ATIVA_REGISTRO_ACOES;

  const permissoesTela: PermissaoAcoesDto = permissoes?.[rotaPermissoesTela];

  const defaultInitialValues = {
    anoLetivo: anoAtual,
    consideraHistorico: false,
  };

  const desabilitarCamposBuscaAtivaRegistroAcoes = useAppSelector(
    (store) => store.buscaAtivaRegistroAcoes.desabilitarCamposBuscaAtivaRegistroAcoes,
  );

  const [formInitialValues, setFormInitialValues] = useState<BuscaAtivaRegistroAcoesFormDto>();

  const registroAcaoId = paramsRoute?.id ? Number(paramsRoute.id) : 0;

  const dadosRouteState: RegistroAcaoBuscaAtivaRespostaDto & { dadosFiltros: any } = location.state;

  useEffect(() => {
    if (dadosRouteState?.dadosFiltros?.dre?.id) {
      setFormInitialValues({ ...dadosRouteState?.dadosFiltros });
    }
  }, [dadosRouteState]);

  useEffect(() => {
    form.resetFields();
  }, [form, formInitialValues]);

  const mapearDto = (dados: RegistroAcaoBuscaAtivaRespostaDto) => {
    const estudante = { codigo: dados?.aluno?.codigoAluno || '', nome: dados?.aluno?.nome || '' };

    const newInitialValues: BuscaAtivaRegistroAcoesFormDto = {
      consideraHistorico: false,
      anoLetivo: dados?.anoLetivo,
      dre: { id: dados?.dreId, value: dados?.dreCodigo },
      ue: { id: dados?.ueId, value: dados?.ueCodigo },
      modalidade: { value: dados?.modalidade?.toString() },
      turma: { id: dados?.turmaId, value: dados?.turmaCodigo },
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
    if (!registroAcaoId && dadosRouteState?.aluno?.codigoAluno) {
      mapearDto(dadosRouteState);
    }
  }, [registroAcaoId, dadosRouteState]);

  useEffect(() => {
    form.resetFields();
  }, [form, formInitialValues]);

  const obterSecoes = useCallback(async () => {
    const resposta = await buscaAtivaService.obterSecoesDeRegistroAcao({
      registroAcaoBuscaAtivaId: registroAcaoId,
    });

    if (resposta.sucesso && resposta.dados?.length) {
      dispatch(setDadosSecoesBuscaAtivaRegistroAcoes(resposta.dados[0]));
    } else {
      dispatch(setDadosSecoesBuscaAtivaRegistroAcoes(null));
    }
  }, [dispatch, registroAcaoId]);

  useEffect(() => {
    obterSecoes();
  }, [obterSecoes]);

  return (
    <LoaderBuscaAtivaRegistroAcoesForm>
      <Col>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          validateMessages={validateMessages}
          initialValues={formInitialValues || defaultInitialValues}
          disabled={desabilitarCamposBuscaAtivaRegistroAcoes}
        >
          <HeaderPage title="Registro de ações">
            <BuscaAtivaRegistroAcoesFormBotoesAcao
              permissoesTela={permissoesTela}
              rotaPai={rotaPai}
              obterSecoes={obterSecoes}
            />
          </HeaderPage>
          <CardContent>
            <Row gutter={24}>
              <Form.Item name="consideraHistorico" valuePropName="checked" hidden>
                <Checkbox />
              </Form.Item>

              <Col xs={24} sm={8} md={6} lg={4}>
                <Form.Item name="anoLetivo" label="Ano Letivo" rules={[{ required: true }]}>
                  <Select options={[{ label: anoAtual, value: anoAtual }]} disabled />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={18} lg={10}>
                <SelectDRE
                  formItemProps={{ rules: [{ required: true }] }}
                  selectProps={{
                    disabled: !!formInitialValues?.dre || desabilitarCamposBuscaAtivaRegistroAcoes,
                  }}
                />
              </Col>

              <Col xs={24} sm={24} md={12} lg={10}>
                <SelectUE
                  formItemProps={{ rules: [{ required: true }] }}
                  selectProps={{
                    disabled: !!formInitialValues?.ue || desabilitarCamposBuscaAtivaRegistroAcoes,
                  }}
                />
              </Col>

              <Col xs={24} md={12} lg={8}>
                <SelectModalidade
                  formItemProps={{ rules: [{ required: true }] }}
                  selectProps={{
                    disabled:
                      !!formInitialValues?.modalidade || desabilitarCamposBuscaAtivaRegistroAcoes,
                  }}
                />
              </Col>

              <Col xs={24} md={12} lg={8}>
                <SelectSemestre
                  selectProps={{
                    disabled:
                      !!formInitialValues?.semestre || desabilitarCamposBuscaAtivaRegistroAcoes,
                  }}
                />
              </Col>

              <Col xs={24} md={12} lg={8}>
                <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                  {(form) => {
                    const modalidade = form.getFieldValue('modalidade');

                    return (
                      <SelectTurma
                        formItemProps={{ rules: [{ required: true }] }}
                        selectProps={{
                          disabled:
                            !modalidade ||
                            desabilitarCamposBuscaAtivaRegistroAcoes ||
                            !!formInitialValues?.turma,
                        }}
                      />
                    );
                  }}
                </Form.Item>
              </Col>

              <Col xs={24}>
                <LocalizadorEstudante
                  inputCodigoProps={{
                    disabled:
                      !!formInitialValues?.localizadorEstudante?.nome ||
                      desabilitarCamposBuscaAtivaRegistroAcoes,
                  }}
                  autoCompleteNameProps={{
                    disabled:
                      !!formInitialValues?.localizadorEstudante?.codigo ||
                      desabilitarCamposBuscaAtivaRegistroAcoes,
                  }}
                />
              </Col>

              <Col xs={24}>
                <BuscaAtivaRegistroAcoesFormDinamico />
              </Col>

              <Col xs={24}>
                <BuscaAtivaRegistroAcoesAuditoria />
              </Col>
            </Row>
          </CardContent>
        </Form>
      </Col>
    </LoaderBuscaAtivaRegistroAcoesForm>
  );
};

export default BuscaAtivaRegistroAcoesForm;
