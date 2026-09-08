import { ModalidadeEnum, ModalidadeEnumDisplay } from './modalidade-enum';
import { TIPO_FORMATO_RELATORIO } from './tipo-formato-relatorio';
import { BimestreEnum, BimestreEnumDisplay } from './bimestre-tab-enum';
import { TIPO_FREQUENCIA_ENUM } from './tipo-frequencia-enum';
import { UF } from './uf-enum';
import { TipoConsolidadoFrequencia } from './tipo-consolidado-frequencia';
import { HttpStatusCode } from './http-status-code';

describe('enums do core', () => {
  it('ModalidadeEnum e display', () => {
    expect(ModalidadeEnum.INFANTIL).toBe(1);
    expect(ModalidadeEnumDisplay[ModalidadeEnum.FUNDAMENTAL]).toBe(
      'Ensino Fundamental'
    );
  });

  it('formato de relatório, bimestre e frequência', () => {
    expect(TIPO_FORMATO_RELATORIO.PDF).toBe(1);
    expect(TIPO_FORMATO_RELATORIO.XLSX).toBe(4);
    expect(BimestreEnumDisplay[BimestreEnum.BIMESTRE_1]).toBe('1º Bimestre');
    expect(TIPO_FREQUENCIA_ENUM.FREQUENCIA_DIARIA).toBe(2);
  });

  it('UF, consolidado e status HTTP customizado', () => {
    expect(UF.SP).toBe('SP');
    expect(TipoConsolidadoFrequencia.Mensal).toBe(2);
    expect(HttpStatusCode.NegocioException).toBe(601);
  });
});
