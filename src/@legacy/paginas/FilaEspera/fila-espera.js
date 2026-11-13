import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './fila-espera.css';

const POSICOES_POR_FAIXA = 500;
const TEMPO_POR_FAIXA_MINUTOS = 5;

const calcularTempoEstimadoEspera = numeroFila => {
  const posicaoFila = Number(numeroFila) || 0;

  const quantidadeFaixas = Math.max(
    Math.ceil(posicaoFila / POSICOES_POR_FAIXA),
    1
  );

  return quantidadeFaixas * TEMPO_POR_FAIXA_MINUTOS;
};

const TextoSondagem = styled.span`
  font-family: Roboto;
  font-weight: 600;
  font-size: 18px;
  line-height: 25px;
  color: #6933ff;
`;

const LinkSondagem = styled.span`
  font-family: Roboto;
  font-weight: 400;
  font-size: 18px;
  line-height: 25px;
  color: #6933ff;
  cursor: pointer;
  text-decoration: underline;
`;

const FilaEspera = () => {
  const navigate = useNavigate();
  const numeroFila = useSelector(state => state.usuarioFilaEspera.numeroFila);
  const tempoEstimadoEsperaMinutos = calcularTempoEstimadoEspera(numeroFila);

  return (
    <div className="page">
      <section className="content" aria-labelledby="titulo">
        <div>
          <div className="logo" aria-hidden="true">
            <img src="/imagens/LogoDoSgp.svg" alt="Logo Novo SGP" />
          </div>
          <div>
            <h1 id="titulo" className="title">
              Logo você será <br /> redirecionado...
            </h1>
            <p className="desc tempo-estimado">
              O tempo estimado de espera é de aproximadamente{' '}
              {tempoEstimadoEsperaMinutos} minutos.
            </p>
            <p className="desc aviso-atualizacao">
              <span>Não atualize a página!</span>
              <br />
              Isso pode aumentar o seu tempo de espera.
            </p>
            <p className="desc mensagem-sondagem">
              Disponibilizamos o novo módulo de{' '}
              <TextoSondagem>Sondagem</TextoSondagem>, caso deseje preencher a
              avaliação de seus estudantes,{' '}
              <LinkSondagem onClick={() => navigate('/login-sondagem')}>
                clique aqui
              </LinkSondagem>
              .
            </p>
          </div>
          <div className="logo-prefeitura">
            <img
              src="/imagens/logo-prefeitura.svg"
              alt="Logo Prefeitura de São Paulo"
            />
          </div>
        </div>

        <div className="art" aria-hidden="true">
          <img
            src="/imagens/fila-espera.svg"
            alt="Ilustração de profissionais aguardando redirecionamento"
          />
        </div>
      </section>
    </div>
  );
};

export default FilaEspera;

export { calcularTempoEstimadoEspera };
