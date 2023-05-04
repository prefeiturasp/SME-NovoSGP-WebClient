import { Container } from './styles';

export const HistoricoItem = ({ historico }) => {
  return (
    <Container>
      <div className="bold">{historico?.descricao}</div>

      {historico?.alteradoDto && (
        <>
          <div className="bold">Seção: {historico.alteradoDto?.secao}</div>
          {historico.alteradoDto?.dataExclusao ? (
            <div>
              Excluiu o atendimento registrado no dia{' '}
              {historico?.alteradoDto.dataExclusao}
            </div>
          ) : (
            <>
              {historico.alteradoDto?.camposInseridos && (
                <div>
                  Campos inseridos: {historico.alteradoDto.camposInseridos}
                </div>
              )}
              {historico.alteradoDto?.camposAlterados && (
                <div>
                  Campos alterados: {historico.alteradoDto.camposAlterados}
                </div>
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
};
