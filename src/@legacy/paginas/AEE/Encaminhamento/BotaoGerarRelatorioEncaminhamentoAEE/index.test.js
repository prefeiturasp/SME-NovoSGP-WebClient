import React from 'react'; // Adicionando o import do React
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import BotaoGerarRelatorioEncaminhamentoAEE from '~/paginas/AEE/Encaminhamento/BotaoGerarRelatorioEncaminhamentoAEE/index'; // Caminho corrigido
import { sucesso, erros } from '~/servicos';
import ServicoEncaminhamentoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoEncaminhamentoAEE';

// Mocks das funções de sucesso e erro
jest.mock('~/servicos', () => ({
  sucesso: jest.fn(),
  erros: jest.fn(),
}));

// Mock do serviço de geração de relatório
jest.mock('~/servicos/Paginas/Relatorios/AEE/ServicoEncaminhamentoAEE', () => ({
  gerarRelatorio: jest.fn(),
}));

describe('BotaoGerarRelatorioEncaminhamentoAEE', () => {
  const idsMock = [1, 2, 3];

  it('deve renderizar o botão corretamente', () => {
    render(<BotaoGerarRelatorioEncaminhamentoAEE ids={idsMock} disabled={false} />);
    const botao = screen.getByRole('button');
    expect(botao).toBeInTheDocument();
  });

  it('deve chamar a função de sucesso quando o relatório for gerado com sucesso', async () => {
    // Simula o sucesso do serviço de geração de relatório
    ServicoEncaminhamentoAEE.gerarRelatorio.mockResolvedValueOnce({ status: 200 });

    render(<BotaoGerarRelatorioEncaminhamentoAEE ids={idsMock} disabled={false} />);

    const botao = screen.getByRole('button');
    fireEvent.click(botao);

    // Espera a função de sucesso ser chamada
    await waitFor(() => expect(sucesso).toHaveBeenCalledWith('Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'));
  });

  it('não deve chamar a função de sucesso se a geração do relatório falhar', async () => {
    // Simula o erro do serviço de geração de relatório
    ServicoEncaminhamentoAEE.gerarRelatorio.mockRejectedValueOnce(new Error('Erro ao gerar relatório'));

    render(<BotaoGerarRelatorioEncaminhamentoAEE ids={idsMock} disabled={false} />);

    const botao = screen.getByRole('button');
    fireEvent.click(botao);

    // Espera a função de erro ser chamada
    await waitFor(() => expect(erros).toHaveBeenCalledWith(expect.any(Error)));
  });
});
