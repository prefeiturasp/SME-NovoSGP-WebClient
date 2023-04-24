import React from 'react';
import Navbar from '~/componentes-sgp/navbar/navbar';
import Sider from './sider';
import Conteudo from './conteudo';
import CapturaErros from './captura-erros';
import { useNavigate } from 'react-router-dom';

const Pagina = () => {
  const navigate = useNavigate();

  return (
    <CapturaErros navigate={navigate}>
      <Navbar />
      <div className="h-100" style={{ padding: '0px 32px 0px 32px' }}>
        <Sider />
        <Conteudo />
      </div>
    </CapturaErros>
  );
};

export default Pagina;
