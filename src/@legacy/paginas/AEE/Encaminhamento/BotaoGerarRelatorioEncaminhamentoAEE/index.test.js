import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import BotaoGerarRelatorioEncaminhamentoAEE from '~/paginas/AEE/Encaminhamento/BotaoGerarRelatorioEncaminhamentoAEE/index'; // Caminho corrigido
import { sucesso, erros } from '~/servicos';
import ServicoEncaminhamentoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoEncaminhamentoAEE';

jest.mock('~/servicos', () => ({
  sucesso: jest.fn(),
  erros: jest.fn(),
}));

jest.mock('~/servicos/Paginas/Relatorios/AEE/ServicoEncaminhamentoAEE', () => ({
  gerarRelatorio: jest.fn(),
}));

describe('BotaoGerarRelatorioEncaminhamentoAEE', () => {
  const idsMock = [1, 2, 3];

  it('deve renderizar o botão corretamente', () => {
    render(
      <BotaoGerarRelatorioEncaminhamentoAEE ids={idsMock} disabled={false} />
    );
    const botao = screen.getByRole('button');
    expect(botao).toBeInTheDocument();
  });

  it('deve chamar a função de sucesso quando o relatório for gerado com sucesso', async () => {
    ServicoEncaminhamentoAEE.gerarRelatorio.mockResolvedValueOnce({
      status: 200,
    });

    render(
      <BotaoGerarRelatorioEncaminhamentoAEE ids={idsMock} disabled={false} />
    );

    const botao = screen.getByRole('button');
    fireEvent.click(botao);

    await waitFor(() =>
      expect(sucesso).toHaveBeenCalledWith(
        'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
      )
    );
  });

  it('não deve chamar a função de sucesso se a geração do relatório falhar', async () => {
    ServicoEncaminhamentoAEE.gerarRelatorio.mockRejectedValueOnce(
      new Error('Erro ao gerar relatório')
    );

    render(
      <BotaoGerarRelatorioEncaminhamentoAEE ids={idsMock} disabled={false} />
    );

    const botao = screen.getByRole('button');
    fireEvent.click(botao);

    await waitFor(() => expect(erros).toHaveBeenCalledWith(expect.any(Error)));
  });
});
