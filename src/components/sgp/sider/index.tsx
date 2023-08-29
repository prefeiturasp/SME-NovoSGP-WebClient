import React, { useEffect, useState, useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@/core/hooks/use-redux';

import { menuSelecionado } from '@/@legacy/redux/modulos/navegacao/actions';
import { obterDescricaoNomeMenu } from '@/@legacy/servicos';
import LogoMenuSGP from '@/assets/logo_sgp_menu.svg';
import { useNavigate } from 'react-router-dom';
import SiderSME, { MenuItemSMEProps, getItemMenu } from '../../lib/sider';
import { cloneDeep } from 'lodash';

const SiderSGP: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const usuario = useAppSelector((state) => state.usuario);
  const navegacaoStore = useAppSelector((state) => state.navegacao);
  const modalidadesFiltroPrincipal = useAppSelector((state) => state.filtro.modalidades);

  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [items, setItems] = useState<MenuItemSMEProps[]>([]);

  const validarMenuSelecionado = useCallback(() => {
    if (navegacaoStore.rotaAtiva) {
      items.forEach((item) => {
        if (item?.children?.length) {
          const menuAtual = item.children.find((itemChild) => {
            if (itemChild?.children?.length) {
              return itemChild.children.find((a) => {
                return a?.url === navegacaoStore?.rotaAtiva;
              });
            }
            return itemChild?.url === navegacaoStore?.rotaAtiva;
          });

          if (menuAtual?.key) {
            dispatch(menuSelecionado([menuAtual?.key?.toString()]));
          }
        }
      });
    }
  }, [navegacaoStore.rotaAtiva, items]);

  useEffect(() => {
    const rota = navegacaoStore.rotas.get(navegacaoStore?.rotaAtiva);
    setOpenKeys([]);

    if (rota?.limpaSelecaoMenu) {
      dispatch(menuSelecionado([]));
    } else {
      validarMenuSelecionado();
    }
  }, [dispatch, items, navegacaoStore.rotaAtiva, navegacaoStore.rotas, validarMenuSelecionado]);

  const montarDadosSubMenus = (subMenu: any) => {
    return subMenu?.menus.map((itemMenu: any) => {
      const title = obterDescricaoNomeMenu(
        itemMenu?.url,
        modalidadesFiltroPrincipal,
        usuario.turmaSelecionada,
        itemMenu?.descricao,
      );

      const icone = null;
      const url = itemMenu?.url;

      if (itemMenu?.subMenus?.length) {
        const children = itemMenu?.subMenus.map((itemSubMenu: any) => {
          const titleChildren = obterDescricaoNomeMenu(
            itemSubMenu?.url,
            modalidadesFiltroPrincipal,
            usuario.turmaSelecionada,
            itemSubMenu?.descricao,
          );
          return getItemMenu(itemSubMenu?.url, titleChildren, itemSubMenu?.codigo, icone);
        });

        return getItemMenu(url, title, itemMenu?.codigo, icone, children);
      }

      return getItemMenu(url, title, itemMenu?.codigo, icone);
    });
  };

  const obterDadosMenus = (menu: any): MenuItemSMEProps[] => {
    if (menu?.length) {
      return menu.map((subMenu: any) => {
        const title = subMenu.descricao;
        const key = `menu-${subMenu?.codigo}`;
        const icone = subMenu.icone ? <i className={subMenu.icone} /> : null;
        const children = montarDadosSubMenus(subMenu);
        const url = subMenu?.url;

        if (subMenu?.menus?.length) {
          return getItemMenu(url, title, key, icone, children);
        }

        return getItemMenu(url, title, key, icone);
      });
    }

    return [];
  };

  useEffect(() => {
    if (usuario.menu?.length) {
      // TODO
      const menus: any = cloneDeep(usuario.menu);
      menus[1].icone = 'fas fa-user-edit';
      menus[1].ehMenu = true;

      const menusValidos = menus?.filter((m: any) => !!m?.ehMenu);
      const items = obterDadosMenus(menusValidos);
      setItems(items);
    }
  }, [usuario.menu]);

  const itemMenuEscolhido = (item: MenuItemSMEProps) => {
    setOpenKeys([]);
    navigate(item?.url);
    dispatch(menuSelecionado([item?.key?.toString()]));
  };

  const onOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const onClickMenuButtonTogle = (collapsed: boolean) => {
    if (collapsed) setOpenKeys([]);
  };

  if (!items?.length) return <></>;

  return (
    <SiderSME
      onClick={itemMenuEscolhido}
      onClickMenuButtonTogle={(collapsed: boolean) => onClickMenuButtonTogle(collapsed)}
      menuProps={{
        onOpenChange,
        openKeys,
        selectedKeys: navegacaoStore.menuSelecionado,
      }}
      styleSider={{ zIndex: 30001 }}
      items={items}
      logoMenu={LogoMenuSGP}
    />
  );
};

export default SiderSGP;
