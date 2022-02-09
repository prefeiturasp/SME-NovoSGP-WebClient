import { Form, Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Colors, Loader, ModalConteudoHtml } from '~/componentes';
import Alert from '~/componentes/alert';
import Button from '~/componentes/button';
import JoditEditor from '~/componentes/jodit-editor/joditEditor';
import notasConceitos from '~/dtos/notasConceitos';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';
import { salvarFechamentoListao } from '~/paginas/DiarioClasse/Listao/listaoFuncoes';
import { confirmar } from '~/servicos/alertas';

const ModalJustificativaFechamento = () => {
  const {
    dadosFechamento,
    bimestreOperacoes,
    setDadosFechamento,
    componenteCurricular,
    setExibirLoaderGeral,
    dadosModalJustificativaFechamento,
    setDadosModalJustificativaFechamento,
  } = useContext(ListaoContext);

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const [exibirLoader, setExibirLoader] = useState(false);
  const [exibirModal, setExibirModal] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [refForm, setRefForm] = useState({});

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

  const limparDadosModal = () => {
    refForm.setFieldValue('descricao', '');
    refForm.resetForm({ descricao: '' });
    setExibirModal(false);
    setModoEdicao(false);
    setTimeout(() => {
      setDadosModalJustificativaFechamento();
    }, 500);
  };

  const onConfirmarJustificativa = async loaderGeral => {
    onChangeJustificativa(refForm?.state?.values?.descricao || '');

    const salvou = await salvarFechamentoListao(
      turmaSelecionada.turma,
      false,
      dadosFechamento,
      bimestreOperacoes,
      loaderGeral ? setExibirLoaderGeral : setExibirLoader,
      componenteCurricular
    );

    if (salvou && dadosModalJustificativaFechamento.acaoPosSalvar) {
      limparDadosModal();
      dadosModalJustificativaFechamento.acaoPosSalvar(true);
    } else {
      limparDadosModal();
    }
  };

  const validaAntesDoSubmit = loaderGeral => {
    refForm.setFieldTouched('descricao', true, true);
    refForm.validateForm().then(() => {
      if (
        refForm?.getFormikContext?.()?.isValid ||
        Object.keys(refForm?.getFormikContext?.()?.errors)?.length === 0
      ) {
        onConfirmarJustificativa(loaderGeral);
      } else {
        setExibirModal(true);
      }
    });
  };

  const onCloseModal = () => {
    if (!exibirLoader) {
      onChangeJustificativa('');
      limparDadosModal();
    }
  };

  const validarAntesDeFechar = async () => {
    if (modoEdicao) {
      setExibirModal(false);
      const confirmado = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );
      if (confirmado) {
        validaAntesDoSubmit(true);
      } else {
        onCloseModal();
      }
    } else {
      onCloseModal();
    }
  };

  console.log(
    'dadosModalJustificativaFechamento',
    dadosModalJustificativaFechamento
  );

  useEffect(() => {
    setExibirModal(!!dadosModalJustificativaFechamento?.exibirModal);
  }, [dadosModalJustificativaFechamento?.exibirModal]);

  return dadosModalJustificativaFechamento?.exibirModal ? (
    <ModalConteudoHtml
      key="inserirJutificativa"
      visivel={exibirModal}
      titulo="Inserir justificativa"
      esconderBotaoPrincipal
      esconderBotaoSecundario
      width="650px"
      loader={exibirLoader}
      onClose={validarAntesDeFechar}
      fecharAoClicarFora={!exibirLoader}
      fecharAoClicarEsc={!exibirLoader}
      closable={!exibirLoader}
    >
      <Formik
        enableReinitialize
        initialValues={{ descricao: '' }}
        validationSchema={validacoes}
        validateOnChange
        validateOnBlur
        ref={refF => setRefForm(refF)}
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
                      setModoEdicao(true);
                    }}
                    name="descricao"
                    permiteInserirArquivo={false}
                  />
                </fieldset>
              </div>
              <div className="d-flex justify-content-end">
                <Button
                  key="btn-voltar-justificativa"
                  label="Voltar"
                  color={Colors.Roxo}
                  bold
                  border
                  className="mr-3 mt-2 padding-btn-confirmacao"
                  onClick={() => {
                    validarAntesDeFechar();
                  }}
                />
                <Button
                  key="btn-sim-confirmacao-justificativa"
                  label="Confirmar"
                  color={Colors.Roxo}
                  bold
                  border
                  className="mr-3 mt-2 padding-btn-confirmacao"
                  disabled={!modoEdicao}
                  onClick={() => {
                    validaAntesDoSubmit(false);
                    setModoEdicao(true);
                  }}
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
