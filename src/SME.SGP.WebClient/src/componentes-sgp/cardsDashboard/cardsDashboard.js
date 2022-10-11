import React from 'react';
import { useSelector } from 'react-redux';
import shortid from 'shortid';
import styled from 'styled-components';
import CardLink from '../../componentes/cardlink';
import Row from '../../componentes/row';
import LaderCardsDashboard from './laderCardsDashboard';

export const Dashboard = styled.div`
  .alinhar-itens-topo {
    align-items: initial !important;
  }
  .card {
    height: 100% !important;
  }
`;

const CardsDashboard = () => {
  const usuario = useSelector(state => state.usuario);

  const dadosCardsDashboard = useSelector(
    store => store.dashboard.dadosCardsDashboard
  );

  const temTurma = !!usuario.turmaSelecionada.turma;

  return (
    <LaderCardsDashboard>
      <Dashboard>
        <Row className="form-inline alinhar-itens-topo">
          {dadosCardsDashboard && dadosCardsDashboard.length ? (
            dadosCardsDashboard.map(item => {
              return (
                <CardLink
                  key={shortid.generate()}
                  cols={[4, 4, 4, 12]}
                  iconSize="40px"
                  url={item.rota}
                  disabled={
                    !item.usuarioTemPermissao ||
                    (item.turmaObrigatoria && !temTurma)
                  }
                  icone={item.icone}
                  label={item.descricao}
                  minHeight="130px"
                />
              );
            })
          ) : (
            <></>
          )}
        </Row>
      </Dashboard>
    </LaderCardsDashboard>
  );
};

export default CardsDashboard;
