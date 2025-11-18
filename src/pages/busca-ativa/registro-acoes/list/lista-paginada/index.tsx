import { ListaPaginada } from '@/@legacy/componentes';
import { SGP_TABLE_REGISTRO_ACOES } from '@/@legacy/constantes/ids/table';
import { FiltroRegistrosAcaoDto } from '@/core/dto/FiltroRegistrosAcaoDto';
import { RegistroAcaoBuscaAtivaListagemDto } from '@/core/dto/RegistroAcaoBuscaAtivaListagemDto';
import { formatarData } from '@/core/utils/functions';
import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { OPCAO_TODOS } from '~/constantes';

type ListaPaginadaBuscaAtivaRegistroAcoes = {
  onClickEditar: (row: RegistroAcaoBuscaAtivaListagemDto) => void;
};

const ListaPaginadaBuscaAtivaRegistroAcoes: React.FC<ListaPaginadaBuscaAtivaRegistroAcoes> = ({
  onClickEditar,
}) => {
  const form = useFormInstance();

  const anoLetivo = useWatch('anoLetivo', form);
  const dre = useWatch('dre', form);
  const ue = useWatch('ue', form);
  const modalidade = useWatch('modalidade', form);
  const semestre = useWatch('semestre', form);
  const turma = useWatch('turma', form);
  const dataInicio = useWatch('dataInicio', form);
  const dataFim = useWatch('dataFim', form);
  const codigoNomeEstudanteCrianca = useWatch('codigoNomeEstudanteCrianca', form);
  const ordemProcedimentoRealizado = useWatch('ordemProcedimentoRealizado', form);

  const [filtro, setFiltro] = useState<any>();

  const columns = useMemo(() => {
    const newColumns: ColumnsType<RegistroAcaoBuscaAtivaListagemDto> = [
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
        title: 'Conseguiu contato com o responsável?',
        dataIndex: 'conseguiuContatoResponsavel',
      },
      {
        title: 'Falta da criança/estudante por motivo de',
        dataIndex: 'descMotivoAusencia',
      },
      {
        title: 'Inserido por',
        dataIndex: 'inseridoPor',
      },
    ];

    if (ue?.value === OPCAO_TODOS) {
      newColumns.unshift({
        title: 'Unidade Escolar (UE)',
        dataIndex: 'ue',
        width: '35%',
      });
    }

    return newColumns;
  }, [ue]);

  useEffect(() => {
    if (!turma) {
      form.setFieldValue('codigoNomeEstudanteCrianca', '');
      form.setFieldValue('dataInicio', undefined);
      form.setFieldValue('dataFim', undefined);
      form.setFieldValue('ordemProcedimentoRealizado', undefined);
    }
  }, [form, turma]);

  useEffect(() => {
    const temValoresIniciais =
      anoLetivo && dre?.id && ue?.value && modalidade?.value && turma?.value;

    setFiltro(undefined);

    if (form.isFieldsTouched() || temValoresIniciais) {
      form.validateFields().then((values) => {
        let ueId = null;
        if (values?.ue?.value !== OPCAO_TODOS) {
          ueId = values?.ue?.id;
        }
        const filtro: FiltroRegistrosAcaoDto = {
          anoLetivo: values?.anoLetivo?.value,
          dreId: values?.dre?.id,
          ueId,
          modalidade: values?.modalidade?.value,
          semestre: values?.semestre?.value,
          turmaId: values?.turma?.id,
          ordemProcedimentoRealizado: values?.ordemProcedimentoRealizado || null,
          codigoNomeAluno: values?.codigoNomeEstudanteCrianca,
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
    codigoNomeEstudanteCrianca,
    ordemProcedimentoRealizado,
  ]);

  return (
    <ListaPaginada
      url="v1/busca-ativa/registros-acao"
      id={SGP_TABLE_REGISTRO_ACOES}
      colunas={columns}
      filtro={filtro}
      filtroEhValido={!!filtro}
      onClick={onClickEditar}
    />
  );
};

export default ListaPaginadaBuscaAtivaRegistroAcoes;
