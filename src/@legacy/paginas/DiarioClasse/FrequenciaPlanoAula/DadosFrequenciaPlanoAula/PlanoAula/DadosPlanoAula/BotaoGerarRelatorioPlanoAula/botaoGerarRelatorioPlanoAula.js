import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Colors } from '~/componentes';
import Button from '~/componentes/button';
import { SGP_BUTTON_IMPRIMIR_RELATORIO_PLANO_AULA } from '~/constantes/ids/button';
import { setExibirLoaderFrequenciaPlanoAula } from '~/redux/modulos/frequenciaPlanoAula/actions';
import { erros, sucesso } from '~/servicos/alertas';
import ServicoPlanoAula from '~/servicos/Paginas/DiarioClasse/ServicoPlanoAula';

export const BotaoGerarRelatorio = styled(Button)`
  i {
    margin-right: 0px !important;
  }
`;

const BotaoGerarRelatorioPlanoAula = props => {
  const { planoAulaId } = props;

  const dispatch = useDispatch();

  const gerarPlanoAula = () => {
    dispatch(setExibirLoaderFrequenciaPlanoAula(true));
    ServicoPlanoAula.gerarRelatorioPlanoAula(planoAulaId)
      .then(() => {
        sucesso(
          'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
        );
      })
      .finally(dispatch(setExibirLoaderFrequenciaPlanoAula(false)))
      .catch(e => erros(e));
  };

  return (
    <div className="mr-3">
      <BotaoGerarRelatorio
        icon="print"
        color={Colors.Azul}
        border
        onClick={() => gerarPlanoAula()}
        disabled={!planoAulaId}
        id={SGP_BUTTON_IMPRIMIR_RELATORIO_PLANO_AULA}
      />
    </div>
  );
};

BotaoGerarRelatorioPlanoAula.propTypes = {
  planoAulaId: PropTypes.number,
};

BotaoGerarRelatorioPlanoAula.defaultProps = {
  planoAulaId: 0,
};

export default BotaoGerarRelatorioPlanoAula;
