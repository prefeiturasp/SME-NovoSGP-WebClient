import React from 'react';
import { render } from '@testing-library/react';
import DataTable from './table/dataTable';

describe('DataTable', () => {
  it('renderiza sem erros', () => {
    const columns = [{ title: 'Coluna', dataIndex: 'coluna', key: 'coluna' }];
    const dataSource = [{ key: '1', coluna: 'Valor' }];
    render(<DataTable columns={columns} dataSource={dataSource} />);
  });
});
