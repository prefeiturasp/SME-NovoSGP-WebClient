import Loader from '../componentes/loader';



const TelaLoaderTrocaPerfil = () => (
  <div style={{
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    zIndex: 99999
    
  }}>
    <div style={{
        backgroundColor: 'rgba(255, 255, 255, 1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: 24,
        paddingTop: 64,
        borderRadius: 4,
        border: '1px solid #ccc',
        gap: 0,
        background: '#FFFFFF',
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.12)',
        alignContent: 'stretch',
         
    }}>
        <Loader loading={true} tip=""/>
    <p style={{
        marginBottom: 4,
        marginTop: 32,
        fontWeight: 'bold',
        color: '#595959',

    }}>Aguarde um momento!</p>
    <p style={{
        color: '#595959',
    }}>Estamos carregando as informações do perfil...</p>

    </div>
    
  </div>
);

export default TelaLoaderTrocaPerfil;
