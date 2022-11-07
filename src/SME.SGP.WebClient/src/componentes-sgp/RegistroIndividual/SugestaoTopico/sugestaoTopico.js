import React from 'react';
import { useSelector } from 'react-redux';
import { Container } from './sugestaoTopico.css';

const SugestaoTopico = () => {
  const dadosSugestaoTopico = useSelector(
    store => store.registroIndividual?.dadosSugestaoTopico
  );
  return (
    <>
      {dadosSugestaoTopico?.descricao && (
        <Container>
          <i className="fas fa-info-circle">&nbsp;Sugestão de tópico:</i>
          &nbsp;{dadosSugestaoTopico?.descricao}
        </Container>
      )}
    </>
  );
};

export default React.memo(SugestaoTopico);
