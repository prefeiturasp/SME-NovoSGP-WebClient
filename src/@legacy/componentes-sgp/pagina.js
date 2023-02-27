import React from 'react';
import Navbar from '~/componentes-sgp/navbar/navbar';
import Sider from './sider';
import Conteudo from './conteudo';

const Pagina = () => {
  return (
    <>
      <Navbar />
      <div className="h-100" style={{ padding: '0px 32px 0px 32px' }}>
        <Sider />
        <Conteudo />
      </div>
    </>
  );
};

export default Pagina;
