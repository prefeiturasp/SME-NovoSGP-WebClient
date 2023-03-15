import React from 'react';
import shortid from 'shortid';
import Card from '~/componentes/card';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import { URL_HOME } from '~/constantes/url';
import { Corpo } from './pagina-com-erro.css';
import { useNavigate } from 'react-router-dom';

const PaginaComErro = () => {
  const navigate = useNavigate();

  const onClickVoltar = () => {
    navigate(URL_HOME);
  };

  return (
    <Card>
      <Corpo className="col-md-12">
        <i className="far fa-frown not-found" />
        <span className="msg-principal">Ocorreu um erro!</span>
        <span>
          A página que você tentou acessar não está disponível no momento.
        </span>
        <Button
          id={shortid.generate()}
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

export default PaginaComErro;
