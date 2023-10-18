import Navbar from '~/componentes-sgp/navbar/navbar';

import SiderSGP from '@/components/sgp/sider';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';
import CapturaErros from './captura-erros';
import Conteudo from './conteudo';

const Pagina = () => {
  const navigate = useNavigate();

  return (
    <CapturaErros navigate={navigate}>
      <Layout hasSider style={{ minHeight: '100vh' }}>
        <SiderSGP />
        <Layout style={{ marginLeft: '88px' }}>
          <Navbar />
          <Content style={{ margin: '16px 32px' }}>
            <Conteudo />
          </Content>
        </Layout>
      </Layout>
    </CapturaErros>
  );
};

export default Pagina;
