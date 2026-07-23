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
import { SONDAGEM_BYPASS_FILA } from '@/core/config/feature-flags';

const Pagina = () => {
  const navigate = useNavigate();
  const perfisAdministrador = [
    '5be1e074-37d6-e911-abd6-f81654fe895d',
    '5ae1e074-37d6-e911-abd6-f81654fe895d',
    '48e1e074-37d6-e911-abd6-f81654fe895d',
  ];
  const [bloquearTela, setBloquearTela] = useState(false);
  const [usuarioAdministrador, setUsuarioAdministrador] = useState(false);

  const usuarioBloqueado = useSelector(
    state => state.usuarioFilaEspera.usuarioBloqueado
  );

  const perfilStore = useSelector(e => e.perfil);
  const menuOculto = useSelector(e => e.navegacao.menuOculto);
  const usuarioStore = useSelector(e => e.usuario);

  useEffect(() => {
    const ehAdministrador = perfilStore?.perfis?.some(perfil =>
      perfisAdministrador.includes(perfil.codigoPerfil)
    );

    const ehAdministradorSuporte =
      usuarioStore?.administradorSuporte?.login?.length > 0;

    setUsuarioAdministrador(ehAdministrador || ehAdministradorSuporte || false);
  }, [perfilStore]);

  useEffect(
    () => setBloquearTela(usuarioBloqueado && !usuarioAdministrador && !(SONDAGEM_BYPASS_FILA && menuOculto)),
    [usuarioBloqueado, menuOculto, usuarioAdministrador]
  );

  useEffect(() => {
    let userInteracted = false;

    const markInteraction = () => {
      userInteracted = true;
    };

    const handleKeyDown = e => {
      if (e.key === 'F5' || ((e.ctrlKey || e.metaKey) && e.key === 'r')) {
        e.preventDefault();

        const confirmReload = window.confirm(
          'Você realmente deseja recarregar a página?'
        );

        if (confirmReload) {
          window.location.reload();
        }
      }
    };

    const handleBeforeUnload = e => {
      if (userInteracted) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('click', markInteraction, { once: false });
    window.addEventListener('keydown', markInteraction, { once: false });
    window.addEventListener('scroll', markInteraction, { once: false });
    window.addEventListener('touchstart', markInteraction, { once: false });

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('click', markInteraction);
      window.removeEventListener('keydown', markInteraction);
      window.removeEventListener('scroll', markInteraction);
      window.removeEventListener('touchstart', markInteraction);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <CapturaErros navigate={navigate}>
      <Layout
        hasSider={!bloquearTela && !menuOculto}
        style={{
          minHeight: '100vh',
        }}
      >
        {!bloquearTela && !menuOculto && <SiderSGP />}
        <Layout>
          <Navbar bloqueado={bloquearTela} />
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
