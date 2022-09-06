import React from 'react';
import PropTypes from 'prop-types';

// Componentes
import { Button, Colors } from '~/componentes';

// Styles
import { ButtonGroupEstilo } from './styles';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_EXCLUIR,
  SGP_BUTTON_VOLTAR,
} from '~/componentes-sgp/filtro/idsCampos';

function ButtonGroup({
  form,
  modoEdicao,
  novoRegistro,
  permissoesTela,
  temItemSelecionado,
  labelBotaoPrincipal,
  desabilitarBotaoPrincipal,
  onClickVoltar,
  onClickExcluir,
  onClickBotaoPrincipal,
  onClickCancelar,
  somenteConsulta,
  botoesEstadoVariavel,
  idBotaoPrincipal,
}) {
  const desabilitarExcluir = () => {
    const { podeExcluir } = permissoesTela;
    return (
      somenteConsulta ||
      (!podeExcluir && temItemSelecionado === false) ||
      (!podeExcluir && temItemSelecionado === true) ||
      (podeExcluir && temItemSelecionado === false) ||
      (!podeExcluir && novoRegistro === false) ||
      (podeExcluir && novoRegistro === true)
    );
  };

  return (
    <ButtonGroupEstilo className="d-flex justify-content-end">
      <Button
        id={SGP_BUTTON_VOLTAR}
        label="Voltar"
        icon="arrow-left"
        color={Colors.Azul}
        border
        className="btnGroupItem"
        onClick={onClickVoltar}
      />
      {typeof onClickCancelar === 'function' && (
        <Button
          id={SGP_BUTTON_CANCELAR}
          label="Cancelar"
          color={Colors.Roxo}
          border
          className="btnGroupItem"
          onClick={() => onClickCancelar(form)}
          disabled={
            botoesEstadoVariavel ||
            somenteConsulta ||
            !modoEdicao ||
            !permissoesTela.podeIncluir ||
            !permissoesTela.podeAlterar
          }
        />
      )}
      {typeof onClickExcluir === 'function' && (
        <Button
          id={SGP_BUTTON_EXCLUIR}
          label="Excluir"
          color={Colors.Vermelho}
          border
          className="btnGroupItem"
          disabled={somenteConsulta || desabilitarExcluir()}
          onClick={onClickExcluir}
        />
      )}
      {typeof onClickBotaoPrincipal === 'function' && (
        <Button
          id={idBotaoPrincipal}
          label={labelBotaoPrincipal}
          color={Colors.Roxo}
          border
          bold
          className="btnGroupItem"
          onClick={onClickBotaoPrincipal}
          disabled={
            botoesEstadoVariavel ||
            desabilitarBotaoPrincipal ||
            somenteConsulta ||
            !permissoesTela.podeIncluir
          }
        />
      )}
    </ButtonGroupEstilo>
  );
}

ButtonGroup.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.any]),
  modoEdicao: PropTypes.bool,
  novoRegistro: PropTypes.bool,
  desabilitarBotaoPrincipal: PropTypes.bool,
  labelBotaoPrincipal: PropTypes.string,
  permissoesTela: PropTypes.oneOfType([PropTypes.object, PropTypes.any]),
  temItemSelecionado: PropTypes.oneOfType([PropTypes.bool, PropTypes.any]),
  onClickVoltar: PropTypes.func,
  onClickExcluir: PropTypes.func,
  onClickCancelar: PropTypes.func,
  onClickBotaoPrincipal: PropTypes.func,
  somenteConsulta: PropTypes.bool,
  botoesEstadoVariavel: PropTypes.bool,
  idBotaoPrincipal: PropTypes.string,
};

ButtonGroup.defaultProps = {
  form: {},
  permissoesTela: {},
  labelBotaoPrincipal: '',
  modoEdicao: false,
  desabilitarBotaoPrincipal: false,
  novoRegistro: null,
  temItemSelecionado: null,
  onClickVoltar: null,
  onClickExcluir: null,
  onClickCancelar: null,
  onClickBotaoPrincipal: null,
  somenteConsulta: false,
  botoesEstadoVariavel: false,
  idBotaoPrincipal: '',
};

export default ButtonGroup;
