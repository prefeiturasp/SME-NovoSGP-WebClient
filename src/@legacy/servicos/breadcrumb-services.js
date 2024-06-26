import { store } from '@/core/redux';
import { setRotas, rotaAtiva } from '~/redux/modulos/navegacao/actions';

const setBreadcrumbManual = (path, breadcrumbName, parent) => {
  const rota = {
    path,
    breadcrumbName,
    parent,
  };
  store.dispatch(setRotas(rota));
  store.dispatch(rotaAtiva(path));
  localStorage.setItem(
    'rota-dinamica',
    `{"path":"${path}","breadcrumbName":"${breadcrumbName}", "parent": "${parent}" }`
  );
};

export { setBreadcrumbManual };
