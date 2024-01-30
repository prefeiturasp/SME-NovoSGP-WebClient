import { formatarFrequencia } from '@/@legacy/utils';
import { AbrangenciaTurmaRetornoDto } from '@/core/dto/AbrangenciaTurmaRetorno';
import { AlunosAusentesDto } from '@/core/dto/AlunosAusentesDto';
import { FiltroObterAlunosAusentesDto } from '@/core/dto/FiltroObterAlunosAusentesDto';
import { RegistroAcaoBuscaAtivaRespostaDto } from '@/core/dto/RegistroAcaoBuscaAtivaRespostaDto';
import { ROUTES } from '@/core/enum/routes';
import consultaCriancasEstudantesAusentesService from '@/core/services/consulta-criancas-estudantes-ausentes-service';
import { Form, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const columns: ColumnsType<AlunosAusentesDto> = [
  {
    title: 'Nº da chamada',
    dataIndex: 'numeroChamada',
  },
  {
    title: 'Nome completo',
    dataIndex: 'nome',
  },
  {
    title: 'Código EOL',
    dataIndex: 'codigoEol',
  },
  {
    title: 'Frequência global',
    dataIndex: 'frequenciaGlobal',
    render: (frequenciaGlobal: string) => formatarFrequencia(frequenciaGlobal),
  },
  {
    title: 'Dias seguidos com ausência',
    dataIndex: 'diasSeguidosComAusencia',
  },
];

type TableCriancasEstudantesAusentesProps = {
  abrangenciaTurmaRetorno: AbrangenciaTurmaRetornoDto;
};
const TableCriancasEstudantesAusentes: React.FC<TableCriancasEstudantesAusentesProps> = ({
  abrangenciaTurmaRetorno,
}) => {
  const form = Form.useFormInstance();
  const navigate = useNavigate();

  const anoLetivo = Form.useWatch('anoLetivo', form);
  const ausencias = Form.useWatch('ausencias', form);
  const ue = Form.useWatch('ue', form);

  const codigoTurma = abrangenciaTurmaRetorno?.codigo || '';
  const turmaId = abrangenciaTurmaRetorno?.id || 0;
  const turmaNome = abrangenciaTurmaRetorno?.nomeFiltro || '';

  const [dataSource, setDataSource] = useState<AlunosAusentesDto[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const onterDados = useCallback(async () => {
    if (anoLetivo && codigoTurma && ausencias && ue?.value) {
      setLoading(true);
      const params: FiltroObterAlunosAusentesDto = {
        anoLetivo,
        ausencias,
        codigoTurma,
        codigoUe: ue?.value,
      };
      const resposta = await consultaCriancasEstudantesAusentesService.obterTurmasAlunosAusentes(
        params,
      );

      if (resposta.sucesso && resposta.dados?.length) {
        setDataSource(resposta.dados);
      } else {
        setDataSource([]);
      }

      setLoading(false);
    } else {
      setDataSource([]);
    }
  }, [anoLetivo, codigoTurma, ausencias, ue]);

  useEffect(() => {
    onterDados();
  }, [onterDados]);

  return (
    <Table
      style={{ minWidth: '532px' }}
      loading={loading}
      columns={columns}
      rowKey="codigoEol"
      dataSource={dataSource}
      pagination={false}
      bordered
      locale={{ emptyText: 'Sem dados' }}
      onRow={(estudante) => {
        const values = form.getFieldsValue();

        const registroAcaoBuscaAtivaResposta: RegistroAcaoBuscaAtivaRespostaDto = {
          dreId: values?.dre?.id,
          dreNome: values?.dre?.label,
          dreCodigo: values?.dre?.value,
          ueId: values?.ue?.id,
          ueNome: values?.ue?.label,
          ueCodigo: values?.ue?.value,
          turmaId,
          turmaNome,
          turmaCodigo: codigoTurma,
          semestre: values?.semestre?.value || '',
          modalidade: values?.modalidade?.value,
          anoLetivo: values?.anoLetivo,
          aluno: {
            codigoAluno: estudante?.codigoEol || '',
            nome: estudante?.nome || '',
          },
        };
        return {
          onClick: () => {
            navigate(ROUTES.BUSCA_ATIVA_HISTORICO_REGISTRO_ACOES, {
              replace: true,
              state: registroAcaoBuscaAtivaResposta,
            });
          },
        };
      }}
    />
  );
};

export default React.memo(TableCriancasEstudantesAusentes);
