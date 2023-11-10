import { OPCAO_TODOS } from '@/@legacy/constantes';
import { AbrangenciaTurmaRetornoDto } from '@/core/dto/AbrangenciaTurmaRetorno';
import { Form, Row, Table } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import TableCriancasEstudantesAusentes from '../table-ausentes';

const ContainerTable = styled.div`
  .ocultar-coluna-multi-selecao {
    .ant-table-selection-column {
      display: none !important;
    }
    .ant-table-selection-col {
      display: none !important;
    }
  }

  .ant-table-wrapper
    .ant-table.ant-table-small
    .ant-table-tbody
    .ant-table-wrapper:only-child
    .ant-table {
    margin: 14px;
    margin-block: 14px;
    margin-inline: 14px 0px;
  }

  tbody > tr {
    cursor: pointer;
  }
`;

const TableTurmasCriancasEstudantesAusentes: React.FC = () => {
  const form = Form.useFormInstance();

  const turma: AbrangenciaTurmaRetornoDto = useWatch('turma', form);
  const ausencias = Form.useWatch('ausencias', form);

  const listaTurmas: AbrangenciaTurmaRetornoDto[] = form.getFieldsValue(true)?.listaTurmas;

  const [dataSource, setDataSource] = useState<AbrangenciaTurmaRetornoDto[]>();
  const [columns, setColumns] = useState<ColumnsType<AbrangenciaTurmaRetornoDto>>([]);

  const [turmaSelecionada, setTurmaSelecionada] = useState<
    AbrangenciaTurmaRetornoDto | undefined
  >();

  const selectedRowKeys = useMemo(() => {
    if (turmaSelecionada?.codigo) {
      return [turmaSelecionada.codigo];
    }
    return [];
  }, [turmaSelecionada]);

  useEffect(() => {
    if (turma?.value && ausencias) {
      if (turma?.value === OPCAO_TODOS) {
        const turmas = listaTurmas.filter(
          (item: AbrangenciaTurmaRetornoDto) => item?.value !== OPCAO_TODOS,
        );

        setDataSource(turmas);
      } else {
        setDataSource([turma]);
        setTurmaSelecionada(turma);
      }
    } else {
      setDataSource([]);
      setTurmaSelecionada(undefined);
    }
  }, [turma, listaTurmas, ausencias]);

  useEffect(() => {
    const newColumns: ColumnsType<AbrangenciaTurmaRetornoDto> = [
      {
        title: 'Listagem de crianças/estudantes ausentes',
        onCell: () => ({
          style: { cursor: 'default', background: 'white' },
        }),
        render: () => {
          if (dataSource?.length && turmaSelecionada?.codigo) {
            return <TableCriancasEstudantesAusentes abrangenciaTurmaRetorno={turmaSelecionada} />;
          }
          return <></>;
        },
      },
    ];

    setColumns(newColumns);
  }, [dataSource, turmaSelecionada]);

  return (
    <ContainerTable>
      <Row wrap={false}>
        <>
          <Table
            style={{ width: '200px' }}
            bordered
            size="small"
            rowKey="codigo"
            columns={[
              {
                title: 'Turmas',
                dataIndex: 'nomeFiltro',
                width: '200px',
              },
            ]}
            pagination={false}
            dataSource={dataSource}
            locale={{ emptyText: 'Sem dados' }}
            className="ocultar-coluna-multi-selecao"
            rowSelection={{
              selectedRowKeys,
            }}
            onRow={(record) => {
              return {
                onClick: () => {
                  if (record.codigo) {
                    setTurmaSelecionada(record);
                  } else {
                    setTurmaSelecionada(undefined);
                  }
                },
              };
            }}
          />

          <Table
            style={{ width: '100%' }}
            bordered
            size="small"
            rowKey="codigo"
            columns={columns}
            pagination={false}
            dataSource={turmaSelecionada?.codigo ? [{ ...turmaSelecionada }] : []}
            locale={{ emptyText: 'Sem dados' }}
          />
        </>
      </Row>
    </ContainerTable>
  );
};

export default TableTurmasCriancasEstudantesAusentes;
