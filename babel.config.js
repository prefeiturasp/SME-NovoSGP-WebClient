module.exports = {
  presets: [
    '@babel/preset-env', // Transpila o código ES6+ para ES5
    '@babel/preset-react', // Adiciona suporte para JSX
    '@babel/preset-typescript', // Se estiver usando TypeScript
    '@babel/preset-flow', // Se estiver usando Flow
  ],
  plugins: [
    '@babel/plugin-transform-runtime', // Necessário para @babel/runtime
    '@babel/plugin-syntax-dynamic-import', // Suporte para importação dinâmica
    '@babel/plugin-transform-modules-commonjs', // Para garantir que módulos ESM sejam transformados para CommonJS
  ],
};
