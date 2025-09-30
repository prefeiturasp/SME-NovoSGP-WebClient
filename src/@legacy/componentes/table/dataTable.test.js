import { render, screen } from '@testing-library/react';
import DataTable from './dataTable';

jest.mock('antd', () => ({
  Table: jest.fn(({ columns, dataSource, ...props }) => (
    <table data-testid="antd-table">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key || col.dataIndex}>{col.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataSource.map(row => (
          <tr key={row.id}>
            {columns.map(col => (
              <td key={col.key || col.dataIndex}>{row[col.dataIndex]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )),
}));
jest.mock('shortid', () => ({
  generate: jest.fn(() => 'unique-id'),
}));
jest.mock('./dataTable.css', () => ({
  Container: ({ children, ...props }) => (
    <div data-testid="container" {...props}>
      {children}
    </div>
  ),
}));

describe('DataTable', () => {
  const columns = [
    { title: 'Nome', dataIndex: 'nome', key: 'nome' },
    { title: 'Idade', dataIndex: 'idade', key: 'idade' },
  ];
  const dataSource = [
    { id: '1', nome: 'João', idade: 10 },
    { id: '2', nome: 'Maria', idade: 12 },
  ];
  const onSelectRow = jest.fn();
  const onClickRow = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente com props padrão', () => {
    render(<DataTable columns={columns} dataSource={dataSource} />);
    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('antd-table')).toBeInTheDocument();
    expect(screen.getByText('Nome')).toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
  });

  it('aplica classe table-responsive quando tableResponsive é true', () => {
    render(
      <DataTable
        columns={columns}
        dataSource={dataSource}
        tableResponsive={true}
      />
    );
    expect(screen.getByTestId('container').className).toContain(
      'table-responsive'
    );
  });

  it('não aplica classe table-responsive quando tableResponsive é false', () => {
    render(
      <DataTable
        columns={columns}
        dataSource={dataSource}
        tableResponsive={false}
      />
    );
    expect(screen.getByTestId('container').className).not.toContain(
      'table-responsive'
    );
  });

  it('chama onSelectRow ao selecionar linha (selectMultipleRows)', () => {
    render(
      <DataTable
        columns={columns}
        dataSource={dataSource}
        selectedRowKeys={['1']}
        onSelectRow={onSelectRow}
        selectMultipleRows={true}
      />
    );
    const tableProps = require('antd').Table.mock.calls[0][0];
    tableProps.rowSelection.onChange(['2'], [dataSource[1]]);
    expect(onSelectRow).toHaveBeenCalledWith(['2'], [dataSource[1]]);
  });

  it('chama onClickRow ao clicar em linha', () => {
    render(
      <DataTable
        columns={columns}
        dataSource={dataSource}
        onClickRow={onClickRow}
      />
    );
    const tableProps = require('antd').Table.mock.calls[0][0];
    tableProps
      .onRow(dataSource[0])
      .onClick({ target: { className: 'not-selection' } });
    expect(onClickRow).toHaveBeenCalledWith(dataSource[0]);
  });

  it('chama selectRow ao clicar na coluna de seleção', () => {
    const onSelectRowMock = jest.fn();
    render(
      <DataTable
        columns={columns}
        dataSource={dataSource}
        selectedRowKeys={['1']}
        onSelectRow={onSelectRowMock}
        selectMultipleRows={true}
      />
    );
    const tableProps = require('antd').Table.mock.calls[0][0];
    tableProps
      .onRow(dataSource[0])
      .onClick({ target: { className: 'ant-table-selection-column' } });
    expect(onSelectRowMock).toHaveBeenCalled();
  });

  it('gera id único para cada linha quando gerarIdUnico é true', () => {
    render(
      <DataTable
        columns={columns}
        dataSource={[{ nome: 'Teste', idade: 20 }]}
        gerarIdUnico={true}
      />
    );
    const tableProps = require('antd').Table.mock.calls[0][0];
    expect(tableProps.dataSource[0].id).toBe('unique-id');
  });

  it('passa props de expansão corretamente', () => {
    const expandedRowRender = jest.fn();
    render(
      <DataTable
        columns={columns}
        dataSource={dataSource}
        expandedRowRender={expandedRowRender}
        expandIconColumnIndex={1}
        expandedRowKeys={['1']}
        expandIcon={<span>Expand</span>}
        onClickExpandir={jest.fn()}
        showExpandColumn={true}
        expandableColumnWidth={100}
        expandableColumnTitle="Expandir"
      />
    );
    const tableProps = require('antd').Table.mock.calls[0][0];
    expect(tableProps.expandable).toMatchObject({
      showExpandColumn: true,
      columnWidth: 100,
      columnTitle: 'Expandir',
      expandIconColumnIndex: 1,
      expandedRowRender,
      expandIcon: <span>Expand</span>,
      onExpand: expect.any(Function),
      expandedRowKeys: ['1'],
    });
  });

  it('passa loading corretamente', () => {
    render(
      <DataTable columns={columns} dataSource={dataSource} loading={true} />
    );
    const tableProps = require('antd').Table.mock.calls[0][0];
    expect(tableProps.loading).toBe(true);
  });

  it('passa locale corretamente', () => {
    render(
      <DataTable
        columns={columns}
        dataSource={dataSource}
        locale={{ emptyText: 'Sem dados' }}
      />
    );
    const tableProps = require('antd').Table.mock.calls[0][0];
    expect(tableProps.locale).toEqual({ emptyText: 'Sem dados' });
  });

  it('passa scroll corretamente', () => {
    render(
      <DataTable
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 100 }}
      />
    );
    const tableProps = require('antd').Table.mock.calls[0][0];
    expect(tableProps.scroll).toEqual({ x: 100 });
  });

  it('passa id corretamente', () => {
    render(
      <DataTable columns={columns} dataSource={dataSource} id="tabela-teste" />
    );
    const tableProps = require('antd').Table.mock.calls[0][0];
    expect(tableProps.id).toBe('tabela-teste');
  });
});
