import { render, screen } from '@testing-library/react';
import { Form } from 'antd';

jest.mock('@/@legacy/componentes', () => ({
  JoditEditor: ({ id }: { id: string }) => <div data-testid="jodit-editor" id={id} />,
}));

import { EditorDescricaoAcao } from './index'; // ajuste o caminho conforme seu projeto
import { SGP_JODIT_EDITOR_DESCRICAO_ACAO } from '~/constantes/ids/jodit-editor';

describe('EditorDescricaoAcao', () => {
  it('renderiza corretamente com o id correto', () => {
    render(
      <Form>
        <EditorDescricaoAcao />
      </Form>
    );

    const editor = screen.getByTestId('jodit-editor');
    expect(editor).toBeInTheDocument();
    expect(editor).toHaveAttribute('id', SGP_JODIT_EDITOR_DESCRICAO_ACAO);
  });
});
