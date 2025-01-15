import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import 'moment/locale/pt-br';

global.moment = jest.fn().mockImplementation(() => ({
  format: jest.fn().mockReturnValue('2025'),
}));

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.URL.createObjectURL = jest.fn().mockReturnValue('mocked-url');

global.Worker = class {
  constructor() {}
  postMessage() {}
  terminate() {}
};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), 
    removeListener: jest.fn(), 
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
