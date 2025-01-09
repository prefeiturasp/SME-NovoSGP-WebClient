import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import 'moment/locale/pt-br'; // Ou use o mock diretamente aqui

global.moment = jest.fn().mockImplementation(() => ({
  format: jest.fn().mockReturnValue('2025'), // Simula o retorno do formato 'YYYY'
}));

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.URL.createObjectURL = jest.fn().mockReturnValue('mocked-url');

global.Worker = class {
    constructor() {
      // Fazendo o Worker não realizar nenhuma ação
    }
    postMessage() {}
    terminate() {}
  };
