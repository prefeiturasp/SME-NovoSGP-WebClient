import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalImportarArquivo from './ModalImportarArquivo';

describe('ModalImportarArquivo', () => {
  const setarModal = jest.fn();
  const resetarLista = jest.fn();
  const abrirDrawer = jest.fn();

  it('renderiza título e botões principais', () => {
    render(
      <ModalImportarArquivo
        setarModal={setarModal}
        resetarLista={resetarLista}
        abrirDrawer={abrirDrawer}
      />
    );
    const titulos = screen.getAllByText(/Importar arquivo/i);
    expect(titulos[0]).toBeInTheDocument();
    expect(screen.getByText(/Cancelar/i)).toBeInTheDocument();
    const botoesImportar = screen.getAllByText(/Importar Arquivo/i);
    expect(botoesImportar[botoesImportar.length - 1]).toBeInTheDocument();
  });

  it('chama setarModal ao clicar em Cancelar', () => {
    render(
      <ModalImportarArquivo
        setarModal={setarModal}
        resetarLista={resetarLista}
        abrirDrawer={abrirDrawer}
      />
    );
    fireEvent.click(screen.getByText(/Cancelar/i));
    expect(setarModal).toHaveBeenCalledWith(false);
  });
});
