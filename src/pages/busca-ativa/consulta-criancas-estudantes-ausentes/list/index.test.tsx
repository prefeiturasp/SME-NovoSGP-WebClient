import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ConsultaCriancasEstudantesAusentes from '.';

jest.mock('@/components/sgp/inputs/form/dre', () => () => <div>Mocado SelecionaDRE</div>);
jest.mock('@/components/sgp/inputs/form/ue', () => () => <div>Mocado SelecionaUE</div>);
jest.mock('@/components/sgp/inputs/form/modalidade', () => () => (
  <div>Mocked SelecionaModalidade</div>
));
jest.mock('@/components/sgp/inputs/form/semestre', () => () => <div>Mocado SelecionaSemestre</div>);
jest.mock('@/components/sgp/inputs/form/turma', () => () => <div>Mocado SelecionaTurma</div>);
jest.mock('@/components/sgp/inputs/form/ausencias', () => () => <div>Mocado SelectAusencias</div>);
jest.mock('./table-turmas', () => () => <div>Mocado TabelaTurmas</div>);
jest.mock('@/@legacy/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao', () => () => (
  <button>Voltar</button>
));
jest.mock('@/components/lib/header-page', () => ({ children, title }: any) => (
  <div>
    <h1>{title}</h1>
    {children}
  </div>
));
jest.mock('@/components/lib/card-content', () => ({ children }: any) => <div>{children}</div>);

describe('ConsultaCriancasEstudantesAusentes', () => {
  it('Mostra o titulo da pagina', () => {
    render(
      <BrowserRouter>
        <ConsultaCriancasEstudantesAusentes />
      </BrowserRouter>,
    );

    expect(screen.getByText('Consulta de crianças/estudantes ausentes')).toBeInTheDocument();
    expect(screen.getByText('Voltar')).toBeInTheDocument();
  });
});
