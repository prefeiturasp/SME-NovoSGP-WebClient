module.exports = {
    presets: [
      '@babel/preset-env', // Transpila o código ES6+ para ES5
      '@babel/preset-react', // Adiciona suporte para JSX
      '@babel/preset-typescript',
      '@babel/preset-flow',  // Adicionando o preset do Flow
    ],
    plugins: [
      '@babel/plugin-transform-runtime', // Necessário para @babel/runtime
      '@babel/plugin-syntax-dynamic-import',
    ]
  };
  