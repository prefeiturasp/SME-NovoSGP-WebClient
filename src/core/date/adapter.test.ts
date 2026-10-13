import { dateAdapter } from './adapter';
import { dayjs } from './dayjs';

describe('dateAdapter', () => {
  it('parse aceita dayjs, Date e string', () => {
    const agora = dayjs('2024-06-15');
    expect(dateAdapter.parse(agora).isSame(agora)).toBe(true);
    expect(dateAdapter.parse(new Date(2024, 5, 15)).format('YYYY-MM-DD')).toBe(
      '2024-06-15'
    );
    expect(dateAdapter.parse('15/06/2024', 'DD/MM/YYYY').format('YYYY-MM-DD')).toBe(
      '2024-06-15'
    );
  });

  it('parse usa toDate quando disponível', () => {
    const valor = { toDate: () => new Date('2024-01-10T00:00:00') };
    expect(dateAdapter.parse(valor).format('YYYY-MM-DD')).toBe('2024-01-10');
  });

  it('now retorna um dayjs válido', () => {
    expect(dateAdapter.now().isValid()).toBe(true);
  });

  it('format formata a data', () => {
    expect(dateAdapter.format('2024-06-15', 'DD/MM/YYYY')).toBe('15/06/2024');
  });

  it('utc aceita valor e toDate', () => {
    expect(dateAdapter.utc().isValid()).toBe(true);
    expect(dateAdapter.utc('2024-06-15').format('YYYY-MM-DD')).toBe('2024-06-15');
    const valor = { toDate: () => new Date('2024-03-01T00:00:00Z') };
    expect(dateAdapter.utc(valor).isValid()).toBe(true);
  });
});
