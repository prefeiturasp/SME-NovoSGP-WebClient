import { Form, Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Colors, Loader, ModalConteudoHtml } from '~/componentes';
import Alert from '~/componentes/alert';
import Button from '~/componentes/button';
import JoditEditor from '~/componentes/jodit-editor/joditEditor';
import notasConceitos from '~/dtos/notasConceitos';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';
import { salvarFechamentoListao } from '~/paginas/DiarioClasse/Listao/listaoFuncoes';

const ModalJustificativaFechamento = () => {
  const {
    dadosFechamento,
    bimestreOperacoes,
    setDadosFechamento,
    componenteCurricular,
    dadosModalJustificativaFechamento,
    setDadosModalJustificativaFechamento,
  } = useContext(ListaoContext);

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const [exibirLoader, setExibirLoader] = useState(false);

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

  const limparDadosModal = form => {
    form.setFieldValue('descricao', '');
    form.resetForm({ descricao: '' });
    setTimeout(() => {
      setDadosModalJustificativaFechamento();
    }, 500);
  };

  const onConfirmarJustificativa = async form => {
    onChangeJustificativa(form?.values?.descricao || '');

    const salvou = await salvarFechamentoListao(
      turmaSelecionada.turma,
      false,
      dadosFechamento,
      bimestreOperacoes,
      setExibirLoader,
      componenteCurricular
    );

    if (salvou && dadosModalJustificativaFechamento.acaoPosSalvar) {
      limparDadosModal(form);
      dadosModalJustificativaFechamento.acaoPosSalvar(true);
    } else {
      limparDadosModal(form);
    }
  };

  const validaAntesDoSubmit = form => {
    form.setFieldTouched('descricao', true, true);
    form.validateForm().then(() => {
      if (form.isValid || Object.keys(form.errors).length === 0) {
        onConfirmarJustificativa(form);
      }
    });
  };

  return dadosModalJustificativaFechamento?.exibirModal ? (
    <ModalConteudoHtml
      key="inserirJutificativa"
      visivel={dadosModalJustificativaFechamento?.exibirModal}
      titulo="Inserir justificativa"
      esconderBotaoPrincipal
      esconderBotaoSecundario
      closable={false}
      fecharAoClicarFora={false}
      fecharAoClicarEsc={false}
      width="650px"
      loader={exibirLoader}
    >
      <Formik
        enableReinitialize
        initialValues={{ descricao: '' }}
        validationSchema={validacoes}
        validateOnChange
        validateOnBlur
      >
        {form => (
          <Loader loading={exibirLoader} tip="Salvando Fechamento">
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
                  onClick={() => {
                    onChangeJustificativa('');
                    limparDadosModal(form);
                  }}
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
          </Loader>
        )}
      </Formik>
    </ModalConteudoHtml>
  ) : (
    <></>
  );
};

export default ModalJustificativaFechamento;
