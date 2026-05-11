import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import Card from '~/componentes/card';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import { URL_HOME } from '~/constantes/url';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './fila-espera.css';

const FilaEspera = () => {
  const numeroFila = useSelector(state => state.usuarioFilaEspera.numeroFila);

  const [usuarioNumeroFila, setUsuarioNumeroFila] = useState(numeroFila);

  useEffect(() => setUsuarioNumeroFila(numeroFila), [numeroFila]);

  return (
    <div className="page">
      <section className="content" aria-labelledby="titulo">
        <div>
          <div className="logo" aria-hidden="true">
            <img src="/imagens/LogoDoSgp.svg" alt="Logo Novo SGP" />
          </div>
          <div>
            <h1 id="titulo" className="title">
              Você está em uma sala <br /> de espera virtual
            </h1>
            <p className="desc">
              Aguarde um instante, estamos te direcionando.
              <br />
              <span>Não atualize a página </span>
              para não perder sua posição.
            </p>
            <p className="desc">
              <strong> Sua posição na fila: {usuarioNumeroFila}</strong>
            </p>
          </div>
          <div className="logo-prefeitura">
            <img
              src="/imagens/logo-prefeitura.svg"
              alt="Logo Prefeitura de São Paulo"
            />
          </div>
        </div>

        <div class="art" aria-hidden="true">
          <img
            src="/imagens/fila-espera.svg"
            alt="Ilustração de técnico verificando servidores representando erro interno do servidor"
          />
        </div>
      </section>
    </div>
  );
};

export default FilaEspera;
