import { useEffect } from 'react';
import { Modal, notification } from 'antd';
import { setAntdModal, setAntdNotification } from '@/core/config/antd-static-api';

export const AntdAppProvider = ({ children }) => {
  const [notificationApi, notificationHolder] = notification.useNotification({
    maxCount: 5,
  });
  const [modalApi, modalHolder] = Modal.useModal();

  useEffect(() => {
    setAntdNotification(notificationApi);
    setAntdModal(modalApi);

    return () => {
      setAntdNotification(null);
      setAntdModal(null);
    };
  }, [notificationApi, modalApi]);

  return (
    <>
      {notificationHolder}
      {modalHolder}
      {children}
    </>
  );
};
