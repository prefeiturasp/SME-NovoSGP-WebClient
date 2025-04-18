import moment from 'moment';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { JoditEditor, MarcadorSituacao } from '~/componentes';

import {
  setPlanejamentoExpandido,
  setPlanejamentoSelecionado,
} from '~/redux/modulos/devolutivas/actions';

import {
  BotaoEstilizado,
  Container,
  EditorPlanejamento,
  FundoEditor,
  IframeStyle,
  MarcadorInseridoCJ,
} from './caixaTextoExpandivel.css';

const CaixaTextoExpandivel = ({ item }) => {
  const [icone, setIcone] = useState('expand-alt');

  const perfilSelecionado = useSelector(
    store => store.perfil.perfilSelecionado.nomePerfil
  );

  const dadosPlanejamentos = useSelector(
    store => store.devolutivas.dadosPlanejamentos
  );

  const planejamentoExpandido = useSelector(
    store => store.devolutivas.planejamentoExpandido
  );

  const numeroRegistros = useSelector(
    store => store.devolutivas.numeroRegistros
  );

  const totalRegistros = Number(
    numeroRegistros || dadosPlanejamentos?.totalRegistros || 4
  );

  const dispatch = useDispatch();

  const ehPerfilCP = perfilSelecionado === 'CP';

  const cliqueAlternado = () => {
    dispatch(setPlanejamentoExpandido(!planejamentoExpandido));
    dispatch(setPlanejamentoSelecionado(item));
  };

  useEffect(() => {
    if (!planejamentoExpandido) {
      dispatch(setPlanejamentoSelecionado([]));
      setIcone('expand-alt');
      return;
    }
    setIcone('compress-alt');
  }, [dispatch, planejamentoExpandido]);

  return (
    <Container
      className={`col-${
        totalRegistros >= 4 && !planejamentoExpandido ? 6 : 12
      } mb-4`}
    >
      <div className="card">
        <div className="card-header d-flex">
          <div>{item?.data ? moment(item.data).format('L') : ''}</div>
          {totalRegistros > 1 && (
            <div>
              <BotaoEstilizado
                id="btn-expandir"
                icon={icone}
                iconType="fas"
                onClick={() => cliqueAlternado(item)}
                height="13px"
                width="13px"
              />
            </div>
          )}
        </div>
        <div className="card-body">
          <EditorPlanejamento>
            <FundoEditor>
              {item?.inseridoCJ && (
                <MarcadorInseridoCJ>
                  <MarcadorSituacao>Registro inserido pelo CJ</MarcadorSituacao>
                </MarcadorInseridoCJ>
              )}
              <JoditEditor
                id="planejamento-diario-bordo-um"
                value={
                  totalRegistros === 1 || planejamentoExpandido
                    ? item.planejamento
                    : item.planejamentoSimples
                }
                removerToolbar
                readonly
                height="560px"
                iframeStyle={IframeStyle}
                desabilitar={ehPerfilCP}
              />
            </FundoEditor>
          </EditorPlanejamento>
        </div>
      </div>
    </Container>
  );
};

CaixaTextoExpandivel.defaultProps = {
  item: {},
};

CaixaTextoExpandivel.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object]),
};

export default CaixaTextoExpandivel;
