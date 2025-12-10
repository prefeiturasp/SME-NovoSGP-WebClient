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
      <section class="content" aria-labelledby="titulo">
        <div>
          <h1 id="titulo" class="title">
            Você está em uma sala de espera virtual
          </h1>
          <p class="desc">Por favor não atualize a página, aguarde.</p>
          <p class="desc">
            <strong>Seu numero na fila é: {usuarioNumeroFila}</strong>
          </p>
        </div>

        <div class="art" aria-hidden="true">
          <img
            src="/imagens/algo-deu-errado.jpg"
            alt="Ilustração de técnico verificando servidores representando erro interno do servidor"
          />
        </div>
      </section>
    </div>
  );
};

export default FilaEspera;
