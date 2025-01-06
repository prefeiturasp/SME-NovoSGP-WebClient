import React from 'react';
import { render, act } from '@testing-library/react';
import RelatorioFrequencia from './relatorioFrequencia';

// Mock da funcionalidade diretamente no componente


describe('RelatorioFrequencia Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render anos letivos correctly', async () => {
   console.log('wwww')
  });


  // it('should fetch modalidades when a UE is selected', async () => {
  //   ServicoFiltroRelatorio.obterModalidadesPorAbrangencia.mockResolvedValueOnce({
  //     data: [{ valor: ModalidadeEnum.EJA, desc: 'EJA' }],
  //   });

  //   const { getByText } = render(<RelatorioFrequencia />);

  //   await act(async () => {
  //     // Simula a seleção de uma UE
  //     const selectUE = getByText('Select UE');
  //     act(() => {
  //       selectUE.value = '12345';
  //       selectUE.dispatchEvent(new Event('change'));
  //     });
  //   });

  //   expect(
  //     ServicoFiltroRelatorio.obterModalidadesPorAbrangencia
  //   ).toHaveBeenCalledWith('12345');

  //   expect(getByText('EJA')).toBeInTheDocument();
  // });

  // it('should fetch UEs when a DRE is selected', async () => {
  //   ServicoFiltroRelatorio.obterUes.mockResolvedValueOnce({
  //     data: [{ codigo: '6789', nome: 'UE Teste' }],
  //   });

  //   const { getByText } = render(<RelatorioFrequencia />);

  //   await act(async () => {
  //     // Simula a seleção de uma DRE
  //     const selectDRE = getByText('Select DRE');
  //     act(() => {
  //       selectDRE.value = '123';
  //       selectDRE.dispatchEvent(new Event('change'));
  //     });
  //   });

  //   expect(ServicoFiltroRelatorio.obterUes).toHaveBeenCalledWith(
  //     '123',
  //     false,
  //     undefined
  //   );

  //   expect(getByText('UE Teste')).toBeInTheDocument();
  // });

  // it('should fetch DREs on mount', async () => {
  //   AbrangenciaServico.buscarDres.mockResolvedValueOnce({
  //     data: [
  //       { codigo: '1', nome: 'DRE Centro' },
  //       { codigo: '2', nome: 'DRE Norte' },
  //     ],
  //   });

  //   render(<RelatorioFrequencia />);

  //   await act(async () => {
  //     expect(AbrangenciaServico.buscarDres).toHaveBeenCalled();
  //   });

  //   expect(AbrangenciaServico.buscarDres).toHaveBeenCalledWith(
  //     'v1/abrangencias/false/dres?anoLetivo=undefined'
  //   );
  // });
});
