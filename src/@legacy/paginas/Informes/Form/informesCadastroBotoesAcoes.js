import { OPCAO_TODOS } from '@/@legacy/constantes';
import { validaAntesDoSubmit } from '@/@legacy/utils';
import { ROUTES } from '@/core/enum/routes';
import {
  excluirInformePorId,
  salvarInforme,
} from '@/core/services/informes-service';
import { Col, Row } from 'antd';
import { HttpStatusCode } from 'axios';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Colors } from '~/componentes';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_SALVAR,
} from '~/constantes/ids/button';
import { confirmar, erros, sucesso } from '~/servicos';

const InformesCadastroBotoesAcoes = props => {
  const {
    form,
    initialValues,
    setExibirLoader,
    desabilitarCampos,
    podeExcluir,
  } = props;

  const paramsRoute = useParams();
  const id = paramsRoute?.id;

  const navigate = useNavigate();

  const modoEdicao = !!form?.values?.modoEdicao;
  const listaUes = form?.values?.listaUes;
  const listaDres = form?.values?.listaDres;

  const desabilitarExcluir = !id || !podeExcluir;

  const resetarFormulario = () => {
    form.setFieldValue('modoEdicao', false);
    form.resetForm({
      ...form.initialValues,
    });
  };

  const onClickCancelar = async () => {
    if (!desabilitarCampos && modoEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) {
        resetarFormulario();
      }
    }
  };

  const onClickExcluir = async () => {
    const confirmado = await confirmar(
      'Atenção',
      'Você tem certeza que deseja excluir este registro?'
    );
    if (confirmado) {
      setExibirLoader(true);
      const resultado = await excluirInformePorId(id)
        .catch(e => erros(e))
        .finally(() => setExibirLoader(false));

      if (resultado?.status === HttpStatusCode.Ok) {
        sucesso('Registro excluído com sucesso!');
        navigate(ROUTES.INFORMES);
      }
    }
  };

  const onClickSalvar = async valores => {
    const {
      dreCodigo,
      ueCodigo,
      anoLetivo,
      texto,
      titulo,
      perfis,
      listaPerfis,
      listaArquivos,
    } = valores;

    const ueSelecionada = listaUes.find(
      item => String(item.codigo) === String(ueCodigo)
    );

    const dreSelecionada = listaDres.find(
      item => String(item.codigo) === String(dreCodigo)
    );

    const params = {
      anoLetivo,
      dreId: dreSelecionada.id,
      ueId: ueSelecionada.id,
      texto,
      titulo,
      arquivos: listaArquivos.map(item => item.xhr),
      modalidades: valores?.modalidades?.length ? valores.modalidades : [],
    };

    if (perfis?.length) {
      const todosPerfisSelecionado = perfis.find(
        perfilId => String(perfilId) === OPCAO_TODOS
      );

      if (todosPerfisSelecionado) {
        const perfisSemOpcaoTodos = listaPerfis.filter(
          perfil => String(perfil?.id) !== OPCAO_TODOS
        );

        params.perfis = perfisSemOpcaoTodos;
      } else {
        params.perfis = perfis.map(id => ({ id }));
      }
    }

    setExibirLoader(true);

    const resposta = await salvarInforme(params, id)
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.status === HttpStatusCode.Ok) {
      sucesso('Registro salvo com sucesso');
      navigate(ROUTES.INFORMES);
    }
  };

  const onClickVoltar = async () => {
    if (!desabilitarCampos && modoEdicao) {
      const confirmado = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );
      if (confirmado) {
        validaAntesDoSubmit(form, initialValues, onClickSalvar);
      } else {
        navigate(ROUTES.INFORMES);
      }
    } else {
      navigate(ROUTES.INFORMES);
    }
  };

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col>
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Col>

      {!id ? (
        <Col>
          <Button
            id={SGP_BUTTON_CANCELAR}
            label="Cancelar"
            color={Colors.Roxo}
            border
            onClick={() => onClickCancelar(form)}
            disabled={!form?.values?.modoEdicao}
          />
        </Col>
      ) : (
        <></>
      )}
      <Col>
        <BotaoExcluirPadrao
          disabled={desabilitarExcluir}
          onClick={onClickExcluir}
        />
      </Col>
      {!id ? (
        <Col>
          <Button
            id={SGP_BUTTON_SALVAR}
            label="Salvar"
            color={Colors.Roxo}
            border
            bold
            onClick={() => {
              validaAntesDoSubmit(form, initialValues, onClickSalvar);
            }}
          />
        </Col>
      ) : (
        <></>
      )}
    </Row>
  );
};

InformesCadastroBotoesAcoes.propTypes = {
  form: PropTypes.oneOfType([PropTypes.any]),
  initialValues: PropTypes.oneOfType([PropTypes.any]),
  setExibirLoader: PropTypes.oneOfType([PropTypes.any]),
  desabilitarCampos: PropTypes.bool,
  podeExcluir: PropTypes.bool,
};

InformesCadastroBotoesAcoes.defaultProps = {
  form: null,
  initialValues: {},
  setExibirLoader: null,
  desabilitarCampos: false,
  podeExcluir: false,
};

export default InformesCadastroBotoesAcoes;
