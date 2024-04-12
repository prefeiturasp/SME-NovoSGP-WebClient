import { JoditEditor } from '@/@legacy/componentes';
import { Form } from 'antd';
import { SGP_JODIT_EDITOR_DESCRICAO_ACAO } from '~/constantes/ids/jodit-editor';

export const EditorDescricaoAcao = ({ disabled = false }) => (
  <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
    {form => {
      const temErro = !!form.getFieldError('descricao')?.length;

      return (
        <Form.Item
          name="descricao"
          label="Descrição da ação"
          rules={[{ required: true }]}
        >
          <JoditEditor
            temErro={temErro}
            height="400px"
            overflowY="auto"
            id={SGP_JODIT_EDITOR_DESCRICAO_ACAO}
            desabilitar={disabled}
          />
        </Form.Item>
      );
    }}
  </Form.Item>
);
