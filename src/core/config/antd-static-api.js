// Registro global das APIs hook-based do antd (compatível com React 19).
// Separado do provider React para evitar ciclo com alertas.js.

let notificationApi = null;
let modalApi = null;
let messageApi = null;

export const setAntdNotification = api => {
  notificationApi = api;
};

export const setAntdModal = api => {
  modalApi = api;
};

export const setAntdMessage = api => {
  messageApi = api;
};

export const getAntdNotification = () => notificationApi;
export const getAntdModal = () => modalApi;
export const getAntdMessage = () => messageApi;
