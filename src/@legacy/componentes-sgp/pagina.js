import Navbar from '~/componentes-sgp/navbar/navbar';

import SiderSGP from '@/components/sgp/sider';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';
import CapturaErros from './captura-erros';
import Conteudo from './conteudo';
import FilaEspera from '~/paginas/FilaEspera/fila-espera';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Pagina = () => {
  const navigate = useNavigate();
  const [bloquearTela, setBloquearTela] = useState(false);
  const usuarioBloqueado = useSelector(
    state => state.usuarioFilaEspera.usuarioBloqueado
  );

  useEffect(() => setBloquearTela(usuarioBloqueado), [usuarioBloqueado]);

  return (
    <CapturaErros navigate={navigate}>
      <Layout
        hasSider
        style={{
          minHeight: '100vh',
          backgroundColor: bloquearTela ? 'white' : 'inherit',
        }}
      >
        <SiderSGP />
        <Layout>
          <Navbar />
          {bloquearTela ? (
            <FilaEspera />
          ) : (
            <Content style={{ margin: '16px 32px' }}>
              <Conteudo />
            </Content>
          )}
        </Layout>
      </Layout>
    </CapturaErros>
  );
};

export default Pagina;
