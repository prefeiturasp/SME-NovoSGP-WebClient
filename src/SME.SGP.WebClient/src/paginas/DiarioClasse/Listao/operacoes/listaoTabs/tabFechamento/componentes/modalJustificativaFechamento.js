import { Form, Formik } from 'formik';
import React, { useContext } from 'react';
import * as Yup from 'yup';
import { Colors, ModalConteudoHtml } from '~/componentes';
import Alert from '~/componentes/alert';
import Button from '~/componentes/button';
import JoditEditor from '~/componentes/jodit-editor/joditEditor';
import notasConceitos from '~/dtos/notasConceitos';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';

const ModalJustificativaFechamento = () => {
  const {
    dadosFechamento,
    setDadosFechamento,
    exibirModalJustificativaFechamento,
    setExibirModalJustificativaFechamento,
  } = useContext(ListaoContext);

  const ehNota = Number(dadosFechamento?.notaTipo) === notasConceitos.Notas;

  const mensagemAlerta = `A maioria dos estudantes está com ${
    ehNota ? 'notas' : 'conceitos'
  } abaixo do mínimo
   considerado para aprovação, por isso é necessário que você insira uma justificativa.`;

  const validacoes = Yup.object({
    descricao: Yup.string()
      .required('Justificativa obrigatória')
      .max(1000, 'limite de 1000 caracteres'),
  });

  const onChangeJustificativa = valor => {
    dadosFechamento.justificativa = valor;
    setDadosFechamento(dadosFechamento);
  };

  const onClickCancelar = form => {
    form.setFieldValue('descricao', '');
    form.resetForm({ descricao: '' });
    onChangeJustificativa('');
    setExibirModalJustificativaFechamento(false);
  };

  const onConfirmarJustificativa = form => {
    onChangeJustificativa(form?.values?.descricao || '');
    onClickCancelar(form);
    setExibirModalJustificativaFechamento(false);
  };
  const validaAntesDoSubmit = form => {
    form.setFieldTouched('descricao', true, true);
    form.validateForm().then(() => {
      if (form.isValid || Object.keys(form.errors).length === 0) {
        onConfirmarJustificativa(form);
      }
    });
  };

  return (
    exibirModalJustificativaFechamento && (
      <ModalConteudoHtml
        key="inserirJutificativa"
        visivel={exibirModalJustificativaFechamento}
        titulo="Inserir justificativa"
        esconderBotaoPrincipal
        esconderBotaoSecundario
        closable={false}
        fecharAoClicarFora={false}
        fecharAoClicarEsc={false}
        width="650px"
      >
        <Formik
          enableReinitialize
          initialValues={{ descricao: '' }}
          validationSchema={validacoes}
          validateOnChange
          validateOnBlur
        >
          {form => (
            <Form>
              <div className="col-md-12">
                <Alert
                  alerta={{
                    tipo: 'warning',
                    id: 'justificativa-porcentagem',
                    mensagem: mensagemAlerta,
                    estiloTitulo: { fontSize: '18px' },
                  }}
                  className="mb-2"
                />
              </div>
              <div className="col-md-12">
                <fieldset className="mt-3">
                  <JoditEditor
                    form={form}
                    value={form?.values?.descricao}
                    onChange={v => {
                      onChangeJustificativa(v);
                      form.setFieldTouched('descricao', true, true);
                    }}
                    name="descricao"
                  />
                </fieldset>
              </div>
              <div className="d-flex justify-content-end">
                <Button
                  key="btn-cancelar-justificativa"
                  label="Cancelar"
                  color={Colors.Roxo}
                  bold
                  border
                  className="mr-3 mt-2 padding-btn-confirmacao"
                  onClick={() => onClickCancelar(form)}
                />
                <Button
                  key="btn-sim-confirmacao-justificativa"
                  label="Confirmar"
                  color={Colors.Roxo}
                  bold
                  border
                  className="mr-3 mt-2 padding-btn-confirmacao"
                  onClick={() => validaAntesDoSubmit(form)}
                />
              </div>
            </Form>
          )}
        </Formik>
      </ModalConteudoHtml>
    )
  );
};

export default ModalJustificativaFechamento;
