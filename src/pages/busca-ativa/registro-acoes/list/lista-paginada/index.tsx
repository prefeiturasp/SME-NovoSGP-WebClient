import { ListaPaginada } from '@/@legacy/componentes';
import { SGP_TABLE_REGISTRO_ACOES } from '@/@legacy/constantes/ids/table';
import { FiltroRegistrosAcaoDto } from '@/core/dto/FiltroRegistrosAcaoDto';
import { RegistroAcaoBuscaAtivaListagemDto } from '@/core/dto/RegistroAcaoBuscaAtivaListagemDto';
import { ROUTES } from '@/core/enum/routes';
import { formatarData } from '@/core/utils/functions';
import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { OrdemProcedimentoRealizadoEnum } from '@/core/enum/ordem-procedimento-realizado-enum';

const columns: ColumnsType<RegistroAcaoBuscaAtivaListagemDto> = [
  {
    title: 'Turma',
    dataIndex: 'turma',
  },
  {
    title: 'Criança/Estudante',
    dataIndex: 'criancaEstudante',
  },
  {
    title: 'Data',
    dataIndex: 'dataRegistro',
    render: (dataRegistro) => formatarData(dataRegistro),
  },
  {
    title: 'Você entrou em contato com a família por meio de:',
    dataIndex: 'procedimentoRealizado',
  },
  {
    title: 'O contato ocorreu com o responsável pela criança?',
    dataIndex: 'contatoEfetuadoResponsavel',
  },
  {
    title: 'Após a ligação/visita a criança retornou para escola?',
    dataIndex: 'criancaRetornouEscolaAposContato',
  },
  {
    title: 'Inserido por',
    dataIndex: 'inseridoPor',
  },
];

const ListaPaginadaBuscaAtivaRegistroAcoes: React.FC = () => {
  const navigate = useNavigate();

  const form = useFormInstance();

  const anoLetivo = useWatch('anoLetivo', form);
  const dre = useWatch('dre', form);
  const ue = useWatch('ue', form);
  const modalidade = useWatch('modalidade', form);
  const semestre = useWatch('semestre', form);
  const turma = useWatch('turma', form);
  const dataInicio = useWatch('dataInicio', form);
  const dataFim = useWatch('dataFim', form);
  const nomeEstudanteCrianca = useWatch('nomeEstudanteCrianca', form);
  const ordemProcedimentoRealizado = useWatch('ordemProcedimentoRealizado', form);

  const [filtro, setFiltro] = useState<any>();

  useEffect(() => {
    if (!turma) {
      form.setFieldValue('nomeEstudanteCrianca', '');
      form.setFieldValue('dataInicio', undefined);
      form.setFieldValue('dataFim', undefined);
      form.setFieldValue('ordemProcedimentoRealizado', OrdemProcedimentoRealizadoEnum.Nenhum);
    }
  }, [form, turma]);

  useEffect(() => {
    const temValoresIniciais = anoLetivo && dre?.id && ue?.id && modalidade?.value && turma?.value;

    if (form.isFieldsTouched() || temValoresIniciais) {
      form.validateFields().then((values) => {
        const filtro: FiltroRegistrosAcaoDto = {
          anoLetivo: values?.anoLetivo?.value,
          dreId: values?.dre?.id,
          ueId: values?.ue?.id,
          modalidade: values?.modalidade?.value,
          semestre: values?.semestre?.value,
          turmaId: values?.turma?.id,
          ordemProcedimentoRealizado: values?.ordemProcedimentoRealizado || null,
          nomeAluno: values?.nomeEstudanteCrianca,
        };

        if (values?.dataInicio) {
          filtro.dataRegistroInicio = dayjs(values.dataInicio).format('YYYY-MM-DD');
        }

        if (values?.dataFim) {
          filtro.dataRegistroFim = dayjs(values.dataFim).format('YYYY-MM-DD');
        }

        setFiltro({ ...filtro });
      });
    }
  }, [
    form,
    anoLetivo,
    dre,
    ue,
    modalidade,
    semestre,
    turma,
    dataInicio,
    dataFim,
    nomeEstudanteCrianca,
    ordemProcedimentoRealizado,
  ]);

  const onClickEditar = (row: RegistroAcaoBuscaAtivaListagemDto) =>
    navigate(`${ROUTES.BUSCA_ATIVA_REGISTRO_ACOES}/${row.id}`, {
      replace: true,
    });

  return (
    <ListaPaginada
      url="v1/busca-ativa/registros-acao"
      id={SGP_TABLE_REGISTRO_ACOES}
      colunas={columns}
      filtro={filtro}
      filtroEhValido={!!filtro?.ueId}
      onClick={onClickEditar}
    />
  );
};

export default ListaPaginadaBuscaAtivaRegistroAcoes;
