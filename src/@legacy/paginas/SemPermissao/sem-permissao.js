import styled from 'styled-components';
import React from 'react';
import Card from '~/componentes/card';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import { URL_HOME } from '~/constantes/url';
import { useNavigate } from 'react-router-dom';

const SemPermissao = () => {
  const navigate = useNavigate();

  const Corpo = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    min-height: 400px;
    font-size: 16px;
    span {
      padding-bottom: 10px !important;
    }
  `;

  const onClickVoltar = () => {
    navigate(URL_HOME);
  };

  return (
    <Card>
      <Corpo className="col-md-12">
        <span>Você não tem acesso a esta funcionalidade!</span>
        <Button
          label="Voltar"
          icon="arrow-left"
          color={Colors.Azul}
          border
          className="mr-2"
          onClick={onClickVoltar}
        />
      </Corpo>
    </Card>
  );
};

export default SemPermissao;
