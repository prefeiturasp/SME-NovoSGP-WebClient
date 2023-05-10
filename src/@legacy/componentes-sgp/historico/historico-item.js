import { Container } from './styles';

export const HistoricoItem = ({ historico }) => {
  return (
    <Container>
      {historico && (
        <>
          <div className="bold">{historico?.descricao}</div>

          {historico?.secao && (
            <div className="bold">Seção: {historico?.secao}</div>
          )}

          {historico?.camposInseridos && (
            <div>Campos inseridos: {historico.camposInseridos}</div>
          )}

          {historico?.camposAlterados && (
            <div>Campos alterados: {historico.camposAlterados}</div>
          )}
        </>
      )}
    </Container>
  );
};
