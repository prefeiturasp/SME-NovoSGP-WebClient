import React, { useEffect } from 'react';
import { obterUrlSondagem } from '~/servicos/variaveis';
import { useNavigate } from 'react-router-dom';

const Sondagem = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (() => {
      const url = obterUrlSondagem;
      window.open(`${url}/sgp?redirect=/Relatorios/Sondagem`);
      navigate('/');
    })();
  }, [navigate]);

  return <div>sondagem</div>;
};

export default Sondagem;
