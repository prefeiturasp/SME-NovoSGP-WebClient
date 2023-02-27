import tipoFrequencia from '~/dtos/tipoFrequencia';

class MetodosListaFrequencia {
  obterCorTipoFrequencia = tipo => {
    switch (tipo) {
      case tipoFrequencia.Remoto.valor:
        return tipoFrequencia.Remoto.cor;
      case tipoFrequencia.Faltou.valor:
        return tipoFrequencia.Faltou.cor;
      case tipoFrequencia.Compareceu.valor:
        return tipoFrequencia.Compareceu.cor;

      default:
        return '';
    }
  };
}
export default new MetodosListaFrequencia();
