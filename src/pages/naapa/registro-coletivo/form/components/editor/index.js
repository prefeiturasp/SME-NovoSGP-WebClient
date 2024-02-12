import { JoditEditor } from '@/@legacy/componentes';
import { Form } from 'antd';
import { SGP_JODIT_EDITOR_DESCRICAO_ACAO } from '~/constantes/ids/jodit-editor';

export const EditorDescricaoAcao = () => {
  return (
    <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
      {form => {
        const temErro = !!form.getFieldError('descricaoAcao')?.length;

        return (
          <Form.Item
            name="descricaoAcao"
            label="Descrição da ação"
            rules={[{ required: true }]}
          >
            <JoditEditor
              temErro={temErro}
              id={SGP_JODIT_EDITOR_DESCRICAO_ACAO}
              // desabilitar={desabilitarCampos}
            />
          </Form.Item>
        );
      }}
    </Form.Item>
  );
};
